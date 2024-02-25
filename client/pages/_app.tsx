import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import SideMenu from "./components/Layout/Layout";
import { MenuSideBar } from "./components/Menu/Menu";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import LoginGoogleCalendar from "./components/Login/GoogleCalendarLogin";

export default function MyApp({ Component, pageProps }: AppProps) {

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID ? process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID : ""} >  
      <SideMenu>
        <MenuSideBar />
        <Component {...pageProps} />
      </SideMenu>
    </GoogleOAuthProvider>
  );
}
