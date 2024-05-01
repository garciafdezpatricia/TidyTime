import { useSessionContext } from "@/src/components/Context/SolidContext";
import { useRouter } from "next/router";
import toast from "react-hot-toast";


export function useInruptHandler() {

    const router = useRouter();
    const { setSolidSession, solidSession, setUserName } = useSessionContext();

    const serverCheck = () => {
        return fetch("https://13.51.241.98/health-check", { method: 'GET' })
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
                window.location.assign("https://13.51.241.98/solid/login");
            } else {
                toast.error('Server appears to be down');
            }
        })
    }

    const getSession = () => {
        serverCheck()
        .then(response => {
            if (response) {
                fetch("https://13.51.241.98/solid/user/session", {
                    method: 'GET',
                    credentials: 'include'
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data.status) {
                        setSolidSession(data.session);
                    } else {
                        setSolidSession(null);
                    }
                })
                .catch(error => {
                    console.error(error);
                    toast.error('There has been a problem fetching your session!');
                })
            } else {
                router.push("/");
                toast.error('Server appears to be down');
            }
        })
    }

    async function logoutInrupt() {
        serverCheck()
        .then(response => {
            if (response) {
                fetch("https://13.51.241.98/solid/logout", {
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
                fetch("https://13.51.241.98/solid/user/profile", {
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