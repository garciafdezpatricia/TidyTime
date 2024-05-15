import { useSessionContext } from "@/src/components/Context/SolidContext";
import { useState, useEffect } from "react";
import { useInruptHandler } from "./api/inrupt";
import Inrupt from "@/src/components/Login/InruptLogin";
import StatisticsPanel from "@/src/components/Panel/StatisticsPanel/StatisticsPanel";
import Loader from "@/src/components/Loading/Loading";
import LogoutInrupt from "@/src/components/Login/LogoutInruptBtn";

export default function MainPage() {

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
          getProfile();
        }
        const podWasInitialized = await getAllConfiguration();
        if (!podWasInitialized) { // if the pod was initialized, there are no lists/events to fetch
          // fetch lists
          // TODO: fetch events
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
    <section className='index-container'>
      <h2 className="welcome">{userName && userName !== 'No user name' ? `Welcome back, ${userName}!` : 'Welcome back!' }</h2>
      <article className="inrupt-info">
          <p>Currenlty logged in as {solidSession.info.webId}</p>
          <LogoutInrupt />
      </article>
      <StatisticsPanel />
    </section>
    :
    <Inrupt />
  )
}