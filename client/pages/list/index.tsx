import NewTaskForm from "../components/Form/NewTaskForm/NewTaskForm";
import SearchBar from "../components/SearchBar/SearchBar";
import Tab from "../components/Tabs/Tab";

// go to this page as /list
export default function List() {

    //TODO: create context passing the tasks

    function search(text: string) {
        // TODO: get the tasks that match the searched string
    }

    function addNewTask(e:any) {
        console.log(e)
    }


    return (
        <div className="list-container">
            <SearchBar onChange={search}/>
            <Tab></Tab>
            <NewTaskForm onSubmit={addNewTask} />
        </div>)
}