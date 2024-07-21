// Copyright 2024 Patricia García Fernández.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { useEffect, useRef, useState } from "react";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { useTranslation } from "react-i18next";

export interface Props {
    title?: string
    onRenameAction: (arg?:any) => void | any;
    onDeleteAction: (arg?:any) => void | any;
    onInputChange: (arg?:any) => void | any;
    onClose: (arg?:any) => void | any;
    dontShowDelete?: boolean
}

export default function EditListModal({onRenameAction, onDeleteAction, onInputChange, onClose, dontShowDelete, title} : Props) {
    const { t } = useTranslation();
    const [showInput, setShowInput] = useState(false);
    const [isButtonDisabled, setDisabled] = useState(false);
    const [newName, setNewName] = useState("")
    const nameInput = useRef(null);

    const handleKeyDown = (e:any) => {
        if (e.key === 'Enter' && showInput && newName !== "") {
            handleRename();
        }
    };

    const handleRename = async () => {
        await onRenameAction();
        if (nameInput.current) {
            // @ts-ignore
            nameInput.current.value = "";
        }
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
                <div data-testid='edit-modal' className="edit-modal">
                <header className="edit-modal-header">
                    <button 
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
                            data-testid='rename-button'
                        >
                            <MdOutlineDriveFileRenameOutline />
                            {t('board.editColumnPanel.rename')}
                        </button>
                        {
                            showInput && (
                                <section className="input-section">
                                    <input 
                                        data-testid='rename-input'
                                        ref={nameInput}
                                        type="text" 
                                        onChange={(e) => handleInputChange(e)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <button data-testid='confirm-rename' className="confirm-rename" onClick={handleRename} disabled={isButtonDisabled}>
                                        <FaCheck />
                                    </button>
                                </section>
                            )
                        }
                    </section>
                    {
                        !dontShowDelete && 
                        <button 
                            data-testid='remove-button'
                            onClick={onDeleteAction} 
                            className="remove-button"
                        >
                            <RiDeleteBin5Fill color="#b13838"/>
                            {t('board.editColumnPanel.remove')}
                        </button>
                    }
                </div>
            </div>
        </>
    )
}