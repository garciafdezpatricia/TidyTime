import React, { useEffect, useState } from 'react'
import { login, handleIncomingRedirect, getDefaultSession, Session, fetch } from '@inrupt/solid-client-authn-browser';
import {getSolidDataset, getPodUrlAll, getThingAll, createThing, createSolidDataset, removeThing, saveSolidDatasetAt, setThing, addUrl, addStringNoLocale, getStringNoLocale}  from '@inrupt/solid-client';
import { SCHEMA_INRUPT, RDF, AS } from "@inrupt/vocab-common-rdf"

export default function Prueba() {

  const [userData, setUserData] = useState({login: ""})
  const [authorized, setAuthorized] = useState(false);
  const [issues, setIssues] = useState("") 
  const [pod, setPod] = useState("")
  const [session, setSession] = useState<Session>()
  

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

  async function loginInrupt() {
    // await fetch("http://localhost:8080/loginInrupt", {
    //   method: "GET"
    // }).then((response) => {
    //   console.log(response);
    //   return response.text();
    // }).then((data) => {
    //   setInrupt(data);
    // })

    await login({
      oidcIssuer: "https://login.inrupt.com",
      redirectUrl: window.location.href,
      clientName: "TidyTimeDev"
    })
  }

  handleIncomingRedirect().then((info) => {
    if (info?.isLoggedIn && info.webId){
      setSession(getDefaultSession())
    }
  })

  async function doSomething(){
    const pods = await getPodUrlAll(session?.info.webId as string, { fetch: fetch});

    const readingListUrl = `${pods[0]}getting-started/readingList/myList`;

    let titles = ["t1", "t2", "t3", "t4"];

    // Fetch or create a new reading list.
    let myReadingList:any;

    try {
      // Attempt to retrieve the reading list in case it already exists.
      myReadingList = await getSolidDataset(readingListUrl, { fetch: fetch });
      // Clear the list to override the whole list
      let items = getThingAll(myReadingList);
      items.forEach((item) => {
        myReadingList = removeThing(myReadingList, item);
      });
    } catch (error:any) {
      if (typeof error.statusCode === "number" && error.statusCode === 404) {
        // if not found, create a new SolidDataset (i.e., the reading list)
        myReadingList = createSolidDataset();
      } else {
        console.error(error.message);
      }
    }

    // Add titles to the Dataset
    let i = 0;
    titles.forEach((title) => {
      if (title.trim() !== "") {
        let item = createThing({ name: "title" + i });
        item = addUrl(item, RDF.type, AS.Article);
        item = addStringNoLocale(item, SCHEMA_INRUPT.name, title);
        myReadingList = setThing(myReadingList, item);
        i++;
      }
    });

    try {
      // Save the SolidDataset
      let savedReadingList = await saveSolidDatasetAt(
        readingListUrl,
        myReadingList,
        { fetch: fetch }
      );

      // Refetch the Reading List
      savedReadingList = await getSolidDataset(readingListUrl, { fetch: fetch });

      let items = getThingAll(savedReadingList);

      let listcontent = "";
      for (let i = 0; i < items.length; i++) {
        let item = getStringNoLocale(items[i], SCHEMA_INRUPT.name);
        if (item !== null) {
          listcontent += item + "\n";
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
  <section>
    <button onClick={loginInrupt}>LOGIN INRUPT</button>
    <div>{session?.info.webId}</div>
    <button onClick={doSomething}>DO SOMETHING</button>
    <div>{pod}</div>
    {/* {
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
    } */}
  </section>
  )
}