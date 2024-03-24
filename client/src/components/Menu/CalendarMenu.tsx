import { useState } from "react";
import { BsCalendarEventFill } from "react-icons/bs";
import { FaCheck, FaRegCalendarPlus } from "react-icons/fa";
import { SiGooglecalendar } from "react-icons/si";
import { Icon } from "../Icon/Icon";
import NewEventForm from "../Event/NewEventForm";

export default function CalendarMenu() {

    const [createNewEvent, setCreateNewEvent] = useState(false);

    const getEvents = () => {
        fetch('http://localhost:8080/google/events', {
            method: 'GET',
            credentials: 'include',
        }).then(response => response.json());
    }

    return (
        <article className="calendar-menu-popup">
            <section className="calendar-menu-events">
                <h3>Add event</h3>
                <hr/>
                <p>Create a new event and add it to your calendar</p>
                <section className="calendar-menu-buttons">
                    <button onClick={() => setCreateNewEvent(!createNewEvent)} className="create-new-event">
                        <BsCalendarEventFill size={".9rem"}/>
                        New event
                    </button>
                    { createNewEvent && <button className="confirm-btn" >Create</button>}
                </section>
                {
                    createNewEvent && <NewEventForm />
                }
            </section>
            <section className="calendar-menu-google">
                <header className="calendar-menu-google-header">
                    <Icon src={"./google-calendar.svg"} alt={"Google Calendar Icon"} />
                    <h3>Google Calendar</h3>
                </header>
                <hr />
                <p>Manage your Google events and calendars</p>
                <div className="calendar-menu-google-body">
                    <button onClick={getEvents} className="import-google-btn">
                        <FaRegCalendarPlus size={".9rem"} />
                        Import events
                    </button>
                    <button className="import-google-btn">
                        <SiGooglecalendar size={".9rem"} />
                        Import calendars
                    </button>
                </div>
            </section>
        </article>
    )
}