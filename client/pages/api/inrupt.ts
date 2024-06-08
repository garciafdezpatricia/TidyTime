import { useEventContext } from "@/src/components/Context/EventContext";
import { useSessionContext } from "@/src/components/Context/SolidContext";
import { useTaskContext } from "@/src/components/Context/TaskContext";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { Event, Task, TaskList } from "@/src/model/Scheme";


export function useInruptHandler() {

    const router = useRouter();
    const { setSolidSession, setUserName } = useSessionContext();
    const { setListNames, setLabels, setBoardColumns, setshowTasksInCalendar, setTasks } = useTaskContext();
    const { setWeekStart, setEventView, setEvents } = useEventContext();

    const { labels, showTasksInCalendar, boardColumns } = useTaskContext();
    const { weekStart, eventView } = useEventContext();

    const serverCheck = async () => {
        try {
            const response = await fetch("https://tidytime.onrender.com/health-check", {method: 'GET'});
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
                window.location.assign("http://localhost:8080/solid/login");
            } else {
                toast.error('Server appears to be down');
            }
        })
    }

    const getSession = async () => {
        try {
            const response = await serverCheck();
            if (response) {
                const fetchResponse = await fetch("https://tidytime.onrender.com/solid/user/session", {
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
                toast.error('Server appears to be down');
            }
        } catch (error) {
            console.error(error);
            toast.error('There has been a problem fetching your session!');
        }
    }

    async function logoutInrupt() {
        serverCheck()
        .then(response => {
            if (response) {
                fetch("http://localhost:8080/solid/logout", {
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
                toast.error('Server appears to be down');
            }
        })
    }

    const getProfile = async () => {
        const response = await serverCheck();
        if (response) {
            const fetchResponse = await fetch("https://tidytime.onrender.com/solid/user/profile", {
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
            toast.error('Server appears to be down');
        }
    }

    const checkConfiguration = async () => {
        const response = await serverCheck()
        if (response) {
            const fetchResponse = await fetch("https://tidytime.onrender.com/solid/configuration/health-check", {
                method: 'GET',
                credentials: 'include'
            })
            const data = await fetchResponse.json()
            if (!data.status) {
                toast.error('Could not check the configuration');    
            }
        } else {
            toast.error('Server appears to be down');
        }
    }

    // returns true if the pod has been initialized 
    const getAllConfiguration = async () => {
        const response = await serverCheck();
        if (response) {
            const fetchResponse = await fetch("https://tidytime.onrender.com/solid/configuration", {
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
                toast.success("Your POD has been initialized!");
                return true;
            }
        } else {
            toast.error('Server appears to be down');
        }
        return true; // the server is not up so we dont want to get any data from the pod
    }

    const saveConfiguration = () => {
        serverCheck()
        .then(response => {
            if (response) {
                fetch("https://tidytime.onrender.com/solid/configuration/store", {
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
                        toast.success("Preferences saved in your POD!");
                    } else {
                        toast.error("Preferences could not be saved in your POD");
                    }
                });
            } else {
                toast.error('Server appears to be down');
            }
        })
    }

    // the calendar view, week start and show tasks in calendar
    const getCalendarConfiguration = async () => {
        const response = await serverCheck();
        if (response) {
            const fetchResponse = await fetch("https://tidytime.onrender.com/solid/configuration/calendar", {
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
                toast.error('There has been a problem fetching your data');
            }
        } else {
            toast.error('Server appears to be down');
        }
    }

    // tasks
    const getTasks = async () => {
        const response = await serverCheck()
        if (response) {
            const fetchResponse = await fetch("https://tidytime.onrender.com/solid/data/tasks/get", {
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
                toast.error('There has been a problem fetching your data :(');
            }
        } else {
            toast.error('Server appears to be down');
        }
    }

    const getEvents = async () => {
        const response = await serverCheck();
        if (response) {
            const fetchResponse = await fetch("https://tidytime.onrender.com/solid/data/events/get", {
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
                toast.error('There has been a problem fetching your data :(');
            }
            setEvents(events);
        } else {
            toast.error('Server appears to be down');
        }
    }

    // board columns
    const getBoardColumns = async () => {
        const response = await serverCheck()
        if (response) {
            const fetchResponse = await fetch("https://tidytime.onrender.com/solid/configuration/board", {
                method: 'GET',
                credentials: 'include'
            })
            const data = await fetchResponse.json()
            if (data.status) {
                setBoardColumns(data.data.boardColumns ? data.data.boardColumns : []);
                
            } else {
                toast.error('There has been a problem fetching your columns :(');
            }
        } else {
            toast.error('Server appears to be down');
        }
    }

    // labels
    const getLabels = async () => {
        const response = await serverCheck()
        if (response) {
            const fetchResponse = await fetch("https://tidytime.onrender.com/solid/data/labels/get", {
                method: 'GET',
                credentials: 'include'
            })
            const data = await fetchResponse.json()
            if (data.status === "success") {
                setLabels(data.data && data.data.length > 0 ? data.data : []);
            } else if (data.status === "empty") {
                setLabels([]);
            } else {
                toast.error('There has been a problem fetching your labels :(');
            }
        } else {
            toast.error('Server appears to be down');
        }
    }

    const updateListNames = async (listNames: string[], tasks: TaskList[]) => {
        const listNamesAndIds = listNames.map((listname, index) => {
            return {name: listname, id: tasks[index].key};
        })
        fetch("https://tidytime.onrender.com/solid/data/store/listNames", {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                listNames: listNamesAndIds
            })
        }).then((response) => response.json())
        .then((data) => {
            if (data.status) {
                toast.success("Data correctly stored in your pod");
            } else {
                toast.error("There has been a problem while storing data in your pod");
            }
        })
    }

    const deleteList = async(listNames:string[], tasks: TaskList[], tasksIds: string[]) => {
        const listNamesAndIds = listNames.map((listname, index) => {
            return {name: listname, id: tasks[index].key};
        })
        fetch("https://tidytime.onrender.com/solid/data/store/lists/delete", {
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
                toast.success("List correctly deleted");
            } else {
                toast.error("There has been a problem while deleting the list");
            }
        })
    }

    const getApplicationData = async () => {
        try {
            const response = await serverCheck();
            if (response) {
                const fetchResponse = await fetch("https://tidytime.onrender.com/solid/data/get", {
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
                    toast.success("There's no data to fetch!");
                } else {
                    ;
                    toast.error("There has been a problem fetching the data in your pod");
                }
                setListNames(names);
                setTasks(taskLists);
                setEvents(events);
            } else {
                toast.error('Server appears to be down');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const createTask = async (task:Task) => {
        const response = await serverCheck();
        if (response) {
            const fetchResponse = await fetch("https://tidytime.onrender.com/solid/data/store/tasks/create", {
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
            ? toast.success('Pod updated!')
            :toast.error('There has been a problem storing your data :(');
        } else {
            toast.error('Server appears to be down');
        }
    }

    const createEvent = async (event: Event) => {
        const response = await serverCheck();
        if (response) {
            const fetchResponse = await fetch("https://tidytime.onrender.com/solid/data/store/events/create", {
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
            ? toast.success('Pod updated!')
            : toast.error('There has been a problem storing your data :(');
        } else {
            toast.error('Server appears to be down');
        }
    }

    const updateTaskDoneUndone = async (task:Task) => {
        const response = await serverCheck()
        if (response) {
            const fetchResponse = await fetch("https://tidytime.onrender.com/solid/data/store/task/done", {
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
            ? toast.success('Task updated!')
            :toast.error('There has been a problem fetching your data :(');
        } else {
            toast.error('Server appears to be down');
        }
    }

    const updateTask = async (task:Task) => {
        const response = await serverCheck()
        if (response) {
            const fetchResponse = await fetch("https://tidytime.onrender.com/solid/data/store/tasks/update", {
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
            ? toast.success('Task updated!')
            :toast.error('There has been a problem updating your data :(');
        } else {
            toast.error('Server appears to be down');
        }
    }

    const updateEvent = async (event: Event) => {
        const response = await serverCheck();
        if (response) {
            const fetchResponse = await fetch("https://tidytime.onrender.com/solid/data/store/events/update", {
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
            ? toast.success('Event updated!')
            : toast.error('There has been a problem updating your data :(');
        } else {
            toast.error('Server appears to be down');
        }
    }

    const updateTaskStatus = async (task:Task) => {
        const response = await serverCheck()
        if (response) {
            const fetchResponse = await fetch("https://tidytime.onrender.com/solid/data/store/task/status", {
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
            ? toast.success('Task updated!')
            :toast.error('There has been a problem updating your data :(');
        } else {
            toast.error('Server appears to be down');
        }
    }

    const deleteTask = async (task:Task) => {
        const response = await serverCheck()
        if (response) {
            const fetchResponse = await fetch("https://tidytime.onrender.com/solid/data/store/tasks/delete", {
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
            ? toast.success('Task deleted!')
            :toast.error('There has been a problem deleting your data :(');
        } else {
            toast.error('Server appears to be down');
        }
    }

    const deleteEvent = async (event: Event) => {
        const response = await serverCheck();
        if (response) {
            const fetchResponse = await fetch("https://tidytime.onrender.com/solid/data/store/events/delete", {
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
            ? toast.success('Event deleted!')
            : toast.error('There has been a problem deleting your data :(');
        } else {
            toast.error('Server appears to be down');
        }
    }

    const storeBoardColumns = async (boardColumns: string[]) => {
        const response = await serverCheck()
        if (response) {
            const fetchResponse = await fetch("https://tidytime.onrender.com/solid/data/store/boardColumns", {
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
            ? toast.success('Columns updated!')
            :toast.error('There has been a problem updating your data :(');
        } else {
            toast.error('Server appears to be down');
        }
    };

    return { loginInrupt, getSession, logoutInrupt, getProfile, getAllConfiguration, 
        updateListNames, getApplicationData, saveConfiguration, getTasks, getLabels, 
        checkConfiguration, updateTaskDoneUndone, updateTask, deleteTask, deleteList, 
        getBoardColumns, updateTaskStatus, storeBoardColumns, createTask, getEvents,
        createEvent, updateEvent, deleteEvent, getCalendarConfiguration, 
    };
}