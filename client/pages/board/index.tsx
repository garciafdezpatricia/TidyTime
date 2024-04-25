import Board from "@/src/components/Board/Board";
import { useSessionContext } from "@/src/components/Context/SolidContext";
import EditTaskModal from "@/src/components/Modal/EditModal/EditTaskModal";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// go to this page as /board
export default function List() {
    const { solidSession } = useSessionContext();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [reRender, setRerender] = useState(Math.random());
    const router = useRouter();

    useEffect(() => {
        if (!solidSession?.info.isLoggedIn) {
            router.push("/");
        }
    }, [reRender])

    const handleCardClick = () => {
        setEditModalOpen(true);
    }

    return (
        solidSession?.info.isLoggedIn &&
        <div className="board-container">
            <Board handleCardClick={handleCardClick}/>
            {
                editModalOpen && 
                <EditTaskModal 
                    isOpen={editModalOpen} 
                    onClose={() => setEditModalOpen(false)}
                />
            }
        </div>
    )
}