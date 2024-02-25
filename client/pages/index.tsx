import React, { useEffect, useState } from 'react'
import { login, handleIncomingRedirect, getDefaultSession, Session, fetch } from '@inrupt/solid-client-authn-browser';
import { getPodUrlAll } from '@inrupt/solid-client';
import GitHub from './components/Auth/GitHubAuth';
import { MenuSideBar } from './components/Menu/Menu';

export default function Prueba() {
  
  const [issues, setIssues] = useState("") 
  const [pod, setPod] = useState("")
  const [session, setSession] = useState<Session>()

  async function getIssues() {
    // todo: the username will be necessary
    await fetch("http://localhost:8080/getIssues", {
      method: "GET",
      headers: {
        "Authorization" : "Bearer " + localStorage.getItem("accessToken") // Bearer ACCESSTOKEN
      }
    }).then((response) => {
      return response.json();
    }).then((data) => {
      setIssues(data);
    })
  }

  // async function loginInrupt() {
  //   // await fetch("http://localhost:8080/loginInrupt", {
  //   //   method: "GET"
  //   // }).then((response) => {
  //   //   console.log(response);
  //   //   return response.text();
  //   // }).then((data) => {
  //   //   setInrupt(data);
  //   // })

  //   await login({
  //     oidcIssuer: "https://login.inrupt.com",
  //     redirectUrl: window.location.href,
  //     clientName: "TidyTimeDev"
  //   })
  // }

  // handleIncomingRedirect().then((info) => {
  //   if (info?.isLoggedIn && info.webId){
  //     setSession(getDefaultSession())
  //   }
  // })

  // async function doSomething(){
  //   const pods = await getPodUrlAll(session?.info.webId as string, { fetch: fetch});
  //   setPod(pods[0]);
  // }

  return (
  <section>
    {/* <button onClick={loginInrupt}>LOGIN INRUPT</button>
    <div>{session?.info.webId}</div>
    <button onClick={doSomething}>DO SOMETHING</button>
    <div>{pod}</div> */}
    {
      // authorized ? 
      // <>
      //   <h1>We have the access token</h1>
      //   <button onClick={() => {localStorage.removeItem("accessToken"); setAuthorized(false); }}>
      //     Log out
      //   </button>
      //   <h2>Get user data from GH API</h2>
      //   <button onClick={getUserData}>Get user data</button>
      //   { Object.keys(userData).length !== 0 ?
      //   <>
      //     <h3>Hey there {userData.login} </h3>
      //   </>
      //   :
      //   <>
      //   </>
      //   }
      //   <button onClick={getIssues}>Get issues</button>
      //   {
      //     issues !== "" ? <>Tenemos issues!! {console.log(issues)}</> : <>No tenemos issues</>
      //   }
      // </>
      // : 
      // <>
      // <button onClick={loginWithGithub}>Login with Github</button>
      // </>
      // <MenuSideBar>
      //</MenuSideBar>
    }
    <h1>Hi</h1>
  </section>
  )
}