// SideMenu.tsx
import React from 'react';

const SideMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Implementación de SideMenu
    return (
        <div className="layout">
            {children}
        </div>
    );
};

export default SideMenu; // Exportar como predeterminado
