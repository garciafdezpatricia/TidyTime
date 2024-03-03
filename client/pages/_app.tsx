import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import SideMenu from "./components/Layout/Layout";
import { MenuSideBar } from "./components/Menu/Menu";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect } from "react";

export default function MyApp({ Component, pageProps }: AppProps) {

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID as string} >  
      <SideMenu>
        <MenuSideBar />
        <Component {...pageProps} />
      </SideMenu>
    </GoogleOAuthProvider>
  );
}
