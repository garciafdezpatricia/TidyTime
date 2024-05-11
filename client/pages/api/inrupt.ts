import { useEventContext } from "@/src/components/Context/EventContext";
import { useSessionContext } from "@/src/components/Context/SolidContext";
import { useTaskContext } from "@/src/components/Context/TaskContext";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import _ from "lodash";


export function useInruptHandler() {

    const router = useRouter();
    const { setSolidSession, solidSession, setUserName } = useSessionContext();
    const { setListNames, setLabels, setBoardColumns, setshowTasksInCalendar, setTasks } = useTaskContext();
    const { setWeekStart, setEventView} = useEventContext();

    const { labels, showTasksInCalendar, boardColumns } = useTaskContext();
    const { weekStart, eventView } = useEventContext();

    const serverCheck = () => {
        return fetch("http://localhost:8080/health-check", { method: 'GET' })
        .then(response => {
            if (response.ok) {
                return true;
            } else {
                return false;
            }
        })
        .catch(error => {
            return false;
        });
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
                const fetchResponse = await fetch("http://localhost:8080/solid/user/session", {
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

    const getProfile = () => {
        serverCheck()
        .then(response => {
            if (response) {
                fetch("http://localhost:8080/solid/user/profile", {
                    method: 'GET', 
                    credentials: 'include',
                })
                .then(response => response.json())
                .then((data) => {
                    if (data.status) {
                        if (data.data) {
                            setUserName(data.data);
                        } else {
                            setUserName("No user name");
                        }
                    } else {
                        console.error(data.data);
                    }
                })
            } else {
                toast.error('Server appears to be down');
            }
        })
    }

    const getConfiguration = () => {
        serverCheck()
        .then(response => {
            if (response) {
                fetch("http://localhost:8080/solid/container/root", {
                    method: 'GET',
                    credentials: 'include'
                }).then((response) => response.json())
                .then((data) => {
                    if (data.status === "retrieved") {
                        setListNames(data.config.listNames);
                        setBoardColumns(data.config.boardColumns);
                        setLabels(data.config.labels);
                        setshowTasksInCalendar(data.config.showTasksInCalendar);
                        setWeekStart(data.config.weekStart);
                        setEventView(data.config.calendarView);
                    } else if (data.status === "created") {
                        toast.success("Your POD has been initialized!");
                    }
                });
            } else {
                toast.error('Server appears to be down');
            }
        })
    }

    const saveConfiguration = () => {
        serverCheck()
        .then(response => {
            if (response) {
                fetch("http://localhost:8080/solid/store/configuration", {
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
                    if (data.status === "stored") {
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

    const updateListNames = (listNames: string[]) => {
        serverCheck()
        .then(response => {
            if (response) {
                fetch("http://localhost:8080/solid/data/store/listNames", {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        listNames: listNames
                    })
                }).then((response) => response.json())
                .then((data) => {
                    if (data.status) {
                        toast.success("Data correctly stored in your pod");
                    } else {
                        toast.error("There has been a problem while storing data in your pod");
                    }
                })
            } else {
                toast.error('Server appeats to be down');
            }
        })
    }

    const getApplicationData = async () => {
        try {
            const response = await serverCheck();
            if (response) {
                const fetchResponse = await fetch("http://localhost:8080/solid/data/get", {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await fetchResponse.json();
                if (data.status === "success") {
                    setListNames(data.data.data.listNames);
                    let tasklists = data.data.data.listNames.map((_) => { return [] });
                    setTasks(tasklists);
                } else if (data.status === "empty"){
                    ;
                } else {
                    toast.error("There has been a problem fetching the data in your pod");
                }
            } else {
                toast.error('Server appears to be down');
            }
        } catch (error) {
            console.error(error);
        }
    }

    return { loginInrupt, getSession, logoutInrupt, getProfile, getConfiguration, updateListNames, getApplicationData, saveConfiguration };
}