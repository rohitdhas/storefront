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
  console.log(filters);
  const query: any = {};
  // if (!Object.keys(filters).length) return {};

  // if (filters._id) {
  //   query['_id'] = filters._id;
  //   return query;
  // }

  // if (filters.colors) {
  //   query['color'] = { $in: filters.colors };
  // }

  // if (filters.brands) {
  //   query['brand'] = { $in: filters.brands };
  // }

  // if (filters.categories) {
  //   query['category'] = { $in: filters.categories };
  // }

  // if (filters.rating) {
  //   query['rating'] = filters.rating;
  // }

  // if (filters.priceRange) {
  //   query['currentPrice'] = { $gte: filters.priceRange[0], $lte: filters.priceRange[1] }
  // }

  // if ('inStock' in filters) {
  //   if (filters.inStock) {
  //     query['stock'] = { $gt: 0 };
  //   } else {
  //     query['stock'] = { $eq: 0 };
  //   }
  // } else {
  //   query['stock'] = { $gt: 0 };
  // }

  // if (filters.exclusive) {
  //   query['exclusive'] = true;
  // }

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

export function addToCart(product: any) {
  const cart = localStorage.getItem("cart");
  let updatedList = [];

  if (cart) {
    updatedList = JSON.parse(cart);
    const alreadyExist = updatedList.find((item: any) => item._id === product._id);
    if (!alreadyExist) {
      updatedList.push(product);
    }

  } else {
    updatedList = [product]
  }

  localStorage.setItem("cart", JSON.stringify(updatedList));
  return updatedList;
}

export function removeFromCart(productId: string) {
  const cart = localStorage.getItem("cart");
  let updatedList = [];

  if (cart) {
    updatedList = JSON.parse(cart).filter((item: any) => item._id !== productId);
  }

  localStorage.setItem("cart", JSON.stringify(updatedList));
  return updatedList;
}

export function getCart() {
  const cart = localStorage.getItem("cart");
  if (cart) {
    return JSON.parse(cart);
  }
  return [];
}

export function getWishlist() {
  const wishlist = localStorage.getItem("wishlist");
  if (wishlist) {
    return JSON.parse(wishlist);
  }
  return [];
}

export const removeQueryParam = (param: string, router: any) => {
  const { pathname, query } = router;
  const params = new URLSearchParams(query);
  params.delete(param);
  router.replace(
    { pathname, query: params.toString() },
    undefined
  );
};

export const notify = (data: {
  title: string,
  message: string,
  type: string
}
  , toastRef: any) => {
  const { title, message, type } = data;

  toastRef.current.show({
    severity: type,
    summary: title,
    detail: message,
  });
};

export const numFormatter = (num: number) =>
  num.toLocaleString("en-US", {
    style: "currency",
    currency: "INR",
  });