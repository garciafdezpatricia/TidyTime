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

export default function Settings() {

    const { checkAuthentication } = useGoogleHandler();
    const { getUserData } = useGithubHandler();
    const { githubLoggedIn } = useGithubContext();
    const { solidSession } = useSessionContext();
    const { getSession } = useInruptHandler();
    const router = useRouter();
    const [reRender, setRerender] = useState(Math.random());
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        getSession();
  }, [reRender]); 

  useEffect(() => {
    if (solidSession === undefined) {
        setLoading(true);
    } else {
        if (solidSession?.info.isLoggedIn) {
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
        } else {
            router.push("/");
        }
        setLoading(false);
    }
  }, [solidSession])

    return (
        loading ?
        <Loader />
        :
        solidSession?.info.isLoggedIn &&
        <div className="settings-container">
            <ListPanel />
            <BoardPanel />
            <CalendarPanel />
            <ApplicationPanel />
        </div>
    )
}