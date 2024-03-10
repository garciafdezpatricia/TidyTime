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