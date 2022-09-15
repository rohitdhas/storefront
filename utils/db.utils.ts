import { connectToDatabase, ConnectionType } from '../lib/mongodb';
import { buildFilterQuery } from './main.utils';
import { ObjectId } from 'mongodb';

export const getProducts = async (filters: any) => {
  const query = buildFilterQuery(filters);
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
