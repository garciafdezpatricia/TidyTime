import { SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import PromptModal from "../Modal/PromptModal/PromptModal";
import EditListModal from "../Modal/EditModal/EditListModal";
import { IoIosArrowDropdown } from "react-icons/io";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { BiAddToQueue } from "react-icons/bi";
import { useTaskContext } from "../Context/TaskContext";
import { TaskList } from "@/src/model/Scheme";
import TabContent from "./TabContent";


export interface Props {
	handleEditModal: (arg?:any) => void | any;
}

export default function Tab({handleEditModal} : Props) {
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
    const {listNames, selectedListIndex, setListNames, setTasks, tasks, 
		setSelectedListIndex, selectedTaskIndex, setSelectedTaskIndex} = useTaskContext();

	// scroll to selected task
	useEffect(() => {
		const selectedTaskElement = document.querySelector('.selected-task');
		if (selectedTaskElement) {
			selectedTaskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}, [selectedListIndex, selectedTaskIndex]);

	/**
	 * Creates a new tab, having a default name for the tab if none is provided.
	 * Closes the modal, clears the new list name constant and sets the selected list to the created one.
	 */
	const addNewTab = () => {
		// TODO: create the list structure for the pod
		const newTodoList: TaskList = []
		setListNames([...listNames, `List ${listNames.length + 1}`])
		setTasks(prevTodo => [...prevTodo, newTodoList])
		setSelectedListIndex(listNames.length);
	};

	/**
	 * Handles the selection of tabs by setting the selected tab index to the one that has been clicked.
	 * Closes the options modal of any tab if any is opened.
	 * @param index corresponds to the tab being clicked.
	 */
	const handleTabSelection = (index: SetStateAction<number>) => {
		setSelectedListIndex(index);
		setSelectedTaskIndex(-1);
		if (managingList) {
			setManagingList(false);
		}
	};

	/**
	 * Handles the check of tasks. Checked tasks get rearranged to the end of the list, unchecked tasks get rearranged
	 * to the beginning of the list.
	 * @param event corresponds to the tasks being checked
	 * @param itemIndex corresponds with the index of the tasks inside of its list.
	 */
	const handleCheck = (event: any, itemIndex: any) => {
		if (managingList) {
			setManagingList(false);
		}
		setTasks((prevTodo) => {
			return prevTodo.map((list, index) => {
				if (index === selectedListIndex) {
					// remove item from list
					const updatedList = list.filter((_, i) => i !== itemIndex);
					// if event is not done, it is being marked as done
					if (!event.done) {
						return [
							...updatedList,
							{ ...list[itemIndex], done: !list[itemIndex].done },
						];
					} else {
						return [
							{ ...list[itemIndex], done: !list[itemIndex].done },
							...updatedList,
						];
					}
				}
				return list;
			});
		});
	};

	/**
	 * Deletes the tab and content whose index corresponds to the selected tab index. Closes the confirmation modal
	 * raised to inform of the deletion of the tab.
	 */
	const deleteTab = () => {
		setDeletingList(true);
		setListNames((prevTabs) => {
			return prevTabs.filter((_, i) => i !== selectedListIndex);
		});
		setTasks((prevTodo) => {
			return prevTodo.filter((_, i) => i !== selectedListIndex);
		});
		setConfirmationDeleteModalOpen(false);
	};

	/**
	 * Renames the tab whose index corresponds to the selected tab index. Closes the modal prompting for the new tab name.
	 * Clears the const storing the new tab name.
	 */
	const renameTab = () => {
		setListNames((prevTabs) => {
			const newTabs = [...prevTabs];
			newTabs[selectedListIndex] = renameListName;
			return newTabs;
		});
		setRenameListName("");
		setManagingList(false);
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
			setSelectedListIndex(0);
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
					{listNames.map((tab, index) => (
						<section
							className={selectedListIndex === index ? "active-tab" : "tab"}
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
						title="What do you want to do with this list?"
						onDeleteAction={() => setConfirmationDeleteModalOpen(true)}
						onRenameAction={renameTab}
						onInputChange={handleInputChange}
						onClose={() => setManagingList(false)}
					/>
				)}
			<button
				className='tab-container add-list'
				onClick={addNewTab}
			>
                <BiAddToQueue />
				Add New List
			</button>
			<TabContent seeDone={seeDone}  handleCheck={handleCheck} handleEditModal={handleEditModal}/>
			{
				tasks.length > 0 &&
				<button className='see-done-task' onClick={() => setSeeDone(!seeDone)}>
					{seeDone ? <AiFillEyeInvisible /> : <AiFillEye /> }
					{seeDone ? "Hide" : "Show"} done tasks
				</button>
			}
			{isConfirmationDeleteModalOpen && (
				<PromptModal
					title="Are you sure you want to delete this list? This action can't be undone"
					onPrimaryAction={() => deleteTab()}
					primaryActionText='Delete'
					secondaryActionText='Cancel'
					onSecondaryAction={() => setConfirmationDeleteModalOpen(false)}
					variant='confirmation-modal'
					backdrop
				></PromptModal>
			)}
		</article>
	);
}
