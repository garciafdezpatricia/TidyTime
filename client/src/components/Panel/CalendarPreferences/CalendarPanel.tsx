import { useEffect, useState } from "react";
import { useEventContext } from "../../Context/EventContext";
import toast from "react-hot-toast";



export default function CalendarPanel() {
    const {weekStart, setWeekStart} = useEventContext();

    const [weekDays, setWeekDays] = useState([{dim: "M", day: "Monday"}, {dim: "Tue", day: "Tuesday"}, {dim: "W", day: "Wednesday"}, 
        {dim: "Th", day: "Thursday"}, {dim: "F", day: "Friday"}, {dim: "Sat", day: "Saturday"}, {dim: "Sun", day: "Sunday"}]);

    return (
        <article className="calendar-settings">
            <h3>Calendar preferences</h3>
            <hr></hr>
            <section className="week-start">
                <p>Starting day of week (Monday by default):</p>
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
        </article>
    )
}