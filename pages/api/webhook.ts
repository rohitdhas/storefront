import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase, ConnectionType } from "../../lib/mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const event = req.body;
  const { db }: ConnectionType = await connectToDatabase();

  if (event.type === "charge.succeeded") {
    const checkoutId = event.data.object.payment_intent;
    await db
      .collection("orders")
      .updateOne(
        { checkoutToken: checkoutId },
        {
          $set: {
            paymentReceipt: event.data.object.receipt_url,
            paid: event.data.object.paid,
            status: "Received",
          },
        }
      );
  }

  res.status(200).json({ name: "John Doe" });
}
