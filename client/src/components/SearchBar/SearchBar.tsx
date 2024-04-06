import { Task } from "@/src/task/Scheme";
import { useTaskContext } from "../Context/TaskContext";
import { useEffect, useState } from "react";

export default function SearchBar() {

    const { tasks, setSelectedListIndex, setSelectedTaskIndex, selectedListIndex, selectedTaskIndex } = useTaskContext();

    const [result, setResult] = useState<Task[]>([]);
    const [search, setSearch] = useState("");

    const searchTasks = (searchString: string) => {
        return tasks.flat().filter((task) => task.title.toLowerCase().includes(searchString.toLowerCase()));
    }

    useEffect(() => {
        if (search !== "") {
            const filteredTasks = searchTasks(search);
            setResult(filteredTasks);
        } else {
            setResult([]);
        }
    }, [search])

    const selectTask = (task: Task) => {
        setSearch("");
        setSelectedListIndex(task.listIndex);
        const taskIndex = tasks[task.listIndex].findIndex(item => item === task);
        if (taskIndex !== -1) {
            window.location.assign(`#list${task.listIndex}?item${taskIndex}`)
            setSelectedTaskIndex(taskIndex);
        }
    }

    return (
        <div className="search-bar-container">
            <input
                type="search"
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
            >
            </input>
            {result.length > 0 && <div className="search-result">
                {
                    result.map((task, index) => (
                        <p 
                            key={index} 
                            className="result-item"
                            onClick={() => selectTask(task)}
                        >
                            {task.title}
                        </p>
                    ))
                }
            </div>}
        </div>
    );
}