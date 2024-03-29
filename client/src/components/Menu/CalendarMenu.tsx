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

    const { setEvents } = useEventContext()
    const [createNewEvent, setCreateNewEvent] = useState(false);
    const [selectedColor, setSelectedColor] = useState("");
    const titleRef = useRef(null);
    const infoRef = useRef(null);
    const fromDateRef = useRef(null);
    const toDateRef = useRef(null);

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

    const handleCreateEvent = () => {
        if (createEvent()) {
            onClose();
        }
    }

    const handleColorChange = (color:string) => {
        setSelectedColor(color);
    }
    
    const createEvent = () => {    
        // @ts-ignore
        const title = titleRef.current.value; const info = infoRef.current.value; 
        // @ts-ignore
        const from = fromDateRef.current.value; const to = toDateRef.current.value; 
        if (areFieldsCompleted(title, from, to)) {
            console.log("dentro");
            setEvents((prev) => 
            [...prev, {start: new Date(from), end: new Date(to), title: title, desc: info, color: selectedColor, eventId: uuid()}]
            );
            return true;
        }
        return false;
    }

    const getEvents = () => {
        fetch('http://localhost:8080/google/events', {
        method: 'GET',
        credentials: 'include',
        })
        .then(response => response.json()) // Convertir la respuesta en un objeto JavaScript
        .then(data => {
            data.map((event:Event) => {
                event.start = new Date(event.start); 
                event.end = new Date(event.end);
                console.log(event);
            })
            setEvents((prev) => [...prev, ...data]);
        })
        .catch(error => console.error('Error:', error)); // Manejar cualquier error
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