import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Layout from "../components/layout";
import { AnimatePresence } from "framer-motion";
import { Provider } from "react-redux";
import store from "../redux/store";
import "primeicons/primeicons.css";
import "../styles/globals.css";
import "../styles/misc.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <AnimatePresence mode="wait">
        <Provider store={store}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </AnimatePresence>
    </SessionProvider>
  );
}

export default MyApp;
