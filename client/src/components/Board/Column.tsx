import { BoardItem } from "@/src/model/Scheme";
import { IoIosAddCircle, IoIosArrowDropdown } from "react-icons/io";
import { useTaskContext } from "../Context/TaskContext";
import EditListModal from "../Modal/EditModal/EditListModal";
import { useState } from "react";
import PromptModal from "../Modal/PromptModal/PromptModal";
import {v4 as uuid} from 'uuid';
import Card from "./Card";

export interface ColumnProps {
    sectionWidth: number,
    content: BoardItem[],
    index: number,
    name: string,
    handleMoveTask: (arg?:any, arg2?:any) => void | any;
    handleCardClick: (arg?:any) => void | any;
}

export default function Column({sectionWidth, content, index, name, handleMoveTask, handleCardClick} : ColumnProps) {

    const {listNames, setBoardColumns, boardColumns, tasks, setTasks} = useTaskContext();

    const [managingListIndex, setManagingListIndex] = useState(-1);
    const [renameListName, setRenameListName] = useState("");
    const [isConfirmationDeleteModalOpen, setConfirmationDeleteModalOpen] = useState(false);

    const manageEditModal = (index:number) => {
        setManagingListIndex(index);
    }

    const renameList = () => {
        setBoardColumns((prevColumns) => {
			const newColumns = [...prevColumns];
			newColumns[index] = renameListName;
			return newColumns;
		});
		setRenameListName("");
		setManagingListIndex(-1);
    }

    const handleInputChange = (name:string) => {
		setRenameListName(name);
	}

    const deleteColumn = () => {
        if (boardColumns.length > 0) {
            // we're deleting last column
            if (boardColumns.length === 1) {
                // erase all columns
                setBoardColumns([]);
                // set the status of all items to 0
                const updatedItems = tasks;
                updatedItems.flat().map((item) => {
                    item.status = 0;
                })
                setTasks(updatedItems)

            // we're deleting a column but not the last
            } else {
                // erase that column
                setBoardColumns((prevColumns) => {
                    return prevColumns.filter((_, i) => i !== index);
                })
                const updatedBoardItems = [...tasks];
                // move items from the list we're deleting to the first one
                const itemsToMove = tasks[index];
                if (itemsToMove) {
                    itemsToMove.map((item) => item.status = 0);
                    updatedBoardItems.splice(index, 1); // delete 
                    // check if the first column exists (could be the one that is being deleted)
                    updatedBoardItems[0] = updatedBoardItems[0] ? [...itemsToMove, ...updatedBoardItems[0]] : [...itemsToMove];
                } else {
                    updatedBoardItems.splice(index, 1); // delete 
                }                
                setTasks(updatedBoardItems);    
            }
            setConfirmationDeleteModalOpen(false);
        }          
	};
    
    return (
        <section className="board-column" key={index} style={{width: `${sectionWidth}%`}}>
            <div className="board-column-title">
                <p className="title" title={name}>{name}</p>
                <div>
                    <IoIosArrowDropdown
                        size={"1rem"}
                        color={"#3E5B41"}
                        cursor={"pointer"}
                        onClick={() => manageEditModal(index)}
                    />{" "}
                    {managingListIndex === index && (
                        <EditListModal
                            title="What do you want to do with this column?"
                            onDeleteAction={() => setConfirmationDeleteModalOpen(true)}
                            onRenameAction={renameList}
                            onInputChange={handleInputChange}
                            onClose={() => setManagingListIndex(-1)}
                            
                        />
                    )}
                </div>
            </div>
            <div className="board-column-content">
                {
                    content.map((card, cardIndex) => {
                        return (
                            <Card 
                                cardIndex={cardIndex} 
                                list={card.listIndex} 
                                title={card.title} 
                                columnIndex={index} 
                                key={uuid()}
                                handleMoveTask={handleMoveTask}
                                taskIndexinList={card.taskIndexInList}
                                handleCardClick={handleCardClick}
                            />
                        )
                    })
                }
            </div>
            {isConfirmationDeleteModalOpen && (
				<PromptModal
					title="Are you sure you want to delete this list? This action can't be undone"
					onPrimaryAction={() => deleteColumn()}
					primaryActionText='Delete'
					secondaryActionText='Cancel'
					onSecondaryAction={() => setConfirmationDeleteModalOpen(false)}
					variant='confirmation-modal'
					backdrop
				></PromptModal>
			)}
        </section>
    )
}