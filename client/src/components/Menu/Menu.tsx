import { useRouter } from "next/router";
import { Icon } from "../Icon/Icon";
import { useSessionContext } from "../Context/SolidContext";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { SlGlobe } from "react-icons/sl";

export function MenuSideBar() {
    const { t, i18n } = useTranslation();
    const { solidSession } = useSessionContext();
    const router = useRouter();
    const [isDark, setIsDark] = useState(true);
    const [showLanguagePanel, setShowLanguagePanel] = useState(false);

    const languages: Record<string, string> = {
        "en": "English",
        "es": "Español"
    }
     
    const changeLanguage = (lng:any) => {
        i18n.changeLanguage(lng);
        setShowLanguagePanel(false);
    };

    const handleChangeLanguage = () => {
        if (i18n.language == "es") {
            changeLanguage("en");
        } else {
            changeLanguage("es");
        }
    }

    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDark);
    }, [isDark]);

    return (
        <section className="sidebar-menu">
            <div className="menu-title">
                <button className="menu-button" onClick={() => {router.push('/')}}>
                    <h1 className="sidebar-menu-title">TidyTime</h1>
                </button>
                <button className="menu-button dark-light-mode-mobile"
                    onClick={() => setIsDark(!isDark)}>
                    {   isDark 
                        ? <MdOutlineLightMode size={"1.2rem"} />
                        : <MdOutlineDarkMode size={"1.2rem"} />
                    }
                </button>
                <button
                    className="menu-button switch-language-mobile"
                    onClick={() => handleChangeLanguage()}>
                    <SlGlobe /> {i18n.language}
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
                    <p className="menu-button-text">{t('sidemenu.list')}</p>
                </button>
                <button className="menu-button" 
                    onClick={() => { 
                        if (solidSession?.info.isLoggedIn) {
                            router.push('/board')
                        }
                    }}>
                    <Icon src="menu/board.svg" alt="Board" />
                    <p className="menu-button-text">{t('sidemenu.board')}</p>
                </button>
                <button className="menu-button" 
                    onClick={() => { 
                        if (solidSession?.info.isLoggedIn) {
                            router.push('/calendar')
                        }
                    }}>
                    <Icon src="menu/calendar.svg" alt="Calendar" />
                    <p className="menu-button-text">{t('sidemenu.calendar')}</p>
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
                <button className="menu-button dark-light-mode"
                    onClick={() => setIsDark(!isDark)}>
                    {   isDark 
                        ? <MdOutlineLightMode size={"1.2rem"} />
                        : <MdOutlineDarkMode size={"1.2rem"} />
                    }
                </button>
                <button
                    className="menu-button switch-language"
                    onClick={() => handleChangeLanguage()}>
                    <SlGlobe /> {languages[i18n.language]}
                </button>
                <button className="menu-button" 
                    onClick={() => { 
                        if (solidSession?.info.isLoggedIn) {
                            router.push('/settings')
                        }
                    }}>
                    <Icon src="menu/settings.svg" alt="Settings" />
                    <p className="menu-button-text">{t('sidemenu.settings')}</p>
                </button>
            </section>
        </section>
    )
}