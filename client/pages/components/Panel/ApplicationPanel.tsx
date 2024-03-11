import { useState } from "react";
import Toggle from "../ToggleSwitch/ToggleSwitch";
import { Icon } from "../Icon/Icon";


export default function ApplicationPanel() {

    const [change, setChange] = useState(false);


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
                />
                <Application 
                    appImg={"./github.svg"} 
                    appAlt={"GitHub icon"} 
                    appName={"GitHub"} 
                    appDesc={"Connect to GitHub to manage your issues."}
                />
            </div>
        </article>
    )
}

function Application({appImg, appAlt, appName, appDesc}:
    {
        appImg:string, 
        appAlt:string,
        appName:string,
        appDesc:string,
    }) {
    return (
        <section className="content-box">
            <section className="content-header">
                <div className="header-app">
                    <Icon className="app-icon" src={appImg} alt={appAlt} />
                    <h4>{appName}</h4>
                </div>
                <Toggle isChecked={false} onChange={() => {}}/>
            </section>
            <section className="content-body">
                <p>{appDesc}</p>
            </section>
        </section>
    )
}