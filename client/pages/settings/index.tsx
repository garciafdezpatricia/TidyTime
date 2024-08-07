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

import CalendarPanel from "@/src/components/Panel/CalendarPreferences/CalendarPanel";
import ApplicationPanel from "../../src/components/Panel/ApplicationPreferences/ApplicationPanel";
import { useEffect, useState } from "react";
import { useGoogleHandler } from "@/pages/api/google";
import { useGithubHandler } from "../api/github";
import toast from "react-hot-toast";
import { useGithubContext } from "@/src/components/Context/GithubContext";
import BoardPanel from "@/src/components/Panel/BoardPreferences/BoardPanel";
import ListPanel from "@/src/components/Panel/ListPreferences/ListPanel";
import { useRouter } from "next/router";
import { useSessionContext } from "@/src/components/Context/SolidContext";
import { useInruptHandler } from "../api/inrupt";
import Loader from "@/src/components/Loading/Loading";
import { useTranslation } from 'react-i18next';

export default function Settings() {
    const { t } = useTranslation();
    const { checkAuthentication } = useGoogleHandler();
    const { getUserData } = useGithubHandler();
    const { githubLoggedIn, userData } = useGithubContext();
    const { solidSession } = useSessionContext();
    const { getSession, getAllConfiguration, saveConfiguration } = useInruptHandler();

    const router = useRouter();
    const [reRender, setRerender] = useState(Math.random());
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        getSession();
    }, [reRender]); 

    const authenticationActions = async () => {
        // ---> GOOGLE LOGIN
        const params = new URLSearchParams(location.search);
        const emailParam = params.get('user');
        const isUserLoggedIn = localStorage.getItem('googleLoggedIn');    
        checkAuthentication(emailParam, isUserLoggedIn);
        // ---> GITHUB LOGIN
        try {
            if (!userData) {
                await getUserData();
            }
        } catch (error:any) {
            if (error.message === "Failed to fetch") {
                toast.error(t('toast.serverError'));
            } else {
                if (error.message.includes('access not found') && githubLoggedIn) {
                    toast.error(t('toast.reconnectGitHub'));
                }
            }
        }
    }

    const fetchData = async () => {
        if (solidSession === undefined) {
            setLoading(true);
        } else {
            if (solidSession?.info.isLoggedIn) {
                // INRUPT CONFIG
                await getAllConfiguration();
                await authenticationActions();
            } else {
                router.push("/");
            }
            setLoading(false);
        }
    };

	useEffect(() => {	
		if (solidSession !== undefined && solidSession?.info.isLoggedIn) {
			fetchData();
		} else if (solidSession === null) {
            router.push("/");
        }
	}, [solidSession])

    const savePreferences = async () => {
        saveConfiguration();
    }

    return (
        loading ?
        <Loader />
        :
        solidSession?.info.isLoggedIn &&
        <div className="settings-container">
            <ApplicationPanel />    
            <ListPanel />
            <BoardPanel />
            <CalendarPanel />
            <button 
                className="save-preferences-button" 
                onClick={savePreferences}>
                {t('preferences.savePreferences')}
            </button>
        </div>
    )
}