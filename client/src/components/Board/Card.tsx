import { TbArrowMoveRight } from "react-icons/tb";
import { useTaskContext } from "../Context/TaskContext";

export interface CardProps {
    cardIndex: number; // card index
    title: string,
    list: string, // task list name
    columnIndex: number,
    handleMoveTask: (arg?:any, arg2?:any) => void | any;
}

export default function Card({cardIndex, title, list, columnIndex, handleMoveTask} : CardProps) {

    const {setBoardItems, boardColumns} = useTaskContext();

    return (
        <article key={cardIndex} className="board-column-content-item">
            <div className="item-header">
                <p>#{list}</p>
                <div className="move-to-icon">
                    <TbArrowMoveRight 
                        onClick={() => handleMoveTask(columnIndex, cardIndex)} 
                        size={"1.2rem"} 
                        className="move-to-icon-icon" 
                        title="Move task"
                        cursor={"pointer"}
                        />
                </div>
            </div>
            <p className="item-content">{title}</p>
        </article>
    )
}