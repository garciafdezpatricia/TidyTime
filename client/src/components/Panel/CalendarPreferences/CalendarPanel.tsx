import { useState } from "react";



export default function CalendarPanel() {

    const [weekDays, setWeekDays] = useState(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);

    return (
        <article className="calendar-settings">
            <h3>Calendar preferences</h3>
            <hr></hr>
            <section className="week-start">
                <p>Starting day of week</p>
                <div className="week-days-buttons">
                    {
                        weekDays.map((day, index) => {
                            return (
                                <button key={index}
                                >
                                    {day.toUpperCase().charAt(0)}
                                </button>
                            )
                        })
                    }
                </div>
            </section>
        </article>
    )
}