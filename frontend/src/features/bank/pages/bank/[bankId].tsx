// src/features/bank/pages/bank/[bankId].tsx
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { QAPanel } from "@/features/bank/components/QAPanel";
import { QuizGenerationPanel } from "@/features/bank/components/QuizGenerationPanel";
import { bankApi } from "@/features/bank/api/bankApi";
import { useHeader } from "@/contexts/HeaderContext"; // 假设您有一个 HeaderContext

// 定义题库类型
interface Bank {
    id: string;
    name: string;
    description?: string;
    // 可以根据需要添加更多字段
}

export default function Bank() {
    const { bankId } = useParams<{ bankId: string }>();
    const [activeTab, setActiveTab] = useState("qa");
    const [bank, setBank] = useState<Bank | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { setTitle } = useHeader(); // 使用 HeaderContext 来设置标题

    // 从数据库获取题库信息
    useEffect(() => {
        const fetchBankData = async () => {
            if (!bankId) return;

            setLoading(true);
            setError(null);

            try {
                // 替换为您的实际 API 端点
                const res = await bankApi.getBankById(bankId);
                setBank(res);

                // 设置 header 标题为题库名称
                setTitle(res.name);
            } catch (err) {
                console.error("Failed to fetch bank data:", err);
                setError("Failed to load bank information. Please try again later.");

                // 设置一个默认标题
                setTitle("Bank Details");
            } finally {
                setLoading(false);
            }
        };

        fetchBankData();

        // 组件卸载时重置标题
        return () => {
            setTitle(""); // 或者设置为默认标题
        };
    }, [bankId, setTitle]);

    // 加载状态
    if (loading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-40">
                    <p className="text-gray-500">Loading bank information...</p>
                </div>
            </div>
        );
    }

    // 错误状态
    if (error || !bank) {
        return (
            <div className="p-6">
                <div className="text-center py-10">
                    <h2 className="text-xl font-semibold text-red-500">
                        {error || "Bank not found"}
                    </h2>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="qa">Q&A</TabsTrigger>
                    <TabsTrigger value="quiz-generation">Quiz Generation</TabsTrigger>
                </TabsList>

                <TabsContent value="qa">
                    <QAPanel bankId={bankId || ""} />
                </TabsContent>

                <TabsContent value="quiz-generation">
                    <QuizGenerationPanel />
                </TabsContent>
            </Tabs>
        </div>
    );
}