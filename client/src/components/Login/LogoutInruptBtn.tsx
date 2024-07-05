import { useInruptHandler } from "@/pages/api/inrupt";
import { useTranslation } from 'react-i18next';


export default function LogoutInrupt() {
    const { t } = useTranslation();
    const { logoutInrupt } = useInruptHandler();

    return (
        <button data-testid='inrupt-logout-button' className="logout-inrupt-button" onClick={logoutInrupt}>
            {t('home.logoutButton')}
        </button>
    )
}