import { useRef, useState } from "react";
import { BsCalendarEventFill } from "react-icons/bs";
import { FaCheck, FaRegCalendarPlus } from "react-icons/fa";
import { SiGooglecalendar } from "react-icons/si";
import { Icon } from "../Icon/Icon";
import NewEventForm from "../Event/NewEventForm";
import { useEventContext } from "../Context/EventContext";
import { uuid } from "uuidv4";
import { Event } from "@/src/task/Scheme";

export interface Props {
    onClose: (arg?:any) => void | any;
}

export default function CalendarMenu({onClose} : Props) {
    // event context utils
    const { setEvents } = useEventContext()

    const [createNewEvent, setCreateNewEvent] = useState(false);
    const [selectedColor, setSelectedColor] = useState("");
    const titleRef = useRef(null);
    const infoRef = useRef(null);
    const fromDateRef = useRef(null);
    const toDateRef = useRef(null);

    /**
     * Auxiliary function to check if the required fields to create the event are filled 
     * @param title containing the title of the event
     * @param from containing the start date of the event
     * @param to containing the end date of the event
     * @returns true if all fields are completed. False otherwise.
     */
    function areFieldsCompleted(title:string, from:string, to:string) {
        let result = true;
        if (title === "") {
          // @ts-ignore
          titleRef.current.style.borderColor = "#e13535";
          result = false;
        }
        if (from === "") {
          // @ts-ignore
          fromDateRef.current.style.borderColor = "#e13535";
          result = false;
        }
        if (to === "") {
          // @ts-ignore
          toDateRef.current.style.borderColor = "#e13535";
          result = false;
        }
        return result;
    }

    /**
     * Handler for the creation of the event. If the event is correctly created, the creation of the event modal is closed
     */
    const handleCreateEvent = () => {
        if (createEvent()) {
            onClose();
        }
    }

    /**
     * Handler for color changes.
     */
    const handleColorChange = (color:string) => {
        setSelectedColor(color);
    }
    
    /**
     * Creates a new event from the value of the fields. If all required fields are filled, the creation action takes place.
     * @returns 
     */
    const createEvent = () => {    
        // @ts-ignore
        const title = titleRef.current.value; const info = infoRef.current.value; 
        // @ts-ignore
        const from = fromDateRef.current.value; const to = toDateRef.current.value; 
        if (areFieldsCompleted(title, from, to)) {
            // need to create the event dates with new Date() for them to be displayed on the calendar
            setEvents((prev) => 
            [...prev, {start: new Date(from), end: new Date(to), title: title, desc: info, color: selectedColor, eventId: uuid()}]
            );
            return true;
        }
        return false;
    }

    /**
     * Fetch events from Google Calendar. 
     * Makes a call to the API which responds with a list of events.
     */
    const getGoogleCalendarEvents = () => {
        fetch('http://localhost:8080/google/events', {
        method: 'GET',
        credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            data.map((event:any) => {
                // the date coming from the backend is in format YYYY-MM-DDTHH:MM:SS.000Z => need to convert it to Fri Mar 29 ...
                // when doing just new Date(...) the timezone is applied, changing the datetime fetched from the backend.
                // The patch with the ISOString does not change datetimes.
                event.start = new Date(new Date(event.start).toISOString().slice(0, 16));
                event.end = new Date(new Date(event.end).toISOString().slice(0, 16));
            })
            setEvents((prev) => [...prev, ...data]);
        })
        .catch(error => console.error('Error:', error));
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
                    { createNewEvent && <button className="confirm-btn" onClick={() => handleCreateEvent()} >Create</button>}
                </section>
                {
                    createNewEvent && 
                    <NewEventForm 
                        titleRef={titleRef}
                        infoRef={infoRef}
                        fromDateRef={fromDateRef}
                        toDateRef={toDateRef} 
                        onColorChange={handleColorChange}
                    />
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
                    <button onClick={getGoogleCalendarEvents} className="import-google-btn">
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