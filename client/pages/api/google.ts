import toast from "react-hot-toast";
import { useGoogleContext } from "../../src/components/Context/GoogleContext";
import { useEventContext } from "../../src/components/Context/EventContext";
import { CalendarItem, Event } from "../../src/model/Scheme";

export function useGoogleHandler() {

    const { setCalendars, setSelectedCalendarId, setLoggedIn, setAuthUrl, loggedIn } = useGoogleContext();
    const { events, setEvents } = useEventContext();

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

    const handleLogout = () => {
        serverCheck()
        .then(response => {
            if (response) {
                fetch('http://localhost:8080/google/auth/logout', {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    }, 
                    credentials: 'include'
                })
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
            } else {
                toast.error('Server appears to be down');
            }
        })
    }

    const handleLogin = () => {
        serverCheck()
        .then(response => {
            if (response) {
                fetch('http://localhost:8080/google/auth/url', {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    }, 
                    credentials: 'include'
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data.authorizationUrl);
                    setAuthUrl(data.authorizationUrl);
                })
                .catch((error:any) => {
                    console.error('Error al obtener la URL de autorización', error);
                })
            } else {
                toast.error('Server appears to be down');
            }
        })
    }

    const checkAuthentication = async (emailParam:any, isUserLoggedIn:any) => {
        // if email in url
        if (emailParam) {
            try {
                const isAuthenticated = await isAuthenticatedUser(emailParam);
                if (isAuthenticated) {
                    localStorage.setItem("googleLoggedIn", emailParam);
                    if (!loggedIn) {
                        setLoggedIn(true);
                    }
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
                    localStorage.removeItem('googleLoggedIn');
                }    
            } catch (error) {
                toast.error("There has been an error in the authentication. Please, try again.")
                localStorage.removeItem('googleLoggedIn');
                setLoggedIn(false);
            }
        } else {
            setLoggedIn(false);
        }
    };

    const getCalendars = () => {
        return serverCheck()
        .then(response => {
            if (response) {
                return new Promise<boolean>((resolve, reject) => {
                    fetch('http://localhost:8080/google/calendar/list', {
                            method: 'GET',
                            credentials: 'include',
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.status === 'success') {
                                const calendars: CalendarItem[] = [];
                                data.value.map((calendar:any) => {
                                    calendars.push({id: calendar.id, name: calendar.summary, color: calendar.backgroundColor})
                                });
                                setCalendars(calendars);
                                resolve(true);
                            } else {
                                toast.error("Couldn't import the calendars.\nPlease log in with your Google account and try again.", {
                                    position: "top-center",
                                    duration: 6000,
                                    icon: "",
                                    style: {
                                        textAlign: "center"
                                    }
                                })
                                resolve(true);
                            }
                        })  
                        .catch(error => {
                            toast.error(`Error when fetching the calendars`);
                            resolve(false);
                        });
                    })
            }
            else {
                toast.error("Server appears to be down");
                return Promise.resolve(false);
            }
        });
    }

    const getCalendarEvents = (calendarId:string) => {
        return serverCheck()
        .then(response => {
            if (response) {
                return new Promise<boolean>((resolve, reject) => {
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
                            syncEvents(data);
                            resolve(true)
                        })
                        .catch(error => {
                            toast.error(`${error}`)
                            resolve(false)
                        });
                });
            } else {
                toast.error("Server appears to be down");
                return Promise.resolve(false);
            }
        });
    }

    const syncEvents = (data:Event[]) => {
        serverCheck()
        .then(response => {
            if (response) {
                setEvents(prevEvents => {
                    // filter events in data that we already have in events
                    const updatedEvents = prevEvents.filter(event => event.googleId && data.some(newEvent => newEvent.googleId === event.googleId));
            
                    // check if info in data events is the same as the one we have in existing events. If not, update values
                    updatedEvents.forEach(existingEvent => {
                        const newData = data.find(newEvent => newEvent.googleId === existingEvent.googleId);
                        if (newData) {
                            if (newData.desc !== existingEvent.desc)
                                existingEvent.desc = newData.desc;
                            if (existingEvent.title !== newData.title)
                                existingEvent.title = newData.title;
                            if (existingEvent.end !== newData.end)
                                existingEvent.end = newData.end;
                            if (existingEvent.start !== newData.start)
                                existingEvent.start = newData.start;
                            if (existingEvent.googleCalendar !== newData.googleCalendar)
                                existingEvent.googleCalendar = newData.googleCalendar;
                            if (existingEvent.googleHTML !== newData.googleHTML)
                                existingEvent.googleHTML = newData.googleHTML;
                        }
                    });
            
                    // filter new events that we dont have in events
                    const newEvents = data.filter(newEvent => !prevEvents.some(event => event.googleId === newEvent.googleId));
        
                    // filter events that are in events but not in data
                    const existingEvents = prevEvents.filter(prevEvent => !data.some(newEvent => newEvent.googleId === prevEvent.googleId));
            
                    // join new events with updated events
                    return [...existingEvents, ...updatedEvents, ...newEvents];
                });
            } else {
                toast.error("Server appears to be down");
            }
        })
    }

    const exportEvent = (selectedIndex:number) => {
        serverCheck()
        .then(response => {
            if (response) {
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
                        resolve();
                    })
                    .catch(error => {
                        toast.error(`${error}`);
                        reject(error);
                    });
                });
            } else {
                toast.error("Server appears to be down");
            }
        })
        return Promise.resolve(false);
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

    const updateAndSaveEvent = (eventToUpdate:any, googleId:any) => {
        // returning a promise for the toast only
        return new Promise((resolve, reject) => {
            serverCheck()
                .then(response => {
                    if (response) {
                        // format date to google format
                        const ISOStartDate = new Date(new Date(eventToUpdate.start).getTime() - (new Date(eventToUpdate.start).getTimezoneOffset() * 60000)).toISOString();
                        const ISOEndDate = new Date(new Date(eventToUpdate.end).getTime() - (new Date(eventToUpdate.end).getTimezoneOffset() * 60000)).toISOString();
                        fetch('http://localhost:8080/google/events/update', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ 
                                id: googleId,
                                start: ISOStartDate,
                                end: ISOEndDate,
                                title: eventToUpdate.title,
                                desc: eventToUpdate.desc,
                                calendarId: eventToUpdate.googleCalendar                     
                            }),
                            credentials: 'include',
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            if (data.status === 'error') {
                                reject(new Error(data.value));
                            } else {
                                resolve(data); // Resolve with the received data
                            }
                        })
                        .catch(error => {
                            reject(error); // Reject with any error occurred
                        });
                    } else {
                        toast.error("Server appears to be down");
                        reject(new Error("Server appears to be down"));
                    }
                })
        });
    }

    const isAuthenticatedUser = async (emailParam:string) => {
        try {
            const fetchResponse = await fetch('https://tidytime.onrender.com/google/auth/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: emailParam }),
                credentials: 'include',
            });
            const data = await fetchResponse.json();
            return data;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    return {handleLogin, handleLogout, getCalendars, getCalendarEvents, exportEvent, updateAndSaveEvent, isAuthenticatedUser, checkAuthentication};
}