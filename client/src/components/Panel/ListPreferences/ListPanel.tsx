import { LuListPlus } from "react-icons/lu"
import { RiDeleteBin5Fill } from "react-icons/ri"
import { useTaskContext } from "../../Context/TaskContext"


export default function ListPanel() {

    const { labels, setLabels, showTasksInCalendar, setshowTasksInCalendar } = useTaskContext();


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
            <p>Create, delete, and customize tags for your tasks.</p>
            <section className="default-labels">
                {
                    labels !== undefined 
                    ?
                    <div className="labels-input">
                    {
                        labels.length > 0 ?
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
                        : <div style={{paddingInline: ".5rem"}}><p style={{fontSize: ".7rem"}}>Create a new tag!</p></div>
                    }
                    </div>
                    :
                    <div style={{display: "flex", alignItems: "center", gap: ".5rem"}}>
                        <p>Loading...</p>
                        <div className="loader"></div>
                    </div>
                }
                <button 
                    onClick={addNewInput}
                    className="new-label">
                    <LuListPlus />
                </button>
            </section>
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
        </article>
    )
}