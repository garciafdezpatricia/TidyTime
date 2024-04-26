import { Event } from "@/src/model/Scheme";
import { useEventContext } from "../../Context/EventContext";
import { useTaskContext } from "../../Context/TaskContext";
import DonutChart from "../../DonutChart/DonutChart"
import { useEffect, useState } from "react";

export default function StatisticsPanel() {

    const { tasks } = useTaskContext();
    const { events } = useEventContext();

    const [eventsToShow, setEventsToShow] = useState<Event[]>([])

    useEffect(() => {
      setEventsToShow(events.filter((event) => event.start.getDate() >= new Date().getDate()));
    }, [events])

    const daysLeft = (fechaDada:Date) => {
        const currentDate = new Date();
        const miliseconds = fechaDada.getTime() - currentDate.getTime();
        return Math.ceil(miliseconds / (1000 * 60 * 60 * 24));
    }

    return (
    <article className="statistics">
        <article className="task-progress">
          <h2>Completed tasks</h2>
          <DonutChart total={tasks.flat().length} value={tasks.flat().filter((task) => task.done).length} />
        </article>
        <article className="upcoming-events">
          <h2>Upcoming events</h2>
          <div className="event-list">
              {
                eventsToShow.length > 0 
                  ? eventsToShow.sort((a:any, b:any) => a.start - b.start).map((event, index) => {
                    const days = daysLeft(event.start)
                    return (
                      <section className="event" key={index}>
                          <p className="event-title">{event.title.toUpperCase()}</p>
                          <p style={{textDecoration: 'underline'}}>{days === 0 ? "Today" : days >= 2 ? `${days} days left` : `${days} day left`}</p>
                          <p>{event.start.toLocaleDateString()} - {event.end.toLocaleDateString()}</p>
                      </section>
                    )
                  })
                  : <p className="empty-events">No upcoming events!</p>
              }
          </div>
        </article>
      </article>
    )
}