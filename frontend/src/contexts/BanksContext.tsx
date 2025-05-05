// src/contexts/BanksContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { Bank, BanksContextType } from '@/types/bank';

const BanksContext = createContext<BanksContextType | undefined>(undefined);

export function BanksProvider({ children }: { children: React.ReactNode }) {
    const [banks, setBanks] = useState<Bank[]>([]);

    return (
        <BanksContext.Provider value={{ banks, setBanks }}>
            {children}
        </BanksContext.Provider>
    );
}

export function useBanksContext() {
    const context = useContext(BanksContext);
    if (context === undefined) {
        throw new Error('useBanksContext must be used within a BanksProvider');
    }
    return context;
}