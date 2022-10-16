import React from "react";
import Head from "next/head";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function Products() {
  return (
    <div>
      <Head>
        <title>StoreFront Admin Panal</title>
        <meta
          name="description"
          content="Explore the greatest product deals on the internet"
        />
        <link rel="shortcut icon" href="/logo.svg" type="image/x-icon" />
      </Head>
      <main className="mt-3">
        <div>
          <div className="flex align items-center">
            <i className="pi pi-box font-bold text-2xl text-slate-500 mr-2" />
            <span className="text-slate-800 font-bold text-2xl">Products</span>
          </div>
          <p className="text-sm text-info mt-1">
            Showing all products listed on StoreFront!
          </p>
        </div>
        <div className="mt-6">
          <DataTable value={[]} paginator responsiveLayout="scroll">
            <Column field="title" header="Name"></Column>
            <Column field="currentPrice" header="Price"></Column>
            <Column field="stock" header="Stock"></Column>
            <Column field="rating" header="Ratings"></Column>
            <Column field="category" header="Category"></Column>
            <Column field="exclusive" header="Exclusive"></Column>
            <Column header="Actions"></Column>
          </DataTable>
        </div>
      </main>
    </div>
  );
}
