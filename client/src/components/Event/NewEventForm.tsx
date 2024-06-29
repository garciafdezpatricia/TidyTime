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
            <label>{t('calendar.calendarMenu.addEvent.from')}<input ref={fromDateRef} type="datetime-local" defaultValue={start} /> </label>
            <label>{t('calendar.calendarMenu.addEvent.to')}<input ref={toDateRef} type="datetime-local" defaultValue={end} /> </label>
            <ComboBox 
                text={t('calendar.calendarMenu.addEvent.color')}
                colors={["#e13535", "#d37373", "#ffa500", "#3E5B41", "#3bb4ff"]}
                checkedOption={""}   
                onOptionChange={handleOptionChange} 
            />
        </article>
    )
}