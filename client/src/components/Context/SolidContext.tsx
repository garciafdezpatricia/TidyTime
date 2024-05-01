import { TaskList, Label, taskToListOfTaskList, listOfTaskListToTask } from "@/src/model/Scheme";
import { ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { Session } from "@inrupt/solid-client-authn-browser"

/**
 * Interface for the task context of the application.
 */
export interface ISessionContext {
    solidSession?: Session | null,
    setSolidSession: React.Dispatch<React.SetStateAction<Session | null | undefined>>,
    userName: string,
    setUserName: React.Dispatch<React.SetStateAction<string>>,
}

// const with default context (it's not the one from the user's pod)
const defaultContext: ISessionContext ={
    solidSession: undefined,
    setSolidSession: () => {},
    userName: '',
    setUserName: () => {},
}
// context with the default task context
const SessionContext = createContext<ISessionContext>(defaultContext);
/**
 * Custom hook to access the task context.
 * @returns task context
 */
export function useSessionContext() {
    return useContext(SessionContext)
}
/**
 * Interface for the context provider. Only children is added by now.
 */
export interface ISolidContextProvider {
    children: ReactNode;
}
/**
 * Context provider. Makes the task context accessible for children.
 * @param children corresponds to the children of the component
 * @returns context provider
 */
export function SessionProvider({children} : ISolidContextProvider) {
    const [solidSession, setSolidSession] = useState<Session | undefined | null>(undefined);
    const [userName, setUserName] = useState('');
    
    const value = {solidSession, setSolidSession, userName, setUserName};

    return (
        <SessionContext.Provider value={value}>
            {children}
        </SessionContext.Provider>
    )
}

