import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PromptModal from "../Modal/PromptModal/PromptModal";
import NewEventForm from "../Event/NewEventForm";
import {v4 as uuid} from 'uuid';
import EditEventModal from "@/src/components/Modal/EditModal/EditEventModal";
import { useEventContext } from "../Context/EventContext";
import { Event } from "@/src/task/Scheme";

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
    borderColor: 'white', // Opcional: también puedes cambiar el color del borde si lo deseas
    color: 'white',
    cursor: 'pointer',
  };
  return {
    style: style
  };
};

export default function CalendarComponent() {
  const localizer = dayjsLocalizer(dayjs);
  
  const [newEvent, setNewEvent] = useState<Event>();
  const { events, setEvents, selectedEventId, setSelectedEventId } = useEventContext()
  const [isOpenNewEventModal, setOpenNewEventModal] = useState(false);
  const [isOpenEditEventModal, setOpenEditEventModal] = useState(false);
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
    setOpenEditEventModal(true);
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

  const handleCreateEvent = () => {
    if (createEvent()) {
      setOpenNewEventModal(false);
    }
  }

  const handleColorChange = (color:string) => {
    setSelectedColor(color);
}

  const createEvent = () => {    
    // @ts-ignore
    const title = titleRef.current.value; const info = infoRef.current.value; const from = fromDateRef.current.value; const to = toDateRef.current.value;
    if (areFieldsCompleted(title, from, to)) {
      setEvents((prev) => 
        [...prev, {start: new Date(from), end: new Date(to), title: title, desc: info, eventId: uuid(), color: selectedColor}]
      );
      return true;
    }
    return false;
  }

/* Para poner los botones de la cabecera en español, pasar el const messages como prop de Calendar
    const messages = {
    allDay: "Todo el día",
    previous: "Anterior",
    next: "Siguiente",
    today: "Hoy",
    month: "Mes",
    week: "Semana",
    day: "Día",
    agenda: "Agenda",
    date: "Fecha",
    time: "Hora",
    event: "Evento",
    noEventsInRange: "Sin eventos",
  }; */

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
      ></Calendar>
    {
      isOpenNewEventModal && (
        <PromptModal 
            title="New event"
            primaryActionText="Create"
            secondaryActionText="Cancel"
            onPrimaryAction={() => handleCreateEvent()}
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
    </>
  )
}
