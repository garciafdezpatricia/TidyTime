import SearchBar from "../components/SearchBar/SearchBar";
import Tab from "../components/Tabs/Tab";

// go to this page as /list
export default function List() {

    //TODO: create context passing the tasks

    function search(text: string) {
        // TODO: get the tasks that match the searched string
    }


    return (
        <div className="list-container">
            <SearchBar onChange={search}/>
            <Tab></Tab>
        </div>)
}