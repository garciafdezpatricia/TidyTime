import { useEventContext } from "../../Context/EventContext";
import { useTranslation } from 'react-i18next';



export default function CalendarPanel() {
    const { t } = useTranslation();
    const {weekStart, setWeekStart, eventView, setEventView} = useEventContext();

    const weekDays= [{dim: "M", day: "Monday"}, {dim: "Tue", day: "Tuesday"}, {dim: "W", day: "Wednesday"}, 
        {dim: "Th", day: "Thursday"}, {dim: "F", day: "Friday"}, {dim: "Sat", day: "Saturday"}, {dim: "Sun", day: "Sunday"}];
    
    const views = [{view:"Month" , value: "month"}, {view:"Week" , value: "week"}, {view:"Day" , value: "day"}, {view:"Agenda" , value: "agenda"}];

    return (
        <article className="calendar-settings">
            <h3>{t('preferences.calendar.title')}</h3>
            <hr></hr>
            <p>{t('preferences.calendar.desc')}</p>
            <section className="week-start">
                <p>{t('preferences.calendar.weekDay')}</p>
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
                <p>{t('preferences.calendar.calendarView')}</p>
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