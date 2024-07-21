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

import { useState } from "react";
import { useGoogleContext } from "../../Context/GoogleContext";
import { Icon } from "../../Icon/Icon";
import { GrShareOption } from "react-icons/gr";
import { useGoogleHandler } from "@/pages/api/google";
import { useTranslation } from "react-i18next";


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
    const { t } = useTranslation();
    const { exportEvent } = useGoogleHandler();

    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const exportToGoogle = async () => {
        await exportEvent(selectedIndex);
    }

    return (
        <div className="button-share">
            <button className="edit-event-header-button" 
                title={t('calendar.eventPanel.buttons.share')} onClick={() => setIsShareModalOpen(!isShareModalOpen)}>
                <GrShareOption color="#363535" size={"1.1rem"} />
            </button>
            { isShareModalOpen && 
                <article className="share-options">
                    <ShareEventOption 
                        onClick={exportToGoogle} 
                        text={"Google"} />
                </article>
            }
        </div>
    )
}