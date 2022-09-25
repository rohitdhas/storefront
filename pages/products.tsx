import ProductCard from "../components/productCard";
import { productsQuery } from "../utils/gpl.util";
import Filter from "../components/filter";
import React, { useEffect, useState } from "react";
import Head from "next/head";

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

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts();
  }, []);

  async function getProducts() {
    const { data } = await productsQuery();
    setProducts(data.products);
  }

  return (
    <div className="px-6 pt-4">
      <Head>
        <title>StoreFront</title>
        <meta
          name="description"
          content="Explore the greatest product deals on the internet"
        />
      </Head>
      <main>
        <div>
          <h3 className="text-2xl font-bold">Products</h3>
          <p className="text-sm text-info">
            Showing all available products. Use the filters to narrow down the
            results!
          </p>
        </div>
        <div className="flex my-6">
          <Filter />
          <div className="grid grid-cols-4 gap-4 flex-1 ml-6">
            {products.map((product) => {
              return <ProductCard key={product._id} product={product} />;
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products;
