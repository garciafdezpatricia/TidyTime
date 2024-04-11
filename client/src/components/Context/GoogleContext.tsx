import { ReactNode, createContext, useContext, useState } from "react";
import { CalendarItem, Event } from "@/src/task/Scheme";

/**
 * Interface for the task context of the application.
 */
export interface IGoogleContext {
    loggedIn: boolean,
    calendars: CalendarItem[],
    selectedCalendarId: string,
    setCalendars: React.Dispatch<React.SetStateAction<CalendarItem[]>>,
    setSelectedCalendarId: React.Dispatch<React.SetStateAction<string>>,
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
}

// TODO: replace it with solid logic
// const with default context (it's not the one from the user's pod)
const defaultContext: IGoogleContext={
    loggedIn: false,
    calendars: [],
    selectedCalendarId: "",
    setSelectedCalendarId: () => {},
    setCalendars: () => {},
    setLoggedIn: () => {},
}
// context with the default event context
const GoogleContext = createContext<IGoogleContext>(defaultContext);
/**
 * Custom hook to access the task context.
 * @returns task context
 */
export function useGoogleContext() {
    return useContext(GoogleContext)
}
/**
 * Interface for the context provider. Only children is added by now.
 */
export interface IGoogleContextProvider {
    children: ReactNode;
}
/**
 * Context provider. Makes the task context accessible for children.
 * @param children corresponds to the children of the component
 * @returns context provider
 */
export function GoogleProvider({children} : IGoogleContextProvider) {
    const [calendars, setCalendars] = useState(defaultContext.calendars);
    const [selectedCalendarId, setSelectedCalendarId] = useState(defaultContext.selectedCalendarId);
    const [loggedIn, setLoggedIn] = useState(defaultContext.loggedIn);
    const value ={calendars, setCalendars, selectedCalendarId, setSelectedCalendarId, loggedIn, setLoggedIn};

    return (
        <GoogleContext.Provider value={value}>
            {children}
        </GoogleContext.Provider>
    )
}

