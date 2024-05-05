import CalendarComponent from "../../src/components/Calendar/Calendar"
import LoginGoogleCalendar from "../../src/components/Login/GoogleCalendarLogin"
import { useEffect, useRef, useState } from "react";
import CalendarMenu from "../../src/components/Menu/CalendarMenu";
import { useGoogleHandler } from "../api/google";
import { useSessionContext } from "@/src/components/Context/SolidContext";
import { useRouter } from "next/router";
import { useInruptHandler } from "../api/inrupt";
import Loader from "@/src/components/Loading/Loading";


export default function Calendar() {

    const { solidSession } = useSessionContext();
    const { getSession } = useInruptHandler();
    const { checkAuthentication } = useGoogleHandler();
    const [reRender, setRerender] = useState(Math.random());
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        getSession()
    }, [reRender]); // this will be executed on every renderization of the page (new tab and refresh page included)

    useEffect(() => {
        if (solidSession === undefined) {
            setLoading(true);
        } else {
            if (solidSession?.info.isLoggedIn) {
                const params = new URLSearchParams(location.search);
                const emailParam = params.get('user');
                const isUserLoggedIn = localStorage.getItem('googleLoggedIn');    
                checkAuthentication(emailParam, isUserLoggedIn);
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