import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import "primeicons/primeicons.css";
import "../styles/globals.css";
import "../styles/mics.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
