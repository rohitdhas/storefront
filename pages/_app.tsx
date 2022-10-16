import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Layout from "../components/layout";
import { AnimatePresence } from "framer-motion";
import { Provider } from "react-redux";
import store from "../redux/store";
import "primeicons/primeicons.css";
import { Session } from "next-auth";
import "../styles/globals.css";
import "../styles/misc.scss";
import React from "react";
import Router from "next/router";
import { PageLoader } from "../components/spinner";
import { PAGE_LOADER_BLACKLIST } from "../constants/index";

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const start = () => {
      if (PAGE_LOADER_BLACKLIST.includes(Router.pathname)) return;
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };

    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  return (
    <SessionProvider session={pageProps.session}>
      <AnimatePresence mode="wait">
        <Provider store={store}>
          {loading ? (
            <PageLoader />
          ) : (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
        </Provider>
      </AnimatePresence>
    </SessionProvider>
  );
}

export default MyApp;
