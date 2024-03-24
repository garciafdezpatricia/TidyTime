import { useEffect, useState } from "react";

export interface Props {
    isChecked: boolean,
    onChange: (arg?:any) => void | any;
}

export default function Toggle({isChecked, onChange} : Props) {

    const [checkedValue, setChecked] = useState(isChecked);

    useEffect(() => {
        setChecked(isChecked);
      }, [isChecked]);
    
      const handleToggleChange = () => {
        const newValue = !checkedValue;
        setChecked(newValue);
        onChange(newValue);
      };

    return (
        <label className="switch">
            <input type="checkbox" checked={checkedValue} onChange={handleToggleChange} suppressContentEditableWarning/>
            <span className="slider round"></span>
        </label>

    )
}