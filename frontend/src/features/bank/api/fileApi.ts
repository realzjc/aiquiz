import api from "@/lib/api";

export const fileApi = {
    uploadFile: async (
        file: File,
        bankId: number,
        onProgress?: (progress: number) => void
    ): Promise<{ id: string; name: string }> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bank_id", bankId.toString());

        const response = await api.post("/files/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total && onProgress) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    onProgress(percentCompleted);
                }
            },
        });

        return response.data;
    },

    getFilesByBankId: async (bankId: number) => {
        const response = await api.get(`/files/bank/${bankId}`);
        return response.data;
    },

    deleteFile: async (fileId: string) => {
        await api.delete(`/files/${fileId}`);
    }
}; 