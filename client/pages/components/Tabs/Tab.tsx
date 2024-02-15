import { SetStateAction, useState } from "react";

export default function Tab() {

    const [toggleState, setToggleState] = useState(0);
    const [tabs, setTabs] = useState(['List 1', 'List 2', 'List 3'])
    const [content, setContent] = useState(['Content1', 'Content2', 'Content3'])

    const addTab = () => {
        const newTab = `List ${tabs.length + 1}`;
        setTabs([...tabs, newTab]);
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
            <button className="tab-container addTab" onClick={addTab}>Add Tab</button>
            <section>
                {
                    content.map((content, index) => (
                        <section className={toggleState === index ? "active-content" : "content"}
                            key={index}>{content}
                        </section>
                    ))
                }
            </section>

        </article>

    )
}