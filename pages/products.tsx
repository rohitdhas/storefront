/* eslint-disable react-hooks/exhaustive-deps */
import ProductDetailsView from "../components/productDetailsView";
import {
  addToWishlist,
  addToCart,
  notify,
  removeFromWishlist,
} from "../utils/main.utils";
import React, { useEffect, useState, useRef } from "react";
import ProductCard from "../components/productCard";
import { productsQuery, useFetch } from "../utils/gpl.util";
import { updateWishlist, updateCart } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { Toast } from "primereact/toast";
import Filter from "../components/filter";
import { useRouter } from "next/router";
import Loader from "../components/loader";
import Image from "next/image";
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
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const { data, isLoading, fetchData } = useFetch(productsQuery, {});
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

  const wishlistProduct = (product: Product) => {
    const updatedList = addToWishlist(product);
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

  const unWishlistProduct = (product: Product) => {
    const updatedList = removeFromWishlist(product._id);
    dispatch(updateWishlist({ updatedProductList: updatedList }));
  };

  const addProductToCart = (product: Product) => {
    const updatedCart = addToCart(product);
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
    <div className="px-6 pt-4">
      <Head>
        <title>StoreFront</title>
        <meta
          name="description"
          content="Explore the greatest product deals on the internet"
        />
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
            Showing all available products. Use the filters to narrow down the
            results!
          </p>
        </div>
        <div className="flex my-6">
          <Filter />
          {products.length ? (
            <div className="grid grid-cols-4 gap-4 flex-1 ml-6">
              {products.map((product: Product) => {
                return (
                  <ProductCard
                    quickViewToggle={() => setSidebarVisible(true)}
                    wishlistProduct={wishlistProduct}
                    unWishlistProduct={unWishlistProduct}
                    addProductToCart={addProductToCart}
                    setSelectedProduct={(product: Product) =>
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
                height={300}
                width={300}
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
