import NewTaskForm from "../../src/components/Form/NewTaskForm/NewTaskForm";
import SearchBar from "../../src/components/SearchBar/SearchBar";
import Tab from "../../src/components/Tabs/Tab";

// go to this page as /list
export default function List() {
	

	function search(text: string) {
		// TODO: get the tasks that match the searched string
	}


	return (
		<div className='list-container'>
			<SearchBar />
			<Tab></Tab>
			<NewTaskForm />
		</div>
	);
}
