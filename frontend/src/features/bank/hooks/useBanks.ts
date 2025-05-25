// src/features/bank/hooks/useBanks.ts
// 基本的 
// 业务逻辑层，类似 后端services层
import { useEffect } from 'react';
import { bankApi } from '@/features/bank/api/bankApi';
import { useBanksContext } from '@/contexts/BanksContext';
import { Bank } from '@/types/bank';

export function useBanks() {
    const { banks, setBanks } = useBanksContext();

    // 首次加载
    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const data = await bankApi.getAll();
                setBanks(data);
            } catch (error) {
                console.error('Error fetching banks:', error);
            }
        };

        fetchBanks();
    }, [setBanks]);

    async function addBank(name: string, description?: string): Promise<string> {
        const newBank = await bankApi.create(name, description);
        setBanks(prev => [...prev, newBank]);
        console.log('newBank', newBank);
        return newBank.id;
    }

    async function renameBank(id: string, name: string, description?: string): Promise<void> {
        const updatedBank = await bankApi.update(id, name, description);
        setBanks(prev => prev.map(bank => bank.id === id ? updatedBank : bank));
    }

    async function deleteBank(id: string): Promise<void> {
        await bankApi.remove(id);
        setBanks(prev => prev.filter(bank => bank.id !== id));
    }

    return {
        banks,
        addBank,
        renameBank,
        deleteBank,
        refreshBanks: async () => {
            const data = await bankApi.getAll();
            setBanks(data);
        }
    };
}