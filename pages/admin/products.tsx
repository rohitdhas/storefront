import {
  useFetch,
  productsQuery,
  deleteProductQuery,
} from "../../utils/gpl.util";
import { numFormatter } from "../../utils/main.utils";
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { IProduct } from "../../interfaces";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import EditProduct from "../../components/EditProduct";
import AddProduct from "../../components/AddProduct";
import Head from "next/head";

export default function Products() {
  const { data, isLoading } = useFetch(productsQuery, {});
  const { fetchData: deleteProduct } = useFetch(
    deleteProductQuery,
    null,
    false
  );
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct>();
  const [toDeleteProductId, setToDeleteProductId] = useState<string>();
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [deleteProductDialogVisible, setDeleteProductDialogVisible] =
    useState<boolean>(false);

  const [addProductPopupVisible, setAddProductPopupVisible] =
    useState<boolean>(false);

  useEffect(() => {
    if (data) {
      setProducts(data.products);
    }
  }, [data]);

  function updateProductList(product: IProduct | undefined) {
    if (!product) return;
    const update = products.filter((item) => item._id !== product._id);
    update.unshift(product);
    setProducts(update);
  }

  function pushToProductList(product: IProduct) {
    const update = [...products];
    update.push(product);
    setProducts(update);
  }

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
      <ConfirmDialog
        visible={deleteProductDialogVisible}
        onHide={() => setDeleteProductDialogVisible(false)}
        message="Are you sure you want to delete this product?"
        header="Confirmation"
        icon="pi pi-exclamation-triangle"
        accept={() => {
          deleteProduct(toDeleteProductId);
          const update = products.filter(
            (item) => item._id !== toDeleteProductId
          );
          setProducts(update);
        }}
        reject={() => setDeleteProductDialogVisible(false)}
      />
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
        <div>
          <Button
            label="Add Product"
            onClick={() => setAddProductPopupVisible(true)}
          />
        </div>
        <AddProduct
          visible={addProductPopupVisible}
          pushToProductList={pushToProductList}
          onHide={() => setAddProductPopupVisible(false)}
        />
        <EditProduct
          product={selectedProduct}
          visible={sidebarVisible}
          updateProductList={updateProductList}
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
                      onClick={() => {
                        setToDeleteProductId(rowData._id);
                        setDeleteProductDialogVisible(true);
                      }}
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
