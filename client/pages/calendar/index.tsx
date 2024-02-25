// go to this page as /calendar

import { CredentialResponse } from "@react-oauth/google";
import CalendarComponent from "../components/Calendar/Calendar"
import LoginGoogleCalendar from "../components/Login/GoogleCalendarLogin"


export default function Calendar() {
    return (
    <div className="calendar-container">
        <LoginGoogleCalendar />
        <CalendarComponent/>
    </div>)
}