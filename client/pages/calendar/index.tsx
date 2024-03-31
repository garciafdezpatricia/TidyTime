import { IoMenu } from "react-icons/io5";
import CalendarComponent from "../../src/components/Calendar/Calendar"
import LoginGoogleCalendar from "../../src/components/Login/GoogleCalendarLogin"
import { useEffect, useRef, useState } from "react";
import CalendarMenu from "../../src/components/Menu/CalendarMenu";


export default function Calendar() {

    const [menuOpened, setMenuOpened] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [reRender, setRerender] = useState(Math.random());

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const emailParam = params.get('email');
        const isUserLoggedIn = localStorage.getItem('userLoggedIn');
        
        if (isUserLoggedIn) {
            setIsLoggedIn(true);
        } else if (emailParam) {
            localStorage.setItem("userLoggedIn", emailParam);
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [reRender]); // this will be executed on every renderization of the page (new tab and refresh page included)
    
    return (
    <div className="calendar-container">
        <article className="calendar-menu" >
            <button className="calendar-menu-icon" onClick={() => setMenuOpened(!menuOpened)}>
                <IoMenu size={"1.4rem"} style={{color: "#3E5B41", backgroundColor: "transparent", borderRadius: "0.4rem"}}/>
            </button>
            {
                !isLoggedIn && <LoginGoogleCalendar />
            }
        </article>
        {
            menuOpened && <CalendarMenu onClose={() => setMenuOpened(false)}/>     
        }
        <CalendarComponent/>
    </div>)
}