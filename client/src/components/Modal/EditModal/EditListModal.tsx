import { useEffect, useRef, useState } from "react";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";

export interface Props {
    title?: string
    onRenameAction: (arg?:any) => void | any;
    onDeleteAction: (arg?:any) => void | any;
    onInputChange: (arg?:any) => void | any;
    onClose: (arg?:any) => void | any;
    dontShowDelete?: boolean
}

export default function EditListModal({onRenameAction, onDeleteAction, onInputChange, onClose, dontShowDelete, title} : Props) {

    const [showInput, setShowInput] = useState(false);
    const [isButtonDisabled, setDisabled] = useState(false);
    const [newName, setNewName] = useState("")
    const nameInput = useRef(null);

    const handleKeyDown = (e:any) => {
        if (e.key === 'Enter' && showInput && newName !== "") {
            handleRename();
        }
    };

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
        <>
            <div className="backdrop">
                <div className="edit-modal">
                <header className="edit-modal-header">
                    <button 
                        title="Close"
                        onClick={onClose} 
                        className="close-button">
                            <ImCross size={".7rem"} />
                    </button>
                </header>
                    <p>{title}</p>
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
                                <section className="input-section">
                                    <input 
                                        ref={nameInput}
                                        type="text" 
                                        onChange={(e) => handleInputChange(e)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <button className="confirm-rename" onClick={handleRename} disabled={isButtonDisabled}>
                                        <FaCheck />
                                    </button>
                                </section>
                            )
                        }
                    </section>
                    {
                        !dontShowDelete && 
                        <button 
                        onClick={onDeleteAction} 
                        className="remove-button"
                    >
                        <RiDeleteBin5Fill color="#b13838"/>
                        Remove
                    </button>
                    }
                </div>
            </div>
        </>
    )
}