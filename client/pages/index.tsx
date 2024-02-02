import React, { useEffect, useState } from 'react'

export default function Prueba() {

  const [userData, setUserData] = useState({login: ""})
  const [authorized, setAuthorized] = useState(false);
  const [issues, setIssues] = useState("")

  useEffect(() => {
    // get the url when the page is redirected from the authentication in GH
    const querycallback = new URLSearchParams(window.location.search);
    // get the code query param
    const codeParam = querycallback.get("code");

    async function getAccessToken() {
      await fetch("http://localhost:8080/getAccessToken?code=" + codeParam, {
        method: "GET"
      }).then((response) => {
        return response.json();
      }).then((data) => {
        if (data.access_token) {
          // store access token in the local storage
          localStorage.setItem("accessToken", data.access_token)
          // update values
          setAuthorized(true);
        }
      });
    }
    // if we already have the access token (the user refreshed the page or smth like that) the user is authorized
    if (localStorage.getItem("accessToken")){
      setAuthorized(true);
    }
    // if we dont have the access token but we have the code param, get the access token
    else if (codeParam && (localStorage.getItem("accessToken") === null)) {
      getAccessToken();
    }    
  }, [])

  async function getUserData() {
    await fetch("http://localhost:8080/getUserData", {
      method: "GET",
      headers: {
        "Authorization" : "Bearer " + localStorage.getItem("accessToken") // Bearer ACCESSTOKEN
      }
    }).then((response) => {
      return response.json();
    }).then((data) => {
      setUserData(data);
    })
  }

  async function loginWithGithub() {
    // GH api allows authorization requests from the browser with window.location.assign
    // change the url to the server
    window.location.assign("http://localhost:8080/authorizeGH");
  }

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

  return (
  <section>
    {
      authorized ? 
      <>
        <h1>We have the access token</h1>
        <button onClick={() => {localStorage.removeItem("accessToken"); setAuthorized(false); }}>
          Log out
        </button>
        <h2>Get user data from GH API</h2>
        <button onClick={getUserData}>Get user data</button>
        { Object.keys(userData).length !== 0 ?
        <>
          <h3>Hey there {userData.login} </h3>
        </>
        :
        <>
        </>
        }
        <button onClick={getIssues}>Get issues</button>
        {
          issues !== "" ? <>Tenemos issues!! {console.log(issues)}</> : <>No tenemos issues</>
        }
      </>
      : 
      <>
      <button onClick={loginWithGithub}>Login with Github</button>
      </>
    }
  </section>
  )
}