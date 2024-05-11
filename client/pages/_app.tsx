import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import SideMenu from "../src/components/Layout/Layout";
import { MenuSideBar } from "../src/components/Menu/Menu";
import { TaskProvider } from "../src/components/Context/TaskContext";
import { EventProvider } from "@/src/components/Context/EventContext";
import { Toaster } from "react-hot-toast";
import { GoogleProvider } from "@/src/components/Context/GoogleContext";
import { GithubProvider } from "@/src/components/Context/GithubContext";
import { SessionProvider } from "@/src/components/Context/SolidContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loader from "@/src/components/Loading/Loading";

export default function MyApp({ Component, pageProps }: AppProps) {

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => { setLoading(true); };
    const handleComplete = () => { setLoading(false); };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <SessionProvider>
      <TaskProvider>
        <EventProvider>
          <GoogleProvider>
            <GithubProvider>

                <SideMenu>
                  <MenuSideBar />
                  {loading ?
                    <Loader />
                    :
                    <Component {...pageProps} />
                  }
                </SideMenu>
              <Toaster />
              
            </GithubProvider>
          </GoogleProvider>
        </EventProvider>
      </TaskProvider>
    </SessionProvider>
  );
}
