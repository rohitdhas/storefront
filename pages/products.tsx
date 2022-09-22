import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import ProductCard from "../components/productCard";
import Filter from "../components/filter";
import Head from "next/head";
import React from "react";

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: "http://localhost:3000/api/graphql/",
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      query GetProducts {
        products(filters: {}) {
          _id
          title
          description
          images
          currentPrice
          originalPrice
          rating
          stock
          category
          exclusive
          tags
          specifications {
            key
            value
          }
          color
        }
      }
    `,
  });

  return {
    props: {
      data,
    },
  };
}

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

const Products: React.FC<{ data: { products: Product[] } }> = ({ data }) => {
  const { products } = data;

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
