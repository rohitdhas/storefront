import React from "react";
import Head from "next/head";
import Filter from "../components/filter";

const Products: React.FC = () => {
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
        <Filter />
      </main>
    </div>
  );
};

export default Products;
