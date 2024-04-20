import { TbArrowMoveRight } from "react-icons/tb";
import { useTaskContext } from "../Context/TaskContext";

export interface CardProps {
    cardIndex: number; // card index
    title: string,
    list: number, // task list name
    taskIndexinList: number,
    columnIndex: number,
    handleMoveTask: (arg?:any, arg2?:any) => void | any;
    handleCardClick: (arg?:any) => void | any;
}

export default function Card({cardIndex, title, list, columnIndex, handleMoveTask, taskIndexinList, handleCardClick} : CardProps) {

    const {listNames, setSelectedListIndex, setSelectedTaskIndex} = useTaskContext();

    const handleMovingTask = () => {
        setSelectedListIndex(list);
        setSelectedTaskIndex(taskIndexinList);
        handleMoveTask(columnIndex);
    }

    const handleCard = () => {
        setSelectedListIndex(list);
        setSelectedTaskIndex(taskIndexinList);
        handleCardClick()
    }

    return (
        <article key={cardIndex} className="board-column-content-item">
            <div className="item-header">
                <p>#{listNames[list]}</p>
                <div className="move-to-icon">
                    <TbArrowMoveRight 
                        onClick={handleMovingTask} 
                        size={"1.2rem"} 
                        className="move-to-icon-icon" 
                        title="Move task"
                        cursor={"pointer"}
                    />
                </div>
            </div>
            <p onClick={handleCard} className="item-content">{title}</p>
        </article>
    )
}