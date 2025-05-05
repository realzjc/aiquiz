// src/contexts/HeaderContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { HeaderContextType } from '@/types/header';

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: React.ReactNode }) {
    const [title, setTitle] = useState('Dashboard');

    return (
        <HeaderContext.Provider value={{ title, setTitle }}>
            {children}
        </HeaderContext.Provider>
    );
}

export function useHeader() {
    const context = useContext(HeaderContext);
    if (context === undefined) {
        throw new Error('useHeader must be used within a HeaderProvider');
    }
    return context;
}