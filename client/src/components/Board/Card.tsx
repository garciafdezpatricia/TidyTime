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

import { TbArrowMoveRight } from "react-icons/tb";
import { useTaskContext } from "../Context/TaskContext";
import { useEffect, useState } from "react";

export interface CardProps {
    cardIndex: number; // card index
    title: string,
    list: string, // task list name
    taskId: string,
    columnIndex: number,
    handleMoveTask: (arg?:any, arg2?:any) => void | any;
    handleCardClick: (arg?:any) => void | any;
}

export default function Card({cardIndex, title, list, columnIndex, handleMoveTask, taskId, handleCardClick} : CardProps) {

    const {listNames, setSelectedListId, setSelectedTaskId, tasks} = useTaskContext();
    const [reRender, setRerender] = useState(Math.random());
    const [listIndex, setListIndex] = useState(-1);

    useEffect(() => {
        if (tasks) {
            setListIndex(tasks.findIndex((l) => l.key === list) ?? -1);
        }
    }, [tasks, list])

    const handleMovingTask = () => {
        if (tasks && listIndex !== -1) {
            setSelectedListId(list);
            //const taskIndex = tasks[listIndex].value.findIndex((task) => task.id === taskId) ?? -1;
            setSelectedTaskId(taskId);
            handleMoveTask(columnIndex);
        }
    }

    const handleCard = () => {
        if (tasks !== undefined && listIndex !== -1) {
            setSelectedListId(list);
            //const taskIndex = tasks[listIndex].value.findIndex((task) => task.taskIndexInList === taskIndexinList) ?? -1;
            setSelectedTaskId(taskId);
            handleCardClick()
        }
    }

    return (
        <article key={cardIndex} className="board-column-content-item">
            <div className="item-header">
                <p>#{listNames && listNames[listIndex]}</p>
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