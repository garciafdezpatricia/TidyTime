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
    start: Date,
    end: Date,
    title: string,
    desc: string,
    eventId: string,
    color?: string,
    googleId?: string,
    googleHTML?: string,
  }

export interface Label {
    color: string,
    name: string,
}

export type TaskList = Task[];