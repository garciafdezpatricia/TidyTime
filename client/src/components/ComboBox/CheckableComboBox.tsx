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