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

import { useRef } from "react";
import { IoIosAddCircle } from "react-icons/io";
import { useTaskContext } from "../../Context/TaskContext";
import { uuid } from "uuidv4";
import { Task } from "@/src/model/Scheme";
import { useInruptHandler } from "@/pages/api/inrupt";
import { useTranslation } from "react-i18next";

export default function NewTaskForm() {
    const { i18n, t } = useTranslation();
    // use a reference instead of state: we don't want to rerender everytime we type in the input
    const newTask = useRef(null);
    const {tasks, selectedListId, setTasks} = useTaskContext();
    const { createTask } = useInruptHandler();

    const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Verificar si la tecla presionada es Enter (código de tecla 13)
        if (e.key === 'Enter') {
            e.preventDefault(); // Evitar el comportamiento predeterminado de enviar el formulario
            await createNewTask();
        }
    };
    
    const createNewTask = async () => {
        // @ts-ignore
        if (newTask.current.value !== '') {
            // @ts-ignore
            let value = newTask.current.value;
            // @ts-ignore
            newTask.current.value = '';
            // @ts-ignore
            await addNewTask(value); // Llamar a la función onSubmit pasada como prop
        }
    }

    const addNewTask = async (e: any) => {
        if (tasks) {
            const updatedTasks = [...tasks];
            let newTask:Task = { id: uuid(), title: e, done: false, listIndex: selectedListId, status: 0 };
            updatedTasks.map((list) => {
                if (list.key === selectedListId) {
                    list.value = [newTask, ...list.value];
                    return list;
                }
                return list;
            })
            setTasks(updatedTasks);
            await createTask(newTask);
        }
	}

    return (
        <form className="create-task-form" >
            <IoIosAddCircle 
                data-testid='create-task-button'
                size={"1.5rem"} 
                cursor={"pointer"}
                color={"#000000"}
                onClick={createNewTask}/>
            <input 
                title={t('list.newTask')}
                placeholder={t('list.newTask')}
                ref={newTask} 
                type="text"
                onKeyDown={handleKeyPress}
            >
            </input>
        </form>
    )
}