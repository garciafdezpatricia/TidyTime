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

import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import ComboBox from "@/src/components/ComboBox/ComboBox";
import { IoMdClose } from "react-icons/io";
import { MdOutlineDone } from "react-icons/md";
import { TbEyeShare } from "react-icons/tb";
import { useEventContext } from "@/src/components/Context/EventContext";
import { Event } from "@/src/model/Scheme";
import { useClickAway } from "@uidotdev/usehooks";
import toast from "react-hot-toast";
import { PiWarningOctagonFill } from "react-icons/pi";
import ShareModal from "../ShareModal/ShareEventModal";
import PromptModal from "../PromptModal/PromptModal";
import { useGoogleHandler } from "@/pages/api/google";
import { useInruptHandler } from "@/pages/api/inrupt";
import { useTranslation } from "react-i18next";


export interface Props {
    onClose: (arg?:any) => void | any;
}

export default function EditEventModal({onClose} : Props) {
    const { t } = useTranslation();
    // event context utils
    const {setEvents, events, selectedEventId } = useEventContext();
    const { updateEvent, deleteEvent } = useInruptHandler();
    const { updateAndSaveEvent } = useGoogleHandler();

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
    const [isSavingEvent, setIsSavingEvent] = useState(false);
    const [deletingEvent, setDeletingEvent] = useState(false);

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
    const updateEventValues = (event:Event, valuesToChange:{title: string, desc: string, start: string, end: string, color: string}) => {
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
        return updateAndSaveEvent(eventToUpdate, googleId);
    }

    /**
     * Save changes made to the event.
     */
    const onSave = async () => {
        setIsSavingEvent(true);
        // get event to be saved
        let updatedEvents = [...events];
        const eventToUpdate = events[selectedIndex];
        // check which information changed
        const changedValues = checkChangedValues(eventToUpdate);
        if (changedValues) {
            // save correspondent information
            updateEventValues(eventToUpdate, changedValues);
            updatedEvents = [
                ...events.slice(0, selectedIndex),
                eventToUpdate,
                ...events.slice(selectedIndex + 1)
            ];
            setEvents(updatedEvents);
            await updateEvent(eventToUpdate);
            // google flow
            if (isGoogleEvent) {
                if (needToUpdateGoogle(changedValues)) {
                    const promise = updateEventOnGoogle(eventToUpdate);
                    toast.promise(promise, {
                        loading: t('toast.updating'),
                        success: t('toast.updated'), 
                        error: (err) => t('toast.googleSays') + err + "'"
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
        setIsSavingEvent(false);
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
    const onDelete = async () => {
        setDeletingEvent(true);
        const eventToUpdate = events[selectedIndex];
        await deleteEvent(eventToUpdate);
        setEvents((prevEvents) => {
			return prevEvents.filter((_, i) => i !== selectedIndex);
		});
        // close edit modal
        onClose();
        setDeletingEvent(false);
    }

    return (
        // @ts-ignore
        <article ref={ref} className="edit-event-article">
            <section className="edit-event-header">
                {isGoogleEvent && 
                    <a className="edit-event-header-button" title={t('calendar.eventPanel.buttons.google')} href={googleHtml} target="_blank" rel="noopener noreferrer">
                        <TbEyeShare color="#363535" size={"1.2rem"} />
                    </a>
                }
                <button className="edit-event-header-button" title={t('calendar.eventPanel.buttons.save')} onClick={() => onSave()}>
                    {!isSavingEvent && <MdOutlineDone color="#363535" size={"1.2rem"} />}
                    {isSavingEvent && <div className="loader"></div>}
                </button>
                <button className="edit-event-header-button" title={t('calendar.eventPanel.buttons.delete')}onClick={() => setConfirmationDeleteModalOpen(true)}>
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
                placeholder={t('calendar.eventPanel.title')}
                className="edit-event-title" 
                type="text" 
                value={newTitle} 
                onChange={(e) => setNewTitle(e.target.value)} 
            />
            <textarea 
                placeholder={t('calendar.eventPanel.notes')}
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
                    text={t('calendar.eventPanel.color')} 
                    colors={["#e13535", "#d37373", "#ffa500", "#3E5B41", "#3bb4ff"]}
                    checkedOption={ color !== "" ? color : "#3E5B41"} 
                />
            </div>
            {isConfirmationDeleteModalOpen && (
				<PromptModal
					title={t('deletePanel.title')}
					onPrimaryAction={() => onDelete()}
					primaryActionText={deletingEvent ? t('deletePanel.deleting') : t('deletePanel.delete')}
					secondaryActionText={t('deletePanel.cancel')}
					onSecondaryAction={() => setConfirmationDeleteModalOpen(false)}
					variant='confirmation-modal'
					backdrop
				></PromptModal>
			)}
        </article>
    )
}