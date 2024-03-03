import { useRouter } from "next/router";
import { Button } from "../Button/Button";
import { Icon } from "../Icon/Icon";

export function MenuSideBar() {

    const router = useRouter();
    return (
        <section className="sidebar-menu">
            <h1 className="sidebar-menu-title">TidyTime</h1>
            <section className="sidebar-menu-features">
                <Button className="menu-button" onClick={() => router.push('/list')}>
                    <Icon src="menu/to-dolist.png" alt="TO-DO List"/>
                    List
                </Button>
                <Button className="menu-button" onClick={() => router.push('/board')}>
                    <Icon src="menu/board.png" alt="Board" />
                    Board
                </Button>
                <Button className="menu-button" onClick={() => router.push('/calendar')}>
                    <Icon src="menu/calendar.png" alt="Calendar" />
                    Calendar
                </Button>
                <Button className="menu-button" onClick={() => router.push('/tidier')}>
                    <Icon src="menu/tidier.png" alt="Tidier" />
                    Tidier
                </Button>
            </section>
            <section className="sidebar-menu-settings">
                <Button className="menu-button" onClick={() => router.push('/settings')}>
                    <Icon src="menu/settings.png" alt="Settings" />
                    Preferences
                </Button>
            </section>
        </section>
    )
}