


import filePlusLogo from '@/assets/file-plus-2.svg'
import oneDriveLogo from '@/assets/onedrive.svg'
import googleDriveLogo from '@/assets/googledrive.svg'
import { useHeader } from "@/contexts/HeaderContext"
import { useBanks } from "@/contexts/BanksContext"                                  // ▶ MOD: import BanksContext
import { useEffect, useRef, useState, useLayoutEffect } from "react"
import { useNavigate } from "react-router-dom"                                      // ▶ MOD: import navigation
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
    Plus,
    Settings,
    FilePlus,
    ChevronUp,
    ChevronDown,
    FileText,
    FileCode,
    FileIcon,
    X,
    Loader2,
    Check,
    CircleDot,
    CheckSquare,
    MessageSquareText,
    AlignJustify,
    ArrowDown01,
} from "lucide-react"
import { cn } from "@/lib/utils"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function QuickCreate() {
    const { setTitle } = useHeader()
    const { addBank } = useBanks()                                                     // ▶ MOD: get addBank
    const navigate = useNavigate()                                                    // ▶ MOD: get navigate

    const dropRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [dragOver, setDragOver] = useState(false)
    const [files, setFiles] = useState<{ file: File; uploading: boolean }[]>([])
    const [text, setText] = useState("")

    const modelOptions = [
        { label: "Claude 3.7 Sonnet", desc: "Our most intelligent model yet" },
        { label: "Claude 3.5 Haiku", desc: "Fastest model for daily tasks" },
    ]
    const [selectedModel, setSelectedModel] = useState(modelOptions[0].label)

    useEffect(() => {
        setTitle("Quick Create")
    }, [setTitle])

    // 自动调整 textarea 高度
    useLayoutEffect(() => {
        const ta = textareaRef.current
        if (ta) {
            ta.style.height = "auto"
            ta.style.height = `${ta.scrollHeight}px`
        }
    }, [text])

    // 拖拽 & 选文件逻辑（未改）
    const enqueueFiles = (fileList: FileList) => {
        const newOnes = Array.from(fileList).map((f) => ({ file: f, uploading: true }))
        setFiles((prev) => [...prev, ...newOnes])
        setTimeout(() => {
            setFiles((prev) => prev.map((f) => ({ ...f, uploading: false })))
        }, 1500)
    }
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragOver(false)
        enqueueFiles(e.dataTransfer.files)
    }
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragOver(true)
    }
    const handleDragLeave = () => setDragOver(false)
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) enqueueFiles(e.target.files)
    }
    const handleUploadClick = () => fileInputRef.current?.click()
    const handleAddFromGoogle = () => console.log("Add from Google Drive")
    const handleAddFromOneDrive = () => console.log("Add from Microsoft OneDrive")
    const removeFile = (name: string) =>
        setFiles((prev) => prev.filter((f) => f.file.name !== name))
    const getFileIcon = (name: string) => {
        if (name.endsWith(".pdf")) return <FileText className="text-pink-500" />
        if (/\.(js|ts|jsx|tsx)$/.test(name)) return <FileCode className="text-blue-500" />
        return <FileIcon className="text-gray-500" />
    }

    // ▶ MOD: handleSend now creates a bank, adds to context, then navigates to chat page
    const handleSend = async () => {
        if (!text.trim() && files.length === 0) return

        const fd = new FormData()
        fd.append("text", text)
        fd.append("model", selectedModel)
        files.forEach(({ file }) => fd.append("files", file))

        try {
            const res = await fetch("/api/sendMessage", {
                method: "POST",
                body: fd,
            })
            const json = await res.json()
            // ▶ MOD: expect { bankId, bankName }
            if (json.bankId && json.bankName) {
                addBank({
                    id: json.bankId,
                    name: json.bankName,
                    url: `/chat/${json.bankId}`,                                         // ▶ MOD: chat route
                    icon: FileText,
                })
                navigate(`/chat/${json.bankId}`)                                       // ▶ MOD: navigate
            }
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
            <h1 className="text-3xl font-bold mb-6">Ready for Your Files!</h1>
            <div
                ref={dropRef}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                    "w-full max-w-3xl rounded-2xl shadow-md flex flex-col border border-gray-300 bg-white",
                    dragOver && "bg-blue-50 border-blue-400"
                )}
            >
                {/* 隐藏文件输入 */}
                <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                />

                {/* 文件列表 */}
                {files.length > 0 && (
                    <div className="p-3 flex flex-col gap-2">
                        {files.map(({ file, uploading }) => (
                            <div
                                key={file.name}
                                className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md"
                            >
                                <div className="flex items-center gap-2">
                                    {getFileIcon(file.name)}
                                    <div>
                                        <p className="text-sm font-medium leading-none">{file.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {file.type || "Unknown"}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    {uploading ? (
                                        <Loader2 className="animate-spin w-4 h-4 text-muted-foreground" />
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeFile(file.name)}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 输入区 & 工具栏 */}
                <div className="flex flex-col px-4 py-3">
                    <Textarea
                        ref={textareaRef}
                        placeholder="Type the style you want for generated quizzes!"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={1}
                        className="w-full resize-none overflow-hidden border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="ghost">
                                        <Plus className="w-5 h-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white text-black shadow-lg border border-gray-200">
                                    <DropdownMenuItem onClick={handleUploadClick}>
                                        <img
                                            src={filePlusLogo}
                                            alt="File Plus"
                                            className="mr-2 w-5 h-5"
                                        />{" "}
                                        Upload a file
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleAddFromGoogle}>
                                        <img
                                            src={googleDriveLogo}
                                            alt="Google Drive"
                                            className="mr-2 w-5 h-5"
                                        />{" "}
                                        Add from Google Drive
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleAddFromOneDrive}>
                                        <img
                                            src={oneDriveLogo}
                                            alt="OneDrive"
                                            className="mr-2 w-5 h-5"
                                        />{" "}
                                        Add from Microsoft OneDrive
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="ghost">
                                        <AlignJustify className="w-5 h-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white text-black shadow-lg border border-gray-200">
                                    <DropdownMenuItem>
                                        <CircleDot className="mr-2 w-5 h-5" />
                                        Single Choice
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <CheckSquare className="mr-2 w-5 h-5" />
                                        Multiple Choice
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <MessageSquareText className="mr-2 w-5 h-5" />
                                        Q&A
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="icon" variant="ghost">
                                        <ArrowDown01 className="w-5 h-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white text-black shadow-lg border border-gray-200">
                                    <DropdownMenuItem>1</DropdownMenuItem>
                                    <DropdownMenuItem>2</DropdownMenuItem>
                                    <DropdownMenuItem>3</DropdownMenuItem>
                                    <DropdownMenuItem>5</DropdownMenuItem>
                                    <DropdownMenuItem>10</DropdownMenuItem>
                                    <DropdownMenuItem>15</DropdownMenuItem>
                                    <DropdownMenuItem>20</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="px-3">
                                        {selectedModel}
                                        <ChevronDown className="ml-1 w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-white text-black shadow-lg border border-gray-200">
                                    {modelOptions.map((opt) => (
                                        <DropdownMenuItem
                                            key={opt.label}
                                            onClick={() => setSelectedModel(opt.label)}
                                        >
                                            <div className="flex justify-between items-center w-full">
                                                <div>
                                                    <div>{opt.label}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {opt.desc}
                                                    </div>
                                                </div>
                                                {selectedModel === opt.label && (
                                                    <Check className="w-4 h-4 text-blue-500" />
                                                )}
                                            </div>
                                        </DropdownMenuItem>
                                    ))}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>More models</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <Button
                                size="icon"
                                className="bg-black text-white"
                                onClick={handleSend}
                            >
                                <ChevronUp className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


// "use client"

// import filePlusLogo from '@/assets/file-plus-2.svg'
// import oneDriveLogo from '@/assets/onedrive.svg'
// import googleDriveLogo from '@/assets/googledrive.svg'
// import { useHeader } from "@/contexts/HeaderContext"
// import { useBanks } from "@/contexts/BanksContext"
// import { useEffect, useRef, useState, useLayoutEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import {
//     DropdownMenu,
//     DropdownMenuTrigger,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu"
// import {
//     Plus,
//     ChevronDown,
//     ChevronUp,
//     AlignJustify,
//     ArrowDown01,
//     FileText,
//     FileCode,
//     FileIcon,
//     X,
//     Loader2,
//     Check,
//     CircleDot,
//     CheckSquare,
//     MessageSquareText,
// } from "lucide-react"
// import { cn } from "@/lib/utils"

// export default function QuickCreate() {
//     const { setTitle } = useHeader()
//     const { addBank } = useBanks()
//     const navigate = useNavigate()

//     const [step, setStep] = useState<'initial' | 'chat'>('initial')
//     const [bankId, setBankId] = useState<string | null>(null)
//     const [files, setFiles] = useState<File[]>([])
//     const [prompt, setPrompt] = useState('')
//     const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string; quizzes?: any[] }[]>([])
//     const [type, setType] = useState<'single' | 'multiple' | 'qa'>('single')
//     const [count, setCount] = useState<number>(1)
//     const [model, setModel] = useState<string>('Claude 3.7 Sonnet')
//     const textareaRef = useRef<HTMLTextAreaElement>(null)

//     useLayoutEffect(() => {
//         setTitle('Quick Create')
//     }, [setTitle])

//     useLayoutEffect(() => {
//         const ta = textareaRef.current
//         if (ta) {
//             ta.style.height = 'auto'
//             ta.style.height = `${ta.scrollHeight}px`
//         }
//     }, [prompt])

//     // initial send: create bank, upload files, send first prompt
//     const handleInitialSend = async () => {
//         if (!prompt.trim()) return
//         // create bank
//         const resBank = await fetch('/api/v1/quizzes/banks', {
//             method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: '' })
//         })
//         const bank = await resBank.json()
//         setBankId(bank.id)
//         addBank({ id: bank.id, name: bank.name || 'New Bank', url: `/chat/${bank.id}`, icon: FileText })
//         // TODO: upload files to /banks/{bank.id}/files if needed
//         // add user message
//         setMessages(prev => [...prev, { role: 'user', text: prompt }])
//         setStep('chat')
//         setPrompt('')
//         // send to chat endpoint
//         const resChat = await fetch(`/api/v1/quizzes/banks/${bank.id}/chat`, {
//             method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, type, count, model })
//         })
//         const chat = await resChat.json()
//         setMessages(prev => [...prev, { role: 'assistant', text: chat.content, quizzes: chat.quizzes }])
//     }

//     // subsequent chat send
//     const handleChatSend = async () => {
//         if (!prompt.trim() || !bankId) return
//         setMessages(prev => [...prev, { role: 'user', text: prompt }])
//         setPrompt('')
//         const resChat = await fetch(`/api/v1/quizzes/banks/${bankId}/chat`, {
//             method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt })
//         })
//         const chat = await resChat.json()
//         setMessages(prev => [...prev, { role: 'assistant', text: chat.content, quizzes: chat.quizzes }])
//     }

//     // render chat bubbles
//     const renderMessages = () => messages.map((m, i) => (
//         <div key={i} className={cn('w-full flex mb-4', m.role === 'user' ? 'justify-end' : 'justify-start')}>
//             <div className={cn('max-w-[60%] p-3 rounded-lg', m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-black')}>
//                 <div>{m.text}</div>
//                 {m.quizzes && (
//                     <div className="mt-2 space-y-2">
//                         {m.quizzes.map((q, j) => (
//                             <div key={j} className="p-2 border rounded">
//                                 <div><strong>Q{j + 1} [{q.type}]</strong> ({q.options?.join(',')})</div>
//                                 <div>Answer: {q.answer}</div>
//                                 <div>Explanation: {q.explanation}</div>
//                                 <div className="mt-2 space-x-2">
//                                     <Button size="sm" onClick={() => {/* accept logic */ }}>Accept</Button>
//                                     <Button size="sm" variant="outline" onClick={() => {/* reject logic */ }}>Reject</Button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     ))

//     return (
//         <div className="flex flex-col h-full">
//             <div className="flex-1 overflow-auto p-6 bg-white">
//                 {renderMessages()}
//             </div>
//             <div className="border-t p-4 bg-gray-50">
//                 {step === 'initial' ? (
//                     <div className="flex items-center space-x-2">
//                         <Textarea
//                             ref={textareaRef}
//                             className="flex-1"
//                             placeholder="Type your prompt..."
//                             value={prompt}
//                             onChange={e => setPrompt(e.target.value)}
//                         />
//                         <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                                 <Button size="sm">Type: {type}</Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent>
//                                 <DropdownMenuItem onClick={() => setType('single')}>Single Choice</DropdownMenuItem>
//                                 <DropdownMenuItem onClick={() => setType('multiple')}>Multiple Choice</DropdownMenuItem>
//                                 <DropdownMenuItem onClick={() => setType('qa')}>Q&A</DropdownMenuItem>
//                             </DropdownMenuContent>
//                         </DropdownMenu>
//                         <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                                 <Button size="sm">Count: {count}</Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent>
//                                 {[1, 2, 3, 5, 10].map(n => (<DropdownMenuItem key={n} onClick={() => setCount(n)}>{n}</DropdownMenuItem>))}
//                             </DropdownMenuContent>
//                         </DropdownMenu>
//                         <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                                 <Button size="sm">Model: {model}</Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent>
//                                 {['Claude 3.7 Sonnet', 'Claude 3.5 Haiku'].map(m => (<DropdownMenuItem key={m} onClick={() => setModel(m)}>{m}</DropdownMenuItem>))}
//                             </DropdownMenuContent>
//                         </DropdownMenu>
//                         <Button onClick={handleInitialSend}>Send</Button>
//                     </div>
//                 ) : (
//                     <div className="flex items-center space-x-2">
//                         <Textarea
//                             ref={textareaRef}
//                             className="flex-1"
//                             placeholder="Ask follow-up..."
//                             value={prompt}
//                             onChange={e => setPrompt(e.target.value)}
//                         />
//                         <Button onClick={handleChatSend}>Send</Button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }
