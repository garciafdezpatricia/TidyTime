import toast from "react-hot-toast";
import { useGoogleContext } from "../components/Context/GoogleContext";

export function useGoogleHandler() {

    const { setCalendars, setSelectedCalendarId, setLoggedIn, setAuthUrl} = useGoogleContext();

    const handleLogout = () => {
        fetch('http://localhost:8080/google/auth/logout')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success'){
                localStorage.removeItem("userLoggedIn");
                // remove email param if it is in the url
                if (window.location.search.includes('email')) {
                    const newUrl = window.location.origin + window.location.pathname;
                    window.history.replaceState({}, document.title, newUrl);
                }
                setCalendars([]);
                setSelectedCalendarId("");
                toast.success("Logged out!", {
                    position: "top-center"
                })
                setLoggedIn(false);
            } else {
                toast.error("Failed to log out!", {
                    position: "top-center"
                })
            }
        }).catch(error => {
            console.error('Error when logging out');
        });
    }

    const handleLogin = () => {
        fetch('http://localhost:8080/google/auth/url')
        .then(response => response.json())
        .then(data => {
            setAuthUrl(data.authorizationUrl);
        })
        .catch(error => {
            console.error('Error al obtener la URL de autorización', error);
        })
    }

    return {handleLogin, handleLogout};
}