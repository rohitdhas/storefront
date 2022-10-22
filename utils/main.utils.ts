import dateFormat from "dateformat";
import { IProduct } from "../interfaces";

export const numFormatter = (num: number) => {
  if (!num) return 0;
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "INR",
  });
};

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

export const calculatePriceBreakdown = (products: IProduct[]) => {
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

export function formatDate(date: number) {
  const dateToFormat = new Date(date);
  return dateFormat(dateToFormat, "mmmm dS, yyyy, h:MM:ss TT");
}

export function getGreetingMessage() {
  const date = new Date();
  const hours = date.getHours();
  const status =
    hours < 12
      ? "Morning"
      : hours <= 18 && hours >= 12
      ? "Afternoon"
      : "Evening";
  return status;
}

export function truncateString(str: string, num: number) {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
}
