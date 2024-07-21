// Copyright 2024 Patricia García Fernández.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const express = require("express");
require('dotenv').config();
const { addStringNoLocale, createThing, getSolidDataset, createContainerAt,  
    getThing, getStringNoLocale, getNamedNode, getAltProfileUrlAllFrom, 
    getPodUrlAll,  buildThing, createSolidDataset, setThing,
    saveSolidDatasetAt, getInteger, getStringNoLocaleAll, getBoolean, 
    getThingAll, removeAll, deleteSolidDataset, removeThing,
    getDatetime} = require("@inrupt/solid-client");
const { Session, getSessionFromStorage } = require("@inrupt/solid-client-authn-node");
const { foaf, vcard } = require('rdf-namespaces');
const { InMemoryStorage } = require("@inrupt/solid-client-authn-core");

const router = express.Router();
const storage = new InMemoryStorage();

// vocab
const CONFIG_OBJECT = "https://example.com/configuration";
const WEEK_START = "https://example.com/weekStart";
const CALENDAR_VIEW = "https://example.com/calendarView";
const SHOW_TASK = "https://example.com/showTask";
const BOARD_COLUMN = "https://example.com/boardColumns";
const LIST_NAME = "https://example.com/listNames";
const LIST_ID = "https://example.com/listId";
const LABEL_OBJECT = "https://example.com/label";
const LABEL_NAME = "https://example.com/name";
const LABEL_COLOR = "https://example.com/color";
const DATA_RECORD = "https://example.com/dataRecord";
const TASK = "https://example.com/task";
const TASK_ID = "https://example.com/taskId";
const TASK_TITLE = "https://example.com/taskTitle";
const TASK_DESC = "https://example.com/taskDesc";
const TASK_DATE = "https://example.com/taskDate";
const TASK_DIFFICULTY = "https://example.com/taskDifficulty";
const TASK_DONE = "https://example.com/taskDone";
const TASK_IMPORTANT = "https://example.com/taskImportant";
const TASK_LISTINDEX = "https://example.com/taskListIndex";
const TASK_GHHTML = "https://example.com/taskGhHtml";
const TASK_GHURL = "https://example.com/taskGhUrl";
const TASK_STATUS = "https://example.com/taskStatus";
const EVENT = "https://example.com/event";
const EVENT_ID = "https://example.com/eventId";
const EVENT_TITLE = "https://example.com/eventTitle";
const EVENT_DESC = "https://example.com/eventDesc";
const EVENT_START_DATE = "https://example.com/eventStartDate";
const EVENT_END_DATE = "https://example.com/eventEndDate";
const EVENT_COLOR = "https://example.com/eventColor";
const EVENT_ISTASK = "https://example.com/isTask";
const EVENT_GID = "https://example.com/googleId";
const EVENT_GCALENDAR = "https://example.com/googleCalendar";
const EVENT_GHTML = "https://example.com/googleHtml";

/**
 * Get the user name from the webId dataset
 * @param {} webId contains the webId URL
 * @param {*} dataset corresponds to the dataset containing the webId
 * @returns the name present in the WebId document if any. It returns null in case
 * no name is found for foaf.name or vcard.fn predicates
 */
function getNameFromWebId(webId, dataset) {
    const webIdThing = getThing(dataset, webId);
    const namePredicates = [foaf.name, vcard.fn]; 
    const userName = namePredicates.reduce((acc, predicate) =>
        acc ??
        getStringNoLocale(webIdThing, predicate) ??
        getNamedNode(webIdThing, predicate)?.value ??
        null
    , null);
    return userName;
}

/**
 * Create the root container in the user Pod for the Application if it doesn't already exist in the user's pod.
 * @param {*} session corresponds to the session from which the pod is going to be extracted.
 * @returns true if it created the container, false otherwise.
 */
async function createRootContainer(session) {
    try {
        if (session) {
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            await createContainerAt(`${storage}/TidyTime`, {fetch: session.fetch});
            return true;
        }
    } catch (error)  {
        return false;
    }
}

/**
 * Poblates the root container in the user Pod for the Application with the initial needed information. This information
 * would be the default configuration and the [[Thing]] which will keep the record of tasks.
 * @param {*} session contains the session of the user.
 */
async function poblateRootContainer(session) {
    try {
        if (session) {
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            const rootStorage = `${storage}/TidyTime`;
            // dataset containing the default configuration
            let dataset = createSolidDataset();
            const configThing = buildThing(createThing({ name: "configuration" }))
            .addStringNoLocale(CALENDAR_VIEW, "month")
            .addStringNoLocale(BOARD_COLUMN, "To do")
            .addStringNoLocale(BOARD_COLUMN, "In progress")
            .addStringNoLocale(BOARD_COLUMN, "Done")
            .addBoolean(SHOW_TASK, true)
            .addInteger(WEEK_START, 1)
            .addUrl(CONFIG_OBJECT, CONFIG_OBJECT)
            .build();
            const label1 = buildThing(createThing({ name: "label1" }))
            .addStringNoLocale(LABEL_NAME, "home")
            .addStringNoLocale(LABEL_COLOR, "#ad30ad")
            .addUrl(LABEL_OBJECT, LABEL_OBJECT)
            .build();
            const label2 = buildThing(createThing({ name: "label2" }))
            .addStringNoLocale(LABEL_NAME, "school")
            .addStringNoLocale(LABEL_COLOR, "#5930ab")
            .addUrl(LABEL_OBJECT, LABEL_OBJECT)
            .build();
            const label3 = buildThing(createThing({ name: "label3" }))
            .addStringNoLocale(LABEL_NAME, "work")
            .addStringNoLocale(LABEL_COLOR, "#e6a937")
            .addUrl(LABEL_OBJECT, LABEL_OBJECT)
            .build();
            dataset = setThing(dataset, configThing);
            dataset = setThing(dataset, label1);
            dataset = setThing(dataset, label2);
            dataset = setThing(dataset, label3);
            await saveSolidDatasetAt(`${rootStorage}/config`, dataset, {fetch: session.fetch});
            // dataset for the records
            let recordDataset = createSolidDataset();
            const taskRecordThing = buildThing(createThing({ name: "taskRecord" }))
            .addUrl(DATA_RECORD, DATA_RECORD)
            .build();
            const eventRecordThing = buildThing(createThing({ name: "eventRecord" }))
            .addUrl(DATA_RECORD, DATA_RECORD)
            .build();
            recordDataset = setThing(recordDataset, taskRecordThing);
            recordDataset = setThing(recordDataset, eventRecordThing);
            await saveSolidDatasetAt(`${rootStorage}/data`, recordDataset, {fetch: session.fetch});
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * Retrieves the configuration stored for the Application.
 * @param {*} session contains the session of the user.
 * @returns object containing the configuration as its properties: calendarView:string, showTasksInCalendar:bool, weekStart:int,
 * boardColumns:string[] and labels: { color: string, name: string }[].
 */
async function getApplicationConfiguration(session) {
    try {
        if (session) {
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            const rootStorage = `${storage}/TidyTime`;
            // configuration dataset
            const dataset = await getSolidDataset(`${rootStorage}/config`, {fetch: session.fetch});
            const things = getThingAll(dataset);
            const configThing = things.filter((thing) => thing.url.includes("#configuration"))[0];
            let result = {
                calendarView: getStringNoLocale(configThing, CALENDAR_VIEW),
                showTasksInCalendar: getBoolean(configThing, SHOW_TASK),
                weekStart: getInteger(configThing, WEEK_START),
                boardColumns: getStringNoLocaleAll(configThing, BOARD_COLUMN),
            }
            const labels = await Promise.all(things
            .filter((thing) => thing.url.includes("#label"))
            .map(async (thing) => {
                const name = getStringNoLocale(thing, LABEL_NAME);
                const color = getStringNoLocale(thing, LABEL_COLOR);
                return {
                    color: color,
                    name: name
                };
            }));
            return {...result, labels: labels};
        }
    } catch (error) {
        if (error.toString().includes("404")) {
            throw error;
        }
        console.log(error);
    }
}

/**
 * Stores the Application configuration in the user's pod.
 * @param {*} session contains the session of the user.
 * @param {*} labels contains the task labels to be stored: { color: string, name: string }[].
 * @param {*} showTasksInCalendar contains the whether tasks with date are wanted to be shown in the calendar: boolean.
 * @param {*} boardColumns contains the columns of the board: string[].
 * @param {*} weekStart contains the starting week day for the calendar: int.
 * @param {*} calendarView contains the default calendar view: string.
 * @returns true if the configuration was correctly stored, false otherwise.
 */
async function storeApplicationConfiguration(session, labels, showTasksInCalendar, boardColumns, weekStart, calendarView ) {
    try {
        if (session) {
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            const rootStorage = `${storage}/TidyTime`;
            // delete the current configuration dataset
            await deleteSolidDataset(`${rootStorage}/config`, {fetch: session.fetch});
            // create new configuration dataset with new values
            let dataset = createSolidDataset();
            let configThing = buildThing(createThing({ name: "configuration" }))
            .addStringNoLocale(CALENDAR_VIEW, calendarView)
            .addBoolean(SHOW_TASK, showTasksInCalendar)
            .addInteger(WEEK_START, weekStart)
            .addUrl(CONFIG_OBJECT, CONFIG_OBJECT)
            .build();
            configThing = boardColumns.reduce((configThing, column) => {
                configThing = addStringNoLocale(configThing, BOARD_COLUMN, column);
                return configThing;
            }, configThing);
            let labelsThing = labels.map((label, index) => {
                return buildThing(createThing({ name: `label${index}` }))
                .addStringNoLocale(LABEL_NAME, label.name)
                .addStringNoLocale(LABEL_COLOR, label.color)
                .addUrl(LABEL_OBJECT, LABEL_OBJECT)
                .build();
            });
            dataset = setThing(dataset, configThing);
            dataset = labelsThing.reduce((dataset, labelThing) => {
                dataset = setThing(dataset, labelThing);
                return dataset;
            }, dataset)
            await saveSolidDatasetAt(`${rootStorage}/config`, dataset, {fetch: session.fetch});
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Retrieves the board columns from the user's pod.
 * @param {*} session contains the session of the user.
 * @returns object with board columns { boardColumns: string[] }.
 */
async function getBoardColumnsConfiguration(session) {
    try {
        if (session) {
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            const rootStorage = `${storage}/TidyTime`;
            // get the board columns from the config dataset
            const dataset = await getSolidDataset(`${rootStorage}/config`, {fetch: session.fetch});
            const things = getThingAll(dataset);
            const configThing = things.filter((thing) => thing.url.includes("#configuration"))[0];
            let result = {
                boardColumns: getStringNoLocaleAll(configThing, BOARD_COLUMN),
            }
            return result;
        }
    } catch (error) {
        if (error.toString().includes("404")) {
            throw error;
        }
        console.log(error);
    }
}

/**
 * Stores the board columns in the user's pod.
 * @param {*} session contains the user's session.
 * @param {*} boardColumns contains the board columns to be stored: string[].
 * @returns 
 */
async function storeBoardColumns(session, boardColumns) {
    try {
        if (session) {
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            const rootStorage = `${storage}/TidyTime`;
            
            let dataset = await getSolidDataset(`${rootStorage}/config`, {fetch: session.fetch});
            const things = getThingAll(dataset);
            let configThing = things.filter((thing) => thing.url.includes("#configuration"))[0];
            // remove all
            configThing = removeAll(configThing, BOARD_COLUMN);
            configThing = boardColumns.reduce((configThing, column) => {
                configThing = addStringNoLocale(configThing, BOARD_COLUMN, column);
                return configThing;
            }, configThing);
            dataset = setThing(dataset, configThing);
            await saveSolidDatasetAt(`${rootStorage}/config`, dataset, {fetch: session.fetch});
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

// calendar view, week start and show tasks in calendar (change that bit to calendar panel)
/**
 * Retrieves the configuration stored for the calendar module.
 * @param {*} session contains the user's session.
 * @returns object containing configuration.
 */
async function getCalendarConfiguration(session) {
    try {
        if (session) {
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            const rootStorage = `${storage}/TidyTime`;

            const dataset = await getSolidDataset(`${rootStorage}/config`, {fetch: session.fetch});
            const things = getThingAll(dataset);
            const configThing = things.filter((thing) => thing.url.includes("#configuration"))[0];
            let result = {
                calendarView: getStringNoLocale(configThing, CALENDAR_VIEW),
                showTasksInCalendar: getBoolean(configThing, SHOW_TASK),
                weekStart: getInteger(configThing, WEEK_START),
            }
            return {status: true, data: result};
        }
    } catch (error) {
        console.log(error);
        return {status: false};
    }
}

/**
 * Retrieves the task ids from the task record.
 * @param {*} session contains the user's session.
 * @param {*} things contains the things from the application dataset.
 * @returns 
 */
function getTasksIds(session, things) {
    if (session) {
        const taskRecordThing = things.filter((thing) => thing.url.includes("#taskRecord"))[0];
        let tasksIds = [];
        if (taskRecordThing) {
            tasksIds = getStringNoLocaleAll(taskRecordThing, TASK_ID);
        }
        return tasksIds;
    }
}
 
// TODO: make getEVentsIds and getTasksIds the same function -> make taskRecord smth like dataRecord
/**
 * Retrieves the event ids from the event record
 * @param {*} session contains the user's session.
 * @param {*} things contains the things from the application dataset.
 * @returns 
 */
function getEventsIds(session, things) {
    if (session) {
        const eventRecordThing = things.filter((thing) => thing.url.includes("#eventRecord"))[0];
        let eventsIds = [];
        if (eventRecordThing) {
            eventsIds = getStringNoLocaleAll(eventRecordThing, EVENT_ID); // TODO: same here, event id and task id could point to the same url
        }
        return eventsIds;
    }
}

/**
 * Retrieves the task from the task dataset.
 * @param {*} session contains the user's session.
 * @param {*} taskId contains the task id.
 * @returns task object.
 */
async function getTask(session, taskId) {
    if (session) {
        const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
        const rootStorage = `${storage}/TidyTime`;

        const taskDataset = await getSolidDataset(`${rootStorage}/tasks/${taskId}`, {fetch: session.fetch});
        const things = getThingAll(taskDataset);
        const taskThing = things.filter((thing) => thing.url.includes("#task"))[0];
        let result = null
        if (taskThing) {
            const id = getStringNoLocale(taskThing, TASK_ID);
            const title = getStringNoLocale(taskThing, TASK_TITLE);
            const desc = getStringNoLocale(taskThing, TASK_DESC) ?? "";
            const date = getStringNoLocale(taskThing, TASK_DATE) ?? "";
            const difficulty = getInteger(taskThing, TASK_DIFFICULTY) ?? 0;
            const done = getBoolean(taskThing, TASK_DONE) ?? false;
            const important = getBoolean(taskThing, TASK_IMPORTANT) ?? 0;
            const listIndex = getStringNoLocale(taskThing, TASK_LISTINDEX);
            const githubHtml = getStringNoLocale(taskThing, TASK_GHHTML) ?? "";
            const githubUrl = getStringNoLocale(taskThing, TASK_GHURL) ?? "";
            const status = getInteger(taskThing, TASK_STATUS) ?? 0;
            result = { id: id, title: title, desc: desc, endDate: date, difficulty: difficulty,
                done: done, important: important, listIndex: listIndex, githubHtml: githubHtml,
                githubUrl: githubUrl, status: status
            };
        }   
        const labels = await Promise.all(things
            .filter((thing) => thing.url.includes("#label"))
            .map(async (thing) => {
                const name = getStringNoLocale(thing, LABEL_NAME);
                const color = getStringNoLocale(thing, LABEL_COLOR);
                return {
                    color: color,
                    name: name
                };
            }));
        result = {...result, labels: labels};
        return result;
    }
}

/**
 * Retrieves all the application data.
 * @param {*} session contains the user's session.
 * @returns object containing all the data.
 */
async function getApplicationData(session) {
    try {
        if (session) {
            let tasks = [];
            let listNames = [];
            const taskResponse = await getTasks(session);
            if (taskResponse.status === "success") {
                tasks = taskResponse.data.tasks;
                listNames = taskResponse.data.listNames;
            }
            let events = [];
            const eventResponse = await getEvents(session);
            if (eventResponse.status === "success") {
                events = eventResponse.data.events;
            }
            return { status: "success", tasks: {tasks: tasks, listNames: listNames}, events: events };
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return {status: "empty"};    
        }
        return {status: "fail"};
    }
}

/**
 * Get all the labels.
 * @param {*} session contains the user's session.
 * @returns object containing all the labels.
 */
async function getLabels(session) {
    try {
        if (session) {
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            const rootStorage = `${storage}/TidyTime`;

            const dataset = await getSolidDataset(`${rootStorage}/config`, {fetch: session.fetch});
            const things = getThingAll(dataset);
            const labels = await Promise.all(things
            .filter((thing) => thing.url.includes("#label"))
            .map(async (thing) => {
                const name = getStringNoLocale(thing, LABEL_NAME);
                const color = getStringNoLocale(thing, LABEL_COLOR);
                return {
                    color: color,
                    name: name
                };
            }));
            return labels;
        }
    } catch (error) {
        return [];
    }
}

/**
 * Retreieves the tasks and the task lists.
 * @param {*} session contains the user's session.
 * @returns object containing task and task lists.
 */
async function getTasks(session) {
    try {
        if (session) {
            let tasks = [];
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            const rootStorage = `${storage}/TidyTime`;

            const dataset = await getSolidDataset(`${rootStorage}/data`, {fetch: session.fetch});
            const things = getThingAll(dataset);
            const listNamesThings = things.filter((thing) => thing.url.includes("#listName"));
            const listNames = listNamesThings.map((thing) => {
                const name = getStringNoLocale(thing, LIST_NAME);
                const id = getStringNoLocale(thing, LIST_ID);
                return {
                    name: name,
                    id: id
                }
            });
            if (listNames.length > 0) {
                const tasksIds = getTasksIds(session, things);
                tasks = await Promise.all(tasksIds.map(async (taskId) => await getTask(session, taskId)));
            }
            let data = {
                listNames: listNames, tasks: tasks
            }
            return { status: "success", data: {listNames: listNames, tasks: tasks} }
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return {status: "empty"};    
        }
        return {status: "fail"};
    }
}

/**
 * Creates a thing for a task.
 * @param {*} task contains the task.
 * @returns the thing representing the task.
 */
async function createTaskThing(task) {
    let newTask = buildThing(createThing({name: "task"}))
    .addStringNoLocale(TASK_ID, task.id)
    .addStringNoLocale(TASK_TITLE, task.title)
    .addStringNoLocale(TASK_DESC, task.desc ?? "")
    .addStringNoLocale(TASK_DATE, task.endDate ?? "")
    .addStringNoLocale(TASK_GHHTML, task.githubHtml ?? "")
    .addStringNoLocale(TASK_GHURL, task.githubUrl ?? "")
    .addInteger(TASK_DIFFICULTY, task.difficulty ?? 0)
    .addStringNoLocale(TASK_LISTINDEX, task.listIndex)
    .addInteger(TASK_STATUS, task.status ?? 0)
    .addBoolean(TASK_DONE, task.done ?? false)
    .addBoolean(TASK_IMPORTANT, task.important ?? false)
    .addUrl(TASK, TASK)
    .build();
    
    return newTask;
}

/**
 * Creates a thing for an event.
 * @param {*} event contains the event.
 * @returns the thing representing the event.
 */
async function createEventThing(event) {
    let newEvent = buildThing(createThing({name: "event"}))
    .addStringNoLocale(EVENT_ID, event.eventId)
    .addStringNoLocale(EVENT_TITLE, event.title)
    .addStringNoLocale(EVENT_DESC, event.desc ?? "")
    .addDatetime(EVENT_START_DATE, new Date(event.start))
    .addDatetime(EVENT_END_DATE, new Date(event.end)) 
    .addStringNoLocale(EVENT_COLOR, event.color)
    .addBoolean(EVENT_ISTASK, event.isTask ?? 0)
    .addStringNoLocale(EVENT_GHTML, event.googleHTML ?? "")
    .addStringNoLocale(EVENT_GID, event.googleId ?? "")
    .addStringNoLocale(EVENT_GCALENDAR, event.googleCalendar ?? "")
    .addUrl(EVENT, EVENT)
    .build();
    return newEvent;
}

/**
 * Creates a new task.
 * @param {*} session contains the user's session.
 * @param {*} task contains the task to be created.
 * @returns 
 */
async function createTask(session, task) {
    try {
        if (session) {
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            const rootStorage = `${storage}/TidyTime`;
            
            // create thing dataset and add the things and labels (if any)
            let taskDataset = createSolidDataset();
            let taskThing = await createTaskThing(task);
            taskDataset = setThing(taskDataset, taskThing);
            if (task.labels) {
                let labelsThing = task.labels.map((label, index) => {
                    return buildThing(createThing({ name: `label${index}` }))
                    .addStringNoLocale(LABEL_NAME, label.name)
                    .addStringNoLocale(LABEL_COLOR, label.color)
                    .addUrl(LABEL_OBJECT, LABEL_OBJECT)
                    .build();
                });
                taskDataset = labelsThing.reduce((taskDataset, labelThing) => {
                    taskDataset = setThing(taskDataset, labelThing);
                    return taskDataset;
                }, taskDataset)
            }
            await saveSolidDatasetAt(`${rootStorage}/tasks/${task.id}`, taskDataset, {fetch: session.fetch});

            // if it exists, update task record, else create it
            let dataset = await getSolidDataset(`${rootStorage}/data`, {fetch: session.fetch});
            const things = getThingAll(dataset);
            let taskRecordThing = things.filter((thing) => thing.url.includes("#taskRecord"))[0];
            if (taskRecordThing) {
                taskRecordThing = buildThing(taskRecordThing)
                .addStringNoLocale(TASK_ID, task.id)
                .build();
            } else {
                taskRecordThing = buildThing(createThing({name: "taskRecord"}))
                .addStringNoLocale(TASK_ID, task.id)
                .build();
            }
            dataset = setThing(dataset, taskRecordThing);
            await saveSolidDatasetAt(`${rootStorage}/data`, dataset, {fetch: session.fetch});
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Creates a new event.
 * @param {*} session contains the user's session.
 * @param {*} event contains the event to be created.
 * @returns 
 */
async function createEvent(session, event) {
    try {
        if (session) {
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            const rootStorage = `${storage}/TidyTime`;
            
            // create thing dataset and add the things
            let eventDataset = createSolidDataset();
            let eventThing = await createEventThing(event);
            eventDataset = setThing(eventDataset, eventThing);
            await saveSolidDatasetAt(`${rootStorage}/events/${event.eventId}`, eventDataset, {fetch: session.fetch});

            // if it exists, update event record, else create it
            let dataset = await getSolidDataset(`${rootStorage}/data`, {fetch: session.fetch});
            const things = getThingAll(dataset);
            let eventRecordThing = things.filter((thing) => thing.url.includes("#eventRecord"))[0];
            if (eventRecordThing) {
                eventRecordThing = buildThing(eventRecordThing)
                .addStringNoLocale(EVENT_ID, event.eventId)
                .build();
            } else {
                eventRecordThing = buildThing(createThing({name: "eventRecord"}))
                .addStringNoLocale(EVENT_ID, event.eventId)
                .build();
            }
            dataset = setThing(dataset, eventRecordThing);
            await saveSolidDatasetAt(`${rootStorage}/data`, dataset, {fetch: session.fetch});
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

/**
 * Updates a task.
 * @param {*} session contains the user's session.
 * @param {*} task contains the task to be updated.
 * @param {*} updateAll flag to indicate whether all the task should be updated or just the status.
 * @returns 
 */
async function updateTask(session, task, updateAll) {
    if (session) {
        try {
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            const rootStorage = `${storage}/TidyTime`;
            let taskDataset = await getSolidDataset(`${rootStorage}/tasks/${task.id}`, {fetch: session.fetch});
            let things = getThingAll(taskDataset);
            let taskThing = things.filter((thing) => thing.url.includes("#task"))[0];

            if (updateAll) {
                if (taskThing) {
                    await deleteSolidDataset(`${rootStorage}/tasks/${task.id}`, {fetch: session.fetch});
                    taskDataset = createSolidDataset();
                    let newTask = await createTaskThing(task);
                    taskDataset = setThing(taskDataset, newTask);
                    if (task.labels) {
                        let labelsThing = task.labels.map((label, index) => {
                            return buildThing(createThing({ name: `label${index}` }))
                            .addStringNoLocale(LABEL_NAME, label.name)
                            .addStringNoLocale(LABEL_COLOR, label.color)
                            .addUrl(LABEL_OBJECT, LABEL_OBJECT)
                            .build();
                        });
                        taskDataset = labelsThing.reduce((taskDataset, labelThing) => {
                            taskDataset = setThing(taskDataset, labelThing);
                            return taskDataset;
                        }, taskDataset)
                    }
                    await saveSolidDatasetAt(`${rootStorage}/tasks/${task.id}`, taskDataset, {fetch: session.fetch});
                }
            } else {
                if (taskThing) {
                    taskThing = removeAll(taskThing, TASK_DONE);
                    taskThing = buildThing(taskThing)
                    .addBoolean(TASK_DONE, task.done)
                    .build();
                    taskDataset = setThing(taskDataset, taskThing);
                    await saveSolidDatasetAt(`${rootStorage}/tasks/${task.id}`, taskDataset, {fetch: session.fetch});
                }           
            }
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

/**
 * Updates an event.
 * @param {*} session contains the user's session.
 * @param {*} event contains the event to be updated.
 * @returns 
 */
async function updateEvent(session, event) {
    if (session) {
        try {
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            const rootStorage = `${storage}/TidyTime`;
            let eventDataset = await getSolidDataset(`${rootStorage}/events/${event.eventId}`, {fetch: session.fetch});
            let things = getThingAll(eventDataset);
            let eventThing = things.filter((thing) => thing.url.includes("#event"))[0];
            if (eventThing) {
                await deleteSolidDataset(`${rootStorage}/events/${event.eventId}`, {fetch: session.fetch});
                eventDataset = createSolidDataset();
                let newEvent = await createEventThing(event);
                eventDataset = setThing(eventDataset, newEvent);
                await saveSolidDatasetAt(`${rootStorage}/events/${event.eventId}`, eventDataset, {fetch: session.fetch});
                return true;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

/**
 * Updates the task status.
 * @param {*} session contains the user's session.
 * @param {*} task contains the task to be updated.
 * @returns 
 */
async function updateTaskStatus(session, task) {
    if (session) {
        try {
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            const rootStorage = `${storage}/TidyTime`;
            let taskDataset = await getSolidDataset(`${rootStorage}/tasks/${task.id}`, {fetch: session.fetch});
            let things = getThingAll(taskDataset);
            let taskThing = things.filter((thing) => thing.url.includes("#task"))[0];
            if (taskThing) {
                taskThing = removeAll(taskThing, TASK_STATUS);
                taskThing = buildThing(taskThing)
                .addInteger(TASK_STATUS, task.status)
                .build();
                taskDataset = setThing(taskDataset, taskThing);
                await saveSolidDatasetAt(`${rootStorage}/tasks/${task.id}`, taskDataset, {fetch: session.fetch});
            }           
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

/**
 * Deletes a task from the Solid POD.
 * @param {*} session contains the user's session.
 * @param {*} task to be deleted.
 * @returns 
 */
async function deleteTask(session, task) {
    if (session) {
        try {
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            const rootStorage = `${storage}/TidyTime`;
            
            let taskRecordDataset = await getSolidDataset(`${rootStorage}/data`, {fetch: session.fetch});
            const things = getThingAll(taskRecordDataset);
            // remove task from record
            let taskRecordThing = things.filter((thing) => thing.url.includes("#taskRecord"))[0];
            if (taskRecordThing) {
                let tasksIds = getStringNoLocaleAll(taskRecordThing, TASK_ID).filter((taskId) => taskId !== task.id);
                taskRecordThing = removeAll(taskRecordThing, TASK_ID);
                if (tasksIds && tasksIds.length > 0) {
                    taskRecordThing = tasksIds.reduce((taskRecordThing, taskId) => {
                        taskRecordThing = addStringNoLocale(taskRecordThing, TASK_ID, taskId);
                        return taskRecordThing;
                    }, taskRecordThing)
                }
                taskRecordDataset = setThing(taskRecordDataset, taskRecordThing);
                await saveSolidDatasetAt(`${rootStorage}/data`, taskRecordDataset, {fetch: session.fetch});
            }
            
            // remove task dataset
            await deleteSolidDataset(`${rootStorage}/tasks/${task.id}`, {fetch: session.fetch});
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

/**
 * Deletes an event from the Solid POD.
 * @param {*} session contains the user's session
 * @param {*} event to be deleted.
 * @returns 
 */
async function deleteEvent(session, event) {
    if (session) {
        try {
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            const rootStorage = `${storage}/TidyTime`;
            
            let eventRecordDataset = await getSolidDataset(`${rootStorage}/data`, {fetch: session.fetch});
            const things = getThingAll(eventRecordDataset);
            // remove event from record
            let eventRecordThing = things.filter((thing) => thing.url.includes("#eventRecord"))[0];
            if (eventRecordThing) {
                let eventsIds = getStringNoLocaleAll(eventRecordThing, EVENT_ID).filter((eventId) => eventId !== event.eventId);
                eventRecordThing = removeAll(eventRecordThing, EVENT_ID);
                if (eventsIds && eventsIds.length > 0) {
                    eventRecordThing = eventsIds.reduce((eventRecordThing, eventId) => {
                        eventRecordThing = addStringNoLocale(eventRecordThing, EVENT_ID, eventId);
                        return eventRecordThing;
                    }, eventRecordThing)
                }
                eventRecordDataset = setThing(eventRecordDataset, eventRecordThing);
                await saveSolidDatasetAt(`${rootStorage}/data`, eventRecordDataset, {fetch: session.fetch});
            }
            // remove event dataset
            await deleteSolidDataset(`${rootStorage}/events/${event.eventId}`, {fetch: session.fetch});
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

/**
 * Deletes task list from the Solid POD.
 * @param {*} session contains the user's session.
 * @param {*} tasksIds contains all the tasks to be deleted.
 * @returns 
 */
async function deleteList(session, tasksIds) {
    if (session) {
        try {
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            const rootStorage = `${storage}/TidyTime`;
            
            let taskRecordDataset = await getSolidDataset(`${rootStorage}/data`, {fetch: session.fetch});
            const things = getThingAll(taskRecordDataset);
            // remove tasks from record
            let taskRecordThing = things.filter((thing) => thing.url.includes("#taskRecord"))[0];
            if (taskRecordThing) {
                let remainingIds = getStringNoLocaleAll(taskRecordThing, TASK_ID)
                    .filter((taskId) => !tasksIds.some((id) => id === taskId));
                taskRecordThing = removeAll(taskRecordThing, TASK_ID);
                if (remainingIds && remainingIds.length > 0) {
                    taskRecordThing = remainingIds.reduce((taskRecordThing, taskId) => {
                        taskRecordThing = addStringNoLocale(taskRecordThing, TASK_ID, taskId);
                        return taskRecordThing;
                    }, taskRecordThing)
                }
                taskRecordDataset = setThing(taskRecordDataset, taskRecordThing);
                await saveSolidDatasetAt(`${rootStorage}/data`, taskRecordDataset, {fetch: session.fetch});
            }
            // remove tasks dataset
            await Promise.all(tasksIds.map(async (id) => {
                await deleteSolidDataset(`${rootStorage}/tasks/${id}`, {fetch: session.fetch});
            }))
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

/**
 * Returns all the events.
 * @param {*} session contains the user's session.
 * @returns object containing all the events.
 */
async function getEvents(session) {
    try {
        if (session) {
            let events = [];
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            const rootStorage = `${storage}/TidyTime`;
            
            const dataset = await getSolidDataset(`${rootStorage}/data`, {fetch: session.fetch});
            const things = getThingAll(dataset);
            const eventsIds = getEventsIds(session, things);
            events = await Promise.all(eventsIds.map(async (eventId) => await getEvent(session, eventId)));
            return { status: "success", data: {events: events} }
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return {status: "empty"};    
        }
        console.log(error);
        return {status: "fail"};
    }
}

/**
 * Returns the event from the event dataset.
 * @param {*} session contains the user's session.
 * @param {*} eventId contains the event id.
 * @returns object containing the event.
 */
async function getEvent(session, eventId) {
    try {
        if (session) {
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            const rootStorage = `${storage}/TidyTime`;
    
            const taskDataset = await getSolidDataset(`${rootStorage}/events/${eventId}`, {fetch: session.fetch});
            const things = getThingAll(taskDataset);
            const thing = things.filter((thing) => thing.url.includes("#event"))[0];
            let result = null
            if (thing) {
                const id = getStringNoLocale(thing, EVENT_ID);
                const title = getStringNoLocale(thing, EVENT_TITLE); //TODO: title and desc can be the same for tasks and events
                const desc = getStringNoLocale(thing, EVENT_DESC) ?? "";
                const startDate = getDatetime(thing, EVENT_START_DATE); 
                const endDate = getDatetime(thing, EVENT_END_DATE);
                const color = getStringNoLocale(thing, EVENT_COLOR);
                const isTask = getBoolean(thing, EVENT_ISTASK) ?? false;
                const googleHtml = getStringNoLocale(thing, EVENT_GHTML) ?? "";
                const googleId = getStringNoLocale(thing, EVENT_GID) ?? "";
                const googleCalendar = getStringNoLocale(thing, EVENT_GCALENDAR) ?? "";
                result = { eventId: id, title: title, desc: desc, start: startDate, end: endDate,
                    color: color, isTask: isTask, googleHTML: googleHtml, googleId: googleId,
                    googleCalendar: googleCalendar
                };
                return result;
            } 
            return result;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
    
}

/**
 * Store the task list names.
 * @param {*} session contains the user's session.
 * @param {*} listNames contains the names of the task lists.
 * @returns 
 */
async function storeListNames(session, listNames) {
    try {
        if (session) {
            const storage = await getPodUrlAll(session.info.webId, {fetch: session.fetch});
            const rootStorage = `${storage}/TidyTime`;

            let dataset = null;
            let listNameThings = null;
            try {
                dataset = await getSolidDataset(`${rootStorage}/data`, {fetch: session.fetch});
                // get current list names if any
                const things = getThingAll(dataset);
                listNameThings = things.filter((thing) => thing.url.includes("#listName"));
                // remove all
                dataset = listNameThings.reduce((dataset, listThing) => {
                    dataset = removeThing(dataset, listThing);
                    return dataset;
                }, dataset);
                listNameThings = listNames.map((listName, index) => {
                    return buildThing(createThing({ name: `listName${index}` }))
                    .addStringNoLocale(LIST_NAME, listName.name)
                    .addStringNoLocale(LIST_ID, listName.id)
                    .addUrl(LIST_NAME, LIST_NAME)
                    .build();
                });
                dataset = listNameThings.reduce((dataset, listThing) => {
                    dataset = setThing(dataset, listThing);
                    return dataset;
                }, dataset);
                await saveSolidDatasetAt(`${rootStorage}/data`, dataset, {fetch: session.fetch});
                return true;
            } catch (error) {
                console.log(error);
            }
        }
    } catch (error) {
        console.log(error);
        return false;
    }
}

// ROUTES

/**
 * Log in to Solid POD.
 */
router.get("/solid/login", async function (req, res) {
    try {
        const session = new Session({storage: storage, keepAlive: true});
        res.cookie("inruptSessionId", session.info.sessionId, {
            secure: true,
            httpOnly: true,
            sameSite: "none"
        });
        const redirectToIDP = (url) => {
            res.redirect(url);
        }
        await session.login({
            redirectUrl: `${process.env.BACK_URL}/solid/login/callback`,
            oidcIssuer: "https://login.inrupt.com",
            clientName: "TidyTimeDev",
            handleRedirect: redirectToIDP
        });
    } catch (error) {
        console.log(error);
    }
});

/**
 * Callback for login redirection.
 */
router.get("/solid/login/callback", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId, storage);
        await session.handleIncomingRedirect(`${process.env.BACK_URL}${req.url}`);
        if (session.info.isLoggedIn) {
            res.cookie("webId", session.info.webId, {
                secure: true,
                httpOnly: true,
                sameSite: "none"
            });
            res.redirect(`${process.env.FRONT_URL}?user=${session.info.webId}`)
        }
    } catch (error) {
        console.log(error);
    }
})

/**
 * Check the session of the user.
 */
router.get("/solid/user/session", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId, storage);
        if (session) {
            res.send({status: true, session: session});
        } else {
            res.send({status: false});
        }
    } catch (error) {
        console.log(error);
    }
});

/**
 * Get the profile data from the Solid user.
 */
router.get("/solid/user/profile", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId, storage);
        if (session) {
            const webId = session.info.webId;
            const dataset = await getSolidDataset(webId, {fetch: fetch});
            let result = getNameFromWebId(webId, dataset);
            // if result is null, that means the webId dataset does not have any name predicate.
            // in that case, we navigate through all the predicates to check if the name is in any of them.
            if (!result) {
                result = await Promise.any(getAltProfileUrlAllFrom(webId, dataset).map(
                    async (uniqueProfileIri) => {
                        const dummyDataset = await getSolidDataset(uniqueProfileIri, {fetch: session.fetch});
                        const altName = getNameFromWebId(webId, dummyDataset);
                        return altName;
                    }
                ));
            } 
            res.send({status: true, data: result});
        }
    } catch (error) {
        console.log(error);
        res.send({status: false, data: `${error}`});
    }
});

/**
 * Perform an application logout from Solid.
 */
router.get("/solid/logout", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId, storage);
        session.logout();
        res.send({status: true, data: "Succesfully logged out"});
    } catch (error) {
        console.log(error);
    }
});

/**
 * Initialize application structure in Solid POD.
 */
router.get("/solid/configuration", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId, storage);
        const poblate = await createRootContainer(session);
        if (poblate) {
            await poblateRootContainer(session);
            res.send({status: "created"});
        } else {
            try {
                const configuration = await getApplicationConfiguration(session);
                res.send({status: "retrieved" , config: configuration});
            } catch (error) {
                await poblateRootContainer(session);
                res.send({status: "created"});
            }
        }
    } catch (error) {
        console.log(error);
    }
});

/**
 * Check if the configuration dataset exists in the Solid POD.
 */
router.get("/solid/configuration/health-check", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId, storage);
        const poblate = await createRootContainer(session);
        if (poblate) {
            await poblateRootContainer(session);
            res.send({status: true});
        } else {
            res.send({status: true})
        }
    } catch (error) {
        console.log(error);
        res.send({status: false})
    }
});

/**
 * Retrieve configuration for the calendar panel from the Solid POD.
 */
router.get("/solid/configuration/calendar", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId, storage);
        const configuration = await getCalendarConfiguration(session);
        res.send({status: configuration.status, data: configuration.data});
    } catch (error) {
        console.log(error);
        res.send({status: false});
    }
})

/**
 * Retrieve configuration for the board panel from the Solid POD.
 */
router.get("/solid/configuration/board", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId, storage);
        if (session) {
            const configuration = await getBoardColumnsConfiguration(session);
            res.send({status: true , data: configuration});
        } else {
            res.send({status: false});
        }        
    } catch (error) {
        console.log(error);
        res.send({status: false});
    }
})

/**
 * Store application configuration to the Solid POD.
 */
router.post("/solid/configuration/store", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId, storage);
        const labels = req.body.labels;
        const showTasksInCalendar = req.body.showTasksInCalendar;
        const boardColumns = req.body.boardColumns;
        const weekStart = req.body.weekStart;
        const calendarView = req.body.calendarView;
        const result = await storeApplicationConfiguration(session, labels, showTasksInCalendar, boardColumns, weekStart, calendarView);
        res.send({status: result});
    } catch (error) {
        console.log(error);
        res.send({status: false});
    }
});

/**
 * Store lists to the solid POD.
 */
router.post("/solid/data/store/listNames", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId, storage);
        const listNames = req.body.listNames;
        const result = await storeListNames(session, listNames);
        res.send({status: result});
    } catch (error) {
        console.log(error);
        res.send({status: false, data: []});
    }
});

/**
 * Delete list from the Solid POD.
 */
router.post("/solid/data/store/lists/delete", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId, storage);
        const listNames = req.body.listNames;
        const tasksIds = req.body.tasksIds;
        const deleteResult = await deleteList(session, tasksIds);
        const result = await storeListNames(session, listNames);
        res.send({status: result && deleteResult});
    } catch (error) {
        console.log(error);
        res.send({status: false, data: []});
    }
});

/**
 * Store board columns to the Solid POD.
 */
router.post("/solid/data/store/boardColumns", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId, storage);
        const boardColumns = req.body.boardColumns;
        const result = await storeBoardColumns(session, boardColumns);
        res.send({status: result});
    } catch (error) {
        console.log(error);
        res.send({status: false});
    }
});

/**
 * Create new task in the Solid POD.
 */
router.post("/solid/data/store/tasks/create", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId, storage);
        const task = req.body.task;
        const result = await createTask(session, task);
        res.send({status: result});
    } catch (error) {
        console.log(error);
        res.send({status: false});
    }
});

/**
 * Change the status of the task of the Solid POD.
 */
router.post("/solid/data/store/task/done", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId, storage);
        const task = req.body.task;
        const result = await updateTask(session, task, false);
        res.send({status: result});
    } catch (error) {
        console.log(error);
        res.send({status: false});
    }
});

/**
 * Retrieve the status of the task from Solid POD.
 */
router.post("/solid/data/store/task/status", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId, storage);
        const task = req.body.task;
        const result = await updateTaskStatus(session, task);
        res.send({status: result});
    } catch (error) {
        console.log(error);
        res.send({status: false});
    }
});

/**
 * Update task on Solid POD.
 */
router.post("/solid/data/store/tasks/update", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId, storage);
        const task = req.body.task;
        const result = await updateTask(session, task, true);
        res.send({status: result});
    } catch (error) {
        console.log(error);
        res.send({status: false});
    }
});

/**
 * Delete task from solid POD.
 */
router.post("/solid/data/store/tasks/delete", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId, storage);
        const task = req.body.task;
        const result = await deleteTask(session, task);
        res.send({status: result});
    } catch (error) {
        console.log(error);
        res.send({status: false});
    }
});

/**
 * Create new event on Solid POD.
 */
router.post("/solid/data/store/events/create", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId, storage);
        const event = req.body.event;
        const result = await createEvent(session, event);
        res.send({status: result});
    } catch (error) {
        console.log(error);
        res.send({status: false});
    }
});

/**
 * Update event of Solid POD.
 */
router.post("/solid/data/store/events/update", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId, storage);
        const event = req.body.event;
        const result = await updateEvent(session, event);
        res.send({status: result});
    } catch (error) {
        console.log(error);
        res.send({status: false});
    }
});

/**
 * Delete event from Solid POD.
 */
router.post("/solid/data/store/events/delete", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId, storage);
        const event = req.body.event;
        const result = await deleteEvent(session, event);
        res.send({status: result});
    } catch (error) {
        console.log(error);
        res.send({status: false});
    }
});

/**
 * Get all application data from Solid POD.
 */
router.get("/solid/data/get", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId, storage);
        const result = await getApplicationData(session);
        if (result.status === "success") {
            res.send({status: "success", data: result});
        } else if (result.status === "empty") {
            res.send({status: "empty"});
        } else {
            res.send({status: "whatever"});
        }
    } catch (error) {
        console.log(error);
        res.send({status: "whatever"});
    }
})

/**
 * Get labels from Solid POD.
 */
router.get("/solid/data/labels/get", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId, storage);
        const result = await getLabels(session);
        if (result && result.length > 0) {
            res.send({status: "success", data: result});
        } else {
            res.send({status: "empty"});
        }
    } catch (error) {
        res.send({status: "fail"});
        console.log(error);
    }
})

/**
 * Get tasks from Solid POD.
 */
router.get("/solid/data/tasks/get", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId, storage);
        const result = await getTasks(session);
        res.send({status: result.status, data: result});
    } catch (error) {
        console.log(error);
    }
})

/**
 * Get events from Solid POD.
 */
router.get("/solid/data/events/get", async function (req, res) {
    try {
        const session = await getSessionFromStorage(req.cookies.inruptSessionId, storage);
        const result = await getEvents(session);
        res.send({status: result.status, data: result});
    } catch (error) {
        console.log(error);
        return {status: "fail"};
    }
})

module.exports = router;