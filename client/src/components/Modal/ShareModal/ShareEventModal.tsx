import { useState } from "react";
import { useGoogleContext } from "../../Context/GoogleContext";
import { Icon } from "../../Icon/Icon";
import { useEventContext } from "../../Context/EventContext";
import toast from "react-hot-toast";
import { GrShareOption } from "react-icons/gr";
import { useGoogleHandler } from "@/src/model/google";


export interface Props {
    onClick: (arg?:any) => void | any;
    text: string;
}

export function ShareEventOption({onClick, text} : Props) {

    const { loggedIn } = useGoogleContext();
    const [exportingEvent, setExportingEvent] = useState(false);

    const handleClick = async () => {
        setExportingEvent(true);
        await onClick();
        setExportingEvent(false);
    }

    return (
        <button className="share-option-button" disabled={!loggedIn} onClick={() => handleClick()}>
            {exportingEvent && <div className="loader"></div>}
            <Icon src={"./google.svg"} alt={"Connect to Google"} />
            {text}
        </button>
    )
}

export interface ShareModalProps {
    selectedIndex: number,
}

export default function ShareModal({selectedIndex} : ShareModalProps) {

    const { exportEvent } = useGoogleHandler();

    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const exportToGoogle = async () => {
        await exportEvent(selectedIndex);
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