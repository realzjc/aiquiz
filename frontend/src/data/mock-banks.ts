// mock-banks.ts
export const banks = [
    { id: "bank1", name: "Bank1" },
    { id: "bank2", name: "Bank2" },
    { id: "bank3", name: "Bank3" },
]

// 可选：用于展示的数据
export const bankDataMap: Record<string, any[]> = {
    bank1: [{ id: 1, header: "B1 header", type: "TOC", status: "Done", target: "10", limit: "5", reviewer: "Alice" }],
    bank2: [{ id: 2, header: "B2 header", type: "Summary", status: "Done", target: "20", limit: "8", reviewer: "Bob" }],
    bank3: [{ id: 3, header: "B3 header", type: "Narrative", status: "In Progress", target: "15", limit: "10", reviewer: "Eve" }],
}
