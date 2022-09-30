/* eslint-disable @next/next/no-img-element */
import { Sidebar } from "primereact/sidebar";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { Carousel } from "primereact/carousel";
import { numFormatter } from "../utils/main.utils";
import React from "react";

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

const ProductDetailsView: React.FC<{
  isVisible: boolean;
  toggle: () => void;
  product: Product | null | undefined;
  wishlistProduct: (product: Product) => void;
  addProductToCart: (product: Product) => void;
}> = ({ product, isVisible, toggle, addProductToCart, wishlistProduct }) => {
  if (!product) return <></>;

  const savings = product?.originalPrice - product?.currentPrice;
  const savingsPercentage = ((savings / product?.originalPrice) * 100).toFixed(
    2
  );
  return (
    <div className="w-[100vw]">
      <Sidebar
        className="!w-full lg:!w-[40%] relative"
        visible={isVisible}
        position="right"
        onHide={toggle}
      >
        <Carousel
          className=" !-z-10"
          value={product.images}
          circular={true}
          itemTemplate={ImageTemplate}
        ></Carousel>
        <h3 className="text-xl font-bold text-slate-900">{product?.title}</h3>
        <p className="text-sm text-info my-2">{product?.description}</p>
        <div className="my-4">
          <div>
            <span className="text-xl font-bold text-slate-900">
              {numFormatter(product.currentPrice)}{" "}
            </span>
            <span className="text-info line-through">
              {numFormatter(product.originalPrice)}
            </span>
          </div>
          <div className="mt-1">
            You will save{" "}
            <span className="text-success font-bold">
              {numFormatter(savings)}
            </span>{" "}
            ({savingsPercentage}%)
          </div>
        </div>
        <Divider />
        <div className="flex justify-evenly align items-center">
          <div className="text-center">
            <span className="text-2xl">📅</span>
            <p className="text-xs text-slate-700">12m Warranty</p>
          </div>
          <div className="text-center">
            <span className="text-2xl">🛒</span>
            <p className="text-xs text-slate-700">Easy Returns</p>
          </div>
          <div className="text-center">
            <span className="text-2xl">📦</span>
            <p className="text-xs text-slate-700">Safe Delivery</p>
          </div>
          <div className="text-center">
            <span className="text-2xl">💳</span>
            <p className="text-xs text-slate-700">Secure Payments</p>
          </div>
        </div>
        <Divider />
        <div className="mb-8">
          <h4 className="font-bold text-info my-2">📃 Specifications</h4>
          {product.specifications.map((item: any, idx: number) => {
            return (
              <div
                className="flex justify-between w-[50%] my-2 text-sm"
                key={`${item.key}_${idx}`}
              >
                <span className="font-bold text-slate-900">{item.key}</span>
                <span>{item.value}</span>
              </div>
            );
          })}
        </div>
        <Divider />
        <div className="mb-10">
          <h4 className="font-bold text-info my-2">✅ Rating</h4>
          <p>{"⭐".repeat(Number(product.rating))}</p>
        </div>
        <div className="w-[100%] flex justify-between">
          <Button
            onClick={() => addProductToCart(product)}
            label="Add to Cart"
            icon="pi pi-shopping-cart"
            className="p-button-sm w-[50%] mr-4"
          />
          <Button
            label="Wishlist"
            icon="pi pi-heart-fill"
            onClick={() => wishlistProduct(product)}
            className="p-button-sm w-[50%] p-button-outlined p-button-danger"
          />
        </div>
      </Sidebar>
    </div>
  );
};

const ImageTemplate = (imgUrl: string) => {
  return (
    <div className="mx-auto">
      <img
        className="mx-auto h-[250px] w-auto mb-10"
        src={imgUrl}
        alt="Product Image"
      />
    </div>
  );
};

export default ProductDetailsView;
