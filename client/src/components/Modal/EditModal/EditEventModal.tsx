import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrShareOption } from "react-icons/gr";
import ComboBox from "@/src/components/ComboBox/ComboBox";
import { IoMdClose } from "react-icons/io";
import { MdOutlineDone } from "react-icons/md";
import { TbEyeShare } from "react-icons/tb";
import { useEventContext } from "@/src/components/Context/EventContext";
import { Event } from "@/src/task/Scheme";
import { useClickAway } from "@uidotdev/usehooks";
import toast from "react-hot-toast";
import { PiWarningOctagonFill } from "react-icons/pi";
import ShareModal from "../ShareModal/ShareEventModal";
import PromptModal from "../PromptModal/PromptModal";

export interface Props {
    onClose: (arg?:any) => void | any;
}

export default function EditEventModal({onClose} : Props) {
    // event context utils
    const {setEvents, events, selectedEventId } = useEventContext();

    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newStartDate, setNewStartDate] = useState("");
    const [newEndDate, setNewEndDate] = useState("");
    const [color, setNewColor] = useState("");
    const [isGoogleEvent, setIsGoogleEvent] = useState(false);
    const [googleId, setGoogleId] = useState("");
    const [googleHtml, setGoogleHtml] = useState("");

    const [isConfirmationDeleteModalOpen, setConfirmationDeleteModalOpen] = useState(false);

    const ref = useClickAway(() => {
        onClose();
    })

    /**
     * Set the selected event data to correspondent states.
     */
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
                if (event.googleId){
                    setIsGoogleEvent(true);
                    setGoogleId(event.googleId);
                    setGoogleHtml(event.googleHTML ?? "");
                }
                return;
            }
        })
    }, [events]);
    /**
     * Auxiliary function to compare original values of the event with the ones present when the saving-event action is triggered. 
     * @param eventToUpdate contains the event to be updated
     * @returns object with the values that have changed.
     */
    const checkChangedValues = (eventToUpdate: Event) => {
        // if any value is different from the original one, set the key of the changedValues
        // object to that new value.
        const changedValues = {title: "", desc: "", start: "", end: "", color: ""};
        if (eventToUpdate.title !== newTitle) {
            changedValues.title = newTitle;
        }
        if (eventToUpdate.desc !== newDesc) {
            changedValues.desc = newDesc;
        }
        // format date to YYYY-MM-DDThh:mm:ss in correct time zone
        const startDate = new Date(eventToUpdate.start.getTime() - (eventToUpdate.start.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
        const endDate = new Date(eventToUpdate.end.getTime() - (eventToUpdate.end.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

        if (startDate !== newStartDate) {
            changedValues.start = newStartDate;
        }
        if (endDate !== newEndDate) {
            changedValues.end = newEndDate;
        }
        if (eventToUpdate.color !== color) {
            changedValues.color = color;
        }
        // check if changedValues has any new value
        const allValuesEmpty = Object.values(changedValues).every(value => value === "");
        // return null if changedValues does not have any new value
        return allValuesEmpty ? null : changedValues;
    }

    /**
     * Only need to update google event if title, desc, start date or end date changed.
     * @param valuesToChange 
     * @returns true if the google update is needed. False otherwise.
     */
    const needToUpdateGoogle = (valuesToChange:{title: string, desc: string, start: string, end: string, color: string}) => {
        // color changes do not have an influence on google update
        return valuesToChange.title !== "" || valuesToChange.desc !== "" || valuesToChange.start !== "" || valuesToChange.end !== "";

    }

    /**
     * Updates event based on the values that changed
     * @param event the event to be updated
     * @param valuesToChange the values of the event that need to be updated
     */
    const updateEvent = (event:Event, valuesToChange:{title: string, desc: string, start: string, end: string, color: string}) => {
        if (valuesToChange.title !== "") {
            event.title = valuesToChange.title;
        }
        if (valuesToChange.desc !== "") {
            event.desc = valuesToChange.desc;
        }
        if (valuesToChange.start !== "") {
            event.start = new Date(valuesToChange.start);
        }
        if (valuesToChange.end !== "") {
            event.end = new Date(valuesToChange.end);
        }
        if (valuesToChange.color !== "") {
            event.color = valuesToChange.color;
        }
    }

    /**
     * Update event on Google Calendar through API call.
     * @param eventToUpdate the event to be updated 
     */
    const updateEventOnGoogle = (eventToUpdate:Event) => {
        // format date to google format
        const ISOStartDate = new Date(new Date(eventToUpdate.start).getTime() - (new Date(eventToUpdate.start).getTimezoneOffset() * 60000)).toISOString();
        const ISOEndDate = new Date(new Date(eventToUpdate.end).getTime() - (new Date(eventToUpdate.end).getTimezoneOffset() * 60000)).toISOString();

        return fetch('http://localhost:8080/google/events/update', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                id: googleId,
                start: ISOStartDate,
                end: ISOEndDate,
                title: eventToUpdate.title,
                desc: eventToUpdate.desc,
                calendarId: eventToUpdate.googleCalendar                     
            }),
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'error'){
                throw data.value;
            }
        })
        .catch(error => {
            throw error;
        });
    }

    /**
     * Save changes made to the event.
     */
    const onSave = () => {
        // get event to be saved
        let updatedEvents = [...events];
        const eventToUpdate = events[selectedIndex];
        // check which information changed
        const changedValues = checkChangedValues(eventToUpdate);
        if (changedValues) {
            // save correspondent information
            updateEvent(eventToUpdate, changedValues);
            updatedEvents = [
                ...events.slice(0, selectedIndex),
                eventToUpdate,
                ...events.slice(selectedIndex + 1)
            ];
            setEvents(updatedEvents);
            toast.success('Saved event!', {
                position: "bottom-center"
            });
            // google flow
            if (isGoogleEvent) {
                if (needToUpdateGoogle(changedValues)) {
                    const promise = updateEventOnGoogle(eventToUpdate);
                    toast.promise(promise, {
                        loading: "Updating event...",
                        success: "Google is updated!", 
                        error: (err) => "Google says '" + err + "'"
                    }, {
                        position: "bottom-center",
                        error: {
                            icon: <PiWarningOctagonFill />
                        }
                    });
                }
            }
        }
        // close edit modal
        onClose();
    }

    /**
     * Handler for color changes.
     * @param newColor new color of the event.
     */
    const handleColorChange = (newColor:string) => {
        setNewColor(newColor);
    }

    /**
     * Deletes the event from the set of events.
     */
    const onDelete = () => {
        setEvents((prevEvents) => {
			return prevEvents.filter((_, i) => i !== selectedIndex);
		});
        toast.success('Event succesfully deleted!', {position: "bottom-center"});
        // close edit modal
        onClose();
    }

    /**
     * Exports event to Google Calendar.
     */
    const onShare = () => {
        
    }

    return (
        // @ts-ignore
        <article ref={ref} className="edit-event-article">
            <section className="edit-event-header">
                {isGoogleEvent && 
                    <a className="edit-event-header-button" title="See in Google" href={googleHtml} target="_blank" rel="noopener noreferrer">
                        <TbEyeShare color="#363535" size={"1.2rem"} />
                    </a>
                }
                <button className="edit-event-header-button" title="Save" onClick={() => onSave()}>
                    <MdOutlineDone color="#363535" size={"1.2rem"} />
                </button>
                <button className="edit-event-header-button" title="Delete" onClick={() => setConfirmationDeleteModalOpen(true)}>
                    <RiDeleteBin6Line color="#363535" size={"1.1rem"} />
                </button>
                { !isGoogleEvent &&
                    <ShareModal selectedIndex={selectedIndex} />
                }
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
                    onOptionChange={handleColorChange}
                    text={"Color:"} 
                    colors={["#e13535", "#d37373", "#ffa500", "#3E5B41", "#3bb4ff"]}
                    checkedOption={ color !== "" ? color : "#3E5B41"} 
                />
            </div>
            {isConfirmationDeleteModalOpen && (
				<PromptModal
					title="Are you sure you want to delete this list? This action can't be undone"
					onPrimaryAction={() => onDelete()}
					primaryActionText='Delete'
					secondaryActionText='Cancel'
					onSecondaryAction={() => setConfirmationDeleteModalOpen(false)}
					variant='confirmation-modal'
					backdrop
				></PromptModal>
			)}
        </article>
    )
}