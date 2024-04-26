import { useSessionContext } from "@/src/components/Context/SolidContext";
import { Icon } from "@/src/components/Icon/Icon";
import { useState, useEffect } from "react";
import { useInruptHandler } from "./api/inrupt";
import Inrupt from "@/src/components/Login/InruptLogin";
import StatisticsPanel from "@/src/components/Panel/StatisticsPanel/StatisticsPanel";

export default function MainPage() {

  const { getSession, logoutInrupt, getProfile } = useInruptHandler();
  const { solidSession, userName } = useSessionContext();

  const [reRender, setRerender] = useState(Math.random());

  useEffect(() => {
    getSession();
  }, [reRender]);

  useEffect(() => {
    if (solidSession?.info.isLoggedIn && !userName){
      getProfile();
    }
  }, [solidSession])

  return (
    solidSession?.info.isLoggedIn 
    ?
    <section className='index-container'>
      <h2 className="welcome">{userName && userName !== 'No user name' ? `Welcome back, ${userName}!` : 'Welcome back!' }</h2>
      <article className="inrupt-info">
          <p>Currenlty logged in as {solidSession.info.webId}</p>
          <button className="logout-inrupt-button" onClick={logoutInrupt}>
              <Icon src={"./solid.svg"} alt={"Inrupt logo"} />
              Logout of Solid
          </button>
      </article>
      <StatisticsPanel />
    </section>
    :
    <Inrupt />
  )
}