import { useSessionContext } from "@/src/components/Context/SolidContext";
import toast from "react-hot-toast";


export function useInruptHandler() {

    const { setSolidSession, solidSession, setUserName } = useSessionContext();

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

    const getSession = () => {
        serverCheck()
        .then(response => {
            if (response) {
                fetch("http://localhost:8080/solid/user/session", {
                    method: 'GET',
                    credentials: 'include'
                })
                .then((response) => response.json())
                .then((data) => {
                    setSolidSession(data.session);
                })
                .catch(error => {
                    console.error(error);
                    toast.error('There has been a problem fetching your session!');
                })
            } else {
                toast.error('Server appears to be down');
            }
        })
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
                        setSolidSession(undefined);
                        toast.success(data.data);
                    }
                })
            } else {
                setSolidSession(undefined)
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
                    console.log(data);
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

    return { loginInrupt, getSession, logoutInrupt, getProfile };
}