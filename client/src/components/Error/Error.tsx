import { useTranslation } from "react-i18next";


export default function Fallback({error, resetErrorBoundary}: {error: Error, resetErrorBoundary: any}) {

  const { t } = useTranslation();
  
    return (
      <div className="alert">
        <div className="error-img"></div>
        <h1>{t('errorPage.title')}</h1>
        <p className="error-p">{t('errorPage.desc')}
            <a href="https://github.com/garciafdezpatricia/TidyTime/issues">{t('errorPage.link')}</a>
        </p>
        <button className="refresh-page" onClick={resetErrorBoundary}>{t('errorPage.refreshButton')}</button>
      </div>
    );
  }