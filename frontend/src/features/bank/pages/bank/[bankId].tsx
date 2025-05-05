// src/pages/bank/[bankId].tsx
import { useParams } from "react-router-dom"
import { DataTable } from "@/components/common/data-table"
import { bankDataMap } from "@/data/mock-banks"
import { useHeader } from "@/contexts/HeaderContext"
import { useEffect } from "react"

export default function Bank() {
    const { bankId } = useParams<{ bankId: string }>()
    const { setTitle } = useHeader();

    useEffect(() => {
        setTitle(`${bankId}`);
    }, [setTitle, bankId]);

    if (!bankId || !bankDataMap[bankId]) {
        return <div className="p-6 text-red-500">❌ 无效的 Bank ID</div>
    }

    const bankData = bankDataMap[bankId]
    // return <DataTable data={bankData} />

    return (
        <div className="p-6">
            {/* <h1 className="text-2xl font-bold mb-4">Quiz Bank: {bankId}</h1> */}
            <DataTable data={bankData} />
        </div>
    )
}
