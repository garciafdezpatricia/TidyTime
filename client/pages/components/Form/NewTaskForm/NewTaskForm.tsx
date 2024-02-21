import { useState } from "react";

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
            <input 
                placeholder="New task..." 
                onChange={(e) => handleChange(e)}
                onKeyDown={handleKeyPress}
            >
            </input>
        </form>

    )
}