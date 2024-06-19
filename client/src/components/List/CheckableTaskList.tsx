import { useEffect, useState } from "react";
import { useTaskContext } from "@/src/components/Context/TaskContext";
import { Task } from "@/src/model/Scheme";
import Difficulty from "../../../src/components/DifficultyRate/Difficulty";
import { IoIosArrowDropdownCircle, IoMdClose } from "react-icons/io";

export interface Props {
    selectedTasks: Task[],
    handleTaskCheck: (task:Task) => void
}


export default function CheckableTaskList({ selectedTasks, handleTaskCheck} : Props) {

    const { tasks, listNames } = useTaskContext();
   
    const [flatTasks, setFlatTasks] = useState<Task[]>([]);
    const [isOpenLists, setOpenLists] = useState(false);
    const [selectedListIndex, setSelectedListIndex] = useState(-1);

    const handleListSelection = (index:number) => {
        setSelectedListIndex(index);
        let listId = tasks?.at(index)?.key ?? "";
        if (listId !== "") {
            showTasksFromList(listId);
        }
        setOpenLists(false);
    }

    const showTasksFromList = (id:string) => {
        if (tasks) {
            let result: Task[] = [];
            let list = tasks.find((taskList) => taskList.key === id)
            if (list) {
                list.value.forEach((task) => {
                    if (!task.done) {
                        result.push(task);
                    }
                })
            }
            setFlatTasks(result);
        }
    }

    useEffect(() => {
        if (listNames && listNames.length > 0 && selectedListIndex === -1) {
            handleListSelection(0);
        }
    }, [listNames])


    return (
        <>
            <div className="get-done-tasks">
                <p className="get-done-p">Tasks to get done:</p>
                <section>
                    <div className="list-combobox">
                        <div onClick={() => setOpenLists(!isOpenLists)}>
                            <p>{selectedListIndex >= 0 ? listNames?.at(selectedListIndex) : 'Task lists'}</p>
                            <IoIosArrowDropdownCircle cursor="pointer" />
                        </div>
                    </div>
                    <div className={`list-drop-down-${isOpenLists && listNames ? 'visible' : 'hidden'}`}>
                        {listNames && (
                            listNames?.length > 0 
                            ? listNames.map((list, index) => (
                                <label 
                                    key={index} 
                                    onClick={() => handleListSelection(index)}
                                    className={`${selectedListIndex === index ? 'selected-list' : ''}`}
                                >
                                    {list}
                                </label>
                            )) 
                            : <p>No lists to show</p>
                        )}
                    </div> 
                </section>
            </div>
            <section className={`selected-list-tasks${flatTasks.length <= 0 ? '-empty' : ''}`}>
            {
                flatTasks && 
                (
                    flatTasks.length > 0 
                    ? flatTasks.map((task, index) => {
                        return (
                            <label 
                                className= {
                                    selectedTasks.findIndex((candidate:Task) => task.id === candidate.id) !== -1
                                    ? `selected-list-tasks-item-selected` 
                                    : 'selected-list-tasks-item'
                                }
                                key={index} 
                                onClick={() => handleTaskCheck(task)}
                            >
                                <p className="task-title">{ task.title} </p>
                                <p className="due-date">{ task.endDate ? `${new Date(task.endDate).toLocaleDateString()}` : ''}</p>
                                <p className="difficulty-assigned">
                                    { task.difficulty !== undefined && task.difficulty > 0
                                    ? <><Difficulty difficulty={task.difficulty} color="#879C89"/> </> 
                                    : ''}
                                </p>
                                
                            </label>
                        )
                    })
                    : <p>No tasks to show</p>
                )
            }
            </section>
        </>
    )
}

export function TasksPreview({ selectedTasks, handleTaskCheck } : Props) {

    return (
        <section className="tasks-preview">
            {
                selectedTasks.map((task, index) => {
                    return (
                        <div key={index} className="task-container">
                            <p>{task.title}</p>
                            <IoMdClose 
                                size={"1.2rem"} 
                                className="task-delete" 
                                onClick={() => handleTaskCheck(task)}
                            />
                        </div>
                    )
                })
            }
        </section>
    )
}