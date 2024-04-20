import { ImCross } from "react-icons/im";
import { useTaskContext } from "../../Context/TaskContext";
import DifficultyRate from "../../DifficultyRate/DifficultyRate";
import Toggle from "../../ToggleSwitch/ToggleSwitch";
import CheckableComboBox from "../../ComboBox/CheckableComboBox";
import { useState } from "react";
import { Label, Task } from "@/src/model/Scheme";
import { MdDelete } from "react-icons/md";
import PromptModal from "../PromptModal/PromptModal";

export interface Props {
    onClose: (arg?:any) => void | any;
    isOpen: boolean,
}

export default function EditTaskModal({onClose, isOpen} : Props) {

    const {tasks, selectedListIndex, setTasks, labels, selectedTaskIndex, setSelectedTaskIndex} = useTaskContext();
    const taskToEdit = tasks[selectedListIndex][selectedTaskIndex];

    const [newTitle, setNewTitle] = useState(taskToEdit.title);
    const [newDesc, setNewDesc] = useState(taskToEdit.desc ?? "");
    const [newDifficulty, setNewDifficulty] = useState(-1);
    const [newDate, setNewDate] = useState(taskToEdit.endDate ?? "");
    const [important, setImportant] = useState(taskToEdit.important ?? false);
    const [newLabels, setLabels] = useState<Label[]>(taskToEdit.labels ?? []);
    
    const [isDeleting, setConfirmationDeleteModalOpen] = useState(false);


    const onCancel = () => {
        setNewTitle(taskToEdit.title);
        setNewDesc(prevDesc => taskToEdit.desc ?? "");
        setNewDifficulty(-1);
        setNewDate(taskToEdit.endDate ?? "");
        setImportant(taskToEdit.important ?? false)
    }

    const saveAndClose = () => {
        const updatedToDo = [...tasks];
        const updatedTask = {...taskToEdit};

        updateTask(updatedTask);

        updatedToDo[selectedListIndex] = [
            ...updatedToDo[selectedListIndex].slice(0, selectedTaskIndex),
            updatedTask,
            ...updatedToDo[selectedListIndex].slice(selectedTaskIndex + 1)
        ];
        setTasks(updatedToDo);
        onClose();
    }

    const updateTask = (task:Task) => {
        task.title = newTitle;
        task.desc = newDesc;
        task.difficulty = newDifficulty;
        task.endDate = newDate;
        task.important = important;
        task.labels = newLabels;
    }

    const handleLabels = (labels:Label[]) => {
        setLabels(labels);
    }

    const deleteTask = () => {
        const updatedToDo = [...tasks];

        updatedToDo[selectedListIndex] = [
            ...updatedToDo[selectedListIndex].slice(0, selectedTaskIndex),
            ...updatedToDo[selectedListIndex].slice(selectedTaskIndex + 1)
        ];
        setTasks(updatedToDo);
        setSelectedTaskIndex(-1);
        onClose();
    }

    return (
        isOpen && 
        <article className="edit-task-modal">
            <header className="edit-task-modal-header">
                <button 
                    title="Close"
                    onClick={onClose} 
                    className="close-button">
                        <ImCross />
                </button>
            </header>
            <section className="edit-task-modal-body">
                <section className="important">
                    <label>Urgent: </label>
                    <Toggle isChecked={important} onChange={(e) => setImportant(e)}/>
                </section>
                <section className="main-info">
                    <input 
                        className="task-title" 
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        contentEditable
                        suppressContentEditableWarning={true}
                    />
                    <textarea 
                        placeholder="Add a description..." 
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        contentEditable
                        suppressContentEditableWarning={true}
                    />
                </section>
                <section className="additional-info">
                    <section className="difficulty">
                        <label>Difficulty:</label>
                        <DifficultyRate 
                            key={newDifficulty}
                            onChange={(e) => setNewDifficulty(e)} 
                            taskRating={newDifficulty !== -1 ? newDifficulty : taskToEdit.difficulty} 
                            newDifficulty={newDifficulty}/>
                    </section>
                    <hr />
                    <section className="date-picker">
                        <label>End-date:</label>
                        <input 
                            type="date" 
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                        />
                    </section>
                    <hr />
                    <section className="label-picker">
                        <label>Labels:</label>
                        <CheckableComboBox checkedLabels={taskToEdit.labels ?? []} onChange={handleLabels} text={"Select options:"}/>
                    </section>
                    <section className="labels">
                    {
                        newLabels.map((label, index) => {
                            return (
                                <label style={{borderColor: label.color}} key={index}>{label.name}</label>
                            )
                        })
                    }
                    </section>
                </section>
            </section>
            <section className="edit-task-modal-footer">
                <button
                    onClick={() => setConfirmationDeleteModalOpen(true)}
                    className="delete-task">
                    <MdDelete />
                    Delete
                </button>
                <button 
                    className="cancel"
                    onClick={onCancel}>
                    Reset
                </button>
                <button
                    className="save"
                    onClick={saveAndClose}>
                    Save
                </button>
            </section>
            {
                isDeleting && 
                <PromptModal
					title="Are you sure you want to delete this task? This action can't be undone"
					onPrimaryAction={() => deleteTask()}
					primaryActionText='Delete'
					secondaryActionText='Cancel'
					onSecondaryAction={() => setConfirmationDeleteModalOpen(false)}
					variant='confirmation-modal'
					backdrop
				></PromptModal>
            }
        </article>        
    )
}