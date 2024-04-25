import { useRouter } from "next/router";
import { Icon } from "../Icon/Icon";
import { useSessionContext } from "../Context/SolidContext";

export function MenuSideBar() {

    const { solidSession } = useSessionContext();
    const router = useRouter();
    return (
        <section className="sidebar-menu">
            <button className="menu-button" onClick={() => {router.push('/')}}>
                    <h1 className="sidebar-menu-title">TidyTime</h1>
                </button>
            <section className="sidebar-menu-features">
                <button className="menu-button" 
                    onClick={() => { 
                        if (solidSession?.info.isLoggedIn) {
                            router.push('/list')
                        }
                    }}>
                    <Icon src="menu/todo-list.svg" alt="TO-DO List"/>
                    List
                </button>
                <button className="menu-button" 
                    onClick={() => { 
                        if (solidSession?.info.isLoggedIn) {
                            router.push('/board')
                        }
                    }}>
                    <Icon src="menu/board.svg" alt="Board" />
                    Board
                </button>
                <button className="menu-button" 
                    onClick={() => { 
                        if (solidSession?.info.isLoggedIn) {
                            router.push('/calendar')
                        }
                    }}>
                    <Icon src="menu/calendar.svg" alt="Calendar" />
                    Calendar
                </button>
                <button className="menu-button" 
                    onClick={() => { 
                        if (solidSession?.info.isLoggedIn) {
                            router.push('/tidier')
                        }
                    }}>
                    <Icon src="menu/tidier.svg" alt="Tidier" />
                    Tidier
                </button>
            </section>
            <section className="sidebar-menu-settings">
                <button className="menu-button" 
                    onClick={() => { 
                        if (solidSession?.info.isLoggedIn) {
                            router.push('/settings')
                        }
                    }}>
                    <Icon src="menu/settings.svg" alt="Settings" />
                    Preferences
                </button>
            </section>
        </section>
    )
}