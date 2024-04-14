import { useEffect, useState } from "react";
import { IoIosAddCircle } from "react-icons/io";



export default function Board() {

    const [columns, setColumns] = useState(["To Do", "In progress", "Done"]);
    const [sectionWidth, setSectionWidth] = useState(100 / columns.length);

    useEffect(() => {
        setSectionWidth(100 / columns.length);
    }, [columns])

    return (
        <article className="board-section">
            <section className="board-button-section">
                
            </section>
            <section className="board-board">
                {
                    columns.map((column, index) => {
                        return (
                            <section className="board-column" key={index} style={{width: `${sectionWidth}%`}}>
                                <div className="board-column-title">{column}</div>
                                <div className="board-column-content">
                                    <article className="board-column-content-item">
                                        <p>Hacer las maletas</p>
                                    </article>
                                </div>
                                <div className="board-column-new-item">
                                    <form className="new-item-form">
                                        <IoIosAddCircle 
                                            size={"1.5rem"} 
                                            color="#787777"
                                            cursor={"pointer"}
                                            className="new-item-icon"
                                        />
                                        <input type="text" />
                                    </form> 
                                </div>
                            </section>
                        )
                    })
                }
            </section>
        </article>
    )
}