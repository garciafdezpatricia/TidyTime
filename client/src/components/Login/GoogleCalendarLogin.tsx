import { useEffect, useState } from "react";
import { Icon } from "../Icon/Icon";

export default function LoginGoogleCalendar() {
    const [authUrl, setAuthUrl] = useState("");

    useEffect(() => {
        fetch('http://localhost:8080/google/auth/url')
        .then(response => response.json())
        .then(data => {
            setAuthUrl(data.authorizationUrl);
        })
        .catch(error => {
            console.error('Error al obtener la URL de autorización', error);
        })
    })

    return (
        <>
            <button className="google-login-button">
                <a href={authUrl}>
                    <Icon src={"./google.svg"} alt={"Connect to Google"} />
                    Connect to Google
                </a>
            </button>
        </>
    )
}