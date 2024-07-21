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

import { ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { Session } from "@inrupt/solid-client-authn-browser"

/**
 * Interface for the Solid context of the application.
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
// context with the default Solid context
const SessionContext = createContext<ISessionContext>(defaultContext);
/**
 * Custom hook to access the Solid context.
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
 * Context provider. Makes the Solid context accessible for children.
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

