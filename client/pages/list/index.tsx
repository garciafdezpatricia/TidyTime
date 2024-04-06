import EditTaskModal from "@/src/components/Modal/EditModal/EditTaskModal";
import NewTaskForm from "../../src/components/Form/NewTaskForm/NewTaskForm";
import SearchBar from "../../src/components/SearchBar/SearchBar";
import Tab from "../../src/components/Tabs/Tab";
import { useEffect, useState } from "react";
import { useTaskContext } from "@/src/components/Context/TaskContext";

// go to this page as /list
export default function List() {

	const [isEditingTaskModalOpen, setIsEditingTaskModalOpen] = useState(false);

	const {setSelectedTaskIndex, selectedTaskIndex} = useTaskContext();
	
	/**
	 * Sets the selected task index to the index of the task being selected. Opens/closes edit modal
	 * @param index contains the task index
	 */
	const handleEditModal = (index:number) => {
		setSelectedTaskIndex(index);
		setIsEditingTaskModalOpen(true);
	}

	return (
		<div className='list-container'>
			<SearchBar />
			<Tab handleEditModal={handleEditModal}></Tab>
			<NewTaskForm />
			{
				isEditingTaskModalOpen && (
					<EditTaskModal 
						isOpen={isEditingTaskModalOpen} 
						onClose={() => setIsEditingTaskModalOpen(false)}
					/>
				)
			}
		</div>
	);
}
