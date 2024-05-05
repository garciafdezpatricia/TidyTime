import { useEffect, useState } from "react";
import { useEventContext } from "../../Context/EventContext";
import toast from "react-hot-toast";



export default function CalendarPanel() {
    const {weekStart, setWeekStart, eventView, setEventView} = useEventContext();

    const weekDays= [{dim: "M", day: "Monday"}, {dim: "Tue", day: "Tuesday"}, {dim: "W", day: "Wednesday"}, 
        {dim: "Th", day: "Thursday"}, {dim: "F", day: "Friday"}, {dim: "Sat", day: "Saturday"}, {dim: "Sun", day: "Sunday"}];
    
    const views = [{view:"Month" , value: "month"}, {view:"Week" , value: "week"}, {view:"Day" , value: "day"}, {view:"Agenda" , value: "agenda"}];

    return (
        <article className="calendar-settings">
            <h3>Calendar preferences</h3>
            <hr></hr>
            <p>Adjust the starting day of the week and choose the default calendar view.</p>
            <section className="week-start">
                <p style={{fontWeight: "bold"}}>Starting day of week:</p>
                <div className="week-days-buttons">
                    {
                        weekDays.map((day, index) => {
                             return (
                                <button 
                                    key={index} 
                                    className={weekStart === (index + 1) ? "selected-day" : ""}
                                    onClick={() => setWeekStart(index + 1)}
                                    title={`Set to ${day.day}`}
                                >
                                    {day.dim}
                                </button>
                            )
                        })
                    }
                </div>
            </section>
            <section className="event-view">
                <p style={{fontWeight: "bold"}}>Default calendar view:</p>
                <div className="event-view-buttons">
                    {
                        views.map((view, index) => {
                            return (
                                <button 
                                    key={index}
                                    className={eventView === (view.value) ? "selected-view" : ""}
                                    onClick={() => setEventView(view.value)}
                                    title={`Set to ${view.view}`}
                                >
                                    {view.view}
                                </button>
                            )
                        })
                    }
                </div>
            </section>
        </article>
    )
}