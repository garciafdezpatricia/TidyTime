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

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Event } from "@/src/model/Scheme";
import {v4 as uuid} from "uuid";
import { useTaskContext } from "./TaskContext";

/**
 * Interface for the event context of the application.
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
 * Custom hook to access the event context.
 * @returns event context
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
 * Context provider. Makes the event context accessible for children.
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
        // Filter tasks with defined date
        const listOfTasks = tasks.map((tasklist) => tasklist.value);
        const tasksWithEndDate = listOfTasks.flat().filter(task => task.endDate);
      
        // Parse tasks into events
        const taskEvents = tasksWithEndDate.map(task => task ={
          // @ts-ignore
          start: new Date(task.endDate),
          // @ts-ignore there's a date because they were filtered
          end: new Date(task.endDate),
          title: task.title,
          desc: task.desc ?? "",
          eventId: uuid(),
          isTask: true,
          color: "#3bb4ff"
        });
      
        // Filter initial events that are not tasks
        const nonTaskEvents = events.filter(event => !event.isTask);
      
        // Unify events with the tasks events
        const updatedEvents = [...nonTaskEvents, ...taskEvents];
      
        // Update event state
        setEvents(updatedEvents);
      } else {
        const nonTasksEvents = events.filter(event => !event.isTask);
        setEvents(nonTasksEvents);
      }
    }, [tasks, showTasksInCalendar]);

    const value ={events, setEvents, selectedEventId, setSelectedEventId, weekStart, setWeekStart, eventView, setEventView};

    return (
        <EventContext.Provider value={value}>
            {children}
        </EventContext.Provider>
    )
}

