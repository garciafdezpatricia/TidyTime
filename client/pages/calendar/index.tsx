// go to this page as /calendar
import { BsCalendarEventFill } from "react-icons/bs";
import { SiGooglecalendar } from "react-icons/si";
import { FaRegCalendarPlus } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import CalendarComponent from "../../src/components/Calendar/Calendar"
import LoginGoogleCalendar from "../../src/components/Login/GoogleCalendarLogin"
import { useState } from "react";
import { Icon } from "../../src/components/Icon/Icon";
import CalendarMenu from "../../src/components/Menu/CalendarMenu";


export default function Calendar() {

    const [menuOpened, setMenuOpened] = useState(false);

    return (
    <div className="calendar-container">
        <article className="calendar-menu">
            <button className="calendar-menu-icon" onClick={() => setMenuOpened(!menuOpened)}>
                <IoMenu size={"1.4rem"} style={{color: "#3E5B41", backgroundColor: "transparent", borderRadius: "0.4rem"}}/>
            </button>
            <LoginGoogleCalendar />
        </article>
        {
            menuOpened && <CalendarMenu />     
        }
        <CalendarComponent/>
    </div>)
}