import { ReactNode, createContext, useContext, useState } from "react";
import { Event } from "@/src/task/Scheme";
import {v4 as uuid} from "uuid";

/**
 * Interface for the task context of the application.
 */
export interface IEventContext {
    events: Event[],
    selectedEventId: string,
    setEvents: React.Dispatch<React.SetStateAction<Event[]>>,
    setSelectedEventId: React.Dispatch<React.SetStateAction<string>>,
}

// TODO: replace it with solid logic
// const with default context (it's not the one from the user's pod)
const defaultContext: IEventContext={
    events: [
        {start: new Date("2024-02-18T12:00:00"), 
          end: new Date("2024-02-18T14:00:00"),
          title: "Comida con Manolo",
          desc: "una pequeña descripcion",
          eventId: uuid(),
          color: "#ffa500"
        },
        {start: new Date("2024-02-18T15:00:00"), 
          end: new Date("2024-02-18T16:00:00"),
          desc: "una pequeña descripcion",
          title: "Comida con Manolo2",
          eventId: uuid(),
          color: "#3E5B41"
        },
        {start: new Date("2024-02-18T20:00:00"), 
          end: new Date("2024-02-18T21:00:00"),
          desc: "una pequeña descripcion",
          title: "Comida con Manolo4",
          eventId: uuid(),
          color: "#3E5B41"
        },
        {start: new Date("2024-02-18T18:00:00"), 
          end: new Date("2024-02-18T19:00:00"),
          desc: "una pequeña descripcion",
          title: "Comida con Manolo3",
          eventId: uuid(),
          color: "#3E5B41"
        }
    ],
    selectedEventId: "",
    setSelectedEventId: () => {},
    setEvents: () => {},
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
    const value ={events, setEvents, selectedEventId, setSelectedEventId};

    return (
        <EventContext.Provider value={value}>
            {children}
        </EventContext.Provider>
    )
}

