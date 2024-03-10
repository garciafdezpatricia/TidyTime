import { useTaskContext } from "../components/Context/TaskContext";
import NewTaskForm from "../components/Form/NewTaskForm/NewTaskForm";
import SearchBar from "../components/SearchBar/SearchBar";
import Tab from "../components/Tabs/Tab";

// go to this page as /list
export default function List() {
    // context with the tasks
	const {tabs, todo, selectedListIndex, setTabs, setToDo} = useTaskContext();

	function search(text: string) {
		// TODO: get the tasks that match the searched string
	}

	function addNewTask(e: any) {
		setToDo((prevTodo) => {
			return prevTodo.map((list, index) => {
				if (index === selectedListIndex) {
                    return [{ title: e, done: false }, ...list];
                } 
                return list;
            });
        });
	}


	return (
		<div className='list-container'>
			<SearchBar onChange={search} />
			<Tab></Tab>
			<NewTaskForm onSubmit={addNewTask} />
		</div>
	);
}
