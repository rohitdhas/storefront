import { ObjectId } from 'mongodb';

interface Filters {
  _id: string;
  colors: string[];
  brands: string[];
  categories: string[];
  rating: number;
  inStock: boolean;
  exclusive: boolean;
}

export function buildFilterQuery(filters: Filters) {
  const query: any = {};
  if (!Object.keys(filters).length) return {};

  if (filters._id) {
    query['_id'] = new ObjectId(filters._id);
    return query;
  }

  if (filters.colors) {
    query['color'] = { $in: filters.colors };
  }

  if (filters.brands) {
    query['brand'] = { $in: filters.brands };
  }

  if (filters.categories) {
    query['category'] = { $in: filters.categories };
  }

  if (filters.rating) {
    query['rating'] = filters.rating;
  }

  if ('inStock' in filters) {
    if (filters.inStock) {
      query['stock'] = { $gt: 0 };
    } else {
      query['stock'] = { $eq: 0 };
    }
  }

  if (filters.exclusive) {
    query['exclusive'] = true;
  }

  return query;
}