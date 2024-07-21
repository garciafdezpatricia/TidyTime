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

import { useSessionContext } from "@/src/components/Context/SolidContext";
import { useState, useEffect } from "react";
import { useInruptHandler } from "./api/inrupt";
import Inrupt from "@/src/components/Login/InruptLogin";
import StatisticsPanel from "@/src/components/Panel/StatisticsPanel/StatisticsPanel";
import Loader from "@/src/components/Loading/Loading";
import LogoutInrupt from "@/src/components/Login/LogoutInruptBtn";
import { useTranslation } from 'react-i18next';

export default function MainPage() {
  const { t } = useTranslation();
  const { getSession, getProfile, getAllConfiguration, getApplicationData } = useInruptHandler();
  const { solidSession, userName } = useSessionContext();

  const [reRender, setRerender] = useState(Math.random());
  const [loading, setLoading] = useState(true);

  const getSessionWrapper = async () => {
    await getSession();
  }

  useEffect(() => {
    getSessionWrapper();
  }, [reRender]);

  const fetchData = async () => {
    if (solidSession !== undefined && solidSession !== null) {
      if (solidSession.info.isLoggedIn){
        if (!userName) {
          await getProfile();
        }
        const podWasInitialized = await getAllConfiguration();
        if (!podWasInitialized) { // if the pod was initialized, there are no lists/events to fetch
          await getApplicationData();
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    } else if (solidSession === null) {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [solidSession])

  return (
    loading ?
    <Loader /> :
    solidSession?.info.isLoggedIn 
    ?
    <section data-testid='index-container' className='index-container'>
      <h2 data-testid="welcome-back" className="welcome">{userName && userName !== 'No user name' ? `${t('home.welcome')}, ${userName}!` : `${t('home.welcome')}!` }</h2>
      <article className="inrupt-info">
          <p>{t('home.loggedIn')} {solidSession.info.webId}</p>
          <LogoutInrupt />
      </article>
      <StatisticsPanel />
    </section>
    :
    <Inrupt />
  )
}