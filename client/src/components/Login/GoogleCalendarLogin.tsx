import { useEffect } from "react";
import { Icon } from "../Icon/Icon";
import { useGoogleContext } from "../Context/GoogleContext";
import { useGoogleHandler } from "@/src/model/google";

export default function LoginGoogleCalendar() {
    const {loggedIn, authUrl} = useGoogleContext();
    const { handleLogin, handleLogout} = useGoogleHandler();

    useEffect(() => {
        handleLogin();
    });

    const onLogout = () => {
        handleLogout();
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