// src/features/bank/services/bankApi.ts
import api from '@/lib/api';
import { Bank } from '@/types/bank';

export const bankApi = {
    getAll: async (): Promise<Bank[]> => {
        const { data } = await api.get('/quizzes/banks');
        return data;
    },

    create: async (name: string, description?: string): Promise<Bank> => {
        const { data } = await api.post('/quizzes/banks', { name, description });
        return data;
    },

    update: async (id: string, name: string, description?: string): Promise<Bank> => {
        const { data } = await api.put(`/quizzes/banks/${id}`, { name, description });
        return data;
    },

    remove: async (id: string): Promise<void> => {
        await api.delete(`/quizzes/banks/${id}`);
    },
};