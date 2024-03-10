export interface Task {
    title: string,
    desc?: string,
    labels?: Label[],
    endDate?: string,
    difficulty?: number,
    done: boolean,
    important?: boolean,
}

export interface Event {
    title: string,
    color: string,
    initDate?: string,
    endDate?: string,
    notes?: string,
}

export interface Label {
    color: string,
    name: string,
}

export type TaskList = Task[];