import { useEffect, useState } from "react";
import Column from "./Column";
import { useTaskContext } from "../Context/TaskContext";
import MoveModal from "../Modal/AbsoluteModal/AbsoluteModal";
import { BiAddToQueue } from "react-icons/bi";
import { Task, TaskList } from "@/src/model/Scheme";
import { useInruptHandler } from "@/pages/api/inrupt";


export interface Props {
    handleCardClick: (arg?:any) => void | any;
}

export default function Board({handleCardClick} : Props) {

    const {tasks, boardColumns, setBoardColumns, setTasks, selectedListId, selectedTaskId} = useTaskContext();
    const {updateTaskStatus, storeBoardColumns} = useInruptHandler();

    const [sectionWidth, setSectionWidth] = useState(100 / (boardColumns ? boardColumns.length : 1));
    const [columnIndex, setColumnIndex] = useState(-1);
    const [cardIndex, setCardIndex] = useState(-1);
    const [isMovingTask, setIsMovingTask] = useState(false);
    const [boardItems, setBoardItems] = useState<any[]>([]);

    useEffect(() => {
        setSectionWidth(100 / (boardColumns ? boardColumns.length : 1));
    }, [boardColumns])

    useEffect(() => {
        mapTasksToColumns();
    }, [tasks]);


    const mapTasksToColumns = () => {
        let result: Task[][] = [[]];
        tasks?.forEach((taskList, listIndex) => {
            taskList.value.forEach((task, taskIndex) => {
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

    const moveTask = async (target: number) => {
        if (tasks) {
            const newTasks = [...tasks];
            const listIndex = tasks.findIndex((list) => list.key === selectedListId);
            const taskIndex = tasks[listIndex].value.findIndex((task) => task.id === selectedTaskId);
            const taskToMove = {...tasks[listIndex].value[taskIndex]};
            taskToMove.status = target;
            await updateTaskStatus(taskToMove);
            newTasks[listIndex].value = [
                ...newTasks[listIndex].value.slice(0, taskIndex),
                taskToMove,
                ...newTasks[listIndex].value.slice(taskIndex + 1)
            ];
            setTasks(newTasks);
            setIsMovingTask(false);
        }
    }

    const handleCreateNewColumn = async () => {
        const newColumns = [...boardColumns, "New column"];
        setBoardColumns(newColumns);
        await storeBoardColumns(newColumns);
    }

    return (
        <article className="board-section">
            <section className="board-button-section">
                <p>See your progress using the board!
                </p>
                <button 
                    className="add-column-button"
                    onClick={handleCreateNewColumn}
                >
                    <BiAddToQueue />
                    Add new column
                </button>
            </section>
            <section className={boardColumns && boardColumns.length > 0 ? "board-board" : "board-board-empty"}>
                {
                    boardColumns && boardColumns.length > 0 ?
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
                    options={boardColumns ?? []} 
                    columnIndex={columnIndex}
                    cardIndex={cardIndex}
                    onClick={moveTask} 
                    onClose={() => setIsMovingTask(false)}
                />
            }
        </article>
    )
}