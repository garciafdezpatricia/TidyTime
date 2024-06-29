import { useEffect, useRef, useState } from "react";
import { BsCalendarEventFill } from "react-icons/bs";
import { Icon } from "../Icon/Icon";
import NewEventForm from "../Event/NewEventForm";
import { useEventContext } from "../Context/EventContext";
import { uuid } from "uuidv4";
import { useClickAway } from "@uidotdev/usehooks";
import { IoMdSync } from "react-icons/io";
import { BsFillCalendarPlusFill } from "react-icons/bs";
import { useGoogleContext } from "../Context/GoogleContext";
import { IoMenu } from "react-icons/io5";
import { useGoogleHandler } from "@/pages/api/google";
import { useInruptHandler } from "@/pages/api/inrupt";
import { Event } from "@/src/model/Scheme";
import { useTranslation } from "react-i18next";

export default function CalendarMenu() {
    // event context utils
    const { t } = useTranslation();
    const { setEvents } = useEventContext()
    const { calendars } = useGoogleContext();
    const { getCalendars } = useGoogleHandler();
    const { createEvent } = useInruptHandler();

    const [createNewEvent, setCreateNewEvent] = useState(false);
    const [selectedColor, setSelectedColor] = useState("");
    const [menuOpened, setMenuOpened] = useState(false);
    const [importingCalendars, setImportingCalendars] = useState(false);

    const titleRef = useRef(null);
    const infoRef = useRef(null);
    const fromDateRef = useRef(null);
    const toDateRef = useRef(null);
    const ref = useClickAway(() => {
        setMenuOpened(false);
    })

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
    const handleCreateEvent = async () => {
        if (await constructEvent()) {
            setMenuOpened(false);
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
    const constructEvent = async () => {    
        // @ts-ignore
        const title = titleRef.current.value; const info = infoRef.current.value; 
        // @ts-ignore
        const from = fromDateRef.current.value; const to = toDateRef.current.value; 
        if (areFieldsCompleted(title, from, to)) {
            // need to create the event dates with new Date() for them to be displayed on the calendar
            const event: Event = { start: new Date(from), end: new Date(to), title: title, desc: info, color: selectedColor, eventId: uuid() };
            await createEvent(event);
            setEvents((prev) => 
            [...prev, event]
            );
            return true;
        }
        return false;
    }

    // workaround for setter being async
    useEffect(() => {
        if (importingCalendars) {
            getCalendars().then((response) => {
                setImportingCalendars(false);
            })
        }
    }, [getCalendars, importingCalendars])

    const getGoogleCalendars = () => {
        setImportingCalendars(true);
    }

    return (
        // @ts-ignore
       <div ref={ref}>
            <button className="calendar-menu-icon" onClick={() => setMenuOpened(!menuOpened)} >
                <IoMenu size={"1.4rem"} style={{color: "#3E5B41", backgroundColor: "transparent", borderRadius: "0.4rem"}}/>
            </button>
            {
                menuOpened &&
                // @ts-ignore
                <article className="calendar-menu-popup">
                    <section className="calendar-menu-events">
                        <h3>{t('calendar.calendarMenu.addEvent.title')}</h3>
                        <hr/>
                        <p>{t('calendar.calendarMenu.addEvent.desc')}</p>
                        <section className="calendar-menu-buttons">
                            <button onClick={() => setCreateNewEvent(!createNewEvent)} className="create-new-event">
                                <BsCalendarEventFill size={".9rem"}/>
                                {t('calendar.calendarMenu.addEvent.newEventButton')}
                            </button>
                            { createNewEvent && <button className="confirm-btn" onClick={() => handleCreateEvent()} >{t('calendar.calendarMenu.addEvent.createButton')}</button>}
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
                            <h3>{t('calendar.calendarMenu.googleCalendar.title')}</h3>
                        </header>
                        <hr />
                        <p>{t('calendar.calendarMenu.googleCalendar.desc')}</p>
                        <button className="import-google-btn" onClick={getGoogleCalendars}>
                            {importingCalendars && <div className="loader"></div>}
                            <BsFillCalendarPlusFill />
                            {t('calendar.calendarMenu.googleCalendar.importButton')}
                        </button>
                        <ul className="calendar-menu-google-calendars">
                        {
                            calendars.map((calendar, index) => {
                                return (
                                    <li key={index} className="calendar-item">
                                        <p style={{backgroundColor: calendar.color}}>{calendar.name}</p>
                                        <CalendarHandler calendarId={calendar.id} />
                                    </li>
                                )
                            })
                        }
                        </ul>
                    </section>
                </article>
            }
        </div>
    )
}

export interface CalendarProps {
    calendarId: string,
}
function CalendarHandler({calendarId}: CalendarProps) {

    const { getCalendarEvents } = useGoogleHandler();

    const [syncingCalendar, setSyncingCalendar] = useState(false);

    // workaround for setter being async
    useEffect(() => {
        if (syncingCalendar) {
            getCalendarEvents(calendarId).then((response) => {
                setSyncingCalendar(false);
            })
        }
    }, [syncingCalendar, calendarId, getCalendarEvents])


    /**
     * Fetch events of an specific calendar from Google Calendar. 
     * Makes a call to the API which responds with a list of events.
     */
    const getGoogleCalendarEvents = () => {
        setSyncingCalendar(true);
    }

    return (
        <button onClick={() => getGoogleCalendarEvents()} className="calendar-item-sync-btn">
            {syncingCalendar && <div className="loader"></div>}
            <IoMdSync size={"1rem"} /> Synchronize
        </button>
    )
}