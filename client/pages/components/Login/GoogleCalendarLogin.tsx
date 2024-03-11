import {useGoogleLogin} from "@react-oauth/google";
import { useEffect, useState } from "react";

interface interfaceToken {
    access_token: string,
    expires_in: number,
    id_token: string,
    refresh_token: string,
    scope: string,
    token_type: string,
}

export default function LoginGoogleCalendar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [tokenslocal, setTokensLocal] = useState<interfaceToken>()

    useEffect(() => {
        if (localStorage.getItem("GTokens")){
            setTokensLocal(JSON.parse(localStorage.getItem("GTokens") as string))
        }   
    }, [isLoggedIn])

    const handleLoginSuccess = (tokens:any) => {
        //TODO: securely save them
        localStorage.setItem("GTokens", JSON.stringify(tokens));
        setIsLoggedIn(true);
    }

    const googleLogin = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            fetch('http://localhost:8080/api/auth/google', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: tokenResponse.code }),
              })
              .then(response => response.json())
              .then(data => {
                console.log('Backend response:', data);
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
                    onClick={() => googleLogin()}
                >Sign in with Google
                </button>
            }
        </>
    )
}

    // function getCalendar() {
    //     if (tokenslocal) {
    //         fetch('http://localhost:8080/google/calendar', {
    //             method: 'GET',
    //             headers: {
    //                 'Authorization': 'Bearer ' + tokenslocal.access_token
    //             }
    //         })
    //         .then(response => response.json())
    //         .then(data => console.log(data))
    //     }
    // } 