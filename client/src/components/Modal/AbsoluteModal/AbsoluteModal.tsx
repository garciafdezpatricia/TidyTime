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
                                    onClick={async () => await onClick(index)} 
                                    onMouseOver={() => handleHoverOn(index)}
                                    onMouseOut={() => handleHoverOff()}>
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