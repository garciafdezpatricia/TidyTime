import { IoMenu } from "react-icons/io5";
import CalendarComponent from "../../src/components/Calendar/Calendar"
import LoginGoogleCalendar from "../../src/components/Login/GoogleCalendarLogin"
import { useEffect, useRef, useState } from "react";
import CalendarMenu from "../../src/components/Menu/CalendarMenu";
import { useGoogleContext } from "@/src/components/Context/GoogleContext";
import toast from "react-hot-toast";
import { useGoogleHandler } from "../api/google";


export default function Calendar() {

    const { setLoggedIn } = useGoogleContext();
    const { checkAuthentication } = useGoogleHandler();
    const [reRender, setRerender] = useState(Math.random());

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const emailParam = params.get('user');
        const isUserLoggedIn = localStorage.getItem('googleLoggedIn');    
        checkAuthentication(emailParam, isUserLoggedIn);
    }, [reRender]); // this will be executed on every renderization of the page (new tab and refresh page included)

    return (
    <div className="calendar-container">
        <article className="calendar-menu" >
            <CalendarMenu />
            <LoginGoogleCalendar />
        </article>
        <CalendarComponent/>
    </div>)
}