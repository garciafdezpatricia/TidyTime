import { TaskList, Label } from "@/src/task/Task";
import { ReactNode, createContext, useContext, useState } from "react";

/**
 * Interface for the task context of the application.
 */
export interface ITaskContext {
    tabs: string[],
    todo: TaskList[],
    labels: Label[],
    selectedListIndex: number,
    setTabs: React.Dispatch<React.SetStateAction<string[]>>,
    setToDo: React.Dispatch<React.SetStateAction<TaskList[]>>,
    setSelectedListIndex: React.Dispatch<React.SetStateAction<number>>,
}

// TODO: replace it with solid logic
// const with default context (it's not the one from the user's pod)
const defaultContext: ITaskContext ={
    tabs: ["TFG", "Home", "Work"],
    todo: [
        [
            { done: false, title: "Disable button if new list name is empty string" },
            { done: false, title: "Call granny" },
            { done: false, title: "Buy vacuum" },
            { done: false, title: "This is content 4" },
            { done: false, title: "Call granny" },
            { done: false, title: "Buy vacuum" },
        ],
        [
            { done: false, title: "Load dishwasher" },
            { done: false, title: "Cleaning the bathroom" },
            { done: false, title: "Do laundry" },
            { done: false, title: "Mop" },
        ],
        [
            { done: false, title: "Call Giselle" },
            { done: false, title: "Print EDP reports" },
            { done: false, title: "Update documentation" },
            { done: false, title: "Clean calendar" },
        ],
    ],
    labels: [{color: "#ad30ad", name: "school"}, {color: "#5930ab", name: "work"}, {color: "#e6a937", name: "home"}],
    selectedListIndex: 0,
    setTabs: () => {},
    setToDo: () => {},
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
    const [tabs, setTabs] = useState(defaultContext.tabs);
    const [todo, setToDo] = useState(defaultContext.todo);
    const [selectedListIndex, setSelectedListIndex] = useState(defaultContext.selectedListIndex);
    const labels = defaultContext.labels;
    const value ={tabs, todo, selectedListIndex, setTabs, setToDo, setSelectedListIndex, labels};

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    )
}

