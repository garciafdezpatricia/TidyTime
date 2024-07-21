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

import { useTranslation } from "react-i18next";
import ComboBox from "../ComboBox/ComboBox";
import { MutableRefObject, useState } from "react";

export interface Props {
    startDate?: Date, //yyyy-mm-ddThh:mm
    endDate?: Date, //yyyy-mm-ddThh:mm
    titleRef: MutableRefObject<any>,
    infoRef: MutableRefObject<any>,
    fromDateRef: MutableRefObject<any>,
    toDateRef: MutableRefObject<any>,
    onColorChange: (arg?:any) => void | any; 
}

export default function NewEventForm({startDate, endDate, titleRef, infoRef, fromDateRef, toDateRef, onColorChange} : Props) {
    const { t } = useTranslation();
    const start = startDate 
        ? new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16) 
        : "";
    const end = endDate
    ? new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16) 
    : "";  
    const [selectedColor, setSelectedColor] = useState("#3E5B41");

    const handleOptionChange = (color:string) => {
        setSelectedColor(color);
        onColorChange(color);
    }

    return (
        <article className="new-event-form">
            <input ref={titleRef} placeholder={t('calendar.calendarMenu.addEvent.addTitle')} type="text" />
            <textarea ref={infoRef} placeholder={t('calendar.calendarMenu.addEvent.addNotes')} />
            <label>{t('calendar.calendarMenu.addEvent.from')}
                <input ref={fromDateRef} type="datetime-local" defaultValue={start} data-testid='from-date' /> 
            </label>
            <label>{t('calendar.calendarMenu.addEvent.to')}
                <input ref={toDateRef} type="datetime-local" defaultValue={end} data-testid='to-date' /> 
            </label>
            <ComboBox 
                text={t('calendar.calendarMenu.addEvent.color')}
                colors={["#e13535", "#d37373", "#ffa500", "#3E5B41", "#3bb4ff"]}
                checkedOption={""}   
                onOptionChange={handleOptionChange} 
            />
        </article>
    )
}