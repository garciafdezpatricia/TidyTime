import { FaCheck } from "react-icons/fa";
import ComboBox from "../ComboBox/ComboBox";
import { MutableRefObject, useEffect, useRef } from "react";

export interface Props {
    startDate?: Date, //yyyy-mm-ddThh:mm
    endDate?: Date, //yyyy-mm-ddThh:mm
    titleRef: MutableRefObject<any>,
    infoRef: MutableRefObject<any>,
    fromDateRef: MutableRefObject<any>,
    toDateRef: MutableRefObject<any>,
}

export default function NewEventForm({startDate, endDate, titleRef, infoRef, fromDateRef, toDateRef} : Props) {

    const start = startDate 
        ? new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16) 
        : "";
    const end = endDate
    ? new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60000)).toISOString().slice(0, 16) 
    : "";  

    return (
        <article className="new-event-form">
            <input ref={titleRef} placeholder="Add a title..." type="text" />
            <textarea ref={infoRef} placeholder="Notes..." />
            <label>From:<input ref={fromDateRef} type="datetime-local" defaultValue={start} /> </label>
            <label>To:<input ref={toDateRef} type="datetime-local" defaultValue={end} /> </label>
            <ComboBox 
                text={"Color:"} 
                colors={["#e13535", "#d37373", "#ffa500", "#3E5B41", "#3bb4ff"]}
                checkedOption={""} 
            />
        </article>
    )
}