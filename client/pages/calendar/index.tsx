import { IoMenu } from "react-icons/io5";
import CalendarComponent from "../../src/components/Calendar/Calendar"
import LoginGoogleCalendar from "../../src/components/Login/GoogleCalendarLogin"
import { useEffect, useRef, useState } from "react";
import CalendarMenu from "../../src/components/Menu/CalendarMenu";
import { useGoogleContext } from "@/src/components/Context/GoogleContext";
import toast from "react-hot-toast";


export default function Calendar() {

    const { setLoggedIn } = useGoogleContext();
    const [reRender, setRerender] = useState(Math.random());

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const emailParam = params.get('email');
        const isUserLoggedIn = localStorage.getItem('userLoggedIn');
        const checkAuthentication = async () => {
            // if email in url
            if (emailParam) {
                try {
                    const isAuthenticated = await isAuthenticatedUser(emailParam);
                    if (isAuthenticated) {
                        localStorage.setItem("userLoggedIn", emailParam);
                        setLoggedIn(true);
                    } else {
                        setLoggedIn(false);
                    }
                } catch (error) {
                    toast.error("There has been an error in the authentication. Please, try again.")
                    setLoggedIn(false);
                }
            }
            // if user in local storage
            else if (isUserLoggedIn) {
                try {
                    const isAuthenticated = await isAuthenticatedUser(isUserLoggedIn);
                    setLoggedIn(isAuthenticated);
                    if (!isAuthenticated) {
                        localStorage.removeItem('userLoggedIn');
                    }    
                } catch (error) {
                    toast.error("There has been an error in the authentication. Please, try again.")
                    localStorage.removeItem('userLoggedIn');
                    setLoggedIn(false);
                }
            } else {
                
                setLoggedIn(false);
            }
        };
    
        checkAuthentication();
    }, [reRender]); // this will be executed on every renderization of the page (new tab and refresh page included)

    const isAuthenticatedUser = async (emailParam:string): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            fetch('http://localhost:8080/google/auth/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: emailParam }),
                credentials: 'include',
            })
            .then(response => response.json())
            .then((data: boolean) => {
                resolve(data);
            })
            .catch(e => {
                console.error(e);
                reject(e);
            });
        });
    }

    return (
    <div className="calendar-container">
        <article className="calendar-menu" >
            <CalendarMenu />
            <LoginGoogleCalendar />
        </article>
        <CalendarComponent/>
    </div>)
}