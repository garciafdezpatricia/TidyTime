import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";

export interface Props {
    onSubmit: (arg?:any) => void | any;
}

export default function NewTaskForm(props : Props) {

    const [newTask, setNewTask] = useState("");

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Verificar si la tecla presionada es Enter (código de tecla 13)
        if (e.key === 'Enter') {
            e.preventDefault(); // Evitar el comportamiento predeterminado de enviar el formulario
            if (newTask !== "") {
                props.onSubmit(newTask); // Llamar a la función onSubmit pasada como prop
            }
        }
    };

    const handleChange = (e:any) => {
        setNewTask(e.target.value);
    }

    return (
        <form className="create-task-form" >
            {// TODO: add onclick handler to the icon (create task too)
            }
            <IoIosAddCircle size={"1.5rem"} color={"#3E5B41"}/>
            <input 
                placeholder="New task..." 
                onChange={(e) => handleChange(e)}
                onKeyDown={handleKeyPress}
            >
            </input>
        </form>

    )
}