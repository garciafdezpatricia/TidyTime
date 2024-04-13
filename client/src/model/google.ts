import toast from "react-hot-toast";
import { useGoogleContext } from "../components/Context/GoogleContext";
import { useEventContext } from "../components/Context/EventContext";

export function useGoogleHandler() {

    const { setCalendars, setSelectedCalendarId, setLoggedIn, setAuthUrl } = useGoogleContext();
    const { events, setEvents } = useEventContext();

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

    const getCalendars = (calendarId:string) => {
        return new Promise<void>((resolve, reject) => {
            fetch('http://localhost:8080/google/events/get', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({calendarId}),
            })
            .then(response => response.json())
            .then(data => {
                data.map((event:any) => {
                    // the date coming from the backend is in format YYYY-MM-DDTHH:MM:SS.000Z => need to convert it to Fri Mar 29 ...
                    // when doing just new Date(...) the timezone is applied, changing the datetime fetched from the backend.
                    // The patch with the ISOString does not change datetimes.
                    event.start = new Date(new Date(event.start).toISOString().slice(0, 16));
                    event.end = new Date(new Date(event.end).toISOString().slice(0, 16));
                })
                setEvents((prev) => [...prev, ...data]);
                resolve()
            })
            .catch(error => {
                toast.error(`${error}`)
                reject(error);
            });
        })
    }

    const exportEvent = (selectedIndex:number) => {
        return new Promise<void>((resolve, reject) => {
            const eventToShare = events[selectedIndex];
            // format date to google format
            const ISOStartDate = new Date(new Date(eventToShare.start).getTime() - (new Date(eventToShare.start).getTimezoneOffset() * 60000)).toISOString();
            const ISOEndDate = new Date(new Date(eventToShare.end).getTime() - (new Date(eventToShare.end).getTimezoneOffset() * 60000)).toISOString();
            fetch('http://localhost:8080/google/events/insert', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    start: ISOStartDate,
                    end: ISOEndDate,
                    title: eventToShare.title,
                    desc: eventToShare.desc,                     
                }),
                credentials: 'include',
            })
            .then(response => response.json())
            .then(data => {
                addGoogleInformation(data.googleId, data.googleHTML, selectedIndex);
                toast.success('Event exported to Google Calendar!', {position: "bottom-center"});
            })
            .catch(error => {
                toast.error(`${error}`);
            });
        })
    }

    /**
     * Auxiliary function to add google id and google html link to the event.
     * @param googleId contains event id on google
     * @param googleHTML contains the link to the event
     */
    const addGoogleInformation = (googleId:string, googleHTML:string, selectedIndex:number) => {
        // update event with google id and html
        let updatedEvents = [...events];
        let eventToUpdate = events[selectedIndex];
        eventToUpdate.googleId = googleId;
        eventToUpdate.googleHTML = googleHTML;
        updatedEvents = [
            ...events.slice(0, selectedIndex),
            eventToUpdate,
            ...events.slice(selectedIndex + 1)
        ];
        setEvents(updatedEvents);
    }

    return {handleLogin, handleLogout, getCalendars, exportEvent};
}