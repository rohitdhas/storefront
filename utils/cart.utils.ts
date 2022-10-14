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
