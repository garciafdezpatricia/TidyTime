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

import { useEventContext } from "@/src/components/Context/EventContext";
import { useSessionContext } from "@/src/components/Context/SolidContext";
import { useTaskContext } from "@/src/components/Context/TaskContext";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { Event, Task, TaskList } from "@/src/model/Scheme";
import { useTranslation } from "react-i18next";


export function useInruptHandler() {
    const { t } = useTranslation();
    const router = useRouter();
    const { setSolidSession, setUserName } = useSessionContext();
    const { setListNames, setLabels, setBoardColumns, setshowTasksInCalendar, setTasks } = useTaskContext();
    const { setWeekStart, setEventView, setEvents } = useEventContext();

    const { labels, showTasksInCalendar, boardColumns } = useTaskContext();
    const { weekStart, eventView } = useEventContext();

    const serverCheck = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/health-check`, {method: 'GET'});
            if (response.ok) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    async function loginInrupt() {
        serverCheck()
        .then(response => {
            if (response) {
                window.location.assign(`${process.env.NEXT_PUBLIC_BACK_URL}/solid/login`);
            } else {
                toast.error(t('toast.serverDown'));
            }
        })
    }

    const getSession = async () => {
        try {
            const response = await serverCheck();
            if (response) {
                const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/solid/user/session`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await fetchResponse.json();
                if (data.status) {
                    setSolidSession(data.session);
                } else {
                    setSolidSession(null);
                }
            } else {
                if (window.location.pathname !== "/") {
                    router.push("/");
                }
                toast.error(t('toast.serverDown'));
            }
        } catch (error) {
            console.error(error);
            toast.error(t('toast.errorSession'));
        }
    }

    async function logoutInrupt() {
        serverCheck()
        .then(response => {
            if (response) {
                fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/solid/logout`, {
                    method: 'GET',
                    credentials: 'include',
                })
                .then(response => response.json())
                .then((data) => {
                    if (data.status) {
                        setSolidSession(null);
                        toast.success(data.data);
                    }
                })
            } else {
                setSolidSession(null)
                toast.error(t('toast.serverDown'));
            }
        })
    }

    const getProfile = async () => {
        const response = await serverCheck();
        if (response) {
            const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/solid/user/profile`, {
                method: 'GET', 
                credentials: 'include',
            });
            const data = await fetchResponse.json();
            if (data.status) {
                if (data.data) {
                    setUserName(data.data);
                } else {
                    setUserName("No user name");
                }
            } else {
                console.error(data.data);
            }
        } else {
            toast.error(t('toast.serverDown'));
        }
    }

    const checkConfiguration = async () => {
        const response = await serverCheck()
        if (response) {
            const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/solid/configuration/health-check`, {
                method: 'GET',
                credentials: 'include'
            })
            const data = await fetchResponse.json()
            if (!data.status) {
                toast.error(t('toast.errorRetrieving'));    
            }
        } else {
            toast.error(t('toast.serverDown'));
        }
    }

    // returns true if the pod has been initialized 
    const getAllConfiguration = async () => {
        const response = await serverCheck();
        if (response) {
            const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/solid/configuration`, {
                method: 'GET',
                credentials: 'include'
            })
            const data = await fetchResponse.json()
            if (data.status === "retrieved" && data.config) {
                setBoardColumns(data.config.boardColumns);
                setLabels(data.config.labels);
                setshowTasksInCalendar(data.config.showTasksInCalendar);
                setWeekStart(data.config.weekStart);
                setEventView(data.config.calendarView);
                return false;
            } else if (data.status === "created") {
                toast.success(t('toast.podInit'));
                return true;
            }
        } else {
            toast.error(t('toast.serverDown'));
        }
        return true; // the server is not up so we dont want to get any data from the pod
    }

    const saveConfiguration = () => {
        serverCheck()
        .then(response => {
            if (response) {
                fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/solid/configuration/store`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        labels: labels,
                        showTasksInCalendar: showTasksInCalendar,
                        boardColumns: boardColumns,
                        weekStart: weekStart,
                        calendarView: eventView
                    })
                }).then((response) => response.json())
                .then((data) => {
                    if (data.status) {
                        toast.success(t('toast.updated'));
                    } else {
                        toast.error(t('toast.errorUpdating'));
                    }
                });
            } else {
                toast.error(t('toast.serverDown'));
            }
        })
    }

    // the calendar view, week start and show tasks in calendar
    const getCalendarConfiguration = async () => {
        const response = await serverCheck();
        if (response) {
            const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/solid/configuration/calendar`, {
                method: 'GET', 
                credentials: 'include'
            });
            const data = await fetchResponse.json();
            if (data.status) {
                setshowTasksInCalendar(data.data.showTasksInCalendar);
                setWeekStart(data.data.weekStart);
                setEventView(data.data.calendarView);
                await getEvents();
                if (data.data.showTasksInCalendar) {
                    await getTasks();
                }
            } else {
                toast.error(t('toast.errorRetrieving'));
            }
        } else {
            toast.error(t('toast.serverDown'));
        }
    }

    // tasks
    const getTasks = async () => {
        const response = await serverCheck()
        if (response) {
            const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/solid/data/tasks/get`, {
                method: 'GET',
                credentials: 'include'
            })
            const data = await fetchResponse.json()
            if (data.status === "success") {
                let taskLists:TaskList[] = [];
                let names:string[] = [];
                // listnames
                if (data.data.data.listNames && data.data.data.listNames.length > 0) {
                    // @ts-ignore
                    data.data.data.listNames.forEach((list, index) => {
                        taskLists[index] = {key: list.id, value: []};
                        names[index] = list.name;
                    })
                }
                // tasks
                if (data.data.data.tasks && data.data.data.tasks.length > 0) {
                    taskLists.map((list, index) => {
                        // @ts-ignore
                        const tasksOfTheList = data.data.data.tasks.filter((task) => {
                            return task.listIndex === list.key
                        })
                        if (tasksOfTheList.length > 0) {
                            taskLists[index].value = tasksOfTheList;
                        }
                    })
                }
                setListNames(names);
                setTasks(taskLists)
            } else if (data.status === "empty") {
                setTasks([]);
                setListNames([]);
            } else {
                toast.error(t('toast.errorRetrieving'));
            }
        } else {
            toast.error(t('toast.serverDown'));
        }
    }

    const getEvents = async () => {
        const response = await serverCheck();
        if (response) {
            const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/solid/data/events/get`, {
                method: 'GET',
                credentials: 'include'
            })
            const data = await fetchResponse.json()
            let events:Event[] = [];
            if (data.status === "success") {
                if (data.data.data.events && data.data.data.events.length > 0) {
                    events = data.data.data.events;
                    events.forEach((event) => {
                        event.end = new Date(event.end);
                        event.start = new Date(event.start);
                    });
                }
            } else if (data.status === "empty") {
                ;
            } else {
                toast.error(t('toast.errorRetrieving'));
            }
            setEvents(events);
        } else {
            toast.error(t('toast.serverDown'));
        }
    }

    // board columns
    const getBoardColumns = async () => {
        const response = await serverCheck()
        if (response) {
            const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/solid/configuration/board`, {
                method: 'GET',
                credentials: 'include'
            })
            const data = await fetchResponse.json()
            if (data.status) {
                setBoardColumns(data.data.boardColumns ? data.data.boardColumns : []);
                
            } else {
                toast.error(t('toast.errorRetrieving'));
            }
        } else {
            toast.error(t('toast.serverDown'));
        }
    }

    // labels
    const getLabels = async () => {
        const response = await serverCheck()
        if (response) {
            const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/solid/data/labels/get`, {
                method: 'GET',
                credentials: 'include'
            })
            const data = await fetchResponse.json()
            if (data.status === "success") {
                setLabels(data.data && data.data.length > 0 ? data.data : []);
            } else if (data.status === "empty") {
                setLabels([]);
            } else {
                toast.error(t('toast.errorRetrieving'));
            }
        } else {
            toast.error(t('toast.serverDown'));
        }
    }

    const updateListNames = async (listNames: string[], tasks: TaskList[]) => {
        const listNamesAndIds = listNames.map((listname, index) => {
            return {name: listname, id: tasks[index].key};
        })
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/solid/data/store/listNames`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                listNames: listNamesAndIds
            })
        })
        const data = await response.json()
        if (data.status) {
            toast.success(t('toast.updated'));
        } else {
            toast.error(t('toast.errorUpdating'));
        }
        
    }

    const deleteList = async(listNames:string[], tasks: TaskList[], tasksIds: string[]) => {
        const listNamesAndIds = listNames.map((listname, index) => {
            return {name: listname, id: tasks[index].key};
        })
        fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/solid/data/store/lists/delete`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                listNames: listNamesAndIds,
                tasksIds: tasksIds
            })
        }).then((response) => response.json())
        .then((data) => {
            if (data.status) {
                toast.success(t('toast.deleted'));
            } else {
                toast.error(t('toast.errorDeleting'));
            }
        })
    }

    const getApplicationData = async () => {
        try {
            const response = await serverCheck();
            if (response) {
                const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/solid/data/get`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await fetchResponse.json();
                let taskLists:TaskList[] = [];
                let names:string[] = [];
                let events:Event[] = [];
                if (data.status === "success") {
                    // listnames
                    if (data.data.tasks.listNames && data.data.tasks.listNames.length > 0) {
                        // @ts-ignore
                        data.data.tasks.listNames.forEach((list, index) => {
                            taskLists[index] = {key: list.id, value: []};
                            names[index] = list.name;
                        })
                    }
                    // tasks
                    if (data.data.tasks.tasks && data.data.tasks.tasks.length > 0) {
                        taskLists.map((list, index) => {
                            // @ts-ignore
                            const tasksOfTheList = data.data.tasks.tasks.filter((task) => {
                                return task.listIndex === list.key
                            })

                            if (tasksOfTheList.length > 0) {
                                taskLists[index].value = tasksOfTheList;
                            }
                        })
                    }
                    // events
                    if (data.data.events && data.data.events.length > 0) {
                        events = data.data.events;
                        events.forEach((event) => {
                            event.end = new Date(event.end);
                            event.start = new Date(event.start);
                        });
                    }
                } else if (data.status === "empty"){
                    toast.success(t('toast.noDataToFetch'));
                } else {
                    ;
                    toast.error(t('toast.errorRetrieving'));
                }
                setListNames(names);
                setTasks(taskLists);
                setEvents(events);
            } else {
                toast.error(t('toast.serverDown'));
            }
        } catch (error) {
            console.error(error);
        }
    }

    const createTask = async (task:Task) => {
        const response = await serverCheck();
        if (response) {
            const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/solid/data/store/tasks/create`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task: task
                })
            })
            const data = await fetchResponse.json();
            data.status
            ? toast.success(t('toast.updated'))
            :toast.error(t('toast.errorUpdating'));
        } else {
            toast.error(t('toast.serverDown'));
        }
    }

    const createEvent = async (event: Event) => {
        const response = await serverCheck();
        if (response) {
            const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/solid/data/store/events/create`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event: event
                })
            })
            const data = await fetchResponse.json();
            data.status
            ? toast.success(t('toast.updated'))
            : toast.error(t('toast.errorUpdating'));
        } else {
            toast.error(t('toast.serverDown'));
        }
    }

    const updateTaskDoneUndone = async (task:Task) => {
        const response = await serverCheck()
        if (response) {
            const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/solid/data/store/task/done`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task: task
                })
            })
            const data = await fetchResponse.json();
            data.status
            ? toast.success(t('toast.updated'))
            :toast.error(t('toast.errorUpdating'));
        } else {
            toast.error(t('toast.serverDown'));
        }
    }

    const updateTask = async (task:Task) => {
        const response = await serverCheck()
        if (response) {
            const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/solid/data/store/tasks/update`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task: task
                })
            })
            const data = await fetchResponse.json();
            data.status
            ? toast.success(t('toast.updated'))
            :toast.error(t('toast.errorUpdating'));
        } else {
            toast.error(t('toast.serverDown'));
        }
    }

    const updateEvent = async (event: Event) => {
        const response = await serverCheck();
        if (response) {
            const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/solid/data/store/events/update`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event: event
                })
            })
            const data = await fetchResponse.json();
            data.status
            ? toast.success(t('toast.updated'))
            : toast.error(t('toast.errorUpdating'));
        } else {
            toast.error(t('toast.serverDown'));
        }
    }

    const updateTaskStatus = async (task:Task) => {
        const response = await serverCheck()
        if (response) {
            const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/solid/data/store/task/status`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task: task
                })
            })
            const data = await fetchResponse.json();
            data.status
            ? toast.success(t('toast.updated'))
            :toast.error(t('toast.errorUpdating'));
        } else {
            toast.error(t('toast.serverDown'));
        }
    }

    const deleteTask = async (task:Task) => {
        const response = await serverCheck()
        if (response) {
            const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/solid/data/store/tasks/delete`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task: task
                })
            })
            const data = await fetchResponse.json();
            data.status
            ? toast.success(t('toast.deleted'))
            :toast.error(t('toast.errorDeleting'));
        } else {
            toast.error(t('toast.serverDown'));
        }
    }

    const deleteEvent = async (event: Event) => {
        const response = await serverCheck();
        if (response) {
            const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/solid/data/store/events/delete`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    event: event
                })
            })
            const data = await fetchResponse.json();
            data.status
            ? toast.success(t('toast.deleted'))
            : toast.error(t('toast.errorDeleting'));
        } else {
            toast.error(t('toast.serverDown'));
        }
    }

    const storeBoardColumns = async (boardColumns: string[]) => {
        const response = await serverCheck()
        if (response) {
            const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/solid/data/store/boardColumns`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    boardColumns: boardColumns
                })
            })
            const data = await fetchResponse.json();
            data.status
            ? toast.success(t('toast.updated'))
            :toast.error(t('toast.errorUpdating'));
        } else {
            toast.error(t('toast.serverDown'));
        }
    };

    return { loginInrupt, getSession, logoutInrupt, getProfile, getAllConfiguration, 
        updateListNames, getApplicationData, saveConfiguration, getTasks, getLabels, 
        checkConfiguration, updateTaskDoneUndone, updateTask, deleteTask, deleteList, 
        getBoardColumns, updateTaskStatus, storeBoardColumns, createTask, getEvents,
        createEvent, updateEvent, deleteEvent, getCalendarConfiguration, 
    };
}