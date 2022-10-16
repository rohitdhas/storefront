import React from "react";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";

export async function getServerSideProps(context: any) {
  const session: any = await getSession(context);

  if (!session || session.user.type !== "admin") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

const AdminPanal: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push({ pathname: "/admin/products" });
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto">
      <Head>
        <title>StoreFront Admin Panal</title>
        <meta
          name="description"
          content="Explore the greatest product deals on the internet"
        />
        <link rel="shortcut icon" href="logo.svg" type="image/x-icon" />
      </Head>
      <main></main>
    </div>
  );
};

export default AdminPanal;
