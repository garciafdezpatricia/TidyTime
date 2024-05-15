import Board from "@/src/components/Board/Board";
import { useSessionContext } from "@/src/components/Context/SolidContext";
import EditTaskModal from "@/src/components/Modal/EditModal/EditTaskModal";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useInruptHandler } from "../api/inrupt";
import Loader from "@/src/components/Loading/Loading";

// go to this page as /board
export default function List() {
    const { solidSession } = useSessionContext();
    const { getSession, getTasks, getLabels, getBoardColumns } = useInruptHandler();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [reRender, setRerender] = useState(Math.random());
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        getSession();
    }, [reRender])

    useEffect(() => {
        fetchData();
    }, [solidSession])

    const handleCardClick = () => {
        setEditModalOpen(true);
    }

    const fetchData = async () => {
        if (solidSession === undefined) {
            setLoading(true);
        } else {
            if (solidSession?.info.isLoggedIn) {
                await getTasks();
                await getLabels();
                await getBoardColumns();
            } else {
                router.push("/");
            }
            setLoading(false);
        }
    };

    return (
        loading ?
        <Loader />
        : 
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