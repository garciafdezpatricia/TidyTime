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

import { useInruptHandler } from "@/pages/api/inrupt";
import { useSessionContext } from "../Context/SolidContext";
import { useTranslation } from "react-i18next";


export default function Inrupt() {
    const { t } = useTranslation();
    const { loginInrupt } = useInruptHandler();
    const { solidSession } = useSessionContext();

    return (
        <section className="inrupt-container">
        {
            !solidSession?.info.isLoggedIn && 
            <article data-testid="inrupt-login-article" className="inrupt-login">
                <section className="inrupt-login-header">
                </section>
                <section className="inrupt-login-body">
                    <h2>{t('loginPage.title')}</h2>
                    <p>{t('loginPage.desc')}</p>
                    <button data-testid="inrupt-login-button" onClick={loginInrupt}>{t('loginPage.loginButton')}</button>
                </section>
                <section className="inrupt-login-footer">
                    <p>{t('loginPage.learnMore')}<a href="https://solidproject.org/">{t('loginPage.solidProject')}</a></p>
                </section>
            </article>
        }
        </section>
    )
}