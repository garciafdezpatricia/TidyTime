import {useGoogleLogin} from "@react-oauth/google";
import { useEffect, useState } from "react";
import { Icon } from "../Icon/Icon";

export default function LoginGoogleCalendar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginMessage, setLoginMessage] = useState("");

    const handleLoginSuccess = (response:any) => {
        setIsLoggedIn(response.success) 
        setLoginMessage(response.message);
    }

    const googleLogin = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            fetch('http://localhost:8080/api/auth/google', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: tokenResponse.code }),
                credentials: 'include',
              })
              .then(response => response.json())
              .then(data => {
                handleLoginSuccess(data);
              })
              .catch(error => {
                console.error('Error:', error);
              });
        },
        onError: () => {
            console.log("Error login");
        },
        flow: 'auth-code',
        scope: 'https://www.googleapis.com/auth/calendar openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    })

    return (
        <>
            { !isLoggedIn && 
                <button 
                    className="google-login-button"
                    onClick={() => googleLogin()}>
                <Icon src={"./google.svg"} alt={"Connect to Google"} />
                Connect to Google
                </button>
            }
            { loginMessage!== "" && <p>{loginMessage}</p>}
        </>
    )
}