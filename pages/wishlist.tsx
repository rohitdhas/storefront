import { DataTable } from "primereact/datatable";
import { numFormatter } from "../utils/main.utils";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useCallback, useRef } from "react";
import { useFetch, productsQuery } from "../utils/gpl.util";
import { updateWishlist, updateCart } from "../redux/userSlice";
import { addToCart, removeFromWishlist } from "../utils/cart.utils";
import { notify } from "../utils/notification.util";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { RootState } from "../redux/store";
import Loader from "../components/loader";
import { IProduct } from "../interfaces";
import { Toast } from "primereact/toast";
import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

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
    fetchData({ productIds: wishlistedIds });
  }, [wishlistedIds]);

  useEffect(() => {
    if (wishlistRes) {
      setWishlist(wishlistRes.products);
    }
  }, [wishlistRes]);

  return (
    <div className="mx-2 mt-4 max-w-[1600px] md:px-6 md:mx-auto">
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
      </div>
      <div className="my-4">
        {wishlist.length ? (
          <DataTable value={wishlist} responsiveLayout="scroll">
            <Column
              align={"center"}
              header="Product"
              body={(rowData: IProduct) => {
                return (
                  <div>
                    <Image src={rowData.images[0]} height={100} width={120} />
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
                        className="p-button-sm !mx-2"
                        onClick={() => addProductToCart(rowData)}
                      />
                    )}
                    <Button
                      icon="pi pi-times"
                      tooltip="Remove from wishlist"
                      tooltipOptions={{ position: "bottom" }}
                      className="p-button-sm p-button-danger"
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

export default Wishlist;
