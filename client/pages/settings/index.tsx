import CalendarPanel from "@/src/components/Panel/CalendarPreferences/CalendarPanel";
import ApplicationPanel from "../../src/components/Panel/ApplicationPreferences/ApplicationPanel";
import { useEffect, useState } from "react";
import { useGoogleHandler } from "@/pages/api/google";
import { useGithubHandler } from "../api/github";
import toast from "react-hot-toast";
import { useGithubContext } from "@/src/components/Context/GithubContext";
import BoardPanel from "@/src/components/Panel/BoardPreferences/BoardPanel";
import ListPanel from "@/src/components/Panel/ListPreferences/ListPanel";
import { useRouter } from "next/router";
import { useSessionContext } from "@/src/components/Context/SolidContext";
import { useInruptHandler } from "../api/inrupt";
import Loader from "@/src/components/Loading/Loading";
import { useTaskContext } from "@/src/components/Context/TaskContext";
import { useEventContext } from "@/src/components/Context/EventContext";

export default function Settings() {

    const { checkAuthentication } = useGoogleHandler();
    const { getUserData } = useGithubHandler();
    const { githubLoggedIn, userData } = useGithubContext();
    const { solidSession } = useSessionContext();
    const { getSession, getAllConfiguration, saveConfiguration } = useInruptHandler();

    const router = useRouter();
    const [reRender, setRerender] = useState(Math.random());
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        getSession();
    }, [reRender]); 

    const fetchData = async () => {
        if (solidSession === undefined) {
            setLoading(true);
        } else {
            if (solidSession?.info.isLoggedIn) {
                // INRUPT CONFIG
                await getAllConfiguration();
                // ---> GOOGLE LOGIN
                const params = new URLSearchParams(location.search);
                const emailParam = params.get('user');
                const isUserLoggedIn = localStorage.getItem('googleLoggedIn');    
                checkAuthentication(emailParam, isUserLoggedIn);
                // ---> GITHUB LOGIN
                try {
                    if (!userData) {
                        await getUserData();
                    }
                } catch (error:any) {
                    if (error.message === "Failed to fetch") {
                        toast.error("Error when connecting to the server");
                    } else {
                        if (error.message.includes('access not found') && githubLoggedIn) {
                            toast.error("Please reconnect to GitHub");
                        }
                    }
                }
            } else {
                router.push("/");
            }
            setLoading(false);
        }
    };

	useEffect(() => {	
		if (solidSession !== undefined && solidSession?.info.isLoggedIn) {
			fetchData();
		} else if (solidSession === null) {
            router.push("/");
        }
	}, [solidSession])

    const savePreferences = async () => {
        saveConfiguration();
    }

    return (
        loading ?
        <Loader />
        :
        solidSession?.info.isLoggedIn &&
        <div className="settings-container">
            <button className="save-preferences-button" onClick={savePreferences}>Save preferences</button>
            <ListPanel />
            <BoardPanel />
            <CalendarPanel />
            <ApplicationPanel />
        </div>
    )
}