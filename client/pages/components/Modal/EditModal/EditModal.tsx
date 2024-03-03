import { useEffect, useState } from "react";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import PromptModal from "../PromptModal/PromptModal";

export interface Props {
    onRenameAction?: (arg?:any) => void | any;
    onDeleteAction?: (arg?:any) => void | any;
}

export default function EditModal({onRenameAction, onDeleteAction} : Props) {

    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    
    const handleRenamingList = () => {
        setIsRenameModalOpen(true);
    }

    return (
            <div className="edit-modal">
                <button 
                    onClick={onRenameAction} 
                    className="rename-button"
                >
                    <MdOutlineDriveFileRenameOutline />
                    Rename
                </button>
                <button 
                    onClick={onDeleteAction} 
                    className="remove-button"
                >
                    <RiDeleteBin5Fill color="#b13838"/>
                    Remove
                </button>
            </div>
    )
}