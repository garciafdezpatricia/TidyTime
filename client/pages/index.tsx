import { useSessionContext } from "@/src/components/Context/SolidContext";
import { Icon } from "@/src/components/Icon/Icon";
import { useState, useEffect } from "react";
import { useInruptHandler } from "./api/inrupt";
import Inrupt from "@/src/components/Login/InruptLogin";

export default function MainPage() {

  const { getSession, logoutInrupt } = useInruptHandler();
  const { solidSession } = useSessionContext();
  const [reRender, setRerender] = useState(Math.random());

  useEffect(() => {
      getSession();
  }, [reRender])

  return (
    solidSession?.info.isLoggedIn 
    ?
    <section className='index-container'>
      <article className="inrupt-info">
          <p>Welcome back {solidSession.info.webId} !</p>
          <button className="logout-inrupt-button" onClick={logoutInrupt}>
              <Icon src={"./solid.svg"} alt={"Inrupt logo"} />
              Logout of Solid
          </button>
      </article>
    </section>
    :
    <Inrupt />
  )
}