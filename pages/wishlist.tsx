import { DataTable } from "primereact/datatable";
import { numFormatter } from "../utils/main.utils";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useCallback, useRef } from "react";
import { useFetch, productsQuery } from "../utils/gpl.util";
import { updateWishlist, updateCart } from "../redux/userSlice";
import { addToCart, removeFromWishlist } from "../utils/cart.utils";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { notify } from "../utils/notification.util";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { RootState } from "../redux/store";
import Loader from "../components/spinner";
import { IProduct } from "../interfaces";
import { Toast } from "primereact/toast";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { InputText } from "primereact/inputtext";

const Wishlist: NextPage = () => {
  const { wishlist: wishlistedIds }: { wishlist: string[] } = useSelector(
    (state: RootState) => state.user
  );
  const {
    data: wishlistRes,
    isLoading,
    fetchData,
  } = useFetch(productsQuery, { productIds: wishlistedIds });
  const [wishlist, setWishlist] = useState<IProduct[]>([]);
  const [filters, setFilters] = useState<any>(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const dispatch = useDispatch();
  const toast: any = useRef();

  const addProductToCart = useCallback((product: IProduct) => {
    const updatedCart = addToCart({
      ...product,
      quantity: 1,
    });
    dispatch(updateCart({ updatedCart }));
    notify(
      {
        title: "Added to Cart",
        message: `${product.title} - Added to your cart!`,
        type: "success",
      },
      toast
    );
  }, []);

  const removeItemFromWishlist = useCallback((productId: string) => {
    const updatedWishlist = removeFromWishlist(productId);
    dispatch(updateWishlist({ updatedProductList: updatedWishlist }));
  }, []);

  useEffect(() => {
    initFilters();
  }, []);

  useEffect(() => {
    fetchData({ productIds: wishlistedIds });
  }, [wishlistedIds]);

  useEffect(() => {
    if (wishlistRes) {
      setWishlist(wishlistRes.products);
    }
  }, [wishlistRes]);

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
    <div className="mx-6 mt-4 max-w-[1600px] md:px-6 md:mx-auto">
      <Head>
        <title>Wishlist</title>
        <meta
          name="description"
          content="Explore the greatest product deals on the internet"
        />
        <link rel="shortcut icon" href="logo.svg" type="image/x-icon" />
      </Head>
      <Loader loading={isLoading} />
      <Toast ref={toast} />
      <div>
        <h3 className="text-2xl font-bold">Your Wishlist 💖</h3>
        <p className="text-sm text-info">
          Make use of search box to search through your wishlist!
        </p>
      </div>
      <RenderFilterHeader
        globalFilterValue={globalFilterValue}
        onGlobalFilterChange={onGlobalFilterChange}
        clearFilter={initFilters}
      />
      <div className="my-4">
        {wishlist.length ? (
          <DataTable
            rows={10}
            paginator
            value={wishlist}
            dataKey="wishlist-table"
            responsiveLayout="scroll"
            filters={filters}
            filterDisplay="menu"
            globalFilterFields={["title"]}
          >
            <Column
              align={"center"}
              header="Product"
              filterField="title"
              body={(rowData: IProduct) => {
                return (
                  <div>
                    <div className="relative h-[60px] w-[75px] mx-auto">
                      <Image
                        alt="product_img"
                        src={`${process.env.BUCKET_URL}/${rowData.images[0]}`}
                        layout={"fill"}
                        objectFit={"contain"}
                      />
                    </div>
                    <div>
                      <Link href={`/products?id=${rowData._id}`}>
                        <a className="font-bold text-slate-800 hover:text-blue-500">
                          {rowData.title}
                        </a>
                      </Link>
                    </div>
                  </div>
                );
              }}
            />
            <Column
              header="Price"
              align={"center"}
              body={(rowData: IProduct) => {
                const savings = rowData.originalPrice - rowData.currentPrice;
                const savingsPercentage = (
                  (savings / rowData.originalPrice) *
                  100
                ).toFixed(2);

                return (
                  <div>
                    <span className="font-semibold text-slate-700">
                      {numFormatter(rowData.currentPrice)}
                    </span>{" "}
                    <span className="line-through text-sm text-gray-400">
                      {numFormatter(rowData.originalPrice)}
                    </span>
                    <p className="text-sm text-info">
                      You&apos;ll save{" "}
                      <span className="text-success font-semibold">
                        {numFormatter(savings)}
                      </span>{" "}
                      ({savingsPercentage}
                      %)
                    </p>
                  </div>
                );
              }}
            />
            <Column
              header="Stock Status"
              align={"center"}
              body={(rowData: IProduct) => {
                return (
                  <>
                    {rowData.stock > 0 ? (
                      <div>
                        {rowData.stock < 10 ? (
                          <p className="text-red-400 font-semibold">
                            Hurry, Only {rowData.stock} left in stock!
                          </p>
                        ) : (
                          <p className="font-semibold">In Stock ✅</p>
                        )}
                      </div>
                    ) : (
                      <span className="font-semibold">Out Of Stock ❌</span>
                    )}
                  </>
                );
              }}
            />
            <Column
              header="Actions"
              align={"center"}
              body={(rowData: IProduct) => {
                return (
                  <div className="flex flex-wrap justify-center">
                    {rowData.stock > 0 && (
                      <Button
                        icon="pi pi-shopping-cart"
                        tooltip="Add to cart"
                        tooltipOptions={{ position: "bottom" }}
                        className="p-button-sm !mx-2 !my-1"
                        onClick={() => addProductToCart(rowData)}
                      />
                    )}
                    <Button
                      icon="pi pi-times"
                      tooltip="Remove from wishlist"
                      tooltipOptions={{ position: "bottom" }}
                      className="p-button-sm p-button-danger !my-1"
                      onClick={() => removeItemFromWishlist(rowData._id)}
                    />
                  </div>
                );
              }}
            />
          </DataTable>
        ) : (
          <div className="mx-auto text-center">
            <Image
              height={400}
              width={450}
              src="/wishlist.svg"
              alt="Empty Wishlist"
            />
            <h5 className="font-bold text-slate-700">
              Your wishlist is empty!
            </h5>
            <p className="text-sm text-slate-500">
              Go ahead and add something to your wishlist
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const RenderFilterHeader = ({
  globalFilterValue,
  onGlobalFilterChange,
  clearFilter,
}: {
  globalFilterValue: any;
  onGlobalFilterChange: any;
  clearFilter: () => void;
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
    </div>
  );
};

export default Wishlist;
