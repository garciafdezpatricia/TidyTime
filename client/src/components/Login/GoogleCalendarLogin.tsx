import { useEffect, useState } from "react";
import { Icon } from "../Icon/Icon";
import { useGoogleContext } from "../Context/GoogleContext";
import { useGoogleHandler } from "@/pages/api/google";
import { useTranslation } from "react-i18next";

export default function LoginGoogleCalendar() {
    const { t } = useTranslation();
    const {loggedIn, authUrl} = useGoogleContext();
    const { handleLogin, handleLogout} = useGoogleHandler();

    const [logginInGoogle, setLogginInGoogle] = useState(false);

    useEffect(() => {
        if (authUrl !== "" && !loggedIn && logginInGoogle) {
            window.location.assign(authUrl);
        }
    }, [authUrl, loggedIn]);

    const onLogout = () => {
        handleLogout();
    }

    const onConnect = () => {
        // there's no need to set it to false afterwards since the app is going to be redirected
        // to another page which will redirect the application to this page (and loggingin will be false)
        setLogginInGoogle(true);
        handleLogin();
    }

    return (
        <> 
        { 
            !loggedIn
            ?
            <button className="google-login-button" onClick={onConnect}>
                <Icon src={"./google.svg"} alt={"Connect to Google"} />
                {t('calendar.connectGoogle')}
            </button>
            :
            <button className="google-logout-button" onClick={() => onLogout()}>
                <Icon src={"./google.svg"} alt={"Log out of Google"} />
                {t('home.logoutButton')}
            </button>
        }
        </>
    )
}