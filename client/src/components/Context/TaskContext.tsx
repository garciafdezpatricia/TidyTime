import { TaskList, Label, taskToListOfTaskList } from "@/src/task/Scheme";
import { ReactNode, createContext, useContext, useState } from "react";

/**
 * Interface for the task context of the application.
 */
export interface ITaskContext {
    listNames: string[],
    tasks: TaskList[],
    labels: Label[],
    selectedListIndex: number,
    setListNames: React.Dispatch<React.SetStateAction<string[]>>,
    setTasks: React.Dispatch<React.SetStateAction<TaskList[]>>,
    setSelectedListIndex: React.Dispatch<React.SetStateAction<number>>,
}

const tasks = [
    { done: false, title: "Disable button if new list name is empty string", listIndex: 0 },
    { done: false, title: "Call granny", listIndex: 0 },
    { done: false, title: "Buy vacuum", listIndex: 0 },
    { done: false, title: "This is content 4", listIndex: 0 },
    { done: false, title: "Call granny", listIndex: 0 },
    { done: false, title: "Buy vacuum", listIndex: 0 },
    { done: false, title: "Load dishwasher", listIndex: 1 },
    { done: false, title: "Cleaning the bathroom", listIndex: 1 },
    { done: false, title: "Do laundry", listIndex: 1 },
    { done: false, title: "Mop", listIndex: 1 },
    { done: false, title: "Call Giselle", listIndex: 2 },
    { done: false, title: "Print EDP reports", listIndex: 2 },
    { done: false, title: "Update documentation", listIndex: 2 },
    { done: false, title: "Clean calendar", listIndex: 2 },
]

// TODO: replace it with solid logic
// const with default context (it's not the one from the user's pod)
const defaultContext: ITaskContext ={
    listNames: ["TFG", "Home", "Work"],
    tasks: taskToListOfTaskList(tasks),
    labels: [{color: "#ad30ad", name: "school"}, {color: "#5930ab", name: "work"}, {color: "#e6a937", name: "home"}],
    selectedListIndex: 0,
    setListNames: () => {},
    setTasks: () => {},
    setSelectedListIndex: () => {},
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
    const [selectedListIndex, setSelectedListIndex] = useState(defaultContext.selectedListIndex);
    const labels = defaultContext.labels;
    const value ={listNames, tasks, selectedListIndex, setListNames, setTasks, setSelectedListIndex, labels};

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    )
}

