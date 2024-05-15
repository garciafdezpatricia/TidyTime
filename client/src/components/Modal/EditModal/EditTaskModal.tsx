import { ImCross } from "react-icons/im";
import { useTaskContext } from "../../Context/TaskContext";
import DifficultyRate from "../../DifficultyRate/DifficultyRate";
import Toggle from "../../ToggleSwitch/ToggleSwitch";
import CheckableComboBox from "../../ComboBox/CheckableComboBox";
import { useEffect, useState } from "react";
import { Label, Task } from "@/src/model/Scheme";
import { MdDelete } from "react-icons/md";
import PromptModal from "../PromptModal/PromptModal";
import { TbEyeShare } from "react-icons/tb";
import { useGithubHandler } from "@/pages/api/github";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { useInruptHandler } from "@/pages/api/inrupt";

export interface Props {
    onClose: (arg?:any) => void | any;
    isOpen: boolean,
}

export default function EditTaskModal({onClose, isOpen} : Props) {

    const {tasks, selectedListId, setTasks, labels, selectedTaskId, setSelectedTaskId} = useTaskContext();
    const taskToEdit = tasks?.find((list) => list.key === selectedListId)?.value.find((task) => task.id === selectedTaskId);

    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newDifficulty, setNewDifficulty] = useState(-1);
    const [newDate, setNewDate] = useState("");
    const [important, setImportant] = useState(false);
    const [newLabels, setLabels] = useState<Label[]>([]);
    const [newStatus, setNewStatus] = useState(false);
    
    const [isDeleting, setConfirmationDeleteModalOpen] = useState(false);

    const {updateIssue, openIssue, closeIssue} = useGithubHandler();
    const { updateTask, deleteTask } = useInruptHandler();

    useEffect(() => {
        if (taskToEdit) {
            setNewTitle(taskToEdit.title);
            setNewDesc(taskToEdit.desc ?? "");
            setNewDate(taskToEdit.endDate ?? "");
            setImportant(taskToEdit.important ?? false);
            setLabels(taskToEdit.labels ?? []);
            setNewStatus(taskToEdit.done);
        }
    }, [taskToEdit])

    const onCancel = () => {
        if (taskToEdit) {
            setNewTitle(taskToEdit.title);
            setNewDesc(prevDesc => taskToEdit.desc ?? "");
            setNewDifficulty(-1);
            setNewDate(taskToEdit.endDate ?? "");
            setImportant(taskToEdit.important ?? false)
            setNewStatus(taskToEdit.done);
        }
    }

    const saveAndClose = async () => {
        if (tasks && taskToEdit) {
            const updatedToDo = [...tasks];
            const updatedTask = {...taskToEdit};
            const isDone = updatedTask.done;

            updateTaskFields(updatedTask);
            await updateTask(updatedTask);
            const listIndex = tasks.findIndex((list) => list.key === selectedListId);
            const taskIndex = tasks[listIndex].value.findIndex((task) => task.id === selectedTaskId);

            updatedToDo[listIndex].value = [
                ...updatedToDo[listIndex].value.slice(0, taskIndex),
                updatedTask,
                ...updatedToDo[listIndex].value.slice(taskIndex + 1)
            ];
            setTasks(updatedToDo);
            if (updatedTask.githubUrl) {
                await updateIssue(updatedTask.githubUrl, newTitle, newDesc);
                if (isDone !== updatedTask.done) {
                    isDone   
                    ? await openIssue(updatedTask.githubUrl) // was closed so now it must be open
                    : await closeIssue(updatedTask.githubUrl); // was open so now it must be closed
                }
            }
            setSelectedTaskId('');
            onClose();
        }
    }

    const updateStatus = async () => {
        setNewStatus(!newStatus);
    }

    const updateTaskFields = (task:Task) => {
        task.title = newTitle;
        task.desc = newDesc;
        task.difficulty = newDifficulty;
        task.endDate = newDate;
        task.important = important;
        task.labels = newLabels;
        task.done = newStatus;
    }

    const handleLabels = (labels:Label[]) => {
        setLabels(labels);
    }

    const handleDeleteTask = async () => {
        if (tasks) {
            const updatedToDo = [...tasks];
            const listIndex = tasks.findIndex((list) => list.key === selectedListId);
            const taskIndex = tasks[listIndex].value.findIndex((task) => task.id === selectedTaskId);
            const taskToDelete = updatedToDo[listIndex].value[taskIndex];
            await deleteTask(taskToDelete);

            updatedToDo[listIndex].value = [
                ...updatedToDo[listIndex].value.slice(0, taskIndex),
                ...updatedToDo[listIndex].value.slice(taskIndex + 1)
            ];
            setTasks(updatedToDo);
            setSelectedTaskId('');
            onClose();
        }
    }

    const handleCloseTab = () => {
        setSelectedTaskId('');
        onClose();
    }

    return (
        <>
        <div className="backdrop"></div>
        {isOpen && taskToEdit &&
            <article className="edit-task-modal">
                <header className="edit-task-modal-header">
                    {
                        taskToEdit.githubHtml &&
                        <a className="edit-event-header-button" title="See in GitHub" href={taskToEdit.githubHtml} target="_blank" rel="noopener noreferrer">
                            <TbEyeShare color="#363535" size={"1.2rem"} />
                        </a>
                    }
                    <button 
                        onClick={updateStatus}
                        className="done-undone">
                        {!newStatus ? (<><FaRegCircle />To do</>) : (<><FaCheckCircle />Done</>)}
                    </button>
                    <button 
                        title="Close"
                        onClick={handleCloseTab} 
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
                        onPrimaryAction={() => handleDeleteTask()}
                        primaryActionText='Delete'
                        secondaryActionText='Cancel'
                        onSecondaryAction={() => setConfirmationDeleteModalOpen(false)}
                        variant='confirmation-modal'
                        backdrop
                    ></PromptModal>
                }
            </article>}     
        </>   
    )
}