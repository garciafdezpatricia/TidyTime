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
        <label title="switch" className="switch">
            <input type="checkbox" checked={checkedValue} onChange={handleToggleChange} suppressContentEditableWarning/>
            <span className="slider round"></span>
        </label>

    )
}