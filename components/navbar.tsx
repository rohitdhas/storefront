import { useSession, signOut, signIn } from "next-auth/react";
import { Tooltip } from "primereact/tooltip";
import { Badge } from "primereact/badge";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../redux/userSlice";
import type { RootState } from "../redux/store";
import { motion } from "framer-motion";
import Image from "next/image";

type Props = {};

const arr = [
  "Apple",
  "Banana",
  "Orange",
  "Mango",
  "Pineapple",
  "Papaya",
  "Strawberry",
];

const Navbar: React.FC<Props> = ({}) => {
  const [input, setInput] = useState("");
  const { data: session, status } = useSession();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchResults, setSearchResults] = useState(arr);
  const cart = useSelector((state: RootState) => state.user.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    document.addEventListener("click", () => setDropdownVisible(false));
  }, []);

  return (
    <nav className="flex align items-center justify-between px-6 py-4 shadow-md fixed top-0 left-0 right-0 bg-white z-[100]">
      <div className="flex align items-center justify-between flex-1">
        <h1 className="text-xl xl:text-3xl font-bold">StoreFront 🌟</h1>
        <span className="w-[80%] hidden md:block">
          <AutoComplete
            className="w-[90%]"
            onChange={({ target }) => setInput(target.value)}
            value={input}
            suggestions={searchResults}
            completeMethod={(e) => {
              const filtered = arr.filter((result) =>
                result.toLowerCase().includes(e.query.toLowerCase())
              );
              setSearchResults(filtered);
            }}
            dropdownIcon="pi pi-search font-bold"
            dropdown
            placeholder="Search Something..."
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
          onClick={() => dispatch(addToCart({}))}
          data-pr-tooltip="Cart"
          data-pr-position="bottom"
          className="shopping-cart flex align items-center justify-center hover:bg-gray-200 rounded-full transition-all px-2 py-1 ml-8 mr-4"
        >
          <i className="pi pi-shopping-cart !text-2xl text-info p-overlay-badge">
            <Badge value={cart.length}></Badge>
          </i>
        </span>
        <span
          data-pr-tooltip="Wishlist"
          data-pr-position="bottom"
          className="heart-fill flex align items-center justify-center hover:bg-gray-200 rounded-full transition-all px-2 py-1 mr-8 ml-4"
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
          <Button label="Sign In" onClick={() => signIn("google")} />
        )}
      </motion.div>
    </nav>
  );
};

const ProfileDropdown = ({ session }: { session: any }) => {
  return (
    <motion.div
      key={"profile-dropdown"}
      initial={{ y: -150, opacity: 0, scale: 0.5 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -150, opacity: 0, scale: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="flex flex-col align items-center justify-center absolute top-24 z-[1000]"
    >
      <Card className="p-shadow-5 bg-slate-800">
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
            callback={() => null}
          />
        </div>
        <div className="border-b border-b-slate-600 py-2">
          <DropdownBtn
            icon="pi pi-user-edit"
            label="Account Settings"
            hoverBg="bg-primary"
            callback={() => null}
          />
        </div>
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

const DropdownBtn = ({
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
