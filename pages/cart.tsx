import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { Button } from "primereact/button";
import { numFormatter, removeFromCart } from "../utils/main.utils";
import { updateCart } from "../redux/userSlice";
import { NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

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
}

const Cart: NextPage = () => {
  const { cart: products } = useSelector((state: RootState) => state.user);
  return (
    <div>
      <Head>
        <title>Checkout</title>
        <meta
          name="description"
          content="Explore the greatest product deals on the internet"
        />
        <link rel="shortcut icon" href="logo.svg" type="image/x-icon" />
      </Head>
      <main>
        {!products.length ? (
          <div className="w-max mx-auto text-center">
            <Image
              src="/empty_cart.svg"
              alt="empty cart"
              height={400}
              width={400}
            />
            <div className="mt-6">
              <h5 className="font-bold text-slate-800">Your Cart is Empty!</h5>
              <p className="text-sm text-gray-500">
                Find your favorite products and add them to your cart.
              </p>
            </div>
            <Link href={"/products"}>
              <a>
                <Button label="Explore Products" className="p-button-sm my-6" />
              </a>
            </Link>
          </div>
        ) : (
          <div className="mx-[4rem]">
            <div className="w-[50%]">
              <h5 className="text-xl font-bold text-info my-4">
                Cart Items 🎈
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2">
                {products.map((product: any) => {
                  return <CartItem key={product._id} product={product} />;
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const CartItem: React.FC<{ product: Product }> = ({ product }) => {
  const savings = product.originalPrice - product.currentPrice;
  const savingsPercentage = ((savings / product.originalPrice) * 100).toFixed(
    2
  );
  const [quantity, setQuantity] = useState<number>(1);
  const dispatch = useDispatch();

  return (
    <div className="flex justify-center align items-center border border-gray-300 rounded-md w-max p-4">
      <Image
        src={product.images[0]}
        alt="Product Image"
        height={100}
        width={120}
      />
      <div className="ml-4">
        <h6 className="font-bold flex justify-between align items-center">
          <span>{product.title}</span>
          <Button
            onClick={() => {
              const update = removeFromCart(product._id);
              dispatch(updateCart({ updatedCart: update }));
            }}
            label="X"
            className="p-button-sm p-button-danger text-xs !px-2 !py-1 ml-2"
          />
        </h6>
        <div className="mt-2">
          <p>
            <span className="text-slate-700">
              {numFormatter(product.currentPrice)}{" "}
            </span>
            <span className="line-through text-sm text-info">
              {numFormatter(product.originalPrice)}
            </span>
          </p>
          <p className="text-xs">
            Savings{" "}
            <span className="text-success font-bold">
              {numFormatter(savings)}
            </span>{" "}
            ({savingsPercentage}%)
          </p>
        </div>
        <div className="mt-2">
          <Button
            onClick={() => {
              if (quantity > 1) setQuantity(quantity - 1);
            }}
            label="-"
            className="p-button-sm text-xs !px-3 !py-1"
          />
          <span className="mx-2 font-bold text-info">{quantity}</span>
          <Button
            onClick={() => {
              if (quantity < 10) setQuantity(quantity + 1);
            }}
            label="+"
            className="p-button-sm text-xs !px-3 !py-1"
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
