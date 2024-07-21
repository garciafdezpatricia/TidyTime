// Copyright 2024 Patricia García Fernández.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Task } from "@/src/model/Scheme";
import { useTaskContext } from "../Context/TaskContext";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';

export default function SearchBar() {
    const { t } = useTranslation();
    const { tasks, setSelectedListId, setSelectedTaskId } = useTaskContext();

    const [result, setResult] = useState<Task[]>([]);
    const [search, setSearch] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const resultsContainerRef = useRef(null);


    const searchTasks = (searchString: string) => {
        if (tasks) {
            if (tasks.every((list) => !list.value || list.value.length === 0)) {
                return [];
            }
            return tasks.map((list) => {
                return list.value.filter((task) => task.title.toLowerCase().includes(searchString.toLowerCase()));
            }).flat();
        } 
        return [];
    }

    const handleKeyDown = (e:any) => {
        if (e.key === 'ArrowDown' && result.length > 0) {
            setSelectedIndex((prevIndex) => {
                if (prevIndex === result.length - 1) {
                    // If the last item is selected and arrow down is pressed, scroll to the top
                    // @ts-ignore
                    resultsContainerRef.current.scrollTop = 0;
                    return 0;
                }
                return (prevIndex + 1) % result.length;
            });
        } else if (e.key === 'ArrowUp' && result.length > 0) {
            setSelectedIndex((prevIndex) => {
                if (prevIndex === 0) {
                    // If the first item is selected and arrow up is pressed, scroll to the bottom
                    // @ts-ignore
                    resultsContainerRef.current.scrollTop = resultsContainerRef.current.scrollHeight;
                    return result.length - 1;
                }
                return (prevIndex - 1 + result.length) % result.length;
            });
        } else if (e.key === 'Enter' && selectedIndex !== -1 && result.length > 0) {
            selectTask(result[selectedIndex]);
        }

        if (resultsContainerRef.current && selectedIndex !== -1) {
            // @ts-ignore
            if (resultsContainerRef.current.children[selectedIndex]) {
                // @ts-ignore
                resultsContainerRef.current.children[selectedIndex].scrollIntoView({
                    behavior: 'auto',
                    block: 'center',
                });
            }
        }
    };

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
        setSelectedListId(task.listIndex);
        setSelectedTaskId(task.id);
    }

    return (
        <div className="search-bar-container">
            <input
                type="search"
                title={t('list.search')}
                placeholder={t('list.search')}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
            >
            </input>
            {result.length > 0 && <div className="search-result" ref={resultsContainerRef}>
                {
                    result.map((task, index) => (
                        <p 
                            key={index} 
                            className="result-item"
                            onClick={() => selectTask(task)}
                            style= {{backgroundColor: selectedIndex === index ? "#D5E2D6" : "", textDecoration: task.done ? 'line-through' : 'none'}}
                        >
                            {task.title}
                        </p>
                    ))
                }
            </div>}
        </div>
    );
}