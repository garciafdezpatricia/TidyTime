import { useRef, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { useTaskContext } from "../../Context/TaskContext";

export default function NewTaskForm() {

    // use a reference instead of state: we don't want to rerender everytime we type in the input
    const newTask = useRef(null);
    const {listNames, tasks, selectedListIndex, setListNames, setTasks} = useTaskContext();

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Verificar si la tecla presionada es Enter (código de tecla 13)
        if (e.key === 'Enter') {
            e.preventDefault(); // Evitar el comportamiento predeterminado de enviar el formulario
            createNewTask();
        }
    };
    
    const createNewTask = () => {
        // @ts-ignore
        if (newTask.current.value !== '') {
            // @ts-ignore
            addNewTask(newTask.current.value); // Llamar a la función onSubmit pasada como prop
            // @ts-ignore
            newTask.current.value = '';
        }
    }

    const addNewTask = (e: any) => {
		setTasks((prevTodo) => {
			return prevTodo.map((list, index) => {
				if (index === selectedListIndex) {
                    return [{ title: e, done: false, listIndex: selectedListIndex }, ...list];
                } 
                return list;
            });
        });
	}

    return (
        <form className="create-task-form" >
            <IoIosAddCircle 
                size={"1.5rem"} 
                color={"#3E5B41"}
                cursor={"pointer"}
                onClick={createNewTask}/>
            <input 
                placeholder="New task..."
                ref={newTask} 
                type="text"
                onKeyDown={handleKeyPress}
            >
            </input>
        </form>
    )
}