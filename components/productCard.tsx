/* eslint-disable @next/next/no-img-element */
import { numFormatter } from "../utils/main.utils";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { motion } from "framer-motion";
import { IProduct } from "../interfaces/index";

type Props = {
  product: IProduct;
  quickViewToggle: () => void;
  setSelectedProduct: (product: IProduct) => void;
  unWishlistProduct: (productId: IProduct) => void;
  wishlistProduct: (productId: IProduct) => void;
  addProductToCart: (product: IProduct) => void;
};

const ProductCard: React.FC<Props> = ({
  product,
  quickViewToggle,
  setSelectedProduct,
  wishlistProduct,
  unWishlistProduct,
  addProductToCart,
}) => {
  const savings = product.originalPrice - product.currentPrice;
  const savingsPercentage = ((savings / product.originalPrice) * 100).toFixed(
    2
  );

  const [wishlisted, setWishlisted] = useState<boolean>(false);
  const wishlist = useSelector((state: RootState) => state.user.wishlist);

  // Checking if product is already wishlisted on page load
  useEffect(() => {
    const productInCart = wishlist.find(
      (productId: string) => productId === product._id
    );
    if (productInCart) setWishlisted(true);
  }, [product._id, wishlist]);

  const wishlistItem = () => {
    wishlistProduct(product);
    setWishlisted(true);
  };

  const unwishlist = () => {
    unWishlistProduct(product);
    setWishlisted(false);
  };

  return (
    <>
      <Card className="h-max hover:shadow-xl transition-all border border-slate-100 px-2 w-[100%]">
        <div>
          <Tooltip target=".wishlist-icon" />
          <motion.i
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={wishlisted ? unwishlist : wishlistItem}
            data-pr-tooltip="Wishlist Product"
            data-pr-position="right"
            className={`wishlist-icon pi pi-heart-fill ${
              wishlisted ? "text-error" : "text-slate-400"
            } hover:text-error !text-2xl`}
          />
        </div>
        <img
          src={product.images[0]}
          alt="product_image"
          className="h-[150px] w-[auto] my-4 mx-auto"
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
          {product.stock > 0 ? (
            <p className="text-xs my-1">
              Savings{" "}
              <span className="text-success font-bold">
                {numFormatter(savings)}
              </span>{" "}
              ({savingsPercentage}%)
            </p>
          ) : (
            <div className="my-1 text-xs flex align items-center font-semibold text-red-400">
              <i className="text-xs pi pi-exclamation-triangle !mr-2" />
              <span>Out of Stock</span>
            </div>
          )}
        </div>
        <div className="mt-2 flex justify-between">
          <Button
            label="Quick View"
            onClick={() => {
              setSelectedProduct(product);
              quickViewToggle();
            }}
            className="p-button-outlined p-button-sm flex-1"
          />
          {product.stock > 0 && (
            <span>
              <Tooltip target=".add-to-cart-btn" />
              <Button
                icon="pi pi-shopping-cart"
                data-pr-tooltip="Add to cart"
                data-pr-position="bottom"
                onClick={() => addProductToCart(product)}
                className="p-button-sm flex-1 add-to-cart-btn !ml-2"
              />
            </span>
          )}
        </div>
      </Card>
    </>
  );
};

export default ProductCard;
