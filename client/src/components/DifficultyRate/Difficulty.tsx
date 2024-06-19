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