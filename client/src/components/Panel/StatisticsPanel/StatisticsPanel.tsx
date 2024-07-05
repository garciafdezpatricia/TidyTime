import { Event } from "@/src/model/Scheme";
import { useEventContext } from "../../Context/EventContext";
import { useTaskContext } from "../../Context/TaskContext";
import DonutChart from "../../DonutChart/DonutChart"
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';

export default function StatisticsPanel() {
    const { t } = useTranslation();
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
        <article data-testid='task-progress' className="task-progress">
          <h2>{t('home.taskStat')}</h2>
          <DonutChart total={totalTasks} value={doneTasks} />
        </article>
        <article data-testid="upcoming-events" className="upcoming-events">
          <h2>{t('home.upcomingEvents.title')}</h2>
          <div className="event-list">
              {
                eventsToShow.length > 0 
                  ? eventsToShow.sort((a:any, b:any) => a.start - b.start).map((event, index) => {
                    const days = daysLeft(event.start)
                    return (
                      <section className="event" key={index}>
                          <p className="event-title">{event.title.toUpperCase()}</p>
                          <p style={{textDecoration: 'underline'}}>
                            {days === 0 
                            ? t('home.upcomingEvents.today') 
                            : days >= 2 
                              ? `${days} ${t('home.upcomingEvents.daysLeft')}` 
                              : `${days} ${t('home.upcomingEvents.dayLeft')}`}
                          </p>
                          <p>{event.start.toLocaleDateString()} - {event.end.toLocaleDateString()}</p>
                      </section>
                    )
                  })
                  : <p data-testid='empty-events' className="empty-events">{t('home.upcomingEvents.emptyEvents')}</p>
              }
          </div>
        </article>
      </article>
    )
}