import { TaskList, Label, taskToListOfTaskList, Task } from "@/src/model/Scheme";
import { ReactNode, createContext, useContext, useState } from "react";

/**
 * Interface for the task context of the application.
 */
export interface ITaskContext {
    listNames: string[] | undefined,
    tasks: TaskList[] | undefined,
    labels: Label[] | undefined,
    setLabels: React.Dispatch<React.SetStateAction<Label[] | undefined>>,
    selectedListId: string,
    selectedTaskId: string,
    setListNames: React.Dispatch<React.SetStateAction<string[] | undefined>>,
    setTasks: React.Dispatch<React.SetStateAction<TaskList[] | undefined>>,
    setSelectedListId: React.Dispatch<React.SetStateAction<string>>,
    setSelectedTaskId: React.Dispatch<React.SetStateAction<string>>,
    boardColumns: string[] | undefined,
    setBoardColumns: React.Dispatch<React.SetStateAction<string[] | undefined>>,
    showTasksInCalendar: boolean,
    setshowTasksInCalendar: React.Dispatch<React.SetStateAction<boolean>>,
}
const tasks:Task[] = []

// TODO: check the necessity of this
const listofTasklists = taskToListOfTaskList(tasks);

const defaultContext: ITaskContext ={
    listNames: undefined,
    tasks: listofTasklists,
    labels: undefined,
    setLabels: () => {},
    selectedListId: '',
    selectedTaskId: '',
    setListNames: () => {},
    setTasks: () => {},
    setSelectedListId: () => {},
    setSelectedTaskId: () => {},
    boardColumns: undefined,
    setBoardColumns: () => {},
    showTasksInCalendar: false,
    setshowTasksInCalendar: () => {},
}
// context with the default task context
const TaskContext = createContext<ITaskContext>(defaultContext);
/**
 * Custom hook to access the task context.
 * @returns task context
 */
export function useTaskContext() {
    return useContext(TaskContext)
}
/**
 * Interface for the context provider. Only children is added by now.
 */
export interface ITaskContextProvider {
    children: ReactNode;
}
/**
 * Context provider. Makes the task context accessible for children.
 * @param children corresponds to the children of the component
 * @returns context provider
 */
export function TaskProvider({children} : ITaskContextProvider) {
    const [listNames, setListNames] = useState(defaultContext.listNames);
    const [tasks, setTasks] = useState(defaultContext.tasks);
    const [selectedListId, setSelectedListId] = useState(defaultContext.selectedListId);
    const [selectedTaskId, setSelectedTaskId] = useState(defaultContext.selectedTaskId);
    const [boardColumns, setBoardColumns] = useState(defaultContext.boardColumns);
    const [labels, setLabels] = useState(defaultContext.labels);
    const [showTasksInCalendar, setshowTasksInCalendar] = useState(defaultContext.showTasksInCalendar);

    const value ={listNames, tasks, selectedListId, setListNames, setTasks, setSelectedListId, 
        labels, setLabels, selectedTaskId, setSelectedTaskId, boardColumns, setBoardColumns, showTasksInCalendar, setshowTasksInCalendar};

    
    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    )
}

