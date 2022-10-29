import {
  useFetch,
  productsQuery,
  deleteProductQuery,
} from "../../utils/gpl.util";
import { numFormatter, truncateString } from "../../utils/main.utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { IProduct } from "../../interfaces";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { ConfirmDialog } from "primereact/confirmdialog";
import EditProduct from "../../components/EditProduct";
import AddProduct from "../../components/AddProduct";
import { InputText } from "primereact/inputtext";
import { getSession } from "next-auth/react";
import Head from "next/head";

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context);

  if (!session || session.user.type !== "admin") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

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
  const [filters, setFilters] = useState<any>(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteProductDialogVisible, setDeleteProductDialogVisible] =
    useState<boolean>(false);

  const [addProductPopupVisible, setAddProductPopupVisible] =
    useState<boolean>(false);

  useEffect(() => {
    initFilters();
  }, []);

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

  const onGlobalFilterChange = (e: any) => {
    const value = e.target.value;
    let _filters1 = { ...filters };
    _filters1["global"].value = value;

    setFilters(_filters1);
    setGlobalFilterValue(value);
  };

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      title: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });
    setGlobalFilterValue("");
  };

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
          <RenderFilterHeader
            clearFilter={initFilters}
            setAddProductPopupVisible={setAddProductPopupVisible}
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
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
            paginator
            rows={10}
            loading={isLoading}
            loadingIcon={"pi pi-spinner"}
            value={products}
            filters={filters}
            responsiveLayout="scroll"
            filterDisplay="menu"
            globalFilterFields={["title"]}
          >
            <Column
              filterField="title"
              field="title"
              header="Name"
              body={(rowData: IProduct) => truncateString(rowData.title, 25)}
            />
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

const RenderFilterHeader = ({
  globalFilterValue,
  onGlobalFilterChange,
  clearFilter,
  setAddProductPopupVisible,
}: {
  globalFilterValue: any;
  onGlobalFilterChange: any;
  clearFilter: () => void;
  setAddProductPopupVisible: any;
}) => {
  return (
    <div className="flex justify-between !my-6">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          className="p-inputtext-sm"
          onChange={(e) => onGlobalFilterChange(e)}
          placeholder="Keyword Search"
        />
        <Button
          type="button"
          icon="pi pi-filter-slash"
          className="p-button-outlined p-button-sm !ml-4"
          onClick={clearFilter}
          tooltip={"Clear Filters"}
        />
      </span>
      <Button
        label="Add Product"
        className="!mr-6 p-button-sm"
        icon={"pi pi-plus"}
        onClick={() => setAddProductPopupVisible(true)}
      />
    </div>
  );
};
