import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrShareOption } from "react-icons/gr";
import ComboBox from "@/src/components/ComboBox/ComboBox";
import { IoMdClose } from "react-icons/io";
import { MdOutlineDone } from "react-icons/md";
import { useEventContext } from "@/src/components/Context/EventContext";
import { Event } from "@/src/components/Calendar/Calendar";

export interface Props {
    onClose: (arg?:any) => void | any;
    onShare?: (arg?:any) => void | any;
}


export default function EditEventModal({onClose, onShare} : Props) {
    const {setEvents, setSelectedEventId, events, selectedEventId } = useEventContext();
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newStartDate, setNewStartDate] = useState("");
    const [newEndDate, setNewEndDate] = useState("");
    const [color, setNewColor] = useState("");

    useEffect(() => {
        events.map((event, index) => {
            if (event.eventId === selectedEventId) {
                setSelectedIndex(index);
                setNewTitle(event.title);
                setNewDesc(event.desc);
                const startDate = new Date(event.start.getTime() - (event.start.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
                const endDate = new Date(event.end.getTime() - (event.end.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
                setNewStartDate(startDate);
                setNewEndDate(endDate);
                setNewColor(event.color ? event.color : "");
                return;
            }
        })
    }, []);

    const onSave = () => {
        let updatedEvents = [...events];
        const eventToUpdate = events[selectedIndex];
        
        updateEvent(eventToUpdate);
        
        updatedEvents = [
            ...events.slice(0, selectedIndex),
            eventToUpdate,
            ...events.slice(selectedIndex + 1)
        ];
        setEvents(updatedEvents);
        onClose();
    }

    const updateEvent = (event:Event) => {
        event.color = color;
        event.start = new Date(newStartDate);
        event.end = new Date(newEndDate);
        event.title = newTitle;
        event.desc = newDesc;
    }

    const handleColorChange = (newColor:string) => {
        setNewColor(newColor);
    }

    const onDelete = () => {
        setEvents((prevEvents) => {
			return prevEvents.filter((_, i) => i !== selectedIndex);
		});
        onClose();
    }

    return (
        <article className="edit-event-article">
            <section className="edit-event-header">
                <button title="Save" onClick={() => onSave()}>
                    <MdOutlineDone color="#363535" size={"1.2rem"} />
                </button>
                <button title="Delete" onClick={() => onDelete()}>
                    <RiDeleteBin6Line color="#363535" size={"1.1rem"} />
                </button>
                <button title="Share" onClick={() => onShare}>
                    <GrShareOption color="#363535" size={"1.1rem"} />
                </button>
                <button className="edit-event-close-btn" onClick={() => onClose()}>
                    <IoMdClose size={"1.2rem"} />
                </button>
            </section>
            <input 
                placeholder="New title..." 
                className="edit-event-title" 
                type="text" 
                value={newTitle} 
                onChange={(e) => setNewTitle(e.target.value)} 
            />
            <textarea 
                placeholder="Add notes..." 
                className="edit-event-info" 
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)} 
            />
            <input 
                className="edit-event-start-date" 
                type="datetime-local"
                defaultValue={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
            />
            <input 
                className="edit-event-end-date" 
                type="datetime-local"
                defaultValue={newEndDate}
                onChange={(e) => setNewEndDate(e.target.value)}
            />
            <div className="edit-event-color">
                <ComboBox
                    onChange={handleColorChange}
                    text={"Color:"} 
                    colors={["#e13535", "#d37373", "#ffa500", "#3E5B41", "#3bb4ff"]}
                    checkedOption={ color !== "" ? color : "#3E5B41"} 
                />
            </div>
        </article>
    )
}