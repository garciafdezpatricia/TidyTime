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

import { SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import PromptModal from "../Modal/PromptModal/PromptModal";
import EditListModal from "../Modal/EditModal/EditListModal";
import { IoIosArrowDropdown } from "react-icons/io";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { BiAddToQueue } from "react-icons/bi";
import { useTaskContext } from "../Context/TaskContext";
import { TaskList } from "@/src/model/Scheme";
import TabContent from "./TabContent";
import { useGithubHandler } from "@/pages/api/github";
import { useInruptHandler } from "@/pages/api/inrupt";
import { uuid } from "uuidv4";
import { useTranslation } from "react-i18next";


export interface Props {
	handleEditModal: (arg?:any) => void | any;
}

export default function Tab({handleEditModal} : Props) {
	const { t } = useTranslation();
	// const to see or unsee done tasks
	const [seeDone, setSeeDone] = useState(false);
	// const to open modals based on the action taking place
	const [isConfirmationDeleteModalOpen, setConfirmationDeleteModalOpen] = useState(false);
	// const to store the state of the action taking place
	const [deletingList, setDeletingList] = useState(false);
	// const to store a reference to the current list whose options are being shown
	const [managingList, setManagingList] = useState(false);
	// const to manage renaming of tabs
	const [renameListName, setRenameListName] = useState("");
	
	// const with the lists, tasks and reference to the current active list extracted from the context.
    const {listNames, selectedListId, setListNames, setTasks, tasks, 
		setSelectedListId, selectedTaskId, setSelectedTaskId} = useTaskContext();

	const { closeIssue, openIssue } = useGithubHandler();
	const { updateListNames, deleteList, updateTaskDoneUndone } = useInruptHandler();

	// scroll to selected task
	useEffect(() => {
		const selectedTaskElement = document.querySelector('.selected-task');
		if (selectedTaskElement) {
			selectedTaskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}, [selectedListId, selectedTaskId]);

	/**
	 * Creates a new tab, having a default name for the tab if none is provided.
	 * Closes the modal, clears the new list name constant and sets the selected list to the created one.
	 */
	const addNewTab = async () => {
		const newListNames = listNames ? [...listNames, `List ${listNames.length + 1}`] : ["List 1"];
		const newTodoList: TaskList = {key: uuid(), value: []};
		const newTasks = tasks ? [...tasks, newTodoList] : [newTodoList]
		setListNames(listNames ? [...listNames, `List ${listNames.length + 1}`] : ["List 1"]);
		setTasks(newTasks);
		setSelectedListId(newTodoList.key);
		await updateListNames(newListNames, newTasks);
	};

	/**
	 * Handles the selection of tabs by setting the selected tab index to the one that has been clicked.
	 * Closes the options modal of any tab if any is opened.
	 * @param index corresponds to the tab being clicked.
	 */
	const handleTabSelection = (index: number) => {
		setSelectedListId(tasks?.at(index)?.key ?? '');
		setSelectedTaskId('');
		if (managingList) {
			setManagingList(false);
		}
	};

	/**
	 * Handles the check of tasks. Checked tasks get rearranged to the end of the list, unchecked tasks get rearranged
	 * to the beginning of the list.
	 * @param task corresponds to the task being checked
	 * @param itemIndex corresponds with the index of the task inside of its list.
	 */
	const handleCheck = async (task: any, itemIndex: any) => {
		if (tasks) {
			if (managingList) {
				setManagingList(false);
			}
			const updatedToDo = [...tasks];
			let listIndex = tasks.findIndex((list) => list.key === selectedListId);
			if (listIndex !== -1) {
				let updatedTask = tasks[listIndex].value[itemIndex];
				const isDone = updatedTask.done;
		
				updatedTask.done = !updatedTask.done;
				updateTaskDoneUndone(updatedTask);
				updatedToDo[listIndex].value = [
					...updatedToDo[listIndex].value.slice(0, itemIndex),
					updatedTask,
					...updatedToDo[listIndex].value.slice(itemIndex + 1),
				]
				setTasks(updatedToDo);
				
				if (updatedTask.githubUrl) {
					if (isDone) {
						await openIssue(updatedTask.githubUrl);
					} else {
						await closeIssue(updatedTask.githubUrl);
					}
					
				}
			}
		}
	};

	/**
	 * Deletes the tab and content whose index corresponds to the selected tab index. Closes the confirmation modal
	 * raised to inform of the deletion of the tab.
	 */
	const deleteTab = async () => {
		if (listNames && tasks) {
			setDeletingList(true);
			const index = tasks.findIndex((list) => list.key === selectedListId);
			const newListNames = listNames.filter((_, i) => i !== index);
			let taskIdsToDelete:string[] = [];
			if (tasks[index].value && tasks[index].value.length > 0) {
				taskIdsToDelete = tasks[index].value.map((task) => {return task.id});
			}
			const newTasks = tasks.filter((_, i) => i !== index)!;
			setListNames(newListNames);
			setTasks(newTasks);
			setConfirmationDeleteModalOpen(false);
			await deleteList(newListNames, newTasks, taskIdsToDelete);
		}
	};

	/**
	 * Renames the tab whose index corresponds to the selected tab index. Closes the modal prompting for the new tab name.
	 * Clears the const storing the new tab name.
	 */
	const renameTab = async () => {
		if (listNames) {
			let newListNames = [...listNames];
			const index = tasks?.findIndex((list) => list.key === selectedListId);
			if (index !== undefined && index >= 0) {
				newListNames[index] = renameListName;
				setListNames(newListNames);
				setRenameListName("");
				setManagingList(false);
				await updateListNames(newListNames, tasks!);
			}
		}
	};

	/**
	 * Open/close the modal for managing the selected tab. Actions included: renaming and deletion.
	 * @param index corresponds to the index of the tab being clicked.
	 */
	const manageEditModal = (index: number) => {
		setManagingList(!managingList)
	};

	/**
	 * Hook to set the selected tab index to 0 after a tab deletion has taken place.
	 */
	useEffect(() => {
		if (deletingList) {
			setSelectedListId(tasks?.at(0)?.key ?? '');
			setManagingList(false);
			setDeletingList(false);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deletingList]);

	const handleInputChange = (name:string) => {
		setRenameListName(name);
	}

	return (
		<article className='tab-container'>
				<section className='tab-container bloc-tabs'>{" "}
					{listNames && listNames.map((tab, index) => (
						<section
							className={tasks?.findIndex((list) => list.key === selectedListId) === index ? "active-tab" : "tab"}
							key={index}
						>
							<p onClick={() => handleTabSelection(index)}>{tab}</p>
							<div className='edit-dropdown'>
								<IoIosArrowDropdown
									size={"1rem"}
									color={"#3E5B41"}
									onClick={() => manageEditModal(index)}
								/>{" "}
							</div>
						</section>
					))}
				</section>
				{managingList && (
					<EditListModal
						title={t('list.editListPanel.title')}
						onDeleteAction={() => setConfirmationDeleteModalOpen(true)}
						onRenameAction={renameTab}
						onInputChange={handleInputChange}
						onClose={() => setManagingList(false)}
					/>
				)}
			<button
				data-testid='tab-container-add-list'
				className='tab-container add-list'
				onClick={addNewTab}
			>
                <BiAddToQueue />
				{t('list.addList')}
			</button>
			<TabContent seeDone={seeDone}  handleCheck={handleCheck} handleEditModal={handleEditModal}/>
			{
				tasks && tasks.length > 0 &&
				<button data-testid='see-done-task' className='see-done-task' onClick={() => setSeeDone(!seeDone)}>
					{seeDone ? <AiFillEyeInvisible /> : <AiFillEye /> }
					{seeDone ? `${t('list.hideDoneTasks')} ${t('list.doneTasks')}` : `${t('list.showDoneTask')} ${t('list.doneTasks')}`} 
				</button>
			}
			{isConfirmationDeleteModalOpen && (
				<PromptModal
					title={t('deletePanel.title')}
					onPrimaryAction={() => deleteTab()}
					primaryActionText={t('deletePanel.delete')}
					secondaryActionText={t('deletePanel.cancel')}
					onSecondaryAction={() => setConfirmationDeleteModalOpen(false)}
					variant='confirmation-modal'
					backdrop
				></PromptModal>
			)}
		</article>
	);
}
