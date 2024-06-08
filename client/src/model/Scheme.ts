import { uuid } from "uuidv4";

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
            result.push({key: listIndex, value: []}); // Si no existe una lista para este índice, la creamos
        }
        const index = result.findIndex((list) => list.key === listIndex);
        result[index].value.push(task); // Agregamos la tarea a la lista correspondiente
    }
    return result;
}

// export function listOfTaskListToTask(tasks: TaskList[]) {
//     const result: Task[] = [];
//     // Iterar sobre cada TaskList en el arreglo
//     tasks.forEach((taskList, listIndex) => {
//         // Iterar sobre cada tarea en la TaskList
//         taskList.forEach(task => {
//             // Añadir la tarea al resultado, asignándole el listIndex correspondiente
//             result.push({ ...task, listIndex });
//         });
//     });
//     return result;
// }

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