import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Layout from "../components/layout";
import { AnimatePresence } from "framer-motion";
import "primeicons/primeicons.css";
import "../styles/globals.css";
import "../styles/misc.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <AnimatePresence exitBeforeEnter>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AnimatePresence>
    </SessionProvider>
  );
}

export default MyApp;
