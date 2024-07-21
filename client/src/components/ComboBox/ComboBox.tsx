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

import { MutableRefObject, useEffect, useState } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";

export interface Props {
    text:string,
    options?: string[],
    colors?: string[],
    checkedOption: string,
    onOptionChange: (arg?:any) => void | any; 
}


export default function ComboBox({text, options, colors, checkedOption, onOptionChange} : Props) {

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");

    const handleColorSelection = (color:string) => {
        setSelectedOption(color);
        setIsOpen(false);
    }

    useEffect(() => {
        setSelectedOption(checkedOption)
    }, [checkedOption])

    return (
        <div className="combobox">
            <div className="combobox-header" onClick={() => setIsOpen(!isOpen)} >
                {selectedOption !== "" && selectedOption.startsWith("#")
                    ? <label className="combobox-selected-color" style={{backgroundColor: selectedOption}}></label>
                    : text
                }
                <IoIosArrowDropdownCircle color="#000000" cursor="pointer" />
            </div>
        {isOpen && colors &&  ( // color combobox
            <div className="combobox-content">
            {colors.map((color, index) => (
                <label key={index} style={{backgroundColor: colors[index], borderRadius: "100%"}}>
                    <button 
                        className="combo-color-option"
                        onClick={() => {handleColorSelection(color); onOptionChange(color)}}>
                    </button>
                </label>
            ))}
            </div>
        )}
        </div>
    )
}