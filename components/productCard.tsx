/* eslint-disable @next/next/no-img-element */
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import React, { useState, useRef } from "react";
// import { updateWishlist } from "../redux/userSlice";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { Toast } from "primereact/toast";
import { motion } from "framer-motion";

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

type Props = {
  product: Product;
};

const ProductCard: React.FC<Props> = ({ product }) => {
  const savings = product.originalPrice - product.currentPrice;
  const savingsPercentage = ((savings / product.originalPrice) * 100).toFixed(
    2
  );

  const [wishlisted, setWishlisted] = useState<boolean>(false);
  const wishlist = useSelector((state: RootState) => state.user.wishlist);
  const dispatch = useDispatch();
  const toast = useRef<any>();

  // const wishlistProduct = () => {
  //   const updatedList = addToWishlist(product);
  //   dispatch(updateWishlist({ updatedProductList: updatedList }));
  //   setWishlisted(true);
  //   notify();
  // };

  // const unWishlistProduct = () => {
  //   const updatedList = removeFromWishlist(product._id);
  //   dispatch(updateWishlist({ updatedProductList: updatedList }));
  //   setWishlisted(false);
  // };

  const notify = () => {
    toast.current.show({
      severity: "info",
      summary: "Product Wishlisted",
      detail: `${product.title} - Added to your wishlist!`,
    });
  };

  return (
    <>
      <Toast ref={toast} />
      <Card>
        <div>
          <Tooltip target=".wishlist-icon" />
          <motion.i
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            data-pr-tooltip="Wishlist Product"
            data-pr-position="right"
            className={`wishlist-icon pi pi-heart-fill ${
              wishlisted ? "text-error" : "text-slate-400"
            } hover:text-error text-2xl`}
          />
        </div>
        <img
          src={product.images[0]}
          alt="product_image"
          className="h-[180px] w-[auto] my-4 mx-auto"
        />
        <h5 className="font-bold text-slate-800">{product.title}</h5>
        <div className="my-1">
          <p className="text-xs">Price</p>
          <p>
            <span className="font-bold text-slate-800 mr-2">
              {numFormatter(product.currentPrice)}
            </span>
            <span className="line-through text-sm text-info">
              {numFormatter(product.originalPrice)}
            </span>
          </p>
          <p className="text-xs my-1">
            Savings{" "}
            <span className="text-success font-bold">
              {numFormatter(savings)}
            </span>{" "}
            ({savingsPercentage}%)
          </p>
        </div>
        <div className="mt-2">
          <Button
            label="Quick View"
            className="p-button-outlined p-button-sm mr-2 w-[70%]"
          />
          <span>
            <Tooltip target=".add-to-cart-btn" />
            <Button
              icon="pi pi-shopping-cart"
              data-pr-tooltip="Add to cart"
              data-pr-position="bottom"
              className="p-button-sm w-[20%] add-to-cart-btn"
            />
          </span>
        </div>
      </Card>
    </>
  );
};

const numFormatter = (num: number) =>
  num.toLocaleString("en-US", {
    style: "currency",
    currency: "INR",
  });

export default ProductCard;
