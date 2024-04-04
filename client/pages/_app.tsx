import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import SideMenu from "../src/components/Layout/Layout";
import { MenuSideBar } from "../src/components/Menu/Menu";
import { TaskProvider } from "../src/components/Context/TaskContext";
import { EventProvider } from "@/src/components/Context/EventContext";
import { Toaster } from "react-hot-toast";
import { GoogleProvider } from "@/src/components/Context/GoogleContext";

export default function MyApp({ Component, pageProps }: AppProps) {

  return (
      <TaskProvider>
        <EventProvider>
          <GoogleProvider>
          <SideMenu>
            <MenuSideBar />
            <Component {...pageProps} />
          </SideMenu>
          <Toaster />
          </GoogleProvider>
        </EventProvider>
      </TaskProvider>
  );
}
