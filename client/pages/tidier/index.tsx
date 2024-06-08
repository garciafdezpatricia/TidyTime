import { useSessionContext } from "@/src/components/Context/SolidContext";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {} from "react"
import { useInruptHandler } from "../api/inrupt";
import Loader from "@/src/components/Loading/Loading";
import toast from "react-hot-toast";

export default function Tidier() {

    const { solidSession } = useSessionContext();
    const { getSession } = useInruptHandler();
    const [reRender, setRerender] = useState(Math.random());
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        getSession();
      }, [reRender]);
    
      useEffect(() => {
        if (solidSession === undefined) {
            setLoading(true);
        } else {
            if (!solidSession?.info.isLoggedIn) {
                router.push("/");
            }
            setLoading(false);
        }   
      }, [solidSession])

    return (
        loading ? 
        <Loader />
        :
        <div className="tidier-container">
            <button>
                Create container
            </button>
        </div>
    )
}