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

import { useEffect, useState } from "react";
import { useTaskContext } from "../../Context/TaskContext"
import { LuListPlus } from "react-icons/lu";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useTranslation } from 'react-i18next';

export default function BoardPanel() {
    const { t } = useTranslation();
    const [columns, setColumns] = useState<string[] | undefined>(undefined);
    const { boardColumns, setBoardColumns } = useTaskContext();

    useEffect(() => {
        if (boardColumns) {
            let result:string[] = [];
            boardColumns.forEach((column) => {
                result.push(column);
            })
            setColumns(result);
        }
    }, [boardColumns])

    const handleColumnRename = (value:string, index:number) => {
        if (columns) {
            let result = [...columns];
            let updatedColumn = result[index];
            updatedColumn = value;
            result = [...result.slice(0, index),
                updatedColumn,
                ...result.slice(index + 1)
            ];
            setBoardColumns(result);
        }
    }   

    const handleColumnDeletion = (index:number) => {
        if (columns) {
            let result = columns.filter((column, columnIndex) => index !== columnIndex);
            setBoardColumns(result);
        }
    }

    const addNewInput = () => {
        if (columns) {
            let result = [...columns, "New column"];
            setBoardColumns(result);
        }
    }

    return (
        <article className="board-preferences">
            <h3>{t('preferences.board.title')}</h3>
            <hr></hr>
            <p>{t('preferences.board.desc')}</p>
            <section className="default-columns">
                {
                    columns !== undefined
                    ?
                    <div className="columns-input">
                    {
                        columns.length > 0 ?
                        columns.map((column, index) => {
                            return (
                                <div key={index} className="individual-input">
                                    <input 
                                        title={column ?? "column"}
                                        type="text" 
                                        defaultValue={column}
                                        onChange={(e) => handleColumnRename(e.target.value, index)}
                                    />
                                    <div  
                                        onClick={() => handleColumnDeletion(index)}
                                        className="delete-input-button">
                                        <RiDeleteBin5Fill />
                                    </div>
                                </div>
                            )
                        })
                        : <div style={{paddingInline: ".5rem"}}><p style={{fontSize: ".7rem"}}>Add a column!</p></div>
                    }
                    </div>
                    :
                    <div style={{display: "flex", alignItems: "center", gap: ".5rem"}}>
                        <p>Loading...</p>
                        <div className="loader"></div>
                    </div>
                }
                <div 
                    onClick={addNewInput}
                    className="new-column">
                    <LuListPlus />
                </div>
            </section>
        </article>
    )
}