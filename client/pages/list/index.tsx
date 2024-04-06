import { useTaskContext } from "../../src/components/Context/TaskContext";
import NewTaskForm from "../../src/components/Form/NewTaskForm/NewTaskForm";
import SearchBar from "../../src/components/SearchBar/SearchBar";
import Tab from "../../src/components/Tabs/Tab";

// go to this page as /list
export default function List() {
    // context with the tasks
	const { selectedListIndex, setToDo } = useTaskContext();

	return (
		<div className='list-container'>
			<SearchBar />
			<Tab></Tab>
			<NewTaskForm />
		</div>
	);
}
