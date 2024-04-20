import Board from "@/src/components/Board/Board";
import EditTaskModal from "@/src/components/Modal/EditModal/EditTaskModal";
import { useState } from "react";

// go to this page as /board
export default function List() {
    const [editModalOpen, setEditModalOpen] = useState(false);

    const handleCardClick = () => {
        setEditModalOpen(true);
    }

    return (
    <div className="board-container">
        <Board handleCardClick={handleCardClick}/>
        {
            editModalOpen && 
            <EditTaskModal 
                isOpen={editModalOpen} 
                onClose={() => setEditModalOpen(false)}
            />
        }
    </div>)
}