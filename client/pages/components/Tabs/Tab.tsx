import { SetStateAction, useEffect, useState } from "react";
import PromptModal from "../Modal/PromptModal/PromptModal";
import { FaRegCircle, FaCheckCircle } from "react-icons/fa";
import { IoIosArrowDropdown } from "react-icons/io";

export default function Tab() {

    const [deleting, setDeleting] = useState(false);
    const [selectedList, setSelectedList] = useState(0);
    const [tabs, setTabs] = useState<Array<string>>(['Tasks', 'Home', 'Work']);
    const [todo, setToDo] = useState([
        [
            {done: false, title: 'Go to the gym'},
            {done: false, title: 'Call granny'},
            {done: false, title: 'Buy vacuum'},
            {done: false, title: 'This is content 4'},
        ], 
        [
            {done: false, title: 'Load dishwasher'},
            {done: false, title: 'Cleaning the bathroom'},
            {done: false, title: 'Do laundry'},
            {done: false, title: 'Mop'},
        ], 
        [
            {done: false, title: 'Call Giselle'},
            {done: false, title: 'Print EDP reports'},
            {done: false, title: 'Update documentation'},
            {done: false, title: 'Clean calendar'},
        ]])
    const [isCreateList, setNewList] = useState(false);
    const [title, setTitle] = useState('');

    const addTab = () => {
        setNewList(true)
    }

    const createNewList = () => {
        // TODO: create the list structure for the pod
        title === '' ? setTabs([...tabs, `List ${tabs.length + 1}`]) : setTabs([...tabs, title]);
        setNewList(false);
        setTitle('');
        setSelectedList(tabs.length)
    }

    const handleListSelection = (index: SetStateAction<number>) => {
        setSelectedList(index)
    }

    const handleCheck = (event:any, itemIndex:any) => {
        setToDo(prevTodo => {
            return prevTodo.map((list, index) => {
                if (index === selectedList) {
                    // remove item from list
                    const updatedList = list.filter((_, i) => i !== itemIndex);
                    // if event is not done, it is being marked as done
                    if (!event.done) {
                        return [...updatedList, { ...list[itemIndex], done: !list[itemIndex].done }];
                    } 
                    else {
                        return [{ ...list[itemIndex], done: !list[itemIndex].done }, ...updatedList];
                    }
                }
                return list;
            });
        });
    }

    const deleteList = (index:any) => {
        setDeleting(true);
        setTabs(prevTabs => {
            return prevTabs.filter((_, i) => i !== index)
        })
        setToDo(prevTodo => {
            return prevTodo.filter((_, i) => i !== index)
        });
    }

    useEffect(() => {
        if (deleting) {
            setSelectedList(0);
            setDeleting(false);
        }
    }, [deleting])

    return (
        <article className="tab-container">
            <section className="tab-container bloc-tabs">
                {
                    tabs.map((tab, index) => (
                        <section 
                            className={selectedList === index ? "active-tab" : "tab"} 
                            key={index} 
                            onClick={() => handleListSelection(index)}
                        >{tab}
                        <IoIosArrowDropdown 
                            size={"1rem"}
                            color={"#3E5B41"}
                            onClick={() => deleteList(index)}
                            />
                        </section>
                    ))
                }
            </section>
            <button className="tab-container add-tab" onClick={addTab}>Add New List</button>
            <section className="tab-content-container">
                {
                    todo.map((content, index) => (
                        <ul className={selectedList === index ? "active-content" : "content"}
                            key={index}>
                                {
                                    content.map((item, itemIndex) => (
                                        <li className={item.done ? "task-done" : "task"} key={itemIndex} >
                                            <div className="icon-container">
                                                <FaRegCircle 
                                                    className={item.done ? "circle-disappear" : ""}
                                                    onClick={(e) => handleCheck(item, itemIndex)} 
                                                />
                                                <FaCheckCircle 
                                                    className={item.done ? "" : "circle-disappear"}
                                                    onClick={(e) => handleCheck(item, itemIndex)} 
                                                />
                                            </div>
                                            <div className="task-content">
                                                <h4>{item.title}</h4>
                                            </div>
                                        </li>
                                    ))
                                }
                        </ul>
                    ))
                }
            </section>
            {
                isCreateList && (
                    <PromptModal 
                        variant="new-list" 
                        title="Add new list"
                        onSecondaryAction={() => setNewList(false)}
                        secondaryActionText="Cancel"
                        primaryActionText="Create"
                        onPrimaryAction={() => createNewList()}
                    >
                        <input
                            placeholder={`List ${tabs.length + 1}`}
                            type="text"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </PromptModal>
                )
            }
        </article>

    )
}