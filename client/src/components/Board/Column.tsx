import { IoIosArrowDropdown } from "react-icons/io";
import { useTaskContext } from "../Context/TaskContext";
import EditListModal from "../Modal/EditModal/EditListModal";
import { useState } from "react";
import PromptModal from "../Modal/PromptModal/PromptModal";
import {v4 as uuid} from 'uuid';
import Card from "./Card";
import { useInruptHandler } from "@/pages/api/inrupt";
import { useTranslation } from "react-i18next";

export interface ColumnProps {
    sectionWidth: number,
    content: any[],
    index: number,
    name: string,
    handleMoveTask: (arg?:any, arg2?:any) => void | any;
    handleCardClick: (arg?:any) => void | any;
}

export default function Column({sectionWidth, content, index, name, handleMoveTask, handleCardClick} : ColumnProps) {
    const { t } = useTranslation();
    const {listNames, setBoardColumns, boardColumns, tasks, setTasks} = useTaskContext();
    const {storeBoardColumns} = useInruptHandler();

    const [managingListIndex, setManagingListIndex] = useState(-1);
    const [renameListName, setRenameListName] = useState("");
    const [isConfirmationDeleteModalOpen, setConfirmationDeleteModalOpen] = useState(false);

    const manageEditModal = (index:number) => {
        setManagingListIndex(index);
    }

    const renameList = async () => {
        // @ts-ignore
        let newColumns = [...boardColumns];
        newColumns[index] = renameListName;
        setBoardColumns(newColumns);
        await storeBoardColumns(newColumns);
		setRenameListName("");
		setManagingListIndex(-1);
    }

    const handleInputChange = (name:string) => {
		setRenameListName(name);
	}

    const deleteColumn = async () => {
        if (boardColumns && boardColumns.length > 0) {
            let updatedTasks = tasks ? [...tasks] : [];
            if (boardColumns.length === 1) {
                // erase all columns
                setBoardColumns([]);
                await storeBoardColumns([]);
                updatedTasks.forEach((tasklist) => {
                    tasklist.value.forEach((task) => {
                        task.status = 0;
                    })
                })
            } else {
                // erase that column
                const newColumns = boardColumns.filter((_, i) => i !== index);
                setBoardColumns(newColumns);
                await storeBoardColumns(newColumns)
                updatedTasks.forEach((tasklist) => {
                    tasklist.value.forEach((task) => {
                        if (task.status === index) {
                            task.status = 0;
                        }
                    })
                })                
            }
            setTasks(updatedTasks)
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
                            title={t('board.editColumnPanel.title')}
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
                    content && content.map((card, cardIndex) => {
                        return (
                            <Card 
                                cardIndex={cardIndex} 
                                list={card.listIndex} 
                                title={card.title} 
                                columnIndex={index} 
                                key={uuid()}
                                handleMoveTask={handleMoveTask}
                                taskId={card.id}
                                handleCardClick={handleCardClick}
                            />
                        )
                    })
                }
            </div>
            {isConfirmationDeleteModalOpen && (
				<PromptModal
					title={t('deletePanel.title')}
					onPrimaryAction={async () => await deleteColumn()}
					primaryActionText={t('deletePanel.delete')}
					secondaryActionText={t('deletePanel.cancel')}
					onSecondaryAction={() => setConfirmationDeleteModalOpen(false)}
					variant='confirmation-modal'
					backdrop
				></PromptModal>
			)}
        </section>
    )
}