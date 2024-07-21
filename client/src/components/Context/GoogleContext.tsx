// Copyright 2024 Patricia García Fernández.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { ReactNode, createContext, useContext, useState } from "react";
import { CalendarItem, Event } from "@/src/model/Scheme";

/**
 * Interface for the Google context of the application.
 */
export interface IGoogleContext {
    loggedIn: boolean,
    calendars: CalendarItem[],
    selectedCalendarId: string,
    setCalendars: React.Dispatch<React.SetStateAction<CalendarItem[]>>,
    setSelectedCalendarId: React.Dispatch<React.SetStateAction<string>>,
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
    authUrl: string, 
    setAuthUrl: React.Dispatch<React.SetStateAction<string>>,
}

// const with default context (it's not the one from the user's pod)
const defaultContext: IGoogleContext={
    loggedIn: false,
    calendars: [],
    selectedCalendarId: "",
    authUrl: "",
    setSelectedCalendarId: () => {},
    setCalendars: () => {},
    setLoggedIn: () => {},
    setAuthUrl: () => {},
}
// context with the default Google context
const GoogleContext = createContext<IGoogleContext>(defaultContext);
/**
 * Custom hook to access the Google context.
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
 * Context provider. Makes the Google context accessible for children.
 * @param children corresponds to the children of the component
 * @returns context provider
 */
export function GoogleProvider({children} : IGoogleContextProvider) {
    const [calendars, setCalendars] = useState(defaultContext.calendars);
    const [selectedCalendarId, setSelectedCalendarId] = useState(defaultContext.selectedCalendarId);
    const [loggedIn, setLoggedIn] = useState(defaultContext.loggedIn);
    const [authUrl, setAuthUrl] = useState(defaultContext.authUrl);
    const value ={calendars, setCalendars, selectedCalendarId, setSelectedCalendarId, loggedIn, setLoggedIn, authUrl, setAuthUrl};

    return (
        <GoogleContext.Provider value={value}>
            {children}
        </GoogleContext.Provider>
    )
}

