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