// Copyright 2024 Patricia García Fernández.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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

    const onLogout = async () => {
        await handleLogout();
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
            <button className="google-logout-button" onClick={onLogout}>
                <Icon src={"./google.svg"} alt={"Log out of Google"} />
                {t('home.logoutButton')}
            </button>
        }
        </>
    )
}