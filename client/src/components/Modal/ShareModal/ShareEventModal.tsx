import { useState } from "react";
import { useGoogleContext } from "../../Context/GoogleContext";
import { Icon } from "../../Icon/Icon";
import { useEventContext } from "../../Context/EventContext";
import toast from "react-hot-toast";
import { GrShareOption } from "react-icons/gr";


export interface Props {
    onClick: (arg?:any) => void | any;
    text: string;
}

export function ShareEventOption({onClick, text} : Props) {

    const { loggedIn } = useGoogleContext();

    return (
        <button className="share-option-button" disabled={!loggedIn} onClick={() => onClick()}>
            <Icon src={"./google.svg"} alt={"Connect to Google"} />
            {text}
        </button>
    )
}

export interface ShareModalProps {
    selectedIndex: number,
}

export default function ShareModal({selectedIndex} : ShareModalProps) {

    const { events, setEvents} = useEventContext();

    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const exportToGoogle = () => {
        const eventToShare = events[selectedIndex];
        // format date to google format
        const ISOStartDate = new Date(new Date(eventToShare.start).getTime() - (new Date(eventToShare.start).getTimezoneOffset() * 60000)).toISOString();
        const ISOEndDate = new Date(new Date(eventToShare.end).getTime() - (new Date(eventToShare.end).getTimezoneOffset() * 60000)).toISOString();
        fetch('http://localhost:8080/google/events/insert', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                start: ISOStartDate,
                end: ISOEndDate,
                title: eventToShare.title,
                desc: eventToShare.desc,                     
            }),
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            addGoogleInformation(data.googleId, data.googleHTML);
            toast.success('Event exported to Google Calendar!', {position: "bottom-center"});
        })
        .catch(error => {
            toast.error(`${error}`);
        });
    }

        /**
     * Auxiliary function to add google id and google html link to the event.
     * @param googleId contains event id on google
     * @param googleHTML contains the link to the event
     */
    const addGoogleInformation = (googleId:string, googleHTML:string) => {
        // update event with google id and html
        let updatedEvents = [...events];
        let eventToUpdate = events[selectedIndex];
        eventToUpdate.googleId = googleId;
        eventToUpdate.googleHTML = googleHTML;
        updatedEvents = [
            ...events.slice(0, selectedIndex),
            eventToUpdate,
            ...events.slice(selectedIndex + 1)
        ];
        setEvents(updatedEvents);
    }

    return (
        <div className="button-share">
            <button className="edit-event-header-button" title="Share" onClick={() => setIsShareModalOpen(!isShareModalOpen)}>
                <GrShareOption color="#363535" size={"1.1rem"} />
            </button>
            { isShareModalOpen && 
                <article className="share-options">
                    <ShareEventOption onClick={exportToGoogle} text={"Export to Google"} />
                </article>
            }
        </div>
    )
}