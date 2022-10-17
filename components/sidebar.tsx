import React from "react";
import { Sidebar } from "primereact/sidebar";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { getGreetingMessage } from "../utils/main.utils";
import { DropdownBtn } from "./navbar";
import { Button } from "primereact/button";
import { useSelector, useDispatch } from "react-redux";
import { setSidebarVisibility } from "../redux/userSlice";
import type { RootState } from "../redux/store";
import { useRouter } from "next/router";

const AdminPanalSidebar: React.FC = () => {
  const { data: session }: any = useSession();
  const { sidebarVisible }: any = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const routeTo = React.useCallback((pathname: string) => {
    dispatch(setSidebarVisibility({ visibility: false }));
    router.push({ pathname });
  }, []);

  return (
    <Sidebar
      showCloseIcon={false}
      visible={sidebarVisible}
      onHide={() => dispatch(setSidebarVisibility({ visibility: false }))}
      position="left"
      className="!bg-slate-800"
    >
      <div className="flex justify-evenly align items-center">
        <Image src={"/logo.svg"} height={60} width={60} alt="logo" />
        <h3 className="text-white">
          <span className="text-slate-200">Good, {getGreetingMessage()}</span>{" "}
          <br />
          <span className="font-semibold text-xl">
            {session?.user?.name} 👋
          </span>
        </h3>
      </div>
      <div className="border-b border-b-slate-600 py-2" />
      <main>
        <div className="border-b border-b-slate-600 py-2">
          <DropdownBtn
            icon="pi pi-th-large"
            label="Dashboard"
            hoverBg="bg-primary"
            callback={() => {}}
          />
        </div>
        <div className="border-b border-b-slate-600 py-2">
          <DropdownBtn
            icon="pi pi-box"
            label="Products"
            hoverBg="bg-primary"
            callback={() => routeTo("/admin/products")}
          />
        </div>
        <div className="border-b border-b-slate-600 py-2">
          <DropdownBtn
            icon="pi pi-shopping-bag"
            label="Orders"
            hoverBg="bg-primary"
            callback={() => {}}
          />
        </div>
        <div className="border-b border-b-slate-600 py-2">
          <DropdownBtn
            icon="pi pi-user"
            label="Users"
            hoverBg="bg-primary"
            callback={() => {}}
          />
        </div>
        <div className="border-b border-b-slate-600 py-2">
          <DropdownBtn
            icon="pi pi-sign-out"
            label="Sign Out"
            hoverBg="bg-error"
            callback={signOut}
          />
        </div>
      </main>
    </Sidebar>
  );
};

const CollapsedSidebar: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <div className="!bg-slate-800 w-[100px] p-4 fixed top-0 left-0 bottom-0 flex justify-center">
      <Button
        onClick={() => dispatch(setSidebarVisibility({ visibility: true }))}
        icon="pi pi-bars"
        className="!w-[100%] h-min"
      />
    </div>
  );
};

export { AdminPanalSidebar, CollapsedSidebar };
