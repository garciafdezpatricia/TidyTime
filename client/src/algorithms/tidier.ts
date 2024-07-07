import { Task, ScheduleItem } from "../model/Scheme";

/**
 * Calculates a task priority based on the task difficulty.
 * @param task Task to be prioritized.
 * @returns Task priority as a number.
 */
export function calculatePriority(task: Task): number {
    const today = new Date();
    const dueDate = task.endDate ? new Date(task.endDate) : undefined;
    let daysUntilDueDate: number;
    
    if (dueDate) {
        const timeDifference = dueDate.getTime() - today.getTime();
        daysUntilDueDate = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
        if (daysUntilDueDate < 0) {
            // High priority to past due dates
            daysUntilDueDate = 0.01;
        } else {
            // Avoid division by 0
            daysUntilDueDate = Math.max(1, daysUntilDueDate);
        }
    } else {
        // If it does not have a due date, the priority is low
        daysUntilDueDate = 1;
    }
    // Default difficulty if not present
    const difficulty = task.difficulty !== undefined ? task.difficulty : 1;
    
    return difficulty;

}

/**
 * Formats a number for it to have at least two digits.
 * @param number Number to format.
 * @returns Formatted number as string.
 */
function formatNumber(number: number): string {
    return number < 10 ? `0${number}` : `${number}`;
}

/**
 * Convert time in hours and minutes to total minutes.
 * @param hours Number of hours.
 * @param minutes Number of minutes.
 * @returns Total minutes.
 */
function convertTimeToMinutes(hours: number, minutes: number): number {
    return hours * 60 + minutes;
}

/**
 * Adds a task block to the plan
 * @param plan Current task plan.
 * @param task Task to be added.
 * @param minutes Task's duration in minutes.
 */
function addTaskBlock(plan: ScheduleItem[], task: Task, minutes: number): void {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    plan.push({ title: task.title, hours: formatNumber(hours), minutes: formatNumber(remainingMinutes) });
}

/**
 * Adds a break to the plan.
 * @param plan Current task plan.
 * @param breakTitle Break title.
 * @param breakMinutes Brake's duration in minutes.
 */
function addBreak(plan: ScheduleItem[], breakTitle: string, breakMinutes: number): void {
    plan.push({ title: breakTitle, hours: '00', minutes: formatNumber(breakMinutes) });
}

/**
 * Organizes the tasks in a plan prioritizing their difficulty.
 * @param tasks Task list to plan.
 * @param availableHours Available hours.
 * @param availableMinutes Available minutes.
 * @returns Task plan.
 */
export function mostDifficultyFirst(tasks: Task[], availableHours: number, availableMinutes: number): ScheduleItem[] {
    let availableTime = convertTimeToMinutes(availableHours, availableMinutes);
    const sortedTasks = tasks.sort((a, b) => calculatePriority(b) - calculatePriority(a));
    const plan: ScheduleItem[] = [];
    const shortBreak = 5;
    const longBreak = 15;

    sortedTasks.forEach(currentTask => {
        // There's no more time available
        if (availableTime <= 0) return;
        const difficulty = currentTask.difficulty && currentTask.difficulty !== 0 ? currentTask.difficulty : 1;
        let durationMinutes = Math.min(difficulty * 30, availableTime);
        // While there's time still, divide long tasks in 60 minutes blocks
        while (durationMinutes > 60 && availableTime > 0) {
            const blockMinutes = Math.min(60, durationMinutes);
            addTaskBlock(plan, currentTask, blockMinutes);
            availableTime -= blockMinutes;
            durationMinutes -= blockMinutes;

            if (availableTime > shortBreak) {
                addBreak(plan, 'Short break', shortBreak);
                availableTime -= shortBreak;
            }
        }
        // Add tasks whose duration is less than 60 minutes
        if (durationMinutes > 0 && availableTime > 0) {
            addTaskBlock(plan, currentTask, durationMinutes);
            availableTime -= durationMinutes;
            // if there's enough time to make a break and do at least 10 minutes of work
            if (availableTime >= longBreak + 10) {
                // Add a long break after long tasks and a short break after short ones
                if (durationMinutes >= 55) {
                    addBreak(plan, 'Long break', longBreak);
                    availableTime -= longBreak;
                } else if (durationMinutes >= 30) {
                    addBreak(plan, 'Short break', shortBreak);
                    availableTime -= shortBreak;
                }
            }
        }
    });

    return plan;
}

export function earliestDeadlineFirst(tasks: Task[], availableHours: number, availableMinutes: number): ScheduleItem[] {
    // Sort tasks by due date. Tasks without it go to the end
    tasks.sort((task1, task2) => {
        if (task1.endDate && task2.endDate) {
            return new Date(task1.endDate).getTime() - new Date(task2.endDate).getTime();
        } else if (task1.endDate) {
            return -1; 
        } else if (task2.endDate) {
            return 1; 
        } else {
            return 0; 
        }
    });

    let schedule: ScheduleItem[] = [];
    const breakTime = 5;
    let currentTime = 0;
    let availableTime = convertTimeToMinutes(availableHours, availableMinutes);

    for (let task of tasks) {
        // If adding the current task exceeds the time, finish
        const difficulty = task.difficulty && task.difficulty !== 0 ? task.difficulty : 1;
        let durationMinutes = Math.min(difficulty * 20, availableTime);
        if (currentTime + durationMinutes > availableTime) {
            let time = availableTime - currentTime;
            addTaskBlock(schedule, task, time);
            break;
        }

        // add task to the plan
        addTaskBlock(schedule, task, durationMinutes);
        currentTime += durationMinutes;

        // If adding a break exceeds the time or is the last task, dont add the break
        if (currentTime + breakTime >= availableTime || task === tasks[tasks.length - 1]) continue;

        // Add a break to the plan
        addBreak(schedule, 'Break', breakTime);
        currentTime += breakTime;
    }

    return schedule;
}