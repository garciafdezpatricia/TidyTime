import React, { ReactNode } from "react";

interface Props {
    children? : ReactNode,
    className? : string,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function Button ({children, className="primary-button", onClick } : Props) {
    return (
        <button 
            className={className}
            onClick={onClick}>
            {children}
        </button>
    )
}
