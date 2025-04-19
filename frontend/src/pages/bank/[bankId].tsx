"use client"

// import { useParams } from "react-router-dom"
// import { DataTable } from "@/components/common/data-table"
// import { getBankDataById } from "@/lib/mock-bank-data"

// export default function Bank() {
//     const params = useParams()
//     const bankId = params?.bankId as string
//     const bankData = getBankDataById(bankId)

//     return (
//         <div className="p-6">
//             <h1 className="text-2xl font-bold mb-4">Quiz Bank: {bankId}</h1>
//             <DataTable data={bankData} />
//         </div>
//     )
// }


// src/pages/bank/[bankId].tsx
import { useParams } from "react-router-dom"
import { DataTable } from "@/components/common/data-table"
import { bankDataMap } from "@/data/mock-banks"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SiteHeader } from "@/components/common/site-header"
export default function Bank() {
    const { bankId } = useParams<{ bankId: string }>()

    if (!bankId || !bankDataMap[bankId]) {
        return <div className="p-6 text-red-500">❌ 无效的 Bank ID</div>
    }

    const bankData = bankDataMap[bankId]
    // return <DataTable data={bankData} />

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Quiz Bank: {bankId}</h1>
            <DataTable data={bankData} />
        </div>
    )
}
