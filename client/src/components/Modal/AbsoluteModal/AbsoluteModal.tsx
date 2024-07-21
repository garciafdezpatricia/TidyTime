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

import { useClickAway } from "@uidotdev/usehooks";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TbArrowMoveRight } from "react-icons/tb";
import { uuid } from "uuidv4";

export interface Props {
    options: any[];
    onClick: (arg?:any) => void | any;
    columnIndex: number,
    cardIndex: number,
    onClose: (arg?:any) => void | any;
}


export default function MoveModal({options, onClick, columnIndex, cardIndex, onClose} : Props) {
    const { t } = useTranslation();
    const [iconClass, setIconClass] = useState("move-icon-not-visible");
    const [buttonHovered, setButtonHovered] = useState(-1);
    const [loading, setLoading] = useState(-1);

    const ref = useClickAway(() => {
        onClose();
    })

    const handleHoverOn = (index:number) => {
        setIconClass("move-icon-visible");
        setButtonHovered(index);
    }

    const handleHoverOff = () => {
        setIconClass("move-icon-not-visible");
        setButtonHovered(-1);
    }

    const moving = async (index:number) => {
        setLoading(index);
        await onClick(index);
        setLoading(-1);
    }

    return (
        // @ts-ignore
        <div ref={ref} className="move-task">
            {options.length > 1 ? <p>{t('board.movePanel')}</p> : <p>{t('board.emptyBoard')}</p>}
            {
                options.map((option, index) => {
                    if (index !== columnIndex) {
                        return (
                            <div key={uuid()} className="move-button">
                                <button 
                                    onClick={async () => await moving(index)} 
                                    onMouseOver={() => handleHoverOn(index)}
                                    onMouseOut={() => handleHoverOff()}>
                                    {index === loading && <div className="loader"></div>}
                                    {index === loading && <span>&nbsp;</span>}
                                    {option}
                                </button>
                                <TbArrowMoveRight className={buttonHovered === index ? iconClass : "move-icon-not-visible"} size={"1.2rem"} />
                            </div>
                        )
                    }
                })
            }
        </div>
    )
}