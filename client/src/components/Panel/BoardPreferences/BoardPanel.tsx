import { useEffect, useState } from "react";
import { useTaskContext } from "../../Context/TaskContext"
import { LuListPlus } from "react-icons/lu";
import { RiDeleteBin5Fill } from "react-icons/ri";

export default function BoardPanel() {

    const [columns, setColumns] = useState<string[]>([]);
    const { boardColumns, setBoardColumns } = useTaskContext();

    useEffect(() => {
        let result:string[] = [];
        boardColumns.forEach((column) => {
            result.push(column);
        })
        setColumns(result);
    }, [boardColumns])

    const handleColumnRename = (value:string, index:number) => {
        let result = [...columns];
        let updatedColumn = result[index];
        updatedColumn = value;
        result = [...result.slice(0, index),
            updatedColumn,
            ...result.slice(index + 1)
        ];
        setBoardColumns(result);
    }

    const handleColumnDeletion = (index:number) => {
        let result = columns.filter((column, columnIndex) => index !== columnIndex);
        setBoardColumns(result);
    }

    const addNewInput = () => {
        let result = [...columns, "New column"];
        setBoardColumns(result);
    }

    return (
        <article className="board-preferences">
            <h3>Board preferences</h3>
            <hr></hr>
            <p>These columns represent the current layout of the board, intended to align with the status of your tasks or any other specific criteria you wish to visually represent. You may modify, delete, or adapt them to better suit your needs.</p>
            <section className="default-columns">
                <div className={columns.length > 0 ? "columns-input" : ""}>
                    {
                        columns.map((column, index) => {
                            return (
                                <div key={index} className="individual-input">
                                    <input 
                                        type="text" 
                                        defaultValue={column}
                                        onChange={(e) => handleColumnRename(e.target.value, index)}
                                    />
                                    <button  
                                        onClick={() => handleColumnDeletion(index)}
                                        className="delete-input-button">
                                        <RiDeleteBin5Fill />
                                    </button>
                                </div>
                            )
                        })
                    }
                </div>
                <button 
                    onClick={addNewInput}
                    className="new-column">
                    <LuListPlus />
                </button>
            </section>
        </article>
    )
}