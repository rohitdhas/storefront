import { useSession, signOut, signIn } from "next-auth/react";
import { Button } from "primereact/button";
import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  return (
    <div>
      <Head>
        <title>StoreFront</title>
        <meta
          name="description"
          content="Explore the greatest product deals on the internet"
        />
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
      </Head>
      <main>
        {/* {status === "authenticated" ? (
          <h1 className="text-xl text-center text-blue-700">
            Hello {session.user?.name}!
            <Button label="Sign Out" onClick={() => signOut()} />
          </h1>
        ) : (
          <Button label="Sign In" onClick={() => signIn("google")} />
        )} */}
      </main>
    </div>
  );
};

export default Home;
