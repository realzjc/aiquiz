// src/pages/ChatPage.tsx
import { useHeader } from "@/contexts/HeaderContext"
import { useBanks } from "@/contexts/BanksContext"
import { useParams } from "react-router-dom"
import { useEffect, useRef, useState, useLayoutEffect } from "react"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Plus,
    Settings,
    FilePlus,
    ChevronDown,
    ChevronUp,
    Check,
    FileText,
    FileCode,
    FileIcon,
    X,
    Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function ChatPage() {
    const { setTitle } = useHeader()
    const { banks } = useBanks()
    const { bankId } = useParams<{ bankId: string }>()
    const bank = banks.find((b) => b.id === bankId)

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [text, setText] = useState("")
    const [messages, setMessages] = useState<
        { role: "user" | "ai"; content: string }[]
    >([])
    const [showAccept, setShowAccept] = useState(false)

    // 自动撑高 textarea
    useLayoutEffect(() => {
        const ta = textareaRef.current
        if (ta) {
            ta.style.height = "auto"
            ta.style.height = `${ta.scrollHeight}px`
        }
    }, [text])

    // 设置页面标题为题库名
    useEffect(() => {
        setTitle(bank?.name || "Chat")
    }, [bank, setTitle])

    const handleSend = async () => {
        if (!text.trim()) return

        // 1. 推送用户消息
        setMessages((m) => [...m, { role: "user", content: text }])
        setText("")
        setShowAccept(false)

        // 2. 调用后端 AI 接口
        let aiReply = ""
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bankId, text }),
            })
            const json = await res.json()
            aiReply = json.reply
        } catch (e) {
            aiReply = "出错了，请重试。"
            console.error(e)
        }

        // 3. 推送 AI 回复，显示 Accept 按钮
        setMessages((m) => [...m, { role: "ai", content: aiReply }])
        setShowAccept(true)
    }

    const handleAccept = () => {
        // TODO: 接受后的逻辑，比如把内容固定或保存
        setShowAccept(false)
    }

    return (
        <div className="flex h-full">
            {/* 左侧导航 */}
            <AppSidebar />

            {/* 右侧聊天区 */}
            <div className="flex-1 flex flex-col px-4 py-6">
                {/* 消息列表 */}
                <div className="flex-1 overflow-auto space-y-3">
                    {messages.map((m, i) => (
                        <div
                            key={i}
                            className={cn(
                                "inline-block px-4 py-2 rounded-lg max-w-[70%] break-words",
                                m.role === "user"
                                    ? "self-end bg-blue-500 text-white"
                                    : "self-start bg-gray-100 text-black"
                            )}
                        >
                            {m.content}
                        </div>
                    ))}
                </div>

                {/* Accept 按钮 */}
                {showAccept && (
                    <div className="flex justify-end mb-2">
                        <Button variant="outline" onClick={handleAccept}>
                            Accept
                        </Button>
                    </div>
                )}

                {/* 聊天输入区（和 QuickCreate 一致） */}
                <div className="border-t pt-2 flex items-end gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                                <Plus className="w-5 h-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem disabled>
                                <FilePlus className="mr-2 w-5 h-5" /> Upload a file
                            </DropdownMenuItem>
                            {/* ...可按需添加 GoogleDrive/OneDrive */}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                                <Settings className="w-5 h-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>Tool 1</DropdownMenuItem>
                            <DropdownMenuItem>Tool 2</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Textarea
                        ref={textareaRef}
                        placeholder="询问任何问题"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={1}
                        className="flex-1 resize-none overflow-hidden border-none focus:ring-0"
                    />

                    <Button size="icon" className="bg-black text-white" onClick={handleSend}>
                        <ChevronUp className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
