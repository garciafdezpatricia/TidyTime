import { useGithubContext } from "@/src/components/Context/GithubContext";
import toast from "react-hot-toast";



export function useGithubHandler() {

    const {setGithubLoggedIn, setUserData} = useGithubContext();

    const serverCheck = async () => {
        try {
            const response = await fetch("http://13.51.241.63:4000/health-check", {method: 'GET'});
            if (response.ok) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    }

    const loginWithGithub = async () => {
        try {
            const response = await serverCheck();
            if (response) {
                window.location.assign("http://13.51.241.63:4000/github/auth");
            } else {
                toast.error('Server appears to be down');    
            }
        } catch (error) {
            toast.error('Error when connecting to the server');
        }
    }

    async function logoutGithub() {
        try {
            const response = await serverCheck();
            if (response) {
                const userResponse = await fetch('http://13.51.241.63:4000/github/logout', {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    }, 
                    credentials: 'include'
                });
                const data = await userResponse.json();
                setGithubLoggedIn(false);
                setUserData(null);
                localStorage.removeItem('githubLoggedIn');
                toast.success(data.data);
            } else {
                toast.error('Server appears to be down');    
            }
        } catch (error) {
            toast.error('Error when logging out');
        }
    }

    const getUserData = async () => {
        try {
            const response = await serverCheck();
            if (response) {
                const userResponse = await fetch('http://13.51.241.63:4000/github/user/data', {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    }, 
                    credentials: 'include'
                });
                const data = await userResponse.json();
                if (data.status) {
                    setGithubLoggedIn(true);
                    setUserData(data.data);
                } else {
                    throw Error(data.data);
                }
            } else {
                toast.error('Server appears to be down');
            }
        } catch (error:any) {
            console.error(error.message);
        }
    }  

    const getIssuesOfUser = async (user:string) => {
        try {
            const response = await serverCheck();
            if (response) {
                const issues = await fetch('http://13.51.241.63:4000/github/issues/get?user=' + user, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }, 
                    credentials: 'include'
                });
                const data = await issues.json();
                return data.data;
            } else {
                toast.error('Server appears to be down');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const closeIssue = async (url:string) => {
        try {
            const response = await serverCheck();
            if (response) {
                const issues = await fetch('http://13.51.241.63:4000/github/issues/close', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }, 
                    credentials: 'include',
                    body: 
                        JSON.stringify({
                            url: url
                        })
                });
                const data = await issues.json();
                if (data.data.state === "closed") {
                    toast.success("Updated issue on GitHub!");
                } else {
                    toast.error("There has been a problem updating the issue on GitHub");
                }
            } else {
                toast.error('Server appears to be down');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const openIssue = async (url:string) => {
        try {
            const response = await serverCheck();
            if (response) {
                const issues = await fetch('http://13.51.241.63:4000/github/issues/open', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }, 
                    credentials: 'include',
                    body: 
                        JSON.stringify({
                            url: url
                        })
                });
                const data = await issues.json();
                if (data.data.state === "open") {
                    toast.success("Updated issue on GitHub!");
                } else {
                    toast.error("There has been a problem updating the issue on GitHub");
                }
            } else {
                toast.error('Server appears to be down');
            }
        } catch (error) {
            console.error(error);
        }
    }

    const updateIssue = async (url:string, title:string, body:string) => {
        try {
            const response = await serverCheck();
            if (response) {
                const issues = await fetch('http://13.51.241.63:4000/github/issues/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }, 
                    credentials: 'include',
                    body: 
                        JSON.stringify({
                            url: url,
                            title: title,
                            desc: body
                        })
                });
                const data = await issues.json();
                if (data.data.title === title && data.data.body === body) {
                    toast.success("Updated issue on GitHub!");
                } else {
                    toast.error("There has been a problem updating the issue on GitHub");
                }
            } else {
                toast.error('Server appears to be down');
            }
        } catch (error) {
            console.error(error);
        }
    }

    return { getUserData, loginWithGithub, logoutGithub, getIssuesOfUser, updateIssue, closeIssue, openIssue };
}