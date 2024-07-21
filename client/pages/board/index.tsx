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