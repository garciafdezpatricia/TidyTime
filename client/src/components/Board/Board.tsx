import { useEffect, useState } from "react";
import Column from "./Column";
import { useTaskContext } from "../Context/TaskContext";
import MoveModal from "../Modal/AbsoluteModal/AbsoluteModal";



export default function Board() {

    const {boardItems, boardColumns, setBoardColumns, setBoardItems} = useTaskContext();

    //const [columnContent, setColumnContent] = useState(boardItems) // by default all tasks to to-do list
    const [sectionWidth, setSectionWidth] = useState(100 / boardColumns.length);
    const [columnIndex, setColumnIndex] = useState(-1);
    const [cardIndex, setCardIndex] = useState(-1);
    const [isMovingTask, setIsMovingTask] = useState(false);

    useEffect(() => {
        setSectionWidth(100 / boardColumns.length);
    }, [boardColumns])

    const handleMoveTask = (columnIndex:number, cardIndex:number) => {
        setIsMovingTask(!isMovingTask);
        setColumnIndex(columnIndex);
        setCardIndex(cardIndex);
    }

    const moveTask = (target: number) => {
        setBoardItems((prevBoardItems) => {
            // Copiar el estado anterior para mantener la inmutabilidad
            const newBoardItems = [...prevBoardItems];
            
            // Obtener la tarea que se va a mover
            const taskToMove = {...newBoardItems[columnIndex][cardIndex]};
            
            // Actualizar el estado de la tarea
            taskToMove.status = target;

            // Eliminar la tarea de la columna de origen
            newBoardItems[columnIndex] = newBoardItems[columnIndex].filter((_, index) => index !== cardIndex);

            // Agregar la tarea a la columna de destino
            if (!newBoardItems[target]) {
                newBoardItems[target] = [];
            }
            newBoardItems[target].push(taskToMove);
            return newBoardItems;
        });
        setIsMovingTask(false);
    }

    return (
        <article className="board-section">
            <section className="board-button-section">
                <p>Organize your tasks and see your progress using the board view!
                </p>
                <button 
                    className="add-column-button"
                    onClick={() => setBoardColumns([...boardColumns, "New column"])}
                >Add new column</button>
            </section>
            <section className={boardColumns.length > 0 ? "board-board" : "board-board-empty"}>
                {
                    boardColumns.length > 0 ?
                    boardColumns.map((column, index) => {
                        return (
                            <Column 
                                key={index}
                                index={index}
                                sectionWidth={sectionWidth} 
                                content={boardItems[index] ?? []} 
                                name={column} 
                                handleMoveTask={handleMoveTask}
                            />
                        )
                    })
                    :
                    <p className="empty-board">No columns yet... add a new one</p>
                }
            </section>
            { isMovingTask && 
                <MoveModal 
                    options={boardColumns} 
                    columnIndex={columnIndex}
                    cardIndex={cardIndex}
                    onClick={moveTask} 
                    onClose={() => setIsMovingTask(false)}
                />
            }
        </article>
    )
}