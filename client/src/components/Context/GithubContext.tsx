// Copyright 2024 Patricia García Fernández.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { ReactNode, createContext, useContext, useState } from "react";

/**
 * Interface for the Google context of the application.
 */
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
// context with the default GitHub context
const GithubContext = createContext<IGithubContext>(defaultContext);
/**
 * Custom hook to access the GitHub context.
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
 * Context provider. Makes the GitHub context accessible for children.
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

