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

import { Label } from "@/src/model/Scheme";
import { ReactNode, useState } from "react";
import { useTaskContext } from "../Context/TaskContext";
import { useClickAway } from "@uidotdev/usehooks";

export interface Props{
    variant?: string,
    text: ReactNode,
    checkedLabels: Label[],
    onChange: (selectedOptions: Label[]) => void;
}

export default function CheckableComboBox({checkedLabels, onChange, text, variant} : Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<Label[]>(checkedLabels);
    const {labels} = useTaskContext();
    const ref = useClickAway(() => {
        setIsOpen(false);
    })

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleCheckboxChange = (option:Label) => {
        const selectedIndex = selectedOptions.findIndex((label) => label.name === option.name);
        let newSelectedOptions;
        // if the option is a new filter, add it to the selected options
        if (selectedIndex === -1) {
            newSelectedOptions = [...selectedOptions, option];  
        } else {
            // create a new array for the selected options and remove the option that has been unchecked
            newSelectedOptions = [...selectedOptions];
            newSelectedOptions.splice(selectedIndex, 1);
        }
        setSelectedOptions(newSelectedOptions);
        onChange(newSelectedOptions); // Envía la selección al componente padre
    }

    return (
        // @ts-ignore
        <div ref={ref} className= {variant ? variant : "combobox-select"}>
            <div className="dropdown-header" onClick={toggleDropdown}>
                {text}
            </div>
        {isOpen && (
            <div className="dropdown-content">
            {labels && labels.map((option, index) => (
                <label className="dropdown-option" key={index}>
                <input
                    type="checkbox"
                    checked={selectedOptions.some((label) => label.name === option.name)}
                    onChange={() => handleCheckboxChange(option)}
                />
                {option.name}
                </label>
            ))}
            </div>
        )}
        </div>
    )
}