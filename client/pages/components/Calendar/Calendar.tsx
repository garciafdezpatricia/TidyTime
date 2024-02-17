import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import { useCallback, useState } from "react";
import PromptModal from "../Modal/PromptModal/PromptModal";
import NewEventForm from "../Form/NewEventForm/NewEventForm";

export default function CalendarComponent() {
  const localizer = dayjsLocalizer(dayjs);
  const events = [
    {}
  ];

  const [myEvents, setEvents] = useState(events);
  const [isOpenPromptModal, setOpenPromptModal] = useState(false);

  const handleSelectSlot = useCallback(({start, end} : {start:Date, end:Date}) => {
    // TODO: create new modal asking for title, description, time and color
    setOpenPromptModal(true);
    let title = "";
    // TODO: get values from modal and create event
    setEvents((prev) => [...prev, {start, end, title}])
  }, [setEvents])

  const handleSelectEvent = useCallback(({start, end} : {start:Date, end:Date}) => {
    // TODO: display modal to edit event
    // TODO: get values from modal and update events
    // setEvents((prev) => [...prev, {start, end, title}])
  }, [setEvents])

  // Para poner los botones de la cabecera en español, pasar el const messages como prop de Calendar
//   const messages = {
//     allDay: "Todo el día",
//     previous: "Anterior",
//     next: "Siguiente",
//     today: "Hoy",
//     month: "Mes",
//     week: "Semana",
//     day: "Día",
//     agenda: "Agenda",
//     date: "Fecha",
//     time: "Hora",
//     event: "Evento",
//     noEventsInRange: "Sin eventos",
//   };

  return (
    <>
      <Calendar 
        localizer={localizer} 
        events={events}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        selectable
    ></Calendar>
    {
      isOpenPromptModal && (
        <PromptModal 
          title="New event"
          primaryActionText="Create"
          secondaryActionText="Cancel"
          onSecondaryAction={() => setOpenPromptModal(false)}
          >
            <NewEventForm />
        </PromptModal>
      )
    }
    </>
  )
}
