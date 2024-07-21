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

import CalendarComponent from "../../src/components/Calendar/Calendar"
import LoginGoogleCalendar from "../../src/components/Login/GoogleCalendarLogin"
import { useEffect, useState } from "react";
import CalendarMenu from "../../src/components/Menu/CalendarMenu";
import { useGoogleHandler } from "../api/google";
import { useSessionContext } from "@/src/components/Context/SolidContext";
import { useRouter } from "next/router";
import { useInruptHandler } from "../api/inrupt";
import Loader from "@/src/components/Loading/Loading";

export default function Calendar() {

    const { solidSession } = useSessionContext();
    const { getSession, getCalendarConfiguration } = useInruptHandler();
    const { checkAuthentication } = useGoogleHandler();

    const [firstRender, setFirstRender] = useState(true);
    const [reRender, setRerender] = useState(Math.random());
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const getSessionWrapper = async () => {
		await getSession();
	}

    const initialActions = async () => {
        const params = new URLSearchParams(location.search);
        const emailParam = params.get('user');
        const isUserLoggedIn = localStorage.getItem('googleLoggedIn');
        if (emailParam || isUserLoggedIn) {
            await checkAuthentication(emailParam, isUserLoggedIn);
        }    
        await getCalendarConfiguration();
    };

    const checkAuth = async () => {	
        if (solidSession !== undefined && !solidSession?.info.isLoggedIn) {
            router.push("/");
        }
	};
    
    useEffect(() => {
        getSessionWrapper();
    }, [reRender]);

    useEffect(() => {
        checkAuth();
        if (solidSession?.info.isLoggedIn && firstRender) {
            initialActions();
            setFirstRender(false);
        }
        setLoading(false);
    }, [solidSession])

    return (
        loading ?
        <Loader />
        :
        (solidSession?.info.isLoggedIn &&
        <div data-testid="calendar-container" className="calendar-container">
            <article className="calendar-menu" >
                <CalendarMenu />
                <LoginGoogleCalendar />
            </article>
            <CalendarComponent/>
        </div>)
    )
}