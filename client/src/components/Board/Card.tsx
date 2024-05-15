import { TbArrowMoveRight } from "react-icons/tb";
import { useTaskContext } from "../Context/TaskContext";

export interface CardProps {
    cardIndex: number; // card index
    title: string,
    list: string, // task list name
    taskIndexinList: number,
    columnIndex: number,
    handleMoveTask: (arg?:any, arg2?:any) => void | any;
    handleCardClick: (arg?:any) => void | any;
}

export default function Card({cardIndex, title, list, columnIndex, handleMoveTask, taskIndexinList, handleCardClick} : CardProps) {

    const {listNames, setSelectedListId, setSelectedTaskId, tasks} = useTaskContext();

    const listIndex = tasks?.findIndex((l) => l.key === list) ?? -1;

    const handleMovingTask = () => {
        if (tasks) {
            setSelectedListId(list);
            const taskIndex = tasks[listIndex].value.findIndex((task) => task.taskIndexInList === taskIndexinList) ?? -1;
            setSelectedTaskId(tasks[listIndex].value[taskIndex].id);
            handleMoveTask(columnIndex);
        }
    }

    const handleCard = () => {
        if (tasks) {
            setSelectedListId(list);
            const taskIndex = tasks[listIndex].value.findIndex((task) => task.taskIndexInList === taskIndexinList) ?? -1;
            setSelectedTaskId(tasks[listIndex].value[taskIndex].id);
            handleCardClick()
        }
    }

    return (
        <article key={cardIndex} className="board-column-content-item">
            <div className="item-header">
                <p>#{listNames[listIndex]}</p>
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