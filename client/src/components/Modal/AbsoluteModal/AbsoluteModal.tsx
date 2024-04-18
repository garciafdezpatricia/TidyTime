import { useClickAway } from "@uidotdev/usehooks";
import { MutableRefObject, useState } from "react";
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
        <div ref={ref} className="move-task">
            {options.length > 1 ? <p>Move task to:</p> : <p>Add columns to move your tasks!</p>}
            {
                options.map((option, index) => {
                    if (index !== columnIndex) {
                        return (
                            <div key={uuid()} className="move-button">
                                <button 
                                    onClick={() => onClick(index)} 
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