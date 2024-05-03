import { useSessionContext } from "@/src/components/Context/SolidContext";
import { Icon } from "@/src/components/Icon/Icon";
import { useState, useEffect } from "react";
import { useInruptHandler } from "./api/inrupt";
import Inrupt from "@/src/components/Login/InruptLogin";
import StatisticsPanel from "@/src/components/Panel/StatisticsPanel/StatisticsPanel";
import Loader from "@/src/components/Loading/Loading";
import LogoutInrupt from "@/src/components/Login/LogoutInruptBtn";

export default function MainPage() {

  const { getSession, logoutInrupt, getProfile } = useInruptHandler();
  const { solidSession, userName } = useSessionContext();

  const [reRender, setRerender] = useState(Math.random());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("rerender");
    getSession();
  }, [reRender]);

  useEffect(() => {
    console.log("useEffect");
    console.log(solidSession);
    if (solidSession !== undefined && solidSession !== null) {
      if (solidSession.info.isLoggedIn){
        if (!userName) {
          getProfile();
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } else if (solidSession === null) {
      setLoading(false);
    }
  }, [solidSession, userName])

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