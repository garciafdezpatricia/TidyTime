import { useRouter } from "next/router";
import { Icon } from "../Icon/Icon";
import { useSessionContext } from "../Context/SolidContext";

export function MenuSideBar() {

    const { solidSession } = useSessionContext();
    const router = useRouter();

    return (
        <section className="sidebar-menu">
            <div className="menu-title">
                <button className="menu-button" onClick={() => {router.push('/')}}>
                    <h1 className="sidebar-menu-title">TidyTime</h1>
                </button>
            </div>
            <section className="sidebar-menu-features">
                <button className="menu-button" 
                    onClick={() => { 
                        if (solidSession?.info.isLoggedIn) {
                            router.push('/list')
                        }
                    }}>
                    <Icon src="menu/todo-list.svg" alt="TO-DO List"/>
                    <p className="menu-button-text">List</p>
                </button>
                <button className="menu-button" 
                    onClick={() => { 
                        if (solidSession?.info.isLoggedIn) {
                            router.push('/board')
                        }
                    }}>
                    <Icon src="menu/board.svg" alt="Board" />
                    <p className="menu-button-text">Board</p>
                </button>
                <button className="menu-button" 
                    onClick={() => { 
                        if (solidSession?.info.isLoggedIn) {
                            router.push('/calendar')
                        }
                    }}>
                    <Icon src="menu/calendar.svg" alt="Calendar" />
                    <p className="menu-button-text">Calendar</p>
                </button>
                <button className="menu-button" 
                    onClick={() => { 
                        if (solidSession?.info.isLoggedIn) {
                            router.push('/tidier')
                        }
                    }}>
                    <Icon src="menu/tidier.svg" alt="Tidier" />
                    <p className="menu-button-text">Tidier</p>
                </button>
                <section className="sidebar-menu-settings-mobile">
                <button className="menu-button" 
                    onClick={() => { 
                        if (solidSession?.info.isLoggedIn) {
                            router.push('/settings')
                        }
                    }}>
                    <Icon src="menu/settings.svg" alt="Settings" />
                    <p className="menu-button-text">Preferences</p>
                </button>
            </section>
            </section>
            <section className="sidebar-menu-settings">
                <button className="menu-button" 
                    onClick={() => { 
                        if (solidSession?.info.isLoggedIn) {
                            router.push('/settings')
                        }
                    }}>
                    <Icon src="menu/settings.svg" alt="Settings" />
                    <p className="menu-button-text">Preferences</p>
                </button>
            </section>
        </section>
    )
}