// Copyright 2024 Patricia García Fernández.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
import '../i18n';
import { ErrorBoundary } from "react-error-boundary";
import Fallback from "@/src/components/Error/Error";
import Head from "next/head";

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
    <ErrorBoundary FallbackComponent={Fallback} onReset={() => (location.href = '/')}>
      <SessionProvider>
        <TaskProvider>
          <EventProvider>
            <GoogleProvider>
              <GithubProvider>

                  <SideMenu>
                    <Head>
                      <title>TidyTime</title>
                    </Head>
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
    </ErrorBoundary>
  );
}
