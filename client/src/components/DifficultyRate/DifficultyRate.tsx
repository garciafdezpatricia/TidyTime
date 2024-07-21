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
import { VscCircleLarge, VscCircleLargeFilled } from "react-icons/vsc";

export interface Props {
    taskRating?: number,
    onChange: (arg?:any) => void | any;
    newDifficulty?: number,
}

export default function DifficultyRate({taskRating, onChange, newDifficulty} : Props) {

    const difficultyMax = 4;
    const [rating, setRating] = useState(taskRating? taskRating : -1)

    useEffect(() => {
        if (newDifficulty === -1) {
            setRating(taskRating ? taskRating : -1);
        }
    }, [newDifficulty, taskRating]);

    useEffect(() => {
        onChange(rating);
    }, [onChange, rating]);

    // green scale 
    const diffiycultyColors = ["#b7dfbb", "#87b38b", "#527556", "#3E5B41"]

    return (
        <article className="difficulty-rate">
            {[...Array(difficultyMax)].map((point, index) => {
                const currentRate = index + 1;
                return (
                    <label 
                        key={index} 
                        onClick={() => setRating(currentRate)}>
                        { currentRate <= (rating) 
                            ? <VscCircleLargeFilled size={"1.2rem"} color={diffiycultyColors[index]} /> 
                            : <VscCircleLarge title="Assign difficulty" size={"1.2rem"} />
                        }
                    </label>
                )
            })}
        </article>
    )

}