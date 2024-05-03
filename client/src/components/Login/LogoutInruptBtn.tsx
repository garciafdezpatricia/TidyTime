import { useInruptHandler } from "@/pages/api/inrupt";
import { Icon } from "../Icon/Icon";


export default function LogoutInrupt() {

    const { logoutInrupt } = useInruptHandler();

    return (
        <button className="logout-inrupt-button" onClick={logoutInrupt}>
            Logout
        </button>
    )
}