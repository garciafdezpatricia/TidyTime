import CalendarComponent from "../../src/components/Calendar/Calendar"
import LoginGoogleCalendar from "../../src/components/Login/GoogleCalendarLogin"
import { useEffect, useState } from "react";
import CalendarMenu from "../../src/components/Menu/CalendarMenu";
import { useGoogleHandler } from "../api/google";
import { useSessionContext } from "@/src/components/Context/SolidContext";
import { useRouter } from "next/router";
import { useInruptHandler } from "../api/inrupt";
import Loader from "@/src/components/Loading/Loading";

export default function Calendar() {

    const { solidSession } = useSessionContext();
    const { getSession, getCalendarConfiguration } = useInruptHandler();
    const { checkAuthentication } = useGoogleHandler();

    const [reRender, setRerender] = useState(Math.random());
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const getSessionWrapper = async () => {
		await getSession();
	}

    const initialActions = async () => {
        const params = new URLSearchParams(location.search);
        const emailParam = params.get('user');
        const isUserLoggedIn = localStorage.getItem('googleLoggedIn');    
        await checkAuthentication(emailParam, isUserLoggedIn);
        await getCalendarConfiguration();
    };

    const checkAuth = async () => {	
        if (solidSession !== undefined && !solidSession?.info.isLoggedIn) {
            router.push("/");
        }
	};
    
    useEffect(() => {
        getSessionWrapper();
    }, [reRender]);

    useEffect(() => {
        checkAuth();
        if (solidSession?.info.isLoggedIn) {
            initialActions();
        }
        setLoading(false);
    }, [solidSession])

    return (
        loading ?
        <Loader />
        :
        (solidSession?.info.isLoggedIn &&
        <div className="calendar-container">
            <article className="calendar-menu" >
                <CalendarMenu />
                <LoginGoogleCalendar />
            </article>
            <CalendarComponent/>
        </div>)
    )
}