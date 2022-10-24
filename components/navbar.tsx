/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useSession, signOut, signIn } from "next-auth/react";
import { Tooltip } from "primereact/tooltip";
import { Badge } from "primereact/badge";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../redux/store";
import { getCart, getWishlist } from "../utils/cart.utils";
import { updateCart, updateWishlist } from "../redux/userSlice";
import { autocompleteQuery, useFetch } from "../utils/gpl.util";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import EventEmitter from "events";
import Link from "next/link";
import Image from "next/image";

const Navbar: React.FC = () => {
  const [input, setInput] = useState("");
  const { data: session, status } = useSession();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loginBtnLoading, setLoginBtnLoading] = useState<boolean>(false);
  const { cart } = useSelector((state: RootState) => state.user);
  const { data, fetchData } = useFetch(autocompleteQuery, "", false);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    // Updating Global State with session values
    dispatch(updateCart({ updatedCart: getCart() }));
    dispatch(updateWishlist({ updatedProductList: getWishlist() }));
    document.addEventListener("click", () => setDropdownVisible(false));
    EventEmitter.defaultMaxListeners = 0;
  }, []);

  useEffect(() => {
    if (!data || !data.autocomplete) return;
    setSearchResults(data.autocomplete);
  }, [data]);

  return (
    <nav className="px-6 py-4 shadow-md fixed top-0 left-0 right-0 bg-white z-[100]">
      <div className="flex align items-center justify-between max-w-[1600px] mx-auto">
        <div className="flex align items-center justify-between flex-1">
          <div className="flex align items-center">
            <Link href={"/"}>
              <a>
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.8 }}
                  src={"/logo.svg"}
                  alt="logo"
                  className="h-[60px] w-[60px]"
                />
              </a>
            </Link>
            <Link href={"/products"}>
              <a className="text-slate-500 hover:text-secondary hover:underline ml-6">
                Products
              </a>
            </Link>
          </div>
          <span className="w-[80%] hidden md:block">
            <AutoComplete
              className="w-[90%]"
              onChange={({ target }) => setInput(target.value)}
              completeMethod={({ query }) => {
                if (!query) {
                  setSearchResults([]);
                  return;
                }
                fetchData(input);
              }}
              delay={350}
              field={"title"}
              onSelect={({ value }) => {
                const product: any = searchResults.find(
                  (item: { _id: string; title: string }) =>
                    item.title === value.title
                );
                router.push({
                  pathname: "/products",
                  query: { id: product._id },
                });
              }}
              dropdownIcon="pi pi-search font-bold"
              placeholder="Search Something..."
              suggestions={searchResults}
              value={input}
              dropdown
            />
          </span>
        </div>
        <motion.div
          initial="initial"
          animate="animate"
          className="flex justify-end align items-center"
        >
          <Tooltip className="transition-all" target={".shopping-cart"} />
          <Tooltip className="transition-all" target={".heart-fill"} />
          <span
            onClick={() => router.push({ pathname: "/cart" })}
            data-pr-tooltip="Cart"
            data-pr-position="bottom"
            className="shopping-cart flex align items-center justify-center hover:bg-gray-200 rounded-full transition-all px-2 py-1 ml-8 mr-4"
          >
            <i className="pi pi-shopping-cart !text-2xl text-info p-overlay-badge">
              <Badge value={cart.length}></Badge>
            </i>
          </span>
          <span
            onClick={() => router.push({ pathname: "/wishlist" })}
            data-pr-tooltip="Wishlist"
            data-pr-position="bottom"
            className="heart-fill hidden md:flex align items-center justify-center hover:bg-gray-200 rounded-full transition-all px-2 py-1 mr-8 ml-4"
          >
            <i className="pi pi-heart-fill !text-2xl text-info" />
          </span>
          {status === "authenticated" ? (
            <>
              <Tooltip className="transition-all" target={".profile-pic"} />
              <Image
                src={session.user?.image!}
                alt="profile_pic"
                data-pr-tooltip="You"
                data-pr-position="bottom"
                className="profile-pic rounded-full cursor-pointer hover:opacity-80"
                height={45}
                width={45}
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownVisible(true);
                }}
              />
              <AnimatePresence exitBeforeEnter>
                {dropdownVisible && <ProfileDropdown session={session} />}
              </AnimatePresence>
            </>
          ) : (
            <Button
              className="p-button-outlined p-button-sm md:p-button-md text-sm md:text-md"
              label="Sign In"
              loading={loginBtnLoading}
              onClick={() => {
                setLoginBtnLoading(true);
                signIn("google");
              }}
            />
          )}
        </motion.div>
      </div>
    </nav>
  );
};

const ProfileDropdown = ({ session }: { session: any }) => {
  const router = useRouter();
  return (
    <motion.div
      key={"profile-dropdown"}
      initial={{ y: -150, opacity: 0, scale: 0.5 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -150, opacity: 0, scale: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="flex flex-col align items-center justify-center absolute top-24 z-[1000]"
    >
      <Card className="p-shadow-5 !bg-slate-800">
        <div className="flex align items-center justify-center border-b border-b-slate-600 pb-4">
          <Image
            src={session.user?.image}
            alt="profile_pic"
            className="rounded-full"
            height={60}
            width={60}
          />
          <span className="mx-4">
            <h3 className="text-xl font-bold text-white">
              {session.user?.name}
            </h3>
            <p className="text-sm text-gray-400">{session.user?.email}</p>
          </span>
        </div>
        <div className="border-b border-b-slate-600 py-2">
          <DropdownBtn
            icon="pi pi-shopping-bag"
            label="Your Orders"
            hoverBg="bg-primary"
            callback={() => router.push({ pathname: "/orders" })}
          />
        </div>
        <div className="border-b border-b-slate-600 py-2">
          <DropdownBtn
            icon="pi pi-user-edit"
            label="Account Settings"
            hoverBg="bg-primary"
            callback={() => router.push({ pathname: "/profile" })}
          />
        </div>
        {session.user.type === "admin" ? (
          <div className="border-b border-b-slate-600 py-2">
            <DropdownBtn
              icon="pi pi-cog"
              label="Admin Panal"
              hoverBg="bg-primary"
              callback={() => router.push({ pathname: "/admin" })}
            />
          </div>
        ) : (
          <></>
        )}
        <div className="mt-2">
          <DropdownBtn
            icon="pi pi-sign-out"
            label="Sign Out"
            hoverBg="bg-error"
            callback={() => signOut()}
          />
        </div>
      </Card>
    </motion.div>
  );
};

export const DropdownBtn = ({
  icon,
  label,
  callback,
  hoverBg,
}: {
  icon: string;
  label: string;
  callback: Function;
  hoverBg: string;
}) => {
  if (hoverBg === "bg-error") {
    return (
      <button
        className={`transition-all text-white font-bold w-full bg-transparent rounded-[0.15rem] cursor-pointer hover:bg-error text-start p-2`}
        onClick={() => callback()}
      >
        <i className={`${icon} mx-4 !text-xl`} />
        <span>{label}</span>
      </button>
    );
  }
  return (
    <button
      className={`transition-all text-white font-bold w-full bg-transparent rounded-[0.15rem] cursor-pointer hover:bg-primary text-start p-2`}
      onClick={() => callback()}
    >
      <i className={`${icon} mx-4 !text-xl`} />
      <span>{label}</span>
    </button>
  );
};

export default Navbar;
