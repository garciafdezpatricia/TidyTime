import { SetStateAction, useEffect, useMemo, useState } from "react";
import PromptModal from "../Modal/PromptModal/PromptModal";
import EditModal from "../Modal/EditModal/EditModal";
import { FaRegCircle, FaCheckCircle } from "react-icons/fa";
import { IoIosArrowDropdown } from "react-icons/io";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { BiAddToQueue } from "react-icons/bi";
import { useTaskContext } from "../Context/TaskContext";


export default function Tab() {
	// const to see or unsee done tasks
	const [seeDone, setSeeDone] = useState(false);
	// const to open modals based on the action taking place
	const [isCreatingListModalOpen, setCreatingListModalOpen] = useState(false);
	const [isRenameModalOpen, setRenameModalOpen] = useState(false);
	const [isConfirmationDeleteModalOpen, setConfirmationDeleteModalOpen] =
		useState(false);
	// const to store the state of the action taking place
	const [deletingList, setDeletingList] = useState(false);
	// const to store a reference to the current list whose options are being shown
	const [managingListIndex, setManagingListIndex] = useState(-1);
	// const with the lists, tasks and reference to the current active list extracted from the context.
    const {tabs, todo, selectedListIndex, setTabs, setToDo, setSelectedListIndex} = useTaskContext();
	// const to manage creation and renaming of tabs
	const [newListName, setNewListName] = useState("");
	const [renameListName, setRenameListName] = useState("");

	/**
	 * Sets to true the const storing the state of the modal to create a new list.
	 */
	const openCreatingListModal = () => {
		setCreatingListModalOpen(true);
	};

	/**
	 * Creates a new tab, having a default name for the tab if none is provided.
	 * Closes the modal, clears the new list name constant and sets the selected list to the created one.
	 */
	const addNewTab = () => {
		// TODO: create the list structure for the pod
		newListName === ""
			? setTabs([...tabs, `List ${tabs.length + 1}`])
			: setTabs([...tabs, newListName]);
		setCreatingListModalOpen(false);
		setNewListName("");
		setSelectedListIndex(tabs.length);
	};

	/**
	 * Handles the selection of tabs by setting the selected tab index to the one that has been clicked.
	 * Closes the options modal of any tab if any is opened.
	 * @param index corresponds to the tab being clicked.
	 */
	const handleTabSelection = (index: SetStateAction<number>) => {
		setSelectedListIndex(index);
		if (managingListIndex !== -1) {
			setManagingListIndex(-1);
		}
	};

	/**
	 * Handles the check of tasks. Checked tasks get rearranged to the end of the list, unchecked tasks get rearranged
	 * to the beginning of the list.
	 * @param event corresponds to the tasks being checked
	 * @param itemIndex corresponds with the index of the tasks inside of its list.
	 */
	const handleCheck = (event: any, itemIndex: any) => {
		if (managingListIndex !== -1) {
			setManagingListIndex(-1);
		}
		setToDo((prevTodo) => {
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
		setTabs((prevTabs) => {
			return prevTabs.filter((_, i) => i !== selectedListIndex);
		});
		setToDo((prevTodo) => {
			return prevTodo.filter((_, i) => i !== selectedListIndex);
		});
		setConfirmationDeleteModalOpen(false);
	};

	/**
	 * Renames the tab whose index corresponds to the selected tab index. Closes the modal prompting for the new tab name.
	 * Clears the const storing the new tab name.
	 */
	// TODO: check that there's a name to rename the tab with.
	const renameTab = () => {
		setTabs((prevTabs) => {
			const newTabs = [...prevTabs];
			newTabs[selectedListIndex] = renameListName;
			return newTabs;
		});
		setRenameModalOpen(false);
		setRenameListName("");
	};

	/**
	 * Open/close the modal for managing the selected tab. Actions included: renaming and deletion.
	 * @param index corresponds to the index of the tab being clicked.
	 */
	const manageEditModal = (index: number) => {
		index === managingListIndex
			? setManagingListIndex(-1)
			: setManagingListIndex(index);
	};

	/**
	 * Hook to set the selected tab index to 0 after a tab deletion has taken place.
	 */
	useEffect(() => {
		if (deletingList) {
			setSelectedListIndex(0);
			setDeletingList(false);
		}
	}, [deletingList]);

	return (
		<article className='tab-container'>
			<section className='tab-container bloc-tabs'>
				{" "}
				{tabs.map((tab, index) => (
					<section
						className={selectedListIndex === index ? "active-tab" : "tab"}
						key={index}
						onClick={() => handleTabSelection(index)}
					>
						{tab}
						<div className='edit-dropdown'>
							<IoIosArrowDropdown
								size={"1rem"}
								color={"#3E5B41"}
								onClick={() => manageEditModal(index)}
							/>{" "}
							{managingListIndex === index && (
								<EditModal
									onDeleteAction={() => setConfirmationDeleteModalOpen(true)}
									onRenameAction={() => setRenameModalOpen(true)}
								/>
							)}
						</div>
					</section>
				))}
			</section>
			<button
				className='tab-container add-list'
				onClick={openCreatingListModal}
			>
                <BiAddToQueue />
				Add New List
			</button>
			<section className='tab-content-container'>
				{" "}
				{todo.map((content, index) => (
					<ul
						className={
							selectedListIndex === index ? "active-content" : "content"
						}
						key={index}
					>
						{" "}
						{content.map((item, itemIndex) => {
							if (item.done && !seeDone) {
								return null;
							}
							return (
								<li
									className={item.done ? "task-done" : "task"}
									key={itemIndex}
								>
									<div className='icon-container'>
										<FaRegCircle
											className={item.done ? "circle-disappear" : ""}
											onClick={(e) => handleCheck(item, itemIndex)}
										/>
										<FaCheckCircle
											className={item.done ? "" : "circle-disappear"}
											onClick={(e) => handleCheck(item, itemIndex)}
										/>
									</div>
									<div className='task-content'>
										<h4>{item.title}</h4>
									</div>
								</li>
							);
						})}
					</ul>
				))}
			</section>
			<button className='see-done-task' onClick={() => setSeeDone(!seeDone)}>
                {seeDone ? <AiFillEyeInvisible /> : <AiFillEye /> }
				{seeDone ? "Hide" : "Show"} done tasks
			</button>

			{isCreatingListModalOpen && (
				<PromptModal
					variant='new-list'
					title='Add new list'
					onSecondaryAction={() => setCreatingListModalOpen(false)}
					secondaryActionText='Cancel'
					primaryActionText='Create'
					onPrimaryAction={() => addNewTab()}
					backdrop
				>
					<input
						placeholder={`List ${tabs.length + 1}`}
						type='text'
						onChange={(e) => setNewListName(e.target.value)}
					/>
				</PromptModal>
			)}
			{isRenameModalOpen && (
				<PromptModal
					title='Rename'
					onPrimaryAction={() => renameTab()}
					primaryActionText='Rename'
					secondaryActionText='Cancel'
					onSecondaryAction={() => setRenameModalOpen(false)}
					variant='rename-list-modal'
					backdrop={false}
				>
					<input
						type='text'
						placeholder=''
						onChange={(e) => setRenameListName(e.target.value)}
					/>
				</PromptModal>
			)}
			{isConfirmationDeleteModalOpen && (
				<PromptModal
					title='This list will be deleted'
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
