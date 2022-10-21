import { connectToDatabase, ConnectionType } from "../lib/mongodb";
import { buildFilterQuery } from "./filter.util";
import createStripeOrder from "./stripe.util";
import { ObjectId } from "mongodb";
import { IProduct, IUser } from "../interfaces";

// Query - GET
export const getProducts = async (filters: any) => {
  const query = buildFilterQuery(filters);

  if (query._id && typeof query._id === "string") {
    if (ObjectId.isValid(query._id)) {
      query._id = new ObjectId(query._id);
    } else {
      return [];
    }
  }

  const { db }: ConnectionType = await connectToDatabase();

  const products = await db.collection("products").find(query).toArray();
  return products;
};

export const getOneProduct = async (id: string) => {
  const { db }: ConnectionType = await connectToDatabase();
  const product = await db
    .collection("products")
    .findOne({ _id: new ObjectId(id) });
  return product;
};

export const getOrders = async (email: string) => {
  const { db }: ConnectionType = await connectToDatabase();
  const orders = await db.collection("orders").find({ user: email }).toArray();
  return orders;
};

export const searchAutocomplete = async (input: string) => {
  const { db }: ConnectionType = await connectToDatabase();
  const products = await db
    .collection("products")
    .aggregate([
      {
        $search: {
          index: "default",
          compound: {
            should: [
              {
                autocomplete: {
                  query: input,
                  path: "title",
                  fuzzy: { maxEdits: 2, prefixLength: 3 },
                },
              },
            ],
          },
        },
      },
    ])
    .toArray();
  return products;
};

// Mutations - POST, PUT, DELETE

export const createOrderMut = async (order: {
  products: any;
  addressId: string;
  user: string;
}) => {
  const { products, user, addressId } = order;
  const { db }: ConnectionType = await connectToDatabase();

  const lineItems = [];
  for await (let item of products) {
    const { value: product }: any = await db
      .collection("products")
      .findOneAndUpdate(
        { _id: new ObjectId(item.productId) },
        { $inc: { stock: -1 } }
      );

    item.title = product?.title;

    const shipping = product.currentPrice * item.quantity >= 500 ? 0 : 40;
    const tax = 0.1 * product.currentPrice;
    const totalAmount = shipping + tax + product.currentPrice;

    lineItems.push({
      price_data: {
        currency: "inr",
        product_data: {
          images: [product?.images[0]],
          name: product?.title,
        },
        unit_amount: Math.round(totalAmount) * 100,
      },
      quantity: item.quantity,
    });
  }

  try {
    const stripeRes = await createStripeOrder(lineItems);
    let deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    const totalAmount = lineItems.reduce((acc, cur) => {
      return acc + cur.price_data.unit_amount * cur.quantity;
    }, 0);

    const orderCount = await db.collection("orders").countDocuments();

    const orderDetails = {
      user,
      products,
      totalAmount: totalAmount / 100,
      deliveryDate,
      status: "Created",
      address: addressId,
      order_id: `#${orderCount}`,
      checkoutToken: stripeRes.payment_intent,
      createdAt: new Date(),
      paid: false,
    };

    await db.collection("orders").insertOne(orderDetails);
    return { isError: false, data: { stripeURL: stripeRes.url } };
  } catch (err: any) {
    return { isError: true };
  }
};

export const updateUsernameMut = async (email: string, update: string) => {
  const { db }: ConnectionType = await connectToDatabase();
  const res = await db
    .collection("users")
    .updateOne({ email }, { $set: { username: update } });
  return {
    message: "Username updated successfully",
    isError: false,
    data: res,
  };
};

export const updateAddressMut = async (email: string, update: any) => {
  const { db }: ConnectionType = await connectToDatabase();
  const { updateType, address } = update;
  let res;

  if (updateType === "ADD") {
    res = await db
      .collection("users")
      .updateOne({ email }, { $push: { addresses: address } });
  } else if (updateType === "UPDATE") {
    res = await db
      .collection("users")
      .updateOne(
        { email, "addresses.$.id": address.id },
        { $set: { "addresses.$": address } }
      );
  } else {
    res = await db
      .collection("users")
      .updateOne({ email }, { $pull: { addresses: { id: address.id } } });
  }
  return {
    message: `Address ${
      updateType === "ADD"
        ? "Added"
        : updateType === "UPDATE"
        ? "Updated"
        : "Deleted"
    } successfully`,
    isError: false,
    data: res,
  };
};

export const updateProductMut = async (
  userEmail: string,
  productUpdate: IProduct
) => {
  const { db }: ConnectionType = await connectToDatabase();

  const user: any = await db.collection("users").findOne({ email: userEmail });
  if (user.type !== "admin") {
    return {
      isError: false,
      message: "You don't have rights to update a product!",
    };
  }

  const update: any = { ...productUpdate };
  delete update._id;

  try {
    await db
      .collection("products")
      .updateOne({ _id: new ObjectId(productUpdate._id) }, { $set: update });
    return { isError: false, message: "Product Updated!" };
  } catch (err) {
    console.log(err);
    return { isError: true, message: "Something went wrong!" };
  }
};

export const addProductMut = async (userEmail: string, productData: any) => {
  const { db }: ConnectionType = await connectToDatabase();

  const user: any = await db.collection("users").findOne({ email: userEmail });
  if (user.type !== "admin") {
    return {
      isError: false,
      message: "You don't have rights to update a product!",
    };
  }

  try {
    const res = await db.collection("products").insertOne(productData);
    return {
      isError: false,
      message: "Product Created!",
      data: res.insertedId,
    };
  } catch (err) {
    console.log(err);
    return { isError: true, message: "Something went wrong!" };
  }
};

export const deleteProductMut = async (
  userEmail: string,
  productId: string
) => {
  const { db }: ConnectionType = await connectToDatabase();

  const user: any = await db.collection("users").findOne({ email: userEmail });
  if (user.type !== "admin") {
    return {
      isError: false,
      message: "You don't have rights to delete a product!",
    };
  }

  await db.collection("products").deleteOne({ _id: new ObjectId(productId) });
  return { isError: false, message: "Product deleted!" };
};
