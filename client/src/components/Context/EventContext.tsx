import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Event } from "@/src/model/Scheme";
import {v4 as uuid} from "uuid";
import { useTaskContext } from "./TaskContext";

/**
 * Interface for the task context of the application.
 */
export interface IEventContext {
    events: Event[],
    selectedEventId: string,
    setEvents: React.Dispatch<React.SetStateAction<Event[]>>,
    setSelectedEventId: React.Dispatch<React.SetStateAction<string>>,
    weekStart: number,
    setWeekStart: React.Dispatch<React.SetStateAction<number>>,
    eventView: string,
    setEventView: React.Dispatch<React.SetStateAction<string>>,
}

const defaultContext: IEventContext={
    events: [],
    selectedEventId: "",
    setSelectedEventId: () => {},
    setEvents: () => {},
    weekStart: 1,
    setWeekStart: () => {},
    eventView: "month",
    setEventView: () => {},
}
// context with the default event context
const EventContext = createContext<IEventContext>(defaultContext);
/**
 * Custom hook to access the task context.
 * @returns task context
 */
export function useEventContext() {
    return useContext(EventContext)
}
/**
 * Interface for the context provider. Only children is added by now.
 */
export interface IEventContextProvider {
    children: ReactNode;
}
/**
 * Context provider. Makes the task context accessible for children.
 * @param children corresponds to the children of the component
 * @returns context provider
 */
export function EventProvider({children} : IEventContextProvider) {
    const [events, setEvents] = useState(defaultContext.events);
    const [selectedEventId, setSelectedEventId] = useState(defaultContext.selectedEventId);
    const [weekStart, setWeekStart] = useState(defaultContext.weekStart);
    const [eventView, setEventView] = useState(defaultContext.eventView);

    const { tasks, showTasksInCalendar } = useTaskContext();


    useEffect(() => {
      if (showTasksInCalendar && tasks) {
        // Filtrar las tareas que tienen fecha definida
        const listOfTasks = tasks.map((tasklist) => tasklist.value);
        const tasksWithEndDate = listOfTasks.flat().filter(task => task.endDate);
      
        // Convertir las tareas en eventos
        const taskEvents = tasksWithEndDate.map(task => task ={
          // @ts-ignore
          start: new Date(task.endDate),
          // @ts-ignore sabemos que tienen fecha porque estan filtradas
          end: new Date(task.endDate),
          title: task.title,
          desc: task.desc ?? "",
          eventId: uuid(),
          isTask: true,
          color: "#3bb4ff"
        });
      
        // Filtrar los eventos originales que no son tareas
        const nonTaskEvents = events.filter(event => !event.isTask);
      
        // Unir los eventos originales con los nuevos eventos de tareas
        const updatedEvents = [...nonTaskEvents, ...taskEvents];
      
        // Actualizar el estado de los eventos
        setEvents(updatedEvents);
      } else {
        const nonTasksEvents = events.filter(event => !event.isTask);
        setEvents(nonTasksEvents);
      }
    }, [tasks, showTasksInCalendar]); // Dependencias de useEffect

    const value ={events, setEvents, selectedEventId, setSelectedEventId, weekStart, setWeekStart, eventView, setEventView};

    return (
        <EventContext.Provider value={value}>
            {children}
        </EventContext.Provider>
    )
}

