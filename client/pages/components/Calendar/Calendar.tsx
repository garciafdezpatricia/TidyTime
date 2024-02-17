import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";

export default function CalendarComponent() {
  const localizer = dayjsLocalizer(dayjs);
  const events = [
    {
      start: dayjs("2024-02-18T12:00:00").toDate(),
      end: dayjs("2024-02-18T13:00:00").toDate(),
      title: "Comida con papá",
    },
  ];

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
    <Calendar 
        localizer={localizer} 
        events={events}
    ></Calendar>
  )
}
