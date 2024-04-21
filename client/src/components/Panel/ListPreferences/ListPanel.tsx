import { LuListPlus } from "react-icons/lu"
import { RiDeleteBin5Fill } from "react-icons/ri"
import { useTaskContext } from "../../Context/TaskContext"


export default function ListPanel() {

    const {labels, setLabels, showTasksInCalendar, setshowTasksInCalendar} = useTaskContext();


    const handleLabelRename = (value:string, index:number) => {
        let result = [...labels];
        let updatedColumn = result[index];
        updatedColumn.name = value;
        result = [...result.slice(0, index),
            updatedColumn,
            ...result.slice(index + 1)
        ];
        setLabels(result);
    }

    const handleLabelDeletion = (index:number) => {
        let result = labels.filter((label, labelIndex) => index !== labelIndex);
        setLabels(result);
    }

    const addNewInput = () => {
        let result = [...labels, {name: `New label ${labels.length + 1}`, color: "#000000"}];
        setLabels(result);
    }

    const handleLabelColor = (color:string, index:number) => {
        let result = [...labels];
        let updatedColumn = result[index];
        updatedColumn.color = color;
        result = [...result.slice(0, index),
            updatedColumn,
            ...result.slice(index + 1)
        ];
        setLabels(result);
    }

    return (
        <article className="list-preferences">
            <h3>List preferences</h3>
            <hr></hr>
            <p>This feature allows you to conveniently access and visualize tasks with assigned due dates directly within the calendar module.</p>
            <section className="show-tasks-in-calendar">
                <p style={{fontWeight: "bold"}}>Show tasks with due date in the calendar?</p>
                <div className="show-buttons">
                    <button
                        className={showTasksInCalendar ? "active-button" : ""}
                        onClick={() => setshowTasksInCalendar(true)}>
                        Yes
                    </button>
                    <button 
                        className={showTasksInCalendar ? "" : "active-button"}
                        onClick={() => setshowTasksInCalendar(false)}>
                        No
                    </button>
                </div>
            </section>
            <p>Labels serve as tools to categorize, organize, and filter tasks within your lists. You can create, delete, and customize these labels to suit your specific requirements and preferences.</p>
            <section className="default-labels">
                <div className={labels.length > 0 ? "labels-input" : ""}>
                    {
                        labels.map((column, index) => {
                            return (
                                <div key={index} className="individual-label">
                                    <input style={{backgroundColor: column.color}}
                                        type="color"
                                        defaultValue={column.color}
                                        onChange={(e) => handleLabelColor(e.target.value, index)}
                                    />
                                    <input 
                                        type="text" 
                                        defaultValue={column.name}
                                        onChange={(e) => handleLabelRename(e.target.value, index)}
                                    />
                                    <button  
                                        onClick={() => handleLabelDeletion(index)}
                                        className="delete-label-button">
                                        <RiDeleteBin5Fill />
                                    </button>
                                </div>
                            )
                        })
                    }
                </div>
                <button 
                    onClick={addNewInput}
                    className="new-label">
                    <LuListPlus />
                </button>
            </section>
        </article>
    )
}