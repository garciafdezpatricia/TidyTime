import { useGithubContext } from "@/src/components/Context/GithubContext";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";



export function useGithubHandler() {
    const { t } = useTranslation();
    const {setGithubLoggedIn, setUserData} = useGithubContext();

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

    const loginWithGithub = async () => {
        try {
            const response = await serverCheck();
            if (response) {
                window.location.assign(`${process.env.NEXT_PUBLIC_BACK_URL}/github/auth`);
            } else {
                toast.error(t('toast.serverDown'));    
            }
        } catch (error) {
            toast.error(t('toast.serverError'));
        }
    }

    async function logoutGithub() {
        try {
            const response = await serverCheck();
            if (response) {
                const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/github/logout`, {
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
                toast.error(t('toast.serverDown'));    
            }
        } catch (error) {
            toast.error(t('toast.loggedOutError'));
        }
    }

    const getUserData = async () => {
        try {
            const response = await serverCheck();
            if (response) {
                const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/github/user/data`, {
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
                toast.error(t('toast.serverDown'));
            }
        } catch (error:any) {
            console.error(error.message);
        }
    }  

    const getIssuesOfUser = async (user:string) => {
        try {
            const response = await serverCheck();
            if (response) {
                const issues = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/github/issues/get?user=` + user, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }, 
                    credentials: 'include'
                });
                const data = await issues.json();
                return data.data;
            } else {
                toast.error(t('toast.serverDown'));
            }
        } catch (error) {
            console.error(error);
        }
    }

    const closeIssue = async (url:string) => {
        try {
            const response = await serverCheck();
            if (response) {
                const issues = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/github/issues/close`, {
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
                    toast.success(t('toast.updated'));
                } else {
                    toast.error(t('toast.errorUpdating'));
                }
            } else {
                toast.error(t('toast.serverDown'));
            }
        } catch (error) {
            console.error(error);
        }
    }

    const openIssue = async (url:string) => {
        try {
            const response = await serverCheck();
            if (response) {
                const issues = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/github/issues/open`, {
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
                    toast.success(t('toast.updated'));
                } else {
                    toast.error(t('toast.errorUpdating'));
                }
            } else {
                toast.error(t('toast.serverDown'));
            }
        } catch (error) {
            console.error(error);
        }
    }

    const updateIssue = async (url:string, title:string, body:string) => {
        try {
            const response = await serverCheck();
            if (response) {
                const issues = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/github/issues/update`, {
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
                    toast.success(t('toast.updated'));
                } else {
                    toast.error(t('toast.errorUpdating'));
                }
            } else {
                toast.error(t('toast.serverDown'));
            }
        } catch (error) {
            console.error(error);
        }
    }

    return { getUserData, loginWithGithub, logoutGithub, getIssuesOfUser, updateIssue, closeIssue, openIssue };
}