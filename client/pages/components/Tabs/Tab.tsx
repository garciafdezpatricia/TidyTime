import { SetStateAction, useEffect, useState } from "react";
import PromptModal from "../Modal/PromptModal/PromptModal";

export default function Tab() {

    const [selectedList, setSelectedList] = useState(0);
    const [tabs, setTabs] = useState<Array<string>>(['Tasks', 'Home', 'Work']);
    const [todo, setToDo] = useState([
        [
            {done: false, title : 'Task1', desc: 'Go to the gym'},
            {done: false, title : 'Task2', desc: 'Call granny'},
            {done: false, title : 'Task3', desc: 'Buy vacuum'},
            {done: false, title : 'Task4', desc: 'This is content 4'},
        ], 
        [
            {done: false, title : 'Task1', desc: 'Load dishwasher'},
            {done: false, title : 'Task2', desc: 'Cleaning the bathroom'},
            {done: false, title : 'Task3', desc: 'Do laundry'},
            {done: false, title : 'Task4', desc: 'Mop'},
        ], 
        [
            {done: false, title : 'Task1', desc: 'Call Giselle'},
            {done: false, title : 'Task2', desc: 'Print EDP reports'},
            {done: false, title : 'Task3', desc: 'Update documentation'},
            {done: false, title : 'Task4', desc: 'Clean calendar'},
        ]])
    const [isNewList, setNewList] = useState(false);
    const [title, setTitle] = useState('');

    const addTab = () => {
        setNewList(true)
    }

    const createNewList = () => {
        // TODO: create the list structure for the pod
        title === '' ? setTabs([...tabs, `List ${tabs.length + 1}`]) : setTabs([...tabs, title]);
        setNewList(false);
        setTitle('');
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
                        </section>
                    ))
                }
            </section>
            {
            // TODO:Add styles to the button 
            }
            <button className="tab-container add-tab" onClick={addTab}>Add New List</button>
            <section className="tab-content-container">
                {
                    todo.map((content, index) => (
                        <ul className={selectedList === index ? "active-content" : "content"}
                            key={index}>
                                {
                                    content.map((item, itemIndex) => (
                                        <li className={item.done ? "task-done" : "task"} key={itemIndex} onClick={(e) => handleCheck(item, itemIndex)}>
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
                isNewList && (
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