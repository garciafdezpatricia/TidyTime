import CalendarPanel from "@/src/components/Panel/CalendarPreferences/CalendarPanel";
import ApplicationPanel from "../../src/components/Panel/ApplicationPreferences/ApplicationPanel";
import { useEffect, useState } from "react";
import { useGoogleHandler } from "@/pages/api/google";
import { useGithubHandler } from "../api/github";
import toast from "react-hot-toast";
import { useGithubContext } from "@/src/components/Context/GithubContext";
import BoardPanel from "@/src/components/Panel/BoardPreferences/BoardPanel";

// go to this page as /settings
export default function Settings() {

    const { checkAuthentication } = useGoogleHandler();
    const { getUserData } = useGithubHandler();
    const { githubLoggedIn } = useGithubContext();

    const [reRender, setRerender] = useState(Math.random());
    
    useEffect(() => {
        // ---> GOOGLE LOGIN
        const params = new URLSearchParams(location.search);
        const emailParam = params.get('user');
        const isUserLoggedIn = localStorage.getItem('googleLoggedIn');    
        checkAuthentication(emailParam, isUserLoggedIn);
        // ---> GITHUB LOGIN
        try {
			getUserData();
		} catch (error:any) {
			if (error.message === "Failed to fetch") {
				toast.error("Error when connecting to the server");
			} else {
				if (error.message.includes('access not found') && githubLoggedIn) {
					toast.error("Please reconnect to GitHub");
				}
			}
		}
  }, [reRender]); // this will be executed on every renderization of the page (new tab and refresh page included)

    return (
    <div className="settings-container">
        <BoardPanel />
        <CalendarPanel />
        <ApplicationPanel />
    </div>)
}