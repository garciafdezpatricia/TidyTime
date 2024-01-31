import React, { useEffect, useState } from 'react'

export default function Index() {

  const [msg, setMsg] = useState("Loading...");
  const [people, setPeople] = useState([]);

  useEffect(() => {
    // let our frontend know that we´re going to be fetching data from this url in the backend
    fetch("http://localhost:8080/api/home").then(
      response => response.json()
    ).then(
      data => {
        // set the value of our msg variable to the message of the backend
        setMsg(data.message)
        setPeople(data.people)
      }
    )
  }, [])
  return (
    <div>
      {msg}
      {
        people.map((person, index) => (
          <div key={index}>{person}</div>
        ))
      }

    </div>
  )
}

// import { useEffect, useState } from "react"
// import { Octokit} from "octokit"

// export default function Prueba() {

//   // consider to take the state (oauth) into account

//   const [code, setCode] = useState("");
  
//   useEffect(() => {
//     const querycallback = new URLSearchParams(window.location.search);
//     const codeParam = querycallback.get("code");
//     console.log(codeParam)
//     if (codeParam) {
//       setCode(codeParam);
//       accesstoken();
//       listissues();
//     }
//   }, [])

//   function accesstoken() {
//     fetch('https://github.com/login/oauth/access_token', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       },
//       body: JSON.stringify({
//         client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
//         client_secret: process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
//         code: code
//       })
//     }).then(response => response.json())
//     .then(data => {
//       localStorage.setItem("accessToken", data.access_token);
//     })
//   }

//   async function listissues() {
//     const octokit = new Octokit({ auth: localStorage.getItem("accessToken")});
//     await octokit.request('GET /issues').then((response) => console.log(response))
//   }

//   function loginWithGithub() {
//     window.location.assign("https://github.com/login/oauth/authorize?client_id=" + process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID);
//   }

//   return (
//   <section>
//     <h1>Esto es una prueba para conseguir autenticarse en GH</h1>
//     <button onClick={loginWithGithub}>Login with Github</button>
//   </section>
//   )
// }