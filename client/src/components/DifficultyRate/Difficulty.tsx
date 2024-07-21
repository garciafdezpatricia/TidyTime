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

import { VscCircleLargeFilled } from "react-icons/vsc"

export interface Props {
    difficulty: number,
    color?: string
}

export default function Difficulty({difficulty, color} : Props) {
    
    return (
        <>
        { difficulty > 0 
            ? [...Array(difficulty)].map((point, index) => {
                return (
                    // eslint-disable-next-line react/jsx-key
                    <VscCircleLargeFilled size={"1.2rem"} color={color ?  color : "#3E5B41"} /> 
                )
            })
            : <></>
        }
        </>
    )
}