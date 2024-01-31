import React, { useEffect, useState } from 'react'

export default function Prueba() {

  const [rerender, setRerender] = useState(false);
  const [userData, setUserData] = useState({})
  const CLIENT_ID = "720509f4c43ea363e705";

  useEffect(() => {
    const querycallback = new URLSearchParams(window.location.search);
    const codeParam = querycallback.get("code");

    async function getAccessToken() {
      await fetch("http://localhost:8080/getAccessToken?code=" + codeParam, {
        method: "GET"
      }).then((response) => {
        return response.json();
      }).then((data) => {
        if (data.access_token) {
          localStorage.setItem("accessToken", data.access_token)
          setRerender(!rerender); // to make react rerender
        }
      });
    }
    
    // if we have the param and dont have an access token, grab it
    if (codeParam && (localStorage.getItem("accessToken") === null)) {
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

  function loginWithGithub() {
    window.location.assign("https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID);
  }

  return (
  <section>
    {
      localStorage.getItem("accessToken") ? 
      <>
        <h1>We have the access token</h1>
        <button onClick={() => {localStorage.removeItem("accessToken"); setRerender(!rerender); }}>
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
      </>
      : 
      <>
      <button onClick={loginWithGithub}>Login with Github</button>
      </>
    }
  </section>
  )
}