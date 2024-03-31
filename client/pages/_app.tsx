import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import SideMenu from "../src/components/Layout/Layout";
import { MenuSideBar } from "../src/components/Menu/Menu";
import { TaskProvider } from "../src/components/Context/TaskContext";
import { EventProvider } from "@/src/components/Context/EventContext";

export default function MyApp({ Component, pageProps }: AppProps) {

  return (
      <TaskProvider>
        <EventProvider>
          <SideMenu>
            <MenuSideBar />
            <Component {...pageProps} />
          </SideMenu>
        </EventProvider>
      </TaskProvider>
  );
}
