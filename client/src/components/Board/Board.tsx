import { useEffect, useState } from "react";
import Column from "./Column";
import { useTaskContext } from "../Context/TaskContext";
import MoveModal from "../Modal/AbsoluteModal/AbsoluteModal";
import { BiAddToQueue } from "react-icons/bi";
import { TaskList } from "@/src/model/Scheme";


export interface Props {
    handleCardClick: (arg?:any) => void | any;
}

export default function Board({handleCardClick} : Props) {

    const {tasks, boardColumns, setBoardColumns, setTasks, selectedListIndex, selectedTaskIndex} = useTaskContext();

    const [sectionWidth, setSectionWidth] = useState(100 / boardColumns.length);
    const [columnIndex, setColumnIndex] = useState(-1);
    const [cardIndex, setCardIndex] = useState(-1);
    const [isMovingTask, setIsMovingTask] = useState(false);
    const [boardItems, setBoardItems] = useState<any[]>([]);

    useEffect(() => {
        setSectionWidth(100 / boardColumns.length);
    }, [boardColumns])

    useEffect(() => {
        mapTasksToColumns();
    }, [tasks]);


    const mapTasksToColumns = () => {
        let result: TaskList[] = [];
        tasks.forEach((taskList, listIndex) => {
            taskList.forEach((task, taskIndex) => {
                if (!result[task.status]) {
                    result[task.status] = [];
                }
                result[task.status].push({...task, taskIndexInList: taskIndex});
            })
        })
        setBoardItems(result);
    }

    const handleMoveTask = (columnIndex:number) => {
        setIsMovingTask(!isMovingTask);
        setColumnIndex(columnIndex);
    }

    const moveTask = (target: number) => {
        const newTasks = [...tasks];
        const taskToMove = {...tasks[selectedListIndex][selectedTaskIndex]};
        taskToMove.status = target;
        newTasks[selectedListIndex] = [
            ...newTasks[selectedListIndex].slice(0, selectedTaskIndex),
            taskToMove,
            ...newTasks[selectedListIndex].slice(selectedTaskIndex + 1)
        ];
        setTasks(newTasks);
        setIsMovingTask(false);
    }

    return (
        <article className="board-section">
            <section className="board-button-section">
                <p>See your progress using the board!
                </p>
                <button 
                    className="add-column-button"
                    onClick={() => setBoardColumns([...boardColumns, "New column"])}
                >
                    <BiAddToQueue />
                    Add new column
                </button>
            </section>
            <section className={boardColumns.length > 0 ? "board-board" : "board-board-empty"}>
                {
                    boardColumns.length > 0 ?
                    boardColumns.map((column, index) => {
                        return (
                            <Column 
                                key={index}
                                index={index}
                                sectionWidth={sectionWidth} 
                                content={boardItems[index] ?? []} 
                                name={column} 
                                handleMoveTask={handleMoveTask}
                                handleCardClick={handleCardClick}
                            />
                        )
                    })
                    :
                    <p className="empty-board">No columns yet... add a new one</p>
                }
            </section>
            { isMovingTask && 
                <MoveModal 
                    options={boardColumns} 
                    columnIndex={columnIndex}
                    cardIndex={cardIndex}
                    onClick={moveTask} 
                    onClose={() => setIsMovingTask(false)}
                />
            }
        </article>
    )
}