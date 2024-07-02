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