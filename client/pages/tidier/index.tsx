import { useSessionContext } from "@/src/components/Context/SolidContext";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {} from "react"

export default function Tidier() {

    const { solidSession } = useSessionContext();
    const [reRender, setRerender] = useState(Math.random());
    const router = useRouter();

    useEffect(() => {
        if (!solidSession?.info.isLoggedIn) {
            router.push("/");
        }
    }, [reRender])

    return (
    <div className="tidier-container">
        <h1>Hello Tidier!</h1>
    </div>)
}