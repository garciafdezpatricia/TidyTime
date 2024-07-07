export interface Task {
    id: string,
    title: string,
    desc?: string,
    labels?: Label[],
    endDate?: string,
    difficulty?: number,
    done: boolean,
    important?: boolean,
    listIndex: string,
    githubHtml?: string,
    githubUrl?: string,
    status: number;
    taskIndexInList?: number,
}

export type TaskList = {key: string, value: Task[]};

export function taskToListOfTaskList(tasks: Task[]) {
    let result:TaskList[] = [];
    for (const task of tasks) {
        // get list index from task
        const { listIndex, ...rest } = task;
        if (!result.find((list) => list.key === listIndex)) {
            result.push({key: listIndex, value: []}); // if there is not a list for the index, create it
        }
        const index = result.findIndex((list) => list.key === listIndex);
        result[index].value.push(task); // push the task
    }
    return result;
}

export interface Event {
    start: Date,
    end: Date,
    title: string,
    desc: string,
    eventId: string,
    color?: string,
    googleId?: string,
    googleHTML?: string,
    googleCalendar?: string,
    isTask?: boolean,
  }

export interface Label {
    color: string,
    name: string,
}

export interface CalendarItem { id: string, name: string, color: string};

export interface ScheduleItem {
    title: string;
    hours: string;
    minutes: string;
}