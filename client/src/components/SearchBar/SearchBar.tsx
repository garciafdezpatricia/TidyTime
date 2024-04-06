import { Task } from "@/src/task/Scheme";
import { useTaskContext } from "../Context/TaskContext";
import { useEffect, useState } from "react";


export default function SearchBar() {

    const { todo } = useTaskContext();

    const [result, setResult] = useState<Task[]>([]);
    const [search, setSearch] = useState("");

    const searchTasks = (searchString: string) => {
        return todo.flat().filter((task) => task.title.toLowerCase().includes(searchString.toLowerCase()));
    }

    useEffect(() => {
        if (search !== "") {
            const filteredTasks = searchTasks(search);
            setResult(filteredTasks);
        } else {
            setResult([]);
        }
    }, [search])

    return (
        <div className="search-bar-container">
            <input
                type="text"
                placeholder="Search"
                onChange={(e) => setSearch(e.target.value)}
            >
            </input>
            {result.length > 0 && <div className="search-result">
                {
                    result.map((task, index) => (<p key={index} className="result-item">{task.title}</p>))
                }
            </div>}
        </div>
    );
}