import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import SideMenu from "./components/Layout/Layout";
import { MenuSideBar } from "./components/Menu/Menu";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>  
      <SideMenu>
        <MenuSideBar />
        <Component {...pageProps} />
      </SideMenu>
    </>
  );
}
