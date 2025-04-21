// src/components/sidebar/SearchDialog.tsx
"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useBanks } from "@/contexts/BanksContext"
import { Link } from "react-router-dom"

type SearchDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
    const { banks } = useBanks()                           // 从 context 拿所有 bank
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<typeof banks>([])

    // 简单本地过滤；如有后端接口可改为 fetch(`/api/banks?search=${query}`)
    useEffect(() => {
        if (!query) {
            setResults([])
        } else {
            const q = query.toLowerCase()
            setResults(banks.filter((b) => b.name.toLowerCase().includes(q)))
        }
    }, [query, banks])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-white dark:bg-zinc-900 z-[100] shadow-xl rounded-xl">
                <DialogHeader>
                    <DialogTitle>Search Quiz Banks</DialogTitle>
                    <DialogDescription>Type to search and press Enter</DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    <Input
                        placeholder="Search banks..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
                    {results.map((bank) => (
                        <Link
                            key={bank.id}
                            to={`/bank/${bank.id}`}
                            className="block rounded px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                            onClick={() => onOpenChange(false)}
                        >
                            {bank.name}
                        </Link>
                    ))}
                    {query && results.length === 0 && (
                        <p className="p-2 text-center text-sm text-muted-foreground">
                            No banks found.
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
