// src/features/bank/services/bankApi.ts
import { Bank } from '@/types/bank';
import api from '@/lib/api';

export const bankApi = {
    async getAll(): Promise<Bank[]> {
        const res = await api.get('/quizzes/banks');
        return res.data;
    },
    async getBankById(bankId: string): Promise<Bank> {
        const res = await api.get(`/quizzes/banks/${bankId}`);
        return res.data;
    },
    async create(name: string, description?: string): Promise<Bank> {
        const res = await api.post('/quizzes/banks', { name, description });
        return res.data;
    },
    async update(bankId: string, name: string, description?: string): Promise<Bank> {
        const res = await api.put(`/quizzes/banks/${bankId}`, { name, description });
        return res.data;
    },
    async remove(bankId: string): Promise<void> {
        await api.delete(`/quizzes/banks/${bankId}`);
    },
    
};
