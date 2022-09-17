import { useSession, signOut, signIn } from "next-auth/react";
import { Tooltip } from "primereact/tooltip";
import { Badge } from "primereact/badge";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import React, { useState } from "react";

type Props = {};

const Navbar: React.FC<Props> = ({}) => {
  const [input, setInput] = useState("");
  return (
    <nav className="flex align items-center justify-between px-6 py-4">
      <div className="flex align items-center justify-between flex-1">
        <h1 className="text-3xl font-bold">StoreFront 🌟</h1>
        <span className="p-input-icon-left w-[80%]">
          <i className="pi pi-search" />
          <InputText
            className="w-[100%]"
            onChange={({ target }) => setInput(target.value)}
            value={input}
            placeholder="Search Something..."
          />
        </span>
      </div>
      <div className="flex justify-end align items-center">
        <Tooltip className="transition-all" target={".shopping-cart"} />
        <Tooltip className="transition-all" target={".heart-fill"} />
        <span
          data-pr-tooltip="Cart"
          data-pr-position="bottom"
          className="shopping-cart flex align items-center justify-center hover:bg-gray-200 rounded-full transition-all px-2 py-1 ml-8 mr-4"
        >
          <i className="pi pi-shopping-cart text-2xl text-[#4B5462] p-overlay-badge">
            <Badge value="2"></Badge>
          </i>
        </span>
        <span
          data-pr-tooltip="Wishlist"
          data-pr-position="bottom"
          className="heart-fill flex align items-center justify-center hover:bg-gray-200 rounded-full transition-all px-2 py-1 mr-8 ml-4"
        >
          <i className="pi pi-heart-fill text-2xl text-[#4B5462]" />
        </span>
        <Button label="Sign In" onClick={() => signIn("google")} />
      </div>
    </nav>
  );
};

export default Navbar;
