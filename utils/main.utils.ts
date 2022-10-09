interface Product {
  _id: string;
  title: string;
  description: string;
  images: string[];
  currentPrice: number;
  originalPrice: number;
  rating: number;
  stock: number;
  category: string;
  exclusive: boolean;
  tags: string[];
  specifications: Object[];
  color: string;
  quantity?: number;
}

interface Filters {
  id: string;
  colors: string[];
  brands: string[];
  categories: string[];
  rating: string;
  inStock: string;
  priceRange: string[];
  exclusive: string;
}

export function buildFilterQuery(filters: Filters) {
  const query: any = {};
  if (!Object.keys(filters).length) return {};

  if (filters.id) {
    query["_id"] = filters.id;
    return query;
  }

  if (filters.colors) {
    query["color"] = { $in: filters.colors };
  }

  if (filters.brands) {
    query["brand"] = { $in: filters.brands };
  }

  if (filters.categories) {
    query["category"] = { $in: filters.categories };
  }

  if (filters.rating) {
    query["rating"] = Number(filters.rating);
  }

  if (filters.priceRange) {
    query["currentPrice"] = {
      $gte: Number(filters.priceRange[0]),
      $lte: Number(filters.priceRange[1]),
    };
  }

  if ("inStock" in filters && filters.inStock === "false") {
    query["stock"] = { $eq: 0 };
  } else {
    query["stock"] = { $gt: 0 };
  }

  if (filters.exclusive && filters.exclusive === "true") {
    query["exclusive"] = true;
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
    updatedList = [product];
  }

  localStorage.setItem("wishlist", JSON.stringify(updatedList));
  return updatedList;
}

export function removeFromWishlist(productId: string) {
  const wishlist = localStorage.getItem("wishlist");
  let updatedList = [];

  if (wishlist) {
    updatedList = JSON.parse(wishlist).filter(
      (item: any) => item._id !== productId
    );
  }

  localStorage.setItem("wishlist", JSON.stringify(updatedList));
  return updatedList;
}

export function addToCart(product: any) {
  const cart = localStorage.getItem("cart");
  let updatedList = [];

  if (cart) {
    updatedList = JSON.parse(cart);
    const alreadyExist = updatedList.find(
      (item: any) => item._id === product._id
    );
    if (!alreadyExist) {
      updatedList.push(product);
    }
  } else {
    updatedList = [product];
  }

  localStorage.setItem("cart", JSON.stringify(updatedList));
  return updatedList;
}

export function updateProductQuantity(productId: string, type: string) {
  const cart = localStorage.getItem("cart");
  let updatedList = [];

  if (cart) {
    updatedList = JSON.parse(cart);
    const itemIdx = updatedList.findIndex(
      (item: any) => item._id === productId
    );
    if (itemIdx !== -1) {
      const item = updatedList[itemIdx];
      if (
        (type === "remove" && item.quantity === 1) ||
        (type === "add" && item.quantity === 10)
      )
        return;
      item.quantity = type === "add" ? item.quantity + 1 : item.quantity - 1;
      updatedList[itemIdx] = item;
    }
  }

  localStorage.setItem("cart", JSON.stringify(updatedList));
  return updatedList;
}

export function removeFromCart(productId: string) {
  const cart = localStorage.getItem("cart");
  let updatedList = [];

  if (cart) {
    updatedList = JSON.parse(cart).filter(
      (item: any) => item._id !== productId
    );
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
  router.replace({ pathname, query: params.toString() }, undefined);
};

export const notify = (
  data: {
    title: string;
    message: string;
    type: string;
  },
  toastRef: any
) => {
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

export function getRandomId() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

export const reloadNextAuthSession = () => {
  const event = new Event("visibilitychange");
  document.dispatchEvent(event);
};

export const calculatePriceBreakdown = (products: Product[]) => {
  const priceBreakdown = products.reduce(
    (acc: any, cur: any) => {
      const cartValue = acc.cartValue + cur.originalPrice * cur.quantity;
      const discount =
        acc.discount + (cur.originalPrice - cur.currentPrice) * cur.quantity;
      const shipping =
        acc.shipping + (cur.currentPrice * cur.quantity >= 500 ? 0 : 40);
      const tax = acc.tax + 0.1 * (cur.currentPrice * cur.quantity);
      const total = cartValue + shipping + tax - discount;

      return {
        cartValue,
        discount,
        shipping,
        tax,
        total,
      };
    },
    { cartValue: 0, discount: 0, shipping: 0, tax: 0, total: 0 }
  );
  return priceBreakdown;
};
