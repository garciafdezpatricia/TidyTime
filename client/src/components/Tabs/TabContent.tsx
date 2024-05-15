import { useTaskContext } from "../Context/TaskContext";
import { MdEdit } from "react-icons/md";
import { GrStar } from "react-icons/gr";
import { IoIosTimer } from "react-icons/io";
import Difficulty from "../DifficultyRate/Difficulty";
import { FaRegCircle, FaCheckCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Label, Task } from "@/src/model/Scheme";
import CheckableComboBox from "../ComboBox/CheckableComboBox";

export interface Props {
    handleCheck: (arg?:any, arg2?:any) => void | any;
    handleEditModal: (arg?:any) => void | any;
    seeDone: boolean,
}

export interface FilterSectionProps {
    handleFilter: (arg?:any) => void | any;
    sortByDate: (arg?:any) => void | any;
    sortByDifficulty: (arg?:any) => void | any;
}

export function FilterSection({handleFilter, sortByDate, sortByDifficulty} : FilterSectionProps) {

    const { tasks, selectedListId } = useTaskContext();
    const [tasksToFilter, setTasksToFilter] = useState<Task[]>([]);
    const [doneTasksCounter, setDoneTasksCounter] = useState(0);
    const [undoneTasksCounter, setUndoneTasksCounter] = useState(0);

    useEffect(() => {
        if (tasks) {
            const allTasks = tasks.map((list) =>{return list.value ? list.value : []}).flat();
            if (allTasks.length > 0) {
                setTasksToFilter(allTasks.filter((task) => task.listIndex === selectedListId))
            } else {
                setTasksToFilter([])
            }
        }
    }, [tasks, selectedListId])

    useEffect(() => {
        let done = 0;
        let undone = 0;
        tasksToFilter.reduce((acc, task) => {
            task.done ? done++ : undone++;
            return null;
        }, null)
        setDoneTasksCounter(done);
        setUndoneTasksCounter(undone);
    }, [tasksToFilter]);

    return (
        <section className="filter-section">
            <div className="task-counter">
                <p>{doneTasksCounter} done</p>
                <p>{undoneTasksCounter} to do</p>
            </div>
            <div className="task-filters">
                <CheckableComboBox 
                    variant="filter"
                    text={"Filter..."} 
                    checkedLabels={[]} 
                    onChange={handleFilter}  
                />
                <button className="sort-date" onClick={sortByDate}>Sort by due date</button>
                <button className="sort-difficulty" onClick={sortByDifficulty}>Sort by difficulty</button>
            </div>
        </section>
    )
}

export default function TabContent({ handleCheck, handleEditModal, seeDone} : Props ) {

    const {tasks, selectedListId, selectedTaskId} = useTaskContext();
    const [tasksToShow, setTasksToShow] = useState(tasks);
    const [filterApplied, setFilterApplied] = useState<Label[]>([]);

    const handleFilter = (filter: Label[]) => {
        if (filter.length > 0 && tasksToShow) {
            const listIndex = tasksToShow?.findIndex((list) => list.key === selectedListId);
            const filteredTaskList = tasksToShow[listIndex].value.filter((task) =>
                task.labels?.some((label) =>
                    filter.some((filterLabel) =>
                        filterLabel.name === label.name && filterLabel.color === label.color
                    )
                )
            ) || [];
            setFilterApplied(filter);
            const mergedTasks = tasks ? [...tasks] : [];
            mergedTasks[listIndex].value = filteredTaskList;
            setTasksToShow(mergedTasks);
        } else {
            setFilterApplied([]);
            setTasksToShow(tasks);
        }
    }

    const sortByDate = () => {
        if (tasks) {
            const listIndex = tasks.findIndex((list) => list.key === selectedListId);
            const orderedTaskList = tasks[listIndex]?.value.
            sort((task1, task2) => {
                if (task1.endDate && task2.endDate) {
                    return new Date(task1.endDate).getTime() - new Date(task2.endDate).getTime();
                } else if (task1.endDate) {
                    return -1; // Las tareas con fecha van primero
                } else if (task2.endDate) {
                    return 1; // Las tareas sin fecha van después
                } else {
                    return 0; // Ambas tareas sin fecha se consideran iguales
                }
            });
        const mergedTasks = [...tasks];
        mergedTasks[listIndex].value = orderedTaskList;
        setTasksToShow(mergedTasks);
        }
    }

    const sortByDifficulty = () => {
        if (tasks) {
            const index = tasks?.findIndex((list) => list.key === selectedListId);
            const orderedTaskList = tasks[index].value.
                sort((task1, task2) => {
                    if (task1.difficulty && task2.difficulty) {
                        return task1.difficulty - task2.difficulty;
                    } else if (task1.difficulty) {
                        return 1; // Las tareas con dificultad van después
                    } else if (task2.difficulty) {
                        return -1; // Las tareas sin dificultad van primero
                    } else {
                        return 0; // Ambas tareas sin dificultad se consideran iguales
                    }
                });
                const mergedTasks = [...tasks];
                mergedTasks[index].value = orderedTaskList;
                setTasksToShow(mergedTasks);
        }
    }

    useEffect(() => {
        if (filterApplied){
            handleFilter(filterApplied);
        } else {
            setTasksToShow(tasks);
        }
    }, [tasks, tasksToShow]);

    return (
        <section className={tasks && tasks.length > 0 ? 'tab-content-container': 'tab-content-empty'}>
            {
                tasks && tasks.length > 0 
                ? <FilterSection handleFilter={handleFilter} sortByDate={sortByDate} sortByDifficulty={sortByDifficulty}/>
                : <p className="empty-tab-title">Add task lists!</p>
            }
				{tasksToShow && tasksToShow.map((content, index) => (
					<ul className={tasksToShow.findIndex((list) => list.key === selectedListId) === index ? "active-content" : "content"} key={index}>
						{content.value && content.value.map((item, itemIndex) => {
							if (item.done && !seeDone) {
								return null;
							}
							return (
								<li
									className={`${item.done ? "task-done" : "task"} ${selectedTaskId === item.id ? "selected-task" : ""}`}
									key={itemIndex}
								>
									<div className='icon-container'>
										<FaRegCircle
											className={item.done ? "circle-disappear" : ""}
											onClick={(e) => handleCheck(item, itemIndex)}
										/>
										<FaCheckCircle
											className={item.done ? "" : "circle-disappear"}
											onClick={(e) => handleCheck(item, itemIndex)}
										/>
									</div>
									<div className='task-content'>
										<h4>{item.title}</h4>
									</div>
									<div className="task-properties">
										<p className="end-date" title={item.endDate} >
											{
												item.endDate && <IoIosTimer size={"1.2rem"} />
											}
										</p>
										<p className="difficulty" title="difficulty">
											<Difficulty difficulty={item.difficulty ?? 0} />
										</p>
										<p className="important" title="important">
											{
												item.important && <GrStar size={"1.2rem"} color="orange"/>
											}
										</p>
										<div className="task-labels">
											{
												item.labels?.map((label, index) => {
													return (
														<label 
															key={index} 
															style={{borderColor: label.color}}>
														{label.name}
														</label>
													)
												})
											}
										</div>
									</div>
									<MdEdit
										className="edit-icon"
										onClick={() => handleEditModal(item.id)}
									/>
								</li>
							);
						})}
					</ul>
				))}
			</section>
    )
}