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
                    <div className="inrupt-logo"></div>
                </section>
                <section className="inrupt-login-body">
                    <h2>{t('loginPage.title')}</h2>
                    <p>{t('loginPage.desc')}</p>
                    <button data-testid="inrupt-login-button" onClick={loginInrupt}>{t('loginPage.loginButton')}</button>
                </section>
                <section className="inrupt-login-footer">
                    <p>{t('loginPage.learnMore')} <a href="https://www.inrupt.com/products/enterprise-solid-server">{t('loginPage.inruptESS')}</a>
                    <br />{t('loginPage.learnMore')}<a href="https://solidproject.org/">{t('loginPage.solidProject')}</a>
                    </p>
                </section>
            </article>
        }
        </section>
    )
}