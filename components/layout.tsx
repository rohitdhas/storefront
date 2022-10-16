import React from "react";
import Navbar from "./navbar";
import { useRouter } from "next/router";
import { CollapsedSidebar, AdminPanalSidebar } from "./sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  if (router.pathname.includes("/admin")) {
    return (
      <>
        <AdminPanalSidebar />
        <CollapsedSidebar />
        <main className="pl-[140px] pt-2">{children}</main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mt-28">{children}</main>
    </>
  );
}
