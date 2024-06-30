import { Calendar, View, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import enLocale from 'dayjs/locale/en';
import esLocale from 'dayjs/locale/es';
import { useEffect, useRef, useState } from "react";
import PromptModal from "../Modal/PromptModal/PromptModal";
import NewEventForm from "../Event/NewEventForm";
import {v4 as uuid} from 'uuid';
import EditEventModal from "@/src/components/Modal/EditModal/EditEventModal";
import { useEventContext } from "../Context/EventContext";
import { Event } from "@/src/model/Scheme";
import SeeTaskModal from "../Modal/EditModal/SeeTaskModal";
import { useInruptHandler } from "@/pages/api/inrupt";
import { useTranslation } from "react-i18next";

// custom event for calendar (all views)
const components = {
  event: (props:any) => {
    return (
      <div>
        <h3>{props.event.title}</h3>
      </div>
    );
  }
}

const eventStyleGetter = (event:any, view:any) => {
  const style = {
    backgroundColor: event.color, 
    borderColor: 'white',
    color: 'white',
    cursor: 'pointer',
  };
  return {
    style: style
  };
};

export default function CalendarComponent() {
  const { t, i18n } = useTranslation();
  const { events, setEvents, setSelectedEventId, weekStart, eventView } = useEventContext();
  const { createEvent } = useInruptHandler();
  const [languageLocalizer, setLanguageLocalizer] = useState(enLocale);
  
  
  dayjs.locale('en-custom', {
    ...languageLocalizer, 
    weekStart: weekStart
  });
  const localizer = dayjsLocalizer(dayjs);

  const [newEvent, setNewEvent] = useState<Event>();
  
  const [isOpenNewEventModal, setOpenNewEventModal] = useState(false);
  const [isOpenEditEventModal, setOpenEditEventModal] = useState(false);
  const [isOpenSeeTaskModal, setOpenSeeTaskModal] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");

  const titleRef = useRef(null);
  const infoRef = useRef(null);
  const fromDateRef = useRef(null);
  const toDateRef = useRef(null);

  function handleSelectSlot({start, end} : {start:Date, end:Date}) {
    // format init date to YYYY-MM-DDTHH:mm
    const startDate = new Date(start.getTime() - (start.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    const endDate = new Date(end.getTime() - (end.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    setNewEvent({start: new Date(startDate), end: new Date(endDate), title: "", desc: "", eventId: uuid()});
    setOpenNewEventModal(true);
  }

  const handleSelectEvent = ({eventId} : {eventId:string}) => {
    let isTask = false;
    events.map((event) => {
      if (event.eventId === eventId) {
        if (event.isTask) {
          isTask = true;
        }
        return;
      }
    })
    if (isTask) {
      setOpenSeeTaskModal(true);
    } else {
      setOpenEditEventModal(true);
    }
    setSelectedEventId(eventId);
  }

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

  const handleCreateEvent = async () => {
    if (await createNewEvent()) {
      setOpenNewEventModal(false);
    }
  }

  const handleColorChange = (color:string) => {
    setSelectedColor(color);
}

  const createNewEvent = async () => {    
    // @ts-ignore
    const title = titleRef.current.value; const info = infoRef.current.value; const from = fromDateRef.current.value; const to = toDateRef.current.value;
    if (areFieldsCompleted(title, from, to)) {
      let event: Event = {start: new Date(from), end: new Date(to), title: title, desc: info, eventId: uuid(), color: selectedColor};
      await createEvent(event);
      setEvents((prev) => 
        [...prev, event]
      );
      return true;
    }
    return false;
  }

  useEffect(() => {
    if (i18n.language === 'es') {
      setLanguageLocalizer(esLocale);
    } else if (i18n.language === 'en') {
      setLanguageLocalizer(enLocale);
    }
  }, [i18n.language])

  const messages = {
    allDay: `${t('calendar.messages.allDay')}`,
    previous: `${t('calendar.messages.previous')}`,
    next: `${t('calendar.messages.next')}`,
    today: `${t('calendar.messages.today')}`,
    month: `${t('calendar.messages.month')}`,
    week: `${t('calendar.messages.week')}`,
    day: `${t('calendar.messages.day')}`,
    agenda: `${t('calendar.messages.agenda')}`,
    date: `${t('calendar.messages.date')}`,
    time: `${t('calendar.messages.time')}`,
    event: `${t('calendar.messages.event')}`,
    noEventsInRange: `${t('calendar.messages.noEventsInRange')}`,
  };

  return (
    <>
      <Calendar 
        components={components}
        localizer={localizer} 
        events={events}
        eventPropGetter={eventStyleGetter}
        onSelectSlot={(data) => handleSelectSlot(data)}
        onSelectEvent={(data) => handleSelectEvent(data)}
        selectable
        defaultView={eventView as View}
        messages={messages}
      ></Calendar>
    {
      isOpenNewEventModal && (
        <PromptModal 
            title={t('calendar.newEventPanel.title')}
            primaryActionText={t('calendar.newEventPanel.create')}
            secondaryActionText={t('calendar.newEventPanel.cancel')}
            onPrimaryAction={async () => await handleCreateEvent()}
            onSecondaryAction={() => setOpenNewEventModal(false)} 
            backdrop={false} 
            variant="shadow-modal">
            <NewEventForm 
              startDate={newEvent?.start}
              endDate={newEvent?.end}
              titleRef={titleRef}
              infoRef={infoRef}
              fromDateRef={fromDateRef}
              toDateRef={toDateRef} 
              onColorChange={handleColorChange} />
        </PromptModal>
      )
    }
    {
      isOpenEditEventModal && (
        <EditEventModal 
          onClose={() => setOpenEditEventModal(false)} 
        />
      )
    }
    {
      isOpenSeeTaskModal && (
        <SeeTaskModal 
          onClose={() => setOpenSeeTaskModal(false)} 
        />
      )
    }
    </>
  )
}
