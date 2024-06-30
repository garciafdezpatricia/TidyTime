import { useState } from "react";

export default function Fallback({error, resetErrorBoundary}: {error: Error, resetErrorBoundary: any}) {
    const [showTrace, setShowTrace] = useState(false);
  
    return (
      <div className="alert">
        <div className="error-img"></div>
        <h1>Oops... something went wrong</h1>
        <p className="error-p">Try refreshing the page to reload the application. If the error persists, feel free to open an issue in{" "}
            <a href="https://github.com/garciafdezpatricia/TidyTime/issues">TidyTime</a>
        </p>
        <button className="refresh-page" onClick={resetErrorBoundary}>Refresh page</button>
      </div>
    );
  }