import { ObjectId } from 'mongodb';

interface Filters {
  _id: string;
  colors: string[];
  brands: string[];
  categories: string[];
  rating: number;
  inStock: boolean;
  priceRange: number[];
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

  if (filters.priceRange) {
    query['currentPrice'] = { $gte: filters.priceRange[0], $lte: filters.priceRange[1] }
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

export function addToWishlist(product: any) {
  const wishlist = localStorage.getItem("wishlist");
  let updatedList = [];

  if (wishlist) {
    updatedList = JSON.parse(wishlist);
    updatedList.push(product);
  } else {
    updatedList = [product]
  }

  localStorage.setItem("wishlist", JSON.stringify(updatedList));
  return updatedList;
}

export function removeFromWishlist(productId: string) {
  const wishlist = localStorage.getItem("wishlist");
  let updatedList = [];

  if (wishlist) {
    updatedList = JSON.parse(wishlist).filter((item: any) => item._id !== productId);
  }

  localStorage.setItem("wishlist", JSON.stringify(updatedList));
  return updatedList;
}