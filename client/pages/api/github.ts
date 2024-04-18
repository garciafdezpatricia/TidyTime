import { useGithubContext } from "@/src/components/Context/GithubContext";
import toast from "react-hot-toast";



export function useGithubHandler() {

    const {setGithubLoggedIn, setUserData} = useGithubContext();

    const loginWithGithub = async () => {
        window.location.assign("http://localhost:8080/github/auth");
    }

    async function logoutGithub() {
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
    }

    const getUserData = async () => {
        try {
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
        } catch (error:any) {
            console.error(error.message);
        }
    }  

    const getIssuesOfUser = async (user:string) => {
        try {
            const response = await fetch('http://localhost:8080/github/issues/get?user=' + user, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }, 
                credentials: 'include'
            });
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error(error);
        }
    }

    return { getUserData, loginWithGithub, logoutGithub, getIssuesOfUser };
}