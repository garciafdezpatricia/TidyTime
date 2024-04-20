import { useGithubContext } from "@/src/components/Context/GithubContext";
import toast from "react-hot-toast";



export function useGithubHandler() {

    const {setGithubLoggedIn, setUserData} = useGithubContext();

    const serverCheck = async () => {
        try {
            const response = await fetch("http://localhost:8080/health-check", {method: 'GET'});
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
                window.location.assign("http://localhost:8080/github/auth");
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
                const userResponse = await fetch('http://localhost:8080/github/logout', {
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
                const userResponse = await fetch('http://localhost:8080/github/user/data', {
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
                const issues = await fetch('http://localhost:8080/github/issues/get?user=' + user, {
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

    return { getUserData, loginWithGithub, logoutGithub, getIssuesOfUser };
}