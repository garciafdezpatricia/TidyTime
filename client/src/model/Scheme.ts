export interface Task {
    title: string,
    desc?: string,
    labels?: Label[],
    endDate?: string,
    difficulty?: number,
    done: boolean,
    important?: boolean,
    listIndex: number,
}

export interface BoardItem extends Task {
    status: number;
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

export function taskToBoardItemMatrix(tasks: Task[]) {
    let result:BoardItem[][] = [[]];
    // TODO: when storing this in the pod, instead of getting tasks Task[], we're going to go for the 
    // BoardItem[]. In case there are no boardItems stored (first time using the app / didn't use the board)
    // then all the tasks are assigned to the first column, that is status = 0.
    // If there are boardItems stored, then we create resut[status] = item
    // if tasks typeof Task[] then this:
    for (const task of tasks) {
        result[0].push({...task, status: 0})
    }
    // else
    // for (item of tasks) {
    //     const {status, ...rest} = item;
    //     if (!result[status]) {
    //         result[status] = [];
    //     }
    //     result[status].push(item);
    // }
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
  }

export interface Label {
    color: string,
    name: string,
}

export interface CalendarItem { id: string, name: string, color: string};