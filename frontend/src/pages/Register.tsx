// src/pages/Register.tsx
import { GalleryVerticalEnd } from "lucide-react"
import { RegisterForm } from "@/components/auth/register-form"

export default function Register() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                {/* 注册表单 */}
                <RegisterForm />
            </div>
        </div>
    )
}
