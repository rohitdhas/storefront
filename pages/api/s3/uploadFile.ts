import { connectToDatabase, ConnectionType } from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";
const { IncomingForm } = require("formidable");
import S3 from "aws-sdk/clients/s3";
import { ObjectId } from "mongodb";
import fs from "fs";

const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const data: any = await new Promise((resolve, reject) => {
      const form = new IncomingForm();
      form.options.multiples = true;

      form.parse(req, (err: any, fields: any, files: any) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const fieldName = Object.keys(data?.files)[0];
    const productId = fieldName.split("_")[0];
    const filesData = data?.files[fieldName];
    const { db }: ConnectionType = await connectToDatabase();

    if (!Array.isArray(filesData)) {
      const imageKey = `${productId}_${filesData.originalFilename}`;

      const fileParams: any = {
        Bucket: process.env.BUCKET_NAME,
        Key: imageKey,
        Expires: 600,
        Body: fs.createReadStream(filesData.filepath),
        ContentType: filesData.mimetype,
        ACL: "public-read",
      };

      s3.putObject(fileParams, async (e) => {
        if (e) {
          console.log(e);
          return res.json({
            isError: true,
            message: "Error on uploading to s3!",
          });
        }

        await db
          .collection("products")
          .updateOne(
            { _id: new ObjectId(productId) },
            { $push: { images: imageKey } }
          );
      });
    } else {
      for await (let file of filesData) {
        const imageKey = `${productId}_${file.originalFilename}`;

        const fileParams: any = {
          Bucket: process.env.BUCKET_NAME,
          Key: imageKey,
          Expires: 600,
          Body: fs.createReadStream(file.filepath),
          ContentType: file.mimetype,
          ACL: "public-read",
        };

        s3.putObject(fileParams, async (e) => {
          if (e) {
            console.log(e);
            return res.json({
              isError: true,
              message: "Error on uploading to s3!",
            });
          }

          await db
            .collection("products")
            .updateOne(
              { _id: new ObjectId(productId) },
              { $push: { images: imageKey } }
            );
        });
      }
    }

    return res.json({
      isError: false,
      message: "Files uploaded successfully!",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ isError: true, message: err });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
