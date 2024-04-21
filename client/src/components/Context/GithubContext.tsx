import { ReactNode, createContext, useContext, useState } from "react";
import { CalendarItem, Event } from "@/src/model/Scheme";

export interface IGithubContext {
    githubLoggedIn: boolean,
    setGithubLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
    userData: any,
    setUserData: React.Dispatch<React.SetStateAction<any>>
}

// const with default context (it's not the one from the user's pod)
const defaultContext: IGithubContext={
    githubLoggedIn: false,
    setGithubLoggedIn: () => {},
    userData: null,
    setUserData: () => {},
}
// context with the default event context
const GithubContext = createContext<IGithubContext>(defaultContext);
/**
 * Custom hook to access the task context.
 * @returns task context
 */
export function useGithubContext() {
    return useContext(GithubContext)
}
/**
 * Interface for the context provider. Only children is added by now.
 */
export interface IGithubContextProvider {
    children: ReactNode;
}
/**
 * Context provider. Makes the task context accessible for children.
 * @param children corresponds to the children of the component
 * @returns context provider
 */
export function GithubProvider({children} : IGithubContextProvider) {
    const [githubLoggedIn, setGithubLoggedIn] = useState(defaultContext.githubLoggedIn);
    const [userData, setUserData] = useState(defaultContext.userData);
    const value ={ githubLoggedIn, setGithubLoggedIn, userData, setUserData };

    return (
        <GithubContext.Provider value={value}>
            {children}
        </GithubContext.Provider>
    )
}

