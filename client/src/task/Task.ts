export interface Task {
    title: string,
    desc?: string,
    label?: string,
    color?: string,
    initDate?: string,
    endDate?: string,
    difficulty?: number,
    done?: boolean,
    important?: boolean,
}