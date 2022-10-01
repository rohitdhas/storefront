import { connectToDatabase, ConnectionType } from '../lib/mongodb';
import { buildFilterQuery } from './main.utils';
import { ObjectId } from 'mongodb';

// Query - GET
export const getProducts = async (filters: any) => {
  const query = buildFilterQuery(filters);
  if (query._id) {
    if (ObjectId.isValid(query._id)) {
      query._id = new ObjectId(query._id);
    } else {
      return [];
    }
  }

  const { db }: ConnectionType = await connectToDatabase();

  const products = await db.collection('products').find(query).toArray();
  return products;
}

export const getOneProduct = async (id: string) => {
  const { db }: ConnectionType = await connectToDatabase();
  const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
  return product;
}

export const getOrders = async (userId: string) => {
  const { db }: ConnectionType = await connectToDatabase();
  const orders = await db.collection('orders').find({ user: new ObjectId(userId) }).toArray();
  return orders;
}

export const searchAutocomplete = async (input: string) => {
  const { db }: ConnectionType = await connectToDatabase();
  const products = await db.collection('products').aggregate([
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
            }
          ],
        },
      },
    }
  ]).toArray();
  return products;
}


// Mutations - POST, PUT, DELETE

export const createOrder = async (order: any) => {
  const { db }: ConnectionType = await connectToDatabase();
  const { insertedId } = await db.collection('orders').insertOne(order);
  return { message: "Order created successfully", isError: false, data: insertedId };
}

export const updateUsername = async (userId: string, update: string) => {
  const { db }: ConnectionType = await connectToDatabase();
  const res = await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $set: { username: update } });
  return { message: "Username updated successfully", isError: false, data: res };
}

export const updateAddress = async (userId: string, update: any) => {
  const { db }: ConnectionType = await connectToDatabase();
  const { updateType, address } = update;
  let res;

  if (updateType === "ADD") {
    res = await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $push: { addresses: address } });
  } else if (updateType === "UPDATE") {
    res = await db.collection('users').updateOne({ _id: new ObjectId(userId), "addresses.$.id": address.id }, { $set: { "addresses.$": address } });
  } else {
    res = await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $pull: { addresses: { id: address.id } } });
  }
  return {
    message: `Address ${updateType === 'ADD'
      ? "Added"
      : updateType === "UPDATE"
        ? "Updated"
        : "Deleted"} successfully`,
    isError: false, data: res
  };
}