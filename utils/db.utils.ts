import { connectToDatabase, ConnectionType } from '../lib/mongodb';

export const getProducts = async () => {
  const { db }: any = await connectToDatabase();
  const products = await db.collection('products').find({}).toArray();
  return products;
}