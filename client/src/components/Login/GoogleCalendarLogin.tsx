import { useEffect, useState } from "react";
import { Icon } from "../Icon/Icon";
import { useGoogleContext } from "../Context/GoogleContext";
import toast from "react-hot-toast";

export default function LoginGoogleCalendar() {
    const { loggedIn, setLoggedIn, setSelectedCalendarId, setCalendars } = useGoogleContext();
    
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
    });

    const onLogout = () => {
        fetch('http://localhost:8080/google/auth/logout')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success'){
                localStorage.removeItem("userLoggedIn");
                // remove email param if it is in the url
                if (window.location.search.includes('email')) {
                    const newUrl = window.location.origin + window.location.pathname;
                    window.history.replaceState({}, document.title, newUrl);
                }
                setCalendars([]);
                setSelectedCalendarId("");
                toast.success("Logged out!", {
                    position: "top-center"
                })
                setLoggedIn(false);
            } else {
                toast.error("Failed to log out!", {
                    position: "top-center"
                })
            }
        }).catch(error => {
            console.error('Error when logging out');
        });
    }

    return (
        <> 
        { 
            !loggedIn
            ?
            <button className="google-login-button">
                <a href={authUrl}>
                    <Icon src={"./google.svg"} alt={"Connect to Google"} />
                    Connect to Google
                </a>
            </button>
            :
            <button className="google-logout-button" onClick={() => onLogout()}>
                <Icon src={"./google.svg"} alt={"Log out of Google"} />
                Logout
            </button>
        }
        </>
    )
}