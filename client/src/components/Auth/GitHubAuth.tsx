import { useEffect, useState } from "react";
import { Button } from "../Button/Button";
import { Icon } from "../Icon/Icon";

export default function GitHub() {

    const [authorized, setAuthorized] = useState(false);
    const [userData, setUserData] = useState({login: ""})

    useEffect(() => {
        // get the url when the page is redirected from the authentication in GH
        const querycallback = new URLSearchParams(window.location.search);
        // get the code query param
        const codeParam = querycallback.get("code");
        // function definition 
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
    }, []);

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


    return (
        <Button 
            className="auth-button"
            onClick={loginWithGithub}>
                <Icon className="btn-icon" src="./github.svg" alt="" />
            Connect with Github
        </Button>
    )
    
}