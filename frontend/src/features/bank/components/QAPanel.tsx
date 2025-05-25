import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Upload, X, FileText, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useDropzone } from "react-dropzone";
import api from "@/lib/api";

interface QAPanelProps {
    bankId: string;
}

interface FileItem {
    id: string;
    name: string;
    type: string;
    size: number;
    created_at: string;
}

export function QAPanel({ bankId }: QAPanelProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [files, setFiles] = useState<FileItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});

    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; message: string }[]>([]);
    const [input, setInput] = useState('');
    const [isSending, setIsSending] = useState(false);

    // 固定的 conversation ID，目前设为 "0"
    const conversationId = "0";

    const sendMessage = async () => {
        if (!input.trim() || isSending) return;

        const question = input.trim();

        console.log("send question: ", question);
        setChatHistory(prev => [...prev, { role: 'user', message: question }]);
        setInput('');
        setIsSending(true);

        try {
            // 使用新的聊天 endpoint
            const response = await api.post(`/chat/${bankId}/${conversationId}`, {
                message: question
            });

            // 从响应中获取助手回复
            const assistantMessage = response.data.content;

            setChatHistory(prev => [...prev, { role: 'assistant', message: assistantMessage }]);
        } catch (err) {
            console.error("Error sending message:", err);
            setChatHistory(prev => [...prev, {
                role: 'assistant',
                message: 'Sorry, there was an issue processing your request. Please try again later.'
            }]);
        } finally {
            setIsSending(false);
        }
    };

    // 处理按键事件
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // 从后端获取文件列表
    const fetchFiles = useCallback(async () => {
        if (!bankId) return;

        setIsLoading(true);
        try {
            const response = await api.get(`/files/bank/${bankId}`);
            console.log("fetch files", response.data);
            setFiles(response.data);
        } catch (error) {
            console.error("Error fetching files:", error);
            toast.error("Failed to load files. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [bankId]);

    // 组件挂载和bankId变化时获取文件
    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    // 上传文件到后端
    const uploadFile = async (file: File) => {
        if (!bankId) return;

        // 标记文件为上传中
        setUploadingFiles(prev => ({ ...prev, [file.name]: true }));

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post(`/files/upload/${bankId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // 更新文件列表，添加新上传的文件
            setFiles(prev => [...prev, response.data]);

            toast.success(`${file.name} uploaded successfully.`);
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error(`Failed to upload ${file.name}. Please try again.`);
        } finally {
            // 移除上传中标记
            setUploadingFiles(prev => {
                const newState = { ...prev };
                delete newState[file.name];
                return newState;
            });
        }
    };

    // 删除文件
    const deleteFile = async (fileId: string, fileName: string) => {
        if (!bankId) return;

        try {
            await api.delete(`/files/${fileId}`);

            // 从列表中移除文件
            setFiles(prev => prev.filter(file => file.id !== fileId));

            toast.success(`${fileName} deleted successfully.`);
        } catch (error) {
            console.error("Error deleting file:", error);
            toast.error(`Failed to delete ${fileName}. Please try again.`);
        }
    };

    // 处理文件拖放
    const onDrop = useCallback((acceptedFiles: File[]) => {
        // 为每个文件启动上传过程
        acceptedFiles.forEach(file => {
            uploadFile(file);
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/msword': ['.doc']
        }
    });

    // 获取文件图标颜色
    const getFileIconColor = (fileType: string): string => {
        if (fileType.includes('pdf')) return 'text-pink-500';
        if (fileType.includes('text') || fileType.includes('txt')) return 'text-blue-500';
        if (fileType.includes('doc')) return 'text-indigo-500';
        return 'text-gray-500';
    };

    // 格式化文件大小
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="p-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <div className="w-full p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-base font-medium text-gray-800">Project Files</h3>
                                {isLoading ? (
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        <span>Loading files...</span>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        {files.length} {files.length === 1 ? 'file' : 'files'}
                                    </p>
                                )}
                            </div>
                            <div className="bg-gray-100 rounded-full p-2">
                                <PlusCircle className="h-5 w-5 text-gray-500" />
                            </div>
                        </div>
                    </div>
                </DialogTrigger>

                <DialogContent className="max-w-xl bg-white dark:bg-zinc-900 shadow-xl rounded-xl border-0">
                    <DialogHeader className="pb-4">
                        <DialogTitle className="text-lg font-semibold">Project Files</DialogTitle>
                        <DialogClose className="absolute right-4 top-4" />
                    </DialogHeader>

                    <div className="py-4">
                        <div
                            {...getRootProps()}
                            className="border-2 border-dashed p-6 rounded-lg text-center cursor-pointer transition hover:bg-gray-50 bg-gray-50/50"
                        >
                            <input {...getInputProps() as any} />
                            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                            <p className="text-gray-500 text-sm">
                                {isDragActive
                                    ? "Release files to upload"
                                    : "Drag files here, or click to upload"
                                }
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Supports PDF, TXT, DOC, DOCX
                            </p>
                        </div>

                        <div className="mt-4 space-y-2 max-h-[40vh] overflow-y-auto pr-2">
                            {isLoading ? (
                                <div className="flex justify-center items-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                </div>
                            ) : !Array.isArray(files) || files.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">
                                    No files uploaded yet
                                </p>
                            ) : (
                                files.map((file) => (
                                    <div
                                        key={file.id}
                                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <FileText className={`h-6 w-6 ${getFileIconColor(file.type)}`} />
                                            <div>
                                                <p className="text-sm font-medium">{file.name}</p>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <span>{file.type}</span>
                                                    <span>•</span>
                                                    <span>{formatFileSize(file.size)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => deleteFile(file.id, file.name)}
                                            disabled={isLoading}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))
                            )}

                            {/* 显示正在上传的文件 */}
                            {Object.keys(uploadingFiles).map((fileName) => (
                                <div
                                    key={`uploading-${fileName}`}
                                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center space-x-3">
                                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                                        <div>
                                            <p className="text-sm font-medium">{fileName}</p>
                                            <p className="text-xs text-gray-500">Uploading...</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            className="px-8"
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Chat with Assistant</h3>
                <div className="border rounded-xl p-4 bg-white space-y-4 max-h-[400px] overflow-y-auto">
                    {chatHistory.map((item, index) => (
                        <div key={index} className={`text-sm ${item.role === 'user' ? 'text-right' : 'text-left'}`}>
                            <div className={`inline-block px-3 py-2 rounded-lg ${item.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                {item.message}
                            </div>
                        </div>
                    ))}
                    {isSending && (
                        <div className="text-sm text-left">
                            <div className="inline-block px-3 py-2 rounded-lg bg-gray-100">
                                <div className="flex items-center space-x-2">
                                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></div>
                                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex gap-2 mt-4">
                    <input
                        type="text"
                        className="flex-1 border rounded px-3 py-2 text-sm"
                        placeholder="Ask a question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isSending}
                    />
                    <Button
                        onClick={sendMessage}
                        disabled={isSending || !input.trim()}
                    >
                        {isSending ? (
                            <div className="flex items-center">
                                <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                                Sending...
                            </div>
                        ) : 'Send'}
                    </Button>
                </div>
            </div>
        </div>
    );
} 