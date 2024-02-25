import {CredentialResponse, useGoogleLogin} from "@react-oauth/google";
import { useEffect, useState } from "react";
import {jwtDecode} from 'jwt-decode';


export interface Props {
    onSuccess: (credentialResponse: CredentialResponse) => void,
    onError: (() => void) | undefined
}

interface tokens {
    accessToken: string,
    refreshToken: string,
    profile: string
}

export default function LoginGoogleCalendar() {

    const [user, setUserInfo] = useState<tokens>();

    function handleError() {
        console.log("Login failed");
    }

    const handleLoginSuccess = (tokens:any) => {
        setUserInfo({
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            profile: tokens.id_token
        })
    }

    useEffect(() => {
        if (user) {
            console.log(jwtDecode(user.profile))
        }
    }, [user]);

    const googleLogin = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            console.log('Google login successful', tokenResponse);
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
            handleError();
        },
        flow: 'auth-code',
        
    })

    return (
        <>
            <button 
                onClick={() => googleLogin()}
            >Sign in with Google
            </button>
            <p>{user && user.profile}</p>
        </>
    )
}