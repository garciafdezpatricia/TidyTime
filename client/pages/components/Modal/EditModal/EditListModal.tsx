import { useEffect, useRef, useState } from "react";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import PromptModal from "../PromptModal/PromptModal";

export interface Props {
    onRenameAction: (arg?:any) => void | any;
    onDeleteAction: (arg?:any) => void | any;
    onInputChange: (arg?:any) => void | any;
}

export default function EditListModal({onRenameAction, onDeleteAction, onInputChange} : Props) {

    const [showInput, setShowInput] = useState(false);
    const [isButtonDisabled, setDisabled] = useState(false);
    const [newName, setNewName] = useState("")
    const nameInput = useRef(null);

    const handleRename = () => {
        onRenameAction();
        // @ts-ignore
        nameInput.current.value = "";
        setNewName("");
    }

    const handleInputChange = (e:any) => {
        setNewName(e.target.value);
        onInputChange(e.target.value)
    }

    useEffect(() => {
        newName === ""
        ? setDisabled(true)
        : setDisabled(false);
    }, [newName])

    return (
            <div className="edit-modal">
                <section className="rename-section">
                    <button 
                        onClick={() => setShowInput(!showInput)} 
                        className="rename-button"
                    >
                        <MdOutlineDriveFileRenameOutline />
                        Rename
                    </button>
                    {
                        showInput && (
                            <section className="rename-section">
                                <input 
                                    ref={nameInput}
                                    type="text" 
                                    onChange={(e) => handleInputChange(e)}
                                />
                                <button className="rename" onClick={handleRename} disabled={isButtonDisabled}>
                                    <FaCheck />
                                </button>
                            </section>
                        )
                    }
                </section>
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