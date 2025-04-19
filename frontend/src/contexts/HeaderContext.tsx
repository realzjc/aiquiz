import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HeaderContextType {
    title: string;
    setTitle: (title: string) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
    const [title, setTitle] = useState<string>('文档');

    return (
        <HeaderContext.Provider value={{ title, setTitle }}>
            {children}
        </HeaderContext.Provider>
    );
}

export function useHeader() {
    const context = useContext(HeaderContext);
    if (context === undefined) {
        throw new Error('useHeader 必须在 HeaderProvider 内部使用');
    }
    return context;
} 