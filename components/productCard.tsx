/* eslint-disable @next/next/no-img-element */
import { Card } from "primereact/card";
import { Button } from "primereact/button";
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

type Props = {
  product: Product;
};

const ProductCard: React.FC<Props> = ({ product }) => {
  const savings = product.originalPrice - product.currentPrice;
  const savingsPercentage = ((savings / product.originalPrice) * 100).toFixed(
    2
  );
  return (
    <Card>
      <div>
        <i className="pi pi-heart text-2xl" />
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
        <Button icon="pi pi-shopping-cart" className="p-button-sm w-[20%]" />
      </div>
    </Card>
  );
};

const numFormatter = (num: number) =>
  num.toLocaleString("en-US", {
    style: "currency",
    currency: "INR",
  });

export default ProductCard;
