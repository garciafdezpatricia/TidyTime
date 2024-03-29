import { Label } from "@/src/task/Scheme";
import { useContext, useState } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { useTaskContext } from "../Context/TaskContext";

export interface Props{
    checkedLabels: Label[],
    onChange: (selectedOptions: Label[]) => void;
}

export default function CheckableComboBox({checkedLabels, onChange} : Props) {

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<Label[]>(checkedLabels);
    const {labels} = useTaskContext();

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleCheckboxChange = (option:Label) => {
        const selectedIndex = selectedOptions.findIndex((label) => label.name === option.name);
        let newSelectedOptions;
        if (selectedIndex === -1) {
            newSelectedOptions = [...selectedOptions, option];  
        } else {
            newSelectedOptions = [...selectedOptions];
            newSelectedOptions.splice(selectedIndex, 1);
        }
        setSelectedOptions(newSelectedOptions);
        onChange(newSelectedOptions); // Envía la selección al componente padre
    }

    return (
        <div className="combobox-select">
            <div className="dropdown-header" onClick={toggleDropdown}>
                Select options
                <IoIosArrowDropdownCircle />
            </div>
        {isOpen && (
            <div className="dropdown-content">
            {labels.map((option, index) => (
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