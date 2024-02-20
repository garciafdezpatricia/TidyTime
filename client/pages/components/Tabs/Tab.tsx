import { SetStateAction, useState } from "react";
import PromptModal from "../Modal/PromptModal/PromptModal";

export default function Tab() {

    const [toggleState, setToggleState] = useState(0);
    const [tabs, setTabs] = useState<Array<string>>(['Tasks', 'Home', 'Work']);
    const [content, setContent] = useState([
        [
            {title : 'Task1', desc: 'Go to the gym'},
            {title : 'Task2', desc: 'Call granny'},
            {title : 'Task3', desc: 'Buy vacuum'},
            {title : 'Task4', desc: 'This is content 4'},
        ], 
        [
            {title : 'Task1', desc: 'Load dishwasher'},
            {title : 'Task2', desc: 'Cleaning the bathroom'},
            {title : 'Task3', desc: 'Do laundry'},
            {title : 'Task4', desc: 'Mop'},
        ], 
        [
            {title : 'Task1', desc: 'Call Giselle'},
            {title : 'Task2', desc: 'Print EDP reports'},
            {title : 'Task3', desc: 'Update documentation'},
            {title : 'Task4', desc: 'Clean calendar'},
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

    const toggleTabAndContent = (index: SetStateAction<number>) => {
        setToggleState(index)
    }

    return (
        <article className="tab-container">
            <section className="tab-container bloc-tabs">
                {
                    tabs.map((tab, index) => (
                        <section 
                            className={toggleState === index ? "active-tab" : "tab"} 
                            key={index} 
                            onClick={() => toggleTabAndContent(index)}
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
                    content.map((content, index) => (
                        <section className={toggleState === index ? "active-content" : "content"}
                            key={index}>
                                {
                                    //TODO: make tasks checkable
                                    content.map((item, itemIndex) => (
                                        <article className="task" key={itemIndex}>
                                            <h4>{item.title}</h4>
                                            <p>{item.desc}</p>
                                        </article>
                                    ))
                                }
                        </section>
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