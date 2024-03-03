import { useRef, useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";

export interface Props {
    onSubmit: (arg?:any) => void | any;
}

export default function NewTaskForm(props : Props) {

    // use a reference instead of state: we don't want to rerender everytime we type in the input
    const newTask = useRef(null);
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
        props.onSubmit(newTask.current.value); // Llamar a la función onSubmit pasada como prop
        // @ts-ignore
        newTask.current.value = '';
        }
    }

    return (
        <form className="create-task-form" >
            {// TODO: add onclick handler to the icon (create task too)
            }
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