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

import { useEventContext } from "../../Context/EventContext";
import { useTranslation } from 'react-i18next';



export default function CalendarPanel() {
    const { t } = useTranslation();
    const {weekStart, setWeekStart, eventView, setEventView} = useEventContext();

    const weekDays= [
        {dim: t('calendar.weekDays.monday.dim'), day: t('calendar.weekDays.monday.day')}, 
        {dim: t('calendar.weekDays.tuesday.dim'), day: t('calendar.weekDays.tuesday.day')},
        {dim: t('calendar.weekDays.wednesday.dim'), day: t('calendar.weekDays.wednesday.day')},
        {dim: t('calendar.weekDays.thursday.dim'), day: t('calendar.weekDays.thursday.day')},
        {dim: t('calendar.weekDays.friday.dim'), day: t('calendar.weekDays.friday.day')},
        {dim: t('calendar.weekDays.saturday.dim'), day: t('calendar.weekDays.saturday.day')},
        {dim: t('calendar.weekDays.sunday.dim'), day: t('calendar.weekDays.sunday.day')}
    ];
    
    const views = [
        {view: t('calendar.messages.month') , value: t('calendar.messages.month')},
        {view:t('calendar.messages.week') , value: t('calendar.messages.week')}, 
        {view:t('calendar.messages.day') , value: t('calendar.messages.day')}, 
        {view:t('calendar.messages.agenda') , value: t('calendar.messages.agenda')}
    ];

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
                                    title={day.day}
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
                                    title={view.view}
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