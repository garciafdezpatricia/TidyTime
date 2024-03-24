import { useEffect, useState } from "react";
import { IoIosArrowDropdownCircle } from "react-icons/io";

export interface Props {
    text:string,
    options?: string[],
    colors?: string[],
    checkedOption: string,
    onChange?: (arg?:any) => void | any; 
}


export default function ComboBox({text, options, colors, checkedOption, onChange} : Props) {

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");

    const handleColorSelection = (color:string) => {
        setSelectedOption(color);
        if (onChange) {
            onChange(color);
        }
        setIsOpen(false);
    }

    useEffect(() => {
        setSelectedOption(checkedOption)
    }, [checkedOption])

    useEffect(() => {
        console.log(selectedOption)
    }, [selectedOption])

    return (
        <div className="combobox">
            <div className="combobox-header" onClick={() => setIsOpen(!isOpen)} >
                {selectedOption !== "" && selectedOption.startsWith("#")
                    ? <label className="combobox-selected-color" style={{backgroundColor: selectedOption}}></label>
                    : text
                }
                <IoIosArrowDropdownCircle cursor="pointer" />
            </div>
        {isOpen && colors &&  ( // color combobox
            <div className="combobox-content">
            {colors.map((color, index) => (
                <label key={index} style={{backgroundColor: colors[index], borderRadius: "100%"}}>
                    <button 
                        className="combo-color-option"
                        onClick={() => handleColorSelection(color)}>
                    </button>
                </label>
            ))}
            </div>
        )}
        {
            isOpen && options &&  ( // content combobox
            <div className="dropdown-content">
            {options.map((option, index) => (
                <label key={index}>
                    <button 
                        onClick={() => handleSelection(option)}>
                    </button>
                    {option}
                </label>
            ))}
            </div>
        )}
        </div>
    )
}