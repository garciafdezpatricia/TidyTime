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
import { IoMdClose } from "react-icons/io";
import { useEventContext } from "../../Context/EventContext";
import { useClickAway } from "@uidotdev/usehooks";
import { FaCheckCircle } from "react-icons/fa";


export interface Props {
    onClose: (arg?:any) => void | any,
}

export default function SeeTaskModal({onClose} : Props) {

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [dueDate, setDueDate] = useState("");
    const { events, selectedEventId } = useEventContext();

    const ref = useClickAway(() => {
        onClose();
    })

    useEffect(() => {
        events.map((event) => {
            if (event.eventId === selectedEventId) {
                setTitle(event.title);
                setDesc(event.desc);
                const startDate = new Date(event.start.getTime() - (event.start.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
                setDueDate(startDate);
                return;
            }
        })
    }, [events, selectedEventId]);

    return (
        // @ts-ignore
        <article ref={ref} className="see-task-article">
            <section className="see-task-header">
                <p className="see-task-header-title"><FaCheckCircle /> Task</p>
                <button className="see-task-close-btn" onClick={() => onClose()}>
                    <IoMdClose size={"1.2rem"} />
                </button>
            </section>
            <input 
                placeholder="Title..." 
                className="see-task-title" 
                type="text" 
                value={title} 
                contentEditable={false}
            />
            <textarea 
                placeholder="Description..." 
                className="see-task-info" 
                value={desc}
                contentEditable={false}
            />
            <input 
                className="see-task-date" 
                type="datetime-local"
                value={dueDate}
                contentEditable={false}
            />
        </article>
    )
}