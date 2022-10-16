/* eslint-disable react-hooks/exhaustive-deps */
import ProductDetailsView from "../components/productDetailsView";
import {
  addToWishlist,
  addToCart,
  removeFromWishlist,
} from "../utils/cart.utils";
import { notify } from "../utils/notification.util";
import React, { useEffect, useState, useRef } from "react";
import ProductCard from "../components/productCard";
import { productsQuery, useFetch } from "../utils/gpl.util";
import { updateWishlist, updateCart } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { Toast } from "primereact/toast";
import Filter from "../components/filter";
import { useRouter } from "next/router";
import Loader from "../components/spinner";
import Image from "next/image";
import Head from "next/head";
import { IProduct } from "../interfaces";

const Products: React.FC = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProduct>();
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const { data, isLoading, fetchData } = useFetch(productsQuery, {}, false);
  const router = useRouter();
  const dispatch = useDispatch();
  const toast = useRef<any>();

  useEffect(() => {
    if (data && data.products) {
      setProducts(data.products);
    }
  }, [data]);

  useEffect(() => {
    const queryParmas = Object.keys(router.query).length;
    if (queryParmas) {
      fetchData(router.query);
    } else {
      fetchData({});
    }
  }, [router.query]);

  const wishlistProduct = (product: IProduct) => {
    const updatedList = addToWishlist(product._id);
    dispatch(updateWishlist({ updatedProductList: updatedList }));
    notify(
      {
        title: "Product Wishlisted",
        message: `${product.title} - Added to your wishlist!`,
        type: "info",
      },
      toast
    );
  };

  const unWishlistProduct = (product: IProduct) => {
    const updatedList = removeFromWishlist(product._id);
    dispatch(updateWishlist({ updatedProductList: updatedList }));
  };

  const addProductToCart = (product: IProduct) => {
    const updatedCart = addToCart({ ...product, quantity: 1 });
    dispatch(updateCart({ updatedCart }));
    notify(
      {
        title: "Added to Cart",
        message: `${product.title} - Added to your cart!`,
        type: "success",
      },
      toast
    );
  };

  return (
    <div className="mx-2 mt-4 max-w-[1600px] md:px-6 md:mx-auto">
      <Head>
        <title>Products</title>
        <meta
          name="description"
          content="Explore the greatest product deals on the internet"
        />
        <link rel="shortcut icon" href="logo.svg" type="image/x-icon" />
      </Head>
      <Toast ref={toast} />
      <Loader loading={isLoading} />
      <main>
        <ProductDetailsView
          product={selectedProduct}
          isVisible={sidebarVisible}
          wishlistProduct={wishlistProduct}
          addProductToCart={addProductToCart}
          toggle={() => setSidebarVisible(false)}
        />
        <div>
          <h3 className="text-2xl font-bold">Products</h3>
          <p className="text-sm text-info">
            {router.query.id && products.length ? (
              <>Showing - {products[0].title}</>
            ) : router.query.id && !products.length ? (
              "Something went wrong!"
            ) : (
              "Showing all available products. Use the filters to narrow down the results!"
            )}
          </p>
        </div>
        <div className="flex my-6">
          <Filter />
          {products.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mx-auto md:flex-1 md:ml-6">
              {products.map((product: IProduct) => {
                return (
                  <ProductCard
                    quickViewToggle={() => setSidebarVisible(true)}
                    wishlistProduct={wishlistProduct}
                    unWishlistProduct={unWishlistProduct}
                    addProductToCart={addProductToCart}
                    setSelectedProduct={(product: IProduct) =>
                      setSelectedProduct(product)
                    }
                    key={product._id}
                    product={product}
                  />
                );
              })}
            </div>
          ) : (
            <div className="mx-auto text-center">
              <Image
                height={400}
                width={400}
                src="/no_results.svg"
                alt="No Results Found"
              />
              <h5 className="font-bold text-slate-700">
                Oops...no Products found.
              </h5>
              <p className="text-sm text-slate-500">
                Try changing the filters or search for a different item.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Products;
