import { SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import PromptModal from "../Modal/PromptModal/PromptModal";
import EditListModal from "../Modal/EditModal/EditListModal";
import { FaRegCircle, FaCheckCircle } from "react-icons/fa";
import { IoIosArrowDropdown } from "react-icons/io";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { BiAddToQueue } from "react-icons/bi";
import { useTaskContext } from "../Context/TaskContext";
import EditTaskModal from "../Modal/EditModal/EditTaskModal";
import { TaskList } from "@/src/task/Scheme";
import { MdEdit } from "react-icons/md";
import { GrStar } from "react-icons/gr";
import { IoIosTimer } from "react-icons/io";
import Difficulty from "../DifficultyRate/Difficulty";

export interface Props {
	handleEditModal: (arg?:any) => void | any;
}

export default function Tab({handleEditModal} : Props) {
	// const to see or unsee done tasks
	const [seeDone, setSeeDone] = useState(false);
	// const to open modals based on the action taking place
	const [isCreatingListModalOpen, setCreatingListModalOpen] = useState(false);
	const [isConfirmationDeleteModalOpen, setConfirmationDeleteModalOpen] = useState(false);
	// const to store the state of the action taking place
	const [deletingList, setDeletingList] = useState(false);
	// const to store a reference to the current list whose options are being shown
	const [managingListIndex, setManagingListIndex] = useState(-1);
	// const to manage creation and renaming of tabs
	const [newListName, setNewListName] = useState("");
	const [renameListName, setRenameListName] = useState("");
	
	// const with the lists, tasks and reference to the current active list extracted from the context.
    const {listNames, tasks, selectedListIndex, setListNames, setTasks, setSelectedListIndex, selectedTaskIndex} = useTaskContext();

	const taskRefs = useRef<HTMLLIElement[]>([]);

	useEffect(() => {
		if (selectedTaskIndex !== null && taskRefs.current[selectedTaskIndex]) {
		  taskRefs.current[selectedTaskIndex].scrollIntoView({ behavior: "smooth", block: "center" });
		}
	  }, [selectedTaskIndex]);

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
		const newTodoList: TaskList = []
		newListName === ""
			? setListNames([...listNames, `List ${listNames.length + 1}`])
			: setListNames([...listNames, newListName]);
			setTasks(prevTodo => [...prevTodo, newTodoList])
		setCreatingListModalOpen(false);
		setNewListName("");
		setSelectedListIndex(listNames.length);
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
		setManagingListIndex(-1);
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
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deletingList]);

	const handleInputChange = (name:string) => {
		setRenameListName(name);
	}

	useEffect(() => {
		const targetElementId = `list${selectedListIndex}?item${selectedTaskIndex}`;
		const targetElement = document.getElementById(targetElementId);
		if (targetElement) {
        	targetElement.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
		}
	}, [selectedListIndex, selectedTaskIndex]);

	return (
		<article className='tab-container'>
			<section className='tab-container bloc-tabs'>
				{" "}
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
							{managingListIndex === index && (
								<EditListModal
									onDeleteAction={() => setConfirmationDeleteModalOpen(true)}
									onRenameAction={renameTab}
									onInputChange={handleInputChange}
									onClose={() => setManagingListIndex(-1)}
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
				{tasks.map((content, index) => (
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
									className={`${item.done ? "task-done" : "task"} ${selectedTaskIndex === itemIndex ? "selected-task" : ""}`}
									key={itemIndex}
									id={`list${selectedListIndex}?item${selectedTaskIndex}`}
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
									<div className="task-properties">
										<p className="end-date" title={item.endDate} >
											{
												item.endDate && <IoIosTimer size={"1.2rem"} />
											}
										</p>
										<p className="difficulty" title="difficulty">
											<Difficulty difficulty={item.difficulty ?? 0} />
										</p>
										<p className="important" title="important">
											{
												item.important && <GrStar size={"1.2rem"} color="orange"/>
											}
										</p>
										<div className="task-labels">
											{
												item.labels?.map((label, index) => {
													return (
														<label 
															key={index} 
															style={{borderColor: label.color}}>
														{label.name}
														</label>
													)
												})
											}
										</div>
									</div>
									<MdEdit
										className="edit-icon"
										onClick={() => handleEditModal(itemIndex)}
									/>
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
						placeholder={`List ${listNames.length + 1}`}
						type='text'
						onChange={(e) => setNewListName(e.target.value)}
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
