/* eslint-disable @next/next/no-img-element */
import { ProgressSpinner } from "primereact/progressspinner";
import { useFetch, productsQuery } from "../utils/gpl.util";
import { updateCart } from "../redux/userSlice";
import { addToCart } from "../utils/cart.utils";
import { numFormatter } from "../utils/main.utils";
import { Carousel } from "primereact/carousel";
import { useDispatch } from "react-redux";
import { IProduct } from "../interfaces";
import { Chip } from "primereact/chip";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

const Home: NextPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<IProduct[]>([]);
  const { data: productsRes, isLoading } = useFetch(productsQuery, {
    exclusive: "true",
  });

  useEffect(() => {
    if (productsRes) {
      setProducts(productsRes.products);
    }
  }, [productsRes]);

  return (
    <div>
      <Head>
        <title>StoreFront</title>
        <meta
          name="description"
          content="Explore the greatest product deals on the internet"
        />
        <link rel="shortcut icon" href="logo.svg" type="image/x-icon" />
      </Head>
      <main>
        {/* Carousel Section */}
        <div className="mx-6 bg-white rounded-md border-2 border-primaryLight">
          <Carousel
            autoplayInterval={isLoading ? 0 : 4000}
            className=" !-z-10"
            value={isLoading ? [{}] : products}
            circular={true}
            itemTemplate={isLoading ? CaraousalDataLoading : itemTemplate}
          ></Carousel>
        </div>
      </main>
      {/* Categories Section */}
      <section>
        <div className="mt-12 mb-6 mx-6">
          <SectionTitle firstWord="Product" rest="Categories" />
          <div className="flex justify-center align items-center flex-wrap">
            <motion.div
              onClick={() =>
                router.push({
                  pathname: "/products",
                  query: { categories: "Mobiles & Tablets" },
                })
              }
              className=" my-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="!bg-purple-50 !shadow-lg">
                <Image
                  className="product-img"
                  src={
                    "https://pngimg.com/uploads/iphone_13/iphone_13_PNG31.png"
                  }
                  alt={"category-image"}
                  height={250}
                  width={240}
                />
                <h5 className="text-center font-bold">Mobiles &amp; Tablets</h5>
              </Card>
            </motion.div>
            <motion.div
              onClick={() =>
                router.push({
                  pathname: "/products",
                  query: { categories: "Computers & Laptops" },
                })
              }
              className="md:mx-6 my-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="!bg-pink-50 !shadow-lg">
                <Image
                  className="product-img"
                  src={
                    "https://cdn.shopify.com/s/files/1/0057/8938/4802/files/pi-1.png?v=1624786714"
                  }
                  alt={"category-image"}
                  height={250}
                  width={240}
                />
                <h5 className="text-center font-bold">
                  Computers &amp; Laptops
                </h5>
              </Card>
            </motion.div>
            <motion.div
              onClick={() =>
                router.push({
                  pathname: "/products",
                  query: { categories: "Accessories" },
                })
              }
              className="md:mr-6 my-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="!bg-yellow-50 !shadow-lg">
                <Image
                  className="product-img"
                  src={
                    "https://content.jdmagicbox.com/quickquotes/images_main/noise-colorfit-pro-2-smart-watch-teal-green-178087473-47614.png"
                  }
                  alt={"category-image"}
                  height={250}
                  width={240}
                />
                <h5 className="text-center font-bold">Accessories</h5>
              </Card>
            </motion.div>
            <motion.div
              onClick={() =>
                router.push({
                  pathname: "/products",
                  query: { categories: "TV's & Monitors" },
                })
              }
              className="md:mr-6 my-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="!bg-green-50 !shadow-lg">
                <Image
                  className="product-img"
                  src={
                    "https://cdn.shopify.com/s/files/1/0057/8938/4802/products/rockerz-650-red_600x.png?v=1624968476"
                  }
                  alt={"category-image"}
                  height={250}
                  width={240}
                />
                <h5 className="text-center font-bold">
                  TV&apos;s &amp; Monitors
                </h5>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Deal of the Day Section */}
      <section>
        <div className="mt-12 mb-6 mx-6">
          <SectionTitle firstWord="Deal" rest="of the day" />
          <Card className="w-[95%] md:w-[70%] mx-auto !shadow-none !bg-slate-50">
            <div className="flex flex-col-reverse justify-center align items-center lg:flex-row lg:justify-evenly p-4">
              <div>
                <h3 className="text-2xl font-bold mb-5 text-slate-800">
                  Boat Rockerz 650 Sports
                  <Chip
                    label="Hot Deal"
                    icon="pi pi-star"
                    className="!bg-yellow-400 !text-white !text-[0.6rem] ml-2 !font-bold"
                  />
                </h3>
                <p className="text-info my-4 leading-[1.7]">
                  Catch the faintest beat clearly with the fresh new Rockerz 650
                  <br />
                  wireless headphones. Indulge in a ceaseless, pure audio bliss
                  <br />
                  with its unbelievable 60HRS of playback.The Smart Twist
                  enables
                  <br />
                  you to play or pause your music hassle-free.
                </p>
                <div className="text-xl mb-4">
                  <span className="text-slate-900 font-bold ">
                    {numFormatter(1200)}
                  </span>
                  <span className="line-through text-info mx-2 text-sm font-bold ">
                    {numFormatter(1700)}
                  </span>
                  <br />
                  <span className="text-xs font-semibold">
                    Savings{" "}
                    <span className="text-success">{numFormatter(500)}</span>{" "}
                    (7.00%)
                  </span>
                </div>
                <Button
                  className="p-button-outlined"
                  label="Add to cart"
                  icon="pi pi-shopping-cart"
                />
              </div>
              <motion.div>
                <Image
                  src={
                    "https://cdn.shopify.com/s/files/1/0057/8938/4802/products/rockerz-650-red_600x.png?v=1624968476"
                  }
                  height={300}
                  width={340}
                  alt="product-img"
                />
              </motion.div>
            </div>
          </Card>
        </div>
      </section>
      {/* What we offer section */}
      <section>
        <div className="mt-12 mb-6 mx-6">
          <SectionTitle firstWord="What" rest="We Offer" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 m-auto justify-end">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card className="w-[85%] md:w-[60%] p-4 mx-auto md:mx-0 md:ml-auto !shadow-none !bg-primaryLight text-slate-900">
                <div>
                  <i className="pi pi-box !text-3xl !font-bold text-primary" />
                </div>
                <h5 className="font-bold text-xl my-5">Free Shipping</h5>
                <p className="mt-2 text-[0.9] text-info leading-[1.7]">
                  Free Shipping over all IN orders or
                  <br />
                  orders above ₹500/-
                </p>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card className="w-[85%] md:w-[60%] p-4 mx-auto md:mx-0 md:mr-auto !shadow-none !bg-primaryLight text-slate-900">
                <div>
                  <i className="pi pi-send !text-3xl !font-bold text-primary" />
                </div>
                <h5 className="font-bold text-xl my-5">30 Days Return</h5>
                <p className="mt-2 text-[0.9] text-info leading-[1.7]">
                  Simply return it within <br />
                  30 days for an exchange
                </p>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card className="w-[85%] md:w-[60%] p-4 mx-auto md:mx-0 md:ml-auto !shadow-none !bg-primaryLight text-slate-900">
                <div>
                  <i className="pi pi-wallet !text-3xl !font-bold text-primary" />
                </div>
                <h5 className="font-bold text-xl my-5">100% Secure Payments</h5>
                <p className="mt-2 text-[0.9] text-info leading-[1.7]">
                  Pay securely with your credit/debit cards, with 100% security
                </p>
              </Card>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Card className="w-[85%] md:w-[60%] p-4 mx-auto md:mx-0 md:mr-auto !shadow-none !bg-primaryLight text-slate-900">
                <div>
                  <i className="pi pi-info-circle !text-3xl !font-bold text-primary" />
                </div>
                <h5 className="font-bold text-xl my-5">24/7 Help Center</h5>
                <p className="mt-2 text-[0.9] text-info leading-[1.7]">
                  Resolve your queries with, <br />
                  our Dedicated support team
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      <footer className="py-6 bg-slate-800">
        <div className="text-center text-2xl mt-6 font-bold text-primary">
          <Link href={"mailto:rohitdhas000@gmail.com"}>
            <a target={"_blank"}>
              <motion.i
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.8 }}
                className="pi pi-at !text-2xl !font-bold cursor-pointer"
              />
            </a>
          </Link>
          <Link href={"https://www.instagram.com/rohitdhas.jpg/"}>
            <a target={"_blank"}>
              <motion.i
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.8 }}
                className="pi pi-instagram mx-4 !text-2xl !font-bold cursor-pointer"
              />
            </a>
          </Link>
          <Link href={"https://www.linkedin.com/in/rohitdhas"}>
            <a target={"_blank"}>
              <motion.i
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.8 }}
                className="pi pi-linkedin !text-2xl !font-bold cursor-pointer"
              />
            </a>
          </Link>
          <Link href={"https://twitter.com/rohitdhas_dev"}>
            <a target={"_blank"}>
              <motion.i
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.8 }}
                className="pi pi-twitter mx-4 !text-2xl !font-bold cursor-pointer"
              />
            </a>
          </Link>
          <Link href={"https://github.com/rohitdhas"}>
            <a target={"_blank"}>
              <motion.i
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.8 }}
                className="pi pi-github !text-2xl !font-bold cursor-pointer"
              />
            </a>
          </Link>
        </div>
        <p className="text-center my-4 text-slate-500">
          © 2022 StoreFront. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

const itemTemplate = (product: IProduct) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const addProductToCart = () => {
    const updatedCart = addToCart({ ...product, quantity: 1 });
    dispatch(updateCart({ updatedCart }));
    router.push({ pathname: "/cart" });
  };

  return (
    <div className="product-item flex flex-col-reverse lg:flex-row justify-center lg:justify-evenly align items-center md:px-6">
      <div className="product-detail">
        <h5 className="text-base sm:text-xl md:text-2xl font-bold mt-4 text-slate-500">
          <span>{product.title}</span>
          <Chip
            label="Exclusive"
            icon="pi pi-check"
            className="!bg-success !text-white !text-[0.6rem] ml-2 !font-bold"
          />
        </h5>
        <div
          dangerouslySetInnerHTML={{ __html: product.tagline! }}
          className="description text-[1rem] md:text-[2.7rem] leading-[1.2] font-bold mt-2 text-slate-700"
        />
        <p className="text-xs text-info my-6">
          <span>10% instant discount* on SBI credit/debit cards</span>
          <br />
          <span className="font-bold">*T&amp;C apply</span>
        </p>
        <Button
          className="px-4 py-2 w-full md:py-3 md:w-auto"
          icon={"pi pi-arrow-right"}
          label="Buy Now"
          onClick={addProductToCart}
        />
      </div>

      <div className="relative h-[200px] w-[220px] md:w-[400px] md:h-[420px] my-4">
        <Image
          src={`${process.env.BUCKET_URL}/${product.images[0]}`}
          alt="product_image"
          layout={"fill"}
          objectFit={"contain"}
        />
      </div>
    </div>
  );
};

const SectionTitle = ({
  firstWord,
  rest,
}: {
  firstWord: string;
  rest: string;
}) => {
  return (
    <>
      <div>
        <h2 className="text-3xl font-bold text-slate-600 text-center mt-16 mb-6">
          <span className="text-primary">{firstWord}</span>{" "}
          <span className="italic">{rest}</span>
        </h2>
      </div>
      <div className="w-[180px] h-[5px] rounded-full bg-primary mx-auto my-8" />
    </>
  );
};

function CaraousalDataLoading() {
  return (
    <div className="flex justify-center align items-center h-[300px]">
      <ProgressSpinner
        style={{ width: "70px", height: "70px" }}
        strokeWidth="4"
        animationDuration="1s"
      />
    </div>
  );
}

export default Home;
