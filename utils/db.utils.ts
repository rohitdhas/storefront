import { connectToDatabase, ConnectionType } from '../lib/mongodb';
import { ObjectId } from 'mongodb';

export const getProducts = async () => {
  const { db }: ConnectionType = await connectToDatabase();
  const products = await db.collection('products').find({}).toArray();
  return products;
}

export const getOneProduct = async (id: string) => {
  const { db }: ConnectionType = await connectToDatabase();
  const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
  return product;
}