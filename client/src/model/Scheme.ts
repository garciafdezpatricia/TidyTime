export interface Task {
    title: string,
    desc?: string,
    labels?: Label[],
    endDate?: string,
    difficulty?: number,
    done: boolean,
    important?: boolean,
    listIndex: number,
    githubHtml?: string,
    githubUrl?: string,
    status: number;
    taskIndexInList?: number,
}

export type TaskList = Task[];

export function taskToListOfTaskList(tasks: Task[]) {
    let result:TaskList[] = [];
    for (const task of tasks) {
        // get list index from task
        const { listIndex, ...rest } = task;
        if (!result[listIndex]) {
            result[listIndex] = []; // Si no existe una lista para este índice, la creamos
        }
        result[listIndex].push(task); // Agregamos la tarea a la lista correspondiente
    }
    return result;
}

export function listOfTaskListToTask(tasks: TaskList[]) {
    const result: Task[] = [];
    // Iterar sobre cada TaskList en el arreglo
    tasks.forEach((taskList, listIndex) => {
        // Iterar sobre cada tarea en la TaskList
        taskList.forEach(task => {
            // Añadir la tarea al resultado, asignándole el listIndex correspondiente
            result.push({ ...task, listIndex });
        });
    });
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