import { useFetch, productsQuery } from "../../utils/gpl.util";
import { numFormatter } from "../../utils/main.utils";
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { IProduct } from "../../interfaces";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import EditProduct from "../../components/EditProduct";
import Head from "next/head";

export default function Products() {
  const { data, isLoading } = useFetch(productsQuery, {});
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct>();
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setProducts(data.products);
    }
  }, [data]);

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
            <i className="pi pi-box font-bold !text-2xl text-slate-500 mr-2" />
            <span className="text-slate-800 font-bold text-2xl">Products</span>
          </div>
          <p className="text-sm text-info mt-1">
            Showing all products listed on StoreFront!
          </p>
        </div>
        <EditProduct
          product={selectedProduct}
          visible={sidebarVisible}
          onHide={() => setSidebarVisible(false)}
        />
        <div className="mt-6">
          <DataTable
            loading={isLoading}
            loadingIcon={"pi pi-spinner"}
            value={products}
            paginator
            rows={10}
            responsiveLayout="scroll"
          >
            <Column field="title" header="Name" />
            <Column
              field="currentPrice"
              header="Price"
              body={(rowData: IProduct) => numFormatter(rowData.currentPrice)}
            />
            <Column field="stock" header="Stock" />
            <Column
              field="rating"
              header="Ratings"
              body={(rowData: IProduct) => `${rowData.rating} ⭐`}
            />
            <Column field="category" header="Category" />
            <Column
              field="exclusive"
              header="Exclusive"
              body={(rowData: IProduct) => (rowData.exclusive ? "✅" : "❌")}
            />
            <Column
              header="Actions"
              align={"center"}
              body={(rowData: IProduct) => {
                return (
                  <div className="flex flex-wrap justify-center">
                    <Button
                      icon="pi pi-pencil"
                      tooltip="Edit"
                      tooltipOptions={{ position: "bottom" }}
                      className="p-button-sm !mx-2 !my-1"
                      onClick={() => {
                        setSelectedProduct(rowData);
                        setSidebarVisible(true);
                      }}
                    />
                    <Button
                      icon="pi pi-trash"
                      tooltip="Delete"
                      tooltipOptions={{ position: "bottom" }}
                      className="p-button-sm p-button-danger !my-1"
                      // onClick={() => removeItemFromWishlist(rowData._id)}
                    />
                  </div>
                );
              }}
            />
          </DataTable>
        </div>
      </main>
    </div>
  );
}
