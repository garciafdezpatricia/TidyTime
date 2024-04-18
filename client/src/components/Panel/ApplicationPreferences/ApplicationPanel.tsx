import { useState } from "react";
import Toggle from "../../ToggleSwitch/ToggleSwitch";
import { Icon } from "../../Icon/Icon";
import { useGoogleContext } from "../../Context/GoogleContext";
import { useGoogleHandler } from "@/pages/api/google";
import { useGithubContext } from "../../Context/GithubContext";
import { useGithubHandler } from "@/pages/api/github";


export default function ApplicationPanel() {

    const { loggedIn, authUrl } = useGoogleContext();
    const { githubLoggedIn } = useGithubContext();
    const { handleLogout } = useGoogleHandler();
    const { logoutGithub } = useGithubHandler();
    
    const googleSwitch = (value:boolean) => {
        if (value) {
            window.location.href = authUrl;
        } else {
            handleLogout();
        }
    }

    const githubSwitch = async (value:boolean) => {
        if (value) {

        } else {
            await logoutGithub();
        }
    }

    return (
        <article className="applications-panel">
            <h3>Connect to applications</h3>
            <hr></hr>
            <div className="panel-content">
                <Application 
                    appImg={"./google.svg"} 
                    appAlt={"Google icon"} 
                    appName={"Google Calendar"} 
                    appDesc={"Connect to Google to manage your events, calendars and tasks."}
                    checked={loggedIn}
                    onChange={googleSwitch}
                />
                <Application 
                    appImg={"./github.svg"} 
                    appAlt={"GitHub icon"} 
                    appName={"GitHub"} 
                    appDesc={"Connect to GitHub to manage your issues."}
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