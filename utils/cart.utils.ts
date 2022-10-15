import { CartItem } from "../interfaces";

export function addToWishlist(productId: string) {
  const wishlist = localStorage.getItem("wishlist");
  let updatedList = [];

  if (wishlist) {
    updatedList = JSON.parse(wishlist);
    updatedList.push(productId);
  } else {
    updatedList = [productId];
  }

  localStorage.setItem("wishlist", JSON.stringify(updatedList));
  return updatedList;
}

export function removeFromWishlist(productId: string) {
  const wishlist = localStorage.getItem("wishlist");
  let updatedList = [];

  if (wishlist) {
    updatedList = JSON.parse(wishlist).filter((id: any) => id !== productId);
  }

  localStorage.setItem("wishlist", JSON.stringify(updatedList));
  return updatedList;
}

export function addToCart(data: CartItem) {
  const { productId } = data;

  const cart = localStorage.getItem("cart");
  let updatedList = [];

  if (cart) {
    updatedList = JSON.parse(cart);
    const alreadyExist = updatedList.find(
      (cartItem: CartItem) => cartItem.productId === productId
    );
    if (!alreadyExist) {
      updatedList.push(data);
    }
  } else {
    updatedList = [data];
  }

  localStorage.setItem("cart", JSON.stringify(updatedList));
  return updatedList;
}

export function removeFromCart(productId: string) {
  const cart = localStorage.getItem("cart");
  let updatedList: CartItem[] = [];

  if (cart) {
    updatedList = JSON.parse(cart).filter(
      (cartItem: CartItem) => cartItem.productId !== productId
    );
  }

  localStorage.setItem("cart", JSON.stringify(updatedList));
  return updatedList;
}

export function updateProductQuantity(productId: string, type: string) {
  const cart = localStorage.getItem("cart");
  let updatedList: CartItem[] = [];

  if (cart) {
    updatedList = JSON.parse(cart);
    const itemIdx = updatedList.findIndex(
      (cartItem: CartItem) => cartItem.productId === productId
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
