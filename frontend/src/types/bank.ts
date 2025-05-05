// src/types/bank.ts

export interface Bank {
    id: string;
    name: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
    question_count?: number;
}

export interface BanksContextType {
    banks: Bank[];
    setBanks: React.Dispatch<React.SetStateAction<Bank[]>>;
}