// src/contexts/BanksContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react"
import { LucideIcon } from "lucide-react"

export interface Bank {
    id: string
    name: string
    url: string
    icon: LucideIcon
}

interface BanksContextValue {
    banks: Bank[]
    addBank: (bank: Bank) => void
}

const BanksContext = createContext<BanksContextValue>({
    banks: [],
    addBank: () => { },
})

export const BanksProvider = ({ children }: { children: ReactNode }) => {
    const [banks, setBanks] = useState<Bank[]>([])
    const addBank = (bank: Bank) => setBanks((prev) => [...prev, bank])
    
    return (
        <BanksContext.Provider value={{ banks, addBank }}>
            {children}
        </BanksContext.Provider>
    )
}

export const useBanks = () => useContext(BanksContext)
