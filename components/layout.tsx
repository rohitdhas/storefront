import React from "react";
import Navbar from "./navbar";
import { useRouter } from "next/router";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  if (router.pathname === "/admin") {
    return <main>{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="mt-28">{children}</main>
    </>
  );
}
