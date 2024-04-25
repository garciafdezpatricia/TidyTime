import { IoMenu } from "react-icons/io5";
import CalendarComponent from "../../src/components/Calendar/Calendar"
import LoginGoogleCalendar from "../../src/components/Login/GoogleCalendarLogin"
import { useEffect, useRef, useState } from "react";
import CalendarMenu from "../../src/components/Menu/CalendarMenu";
import { useGoogleContext } from "@/src/components/Context/GoogleContext";
import toast from "react-hot-toast";
import { useGoogleHandler } from "../api/google";
import { useSessionContext } from "@/src/components/Context/SolidContext";
import { useRouter } from "next/router";


export default function Calendar() {

    const { solidSession } = useSessionContext();
    const { checkAuthentication } = useGoogleHandler();
    const [reRender, setRerender] = useState(Math.random());
    const router = useRouter();

    useEffect(() => {
        if (!solidSession?.info.isLoggedIn) {
            router.push("/");
            return;
        } else {
            const params = new URLSearchParams(location.search);
            const emailParam = params.get('user');
            const isUserLoggedIn = localStorage.getItem('googleLoggedIn');    
            checkAuthentication(emailParam, isUserLoggedIn);
        }
    }, [reRender]); // this will be executed on every renderization of the page (new tab and refresh page included)

    return (
        solidSession?.info.isLoggedIn &&
        <div className="calendar-container">
            <article className="calendar-menu" >
                <CalendarMenu />
                <LoginGoogleCalendar />
            </article>
            <CalendarComponent/>
        </div>
    )
}