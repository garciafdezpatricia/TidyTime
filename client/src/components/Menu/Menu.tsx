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
    const [isDark, setIsDark] = useState(false);

    const languages: Record<string, string> = {
        "en": "English",
        "es": "Español"
    }
     
    const changeLanguage = (lng:any) => {
        i18n.changeLanguage(lng);
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
                <button data-testid='menu-button-dark-light-mobile' className="menu-button dark-light-mode-mobile"
                    onClick={() => setIsDark(!isDark)}>
                    {   isDark 
                        ? <MdOutlineLightMode size={"1.2rem"} />
                        : <MdOutlineDarkMode size={"1.2rem"} />
                    }
                </button>
                <button
                    data-testid='menu-button-language-mobile'
                    className="menu-button switch-language-mobile"
                    onClick={() => handleChangeLanguage()}>
                    <SlGlobe /> {i18n.language}
                </button>
            </div>
            <section className="sidebar-menu-features">
                <button data-testid='menu-button-list' className="menu-button" 
                    onClick={() => { 
                        if (solidSession?.info.isLoggedIn) {
                            router.push('/list')
                        }
                    }}>
                    <Icon src="menu/todo-list.svg" alt="TO-DO List"/>
                    <p className="menu-button-text">{t('sidemenu.list')}</p>
                </button>
                <button data-testid='menu-button-board' className="menu-button" 
                    onClick={() => { 
                        if (solidSession?.info.isLoggedIn) {
                            router.push('/board')
                        }
                    }}>
                    <Icon src="menu/board.svg" alt="Board" />
                    <p className="menu-button-text">{t('sidemenu.board')}</p>
                </button>
                <button data-testid='menu-button-calendar' className="menu-button" 
                    onClick={() => { 
                        if (solidSession?.info.isLoggedIn) {
                            router.push('/calendar')
                        }
                    }}>
                    <Icon src="menu/calendar.svg" alt="Calendar" />
                    <p className="menu-button-text">{t('sidemenu.calendar')}</p>
                </button>
                <section className="sidebar-menu-settings-mobile">
                    <button data-testid='menu-button-settings-mobile' className="menu-button" 
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
                <button data-testid='menu-button-dark-light' className="menu-button dark-light-mode"
                    onClick={() => setIsDark(!isDark)}>
                    {   isDark 
                        ? <MdOutlineLightMode size={"1.2rem"} />
                        : <MdOutlineDarkMode size={"1.2rem"} />
                    }
                </button>
                <button
                    data-testid='menu-button-language'
                    className="menu-button switch-language"
                    onClick={() => handleChangeLanguage()}>
                    <SlGlobe /> {languages[i18n.language]}
                </button>
                <button data-testid='menu-button-settings' className="menu-button" 
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