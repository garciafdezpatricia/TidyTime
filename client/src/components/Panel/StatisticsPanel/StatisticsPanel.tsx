import { Event } from "@/src/model/Scheme";
import { useEventContext } from "../../Context/EventContext";
import { useTaskContext } from "../../Context/TaskContext";
import DonutChart from "../../DonutChart/DonutChart"
import { useEffect, useState } from "react";

export default function StatisticsPanel() {

    const { tasks } = useTaskContext();
    const { events } = useEventContext();

    const [eventsToShow, setEventsToShow] = useState<Event[]>([])
    const [totalTasks, setTotalTasks] = useState(0);
    const [doneTasks, setDoneTasks] = useState(0);

    useEffect(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const upcomingEvents = events.filter((event) => {
        const eventDate = event.start;
        eventDate.setHours(0, 0, 0, 0);
        return eventDate >= today && daysLeft(eventDate) <= 20
      });
      setEventsToShow(upcomingEvents);
    }, [events])

    const daysLeft = (fechaDada:Date) => {
        const currentDate = new Date();
        const miliseconds = fechaDada.getTime() - currentDate.getTime();
        return Math.ceil(miliseconds / (1000 * 60 * 60 * 24));
    }

    useEffect(() => {
      if (tasks && tasks.length > 0) {
        let totalCounter = 0;
        let doneCounter = 0;
        tasks.forEach((list) => {
          if (list.value) {
            totalCounter += list.value.length;
            doneCounter += list.value.filter((task) => task.done).length;
          }
        })
        setTotalTasks(totalCounter);
        setDoneTasks(doneCounter);
      } else {
        setTotalTasks(0);
        setDoneTasks(0)
      }
    }, [tasks])

    return (
    <article className="statistics">
        <article className="task-progress">
          <h2>Completed tasks</h2>
          <DonutChart total={totalTasks} value={doneTasks} />
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