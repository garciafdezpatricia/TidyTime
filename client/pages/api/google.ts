import toast from "react-hot-toast";
import { useGoogleContext } from "../../src/components/Context/GoogleContext";
import { useEventContext } from "../../src/components/Context/EventContext";
import { CalendarItem, Event } from "../../src/model/Scheme";
import { useTranslation } from "react-i18next";
import { useInruptHandler } from "./inrupt";

export function useGoogleHandler() {
    const { t } = useTranslation();
    const { setCalendars, setSelectedCalendarId, setLoggedIn, setAuthUrl, loggedIn } = useGoogleContext();
    const { updateEvent, createEvent } = useInruptHandler();
    const { events, setEvents } = useEventContext();

    const serverCheck = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/health-check`, { method: 'GET' });
    
            if (response.ok) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error checking server health:', error);
            return false;
        }
    };
    

    const handleLogout = async () => {
        const response = await serverCheck();
        if (response) {
            try {
                const aresponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/google/auth/logout`, {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    }, 
                    credentials: 'include'
                });
                const data = await aresponse.json();
                if (data.status === 'success'){
                    localStorage.removeItem("userLoggedIn");
                    // remove email param if it is in the url
                    if (window.location.search.includes('email')) {
                        const newUrl = window.location.origin + window.location.pathname;
                        window.history.replaceState({}, document.title, newUrl);
                    }
                    setCalendars([]);
                    setSelectedCalendarId("");
                    toast.success(t('toast.loggedOut'), {
                        position: "top-center"
                    })
                    setLoggedIn(false);
                } else {
                    toast.error(t('toast.loggedOutError'), {
                        position: "top-center"
                    })
                }  
            } catch (error) {
                console.error('Error when logging out');
            }   
        } else {
            toast.error(t('toast.serverDown'));
        }
    }

    const handleLogin = async () => {
        const response = await serverCheck();
        if (response) {
            try {
                const aresponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/google/auth/url`, {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    }, 
                    credentials: 'include'
                });
                const data = await aresponse.json();
                setAuthUrl(data.authorizationUrl);
            } catch (error) {
                console.error('Error al obtener la URL de autorización', error);
            }
        }
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
                toast.error(t('toast.errorAuthn'))
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
                toast.error(t('toast.errorAuthn'))
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
                    fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/google/calendar/list`, {
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
                                toast.error(t('toast.errorGoogle'), {
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
                            toast.error(t('toast.errorRetrieving'));
                            resolve(false);
                        });
                    })
            }
            else {
                toast.error(t('toast.serverDown'));
                return Promise.resolve(false);
            }
        });
    }

    const getCalendarEvents = async (calendarId:string) => {
        const response = await serverCheck();
        if (response) {
            try {
                const aresponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/google/events/get`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json'},
                        body: JSON.stringify({calendarId}),
                    });
                    const data = await aresponse.json();
                    data.map((event:any) => {
                        // the date coming from the backend is in format YYYY-MM-DDTHH:MM:SS.000Z => need to convert it to Fri Mar 29 ...
                        // when doing just new Date(...) the timezone is applied, changing the datetime fetched from the backend.
                        // The patch with the ISOString does not change datetimes.
                        event.start = new Date(new Date(event.start).toISOString().slice(0, 16));
                        event.end = new Date(new Date(event.end).toISOString().slice(0, 16));
                    })
                    await syncEvents(data);
            } catch (error) {
                toast.error(`${error}`)
            }
        }
    }

    const syncEvents = async (data:Event[]) => {
        const response = await serverCheck();
        if (response) {
            try {
                const prevEvents = [...events];
                // filter events in data that we already have in events
                const updatedEvents = prevEvents.filter(event => event.googleId && data.some(newEvent => newEvent.googleId === event.googleId));
                // check if info in data events is the same as the one we have in existing events. If not, update values
                for (const existingEvent of updatedEvents ) {
                    const newData = data.find(newEvent => newEvent.googleId === existingEvent.googleId);
                    let updated = false;
                    if (newData) {
                        if (newData.desc !== existingEvent.desc) {
                            existingEvent.desc = newData.desc; 
                            updated = true;
                        }
                        if (existingEvent.title !== newData.title) {
                            existingEvent.title = newData.title;
                            updated = true;
                        }
                        if (existingEvent.end !== newData.end) {
                            existingEvent.end = newData.end;
                            updated = true;
                        }
                        if (existingEvent.start !== newData.start) {
                            existingEvent.start = newData.start;
                            updated = true;
                        }
                        if (existingEvent.googleCalendar !== newData.googleCalendar) {
                            existingEvent.googleCalendar = newData.googleCalendar;
                            updated = true;
                        }
                        if (existingEvent.googleHTML !== newData.googleHTML) {
                            existingEvent.googleHTML = newData.googleHTML;
                            updated = true;
                        }
                        if (updated) {
                            await updateEvent(existingEvent);
                        }
                    }
                }
                
                // filter new events that we dont have in events
                const newEvents = data.filter(newEvent => !prevEvents.some(event => event.googleId === newEvent.googleId));
                for (const newEvent of newEvents) {
                    await createEvent(newEvent);
                }
                // filter events that are in events but not in data
                const existingEvents = prevEvents.filter(prevEvent => !data.some(newEvent => newEvent.googleId === prevEvent.googleId));
                // join new events with updated events
                const finalEvents = [...existingEvents, ...updatedEvents, ...newEvents];
                setEvents(finalEvents);
            } catch (error) {
                console.log(error);
            }
        }
    }

    const exportEvent = async (selectedIndex:number) => {
        const response = await serverCheck();
        if (response) {
            try {
                const eventToShare = events[selectedIndex];
                // format date to google format
                const ISOStartDate = new Date(new Date(eventToShare.start).getTime() - (new Date(eventToShare.start).getTimezoneOffset() * 60000)).toISOString();
                const ISOEndDate = new Date(new Date(eventToShare.end).getTime() - (new Date(eventToShare.end).getTimezoneOffset() * 60000)).toISOString();
                const aresponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/google/events/insert`, {
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
                });
                const data = await aresponse.json();
                await addGoogleInformation(data.googleId, data.googleHTML, selectedIndex);
                toast.success(t('toast.exported'));                
            } catch (error) {
                toast.error(`${error}`);
            }
        }
    }

    /**
     * Auxiliary function to add google id and google html link to the event.
     * @param googleId contains event id on google
     * @param googleHTML contains the link to the event
     */
    const addGoogleInformation = async (googleId:string, googleHTML:string, selectedIndex:number) => {
        // update event with google id and html
        let updatedEvents = [...events];
        let eventToUpdate = events[selectedIndex];
        eventToUpdate.googleId = googleId;
        eventToUpdate.googleHTML = googleHTML;
        await updateEvent(eventToUpdate);
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
                        fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/google/events/update`, {
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
                        toast.error(t('toast.serverDown'));
                        reject(new Error("Server appears to be down"));
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        });
    }

    const isAuthenticatedUser = async (emailParam:string) => {
        try {
            const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_BACK_URL}/google/auth/email`, {
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