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

import Toggle from "../../ToggleSwitch/ToggleSwitch";
import { Icon } from "../../Icon/Icon";
import { useGoogleContext } from "../../Context/GoogleContext";
import { useGoogleHandler } from "@/pages/api/google";
import { useGithubContext } from "../../Context/GithubContext";
import { useGithubHandler } from "@/pages/api/github";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';


export default function ApplicationPanel() {
    const { t } = useTranslation();
    const { loggedIn, authUrl } = useGoogleContext();
    const { githubLoggedIn } = useGithubContext();
    const { handleLogout, handleLogin } = useGoogleHandler();
    const { logoutGithub, loginWithGithub } = useGithubHandler();

    const [reRender, setRerender] = useState(Math.random());

    useEffect(() => {
        handleLogin();
    }, [reRender])
    
    const googleSwitch = (value:boolean) => {
        if (value) {
            console.log(authUrl);
            window.location.assign(authUrl);
        } else {
            handleLogout();
        }
    }

    const githubSwitch = async (value:boolean) => {
        if (value) {
            await loginWithGithub();
        } else {
            await logoutGithub();
        }
    }

    return (
        <article className="applications-panel">
            <h3>{t('preferences.applications.title')}</h3>
            <hr></hr>
            <p>{t('preferences.applications.desc')}</p>
            <div className="panel-content">
                <Application 
                    appImg={"./google.svg"} 
                    appAlt={"Google icon"} 
                    appName={"Google Calendar"} 
                    appDesc={t('preferences.applications.google')}
                    checked={loggedIn}
                    onChange={googleSwitch}
                />
                <Application 
                    appImg={"./github.svg"} 
                    appAlt={"GitHub icon"} 
                    appName={"GitHub"} 
                    appDesc={t('preferences.applications.github')}
                    checked={githubLoggedIn}
                    onChange={githubSwitch}
                />
            </div>
        </article>
    )
}

function Application({appImg, appAlt, appName, appDesc, checked, onChange}:
    {
        appImg:string, 
        appAlt:string,
        appName:string,
        appDesc:string,
        checked?: boolean,
        onChange: (arg?:any) => void | any;
    }) {
    return (
        <section className="content-box">
            <section className="content-header">
                <div className="header-app">
                    <Icon className="app-icon" src={appImg} alt={appAlt} />
                    <h4>{appName}</h4>
                </div>
                <Toggle isChecked={checked ?? false} onChange={(value) => onChange(value)}/>
            </section>
            <section className="content-body">
                <p>{appDesc}</p>
            </section>
        </section>
    )
}