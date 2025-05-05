
/* src/pages/Login.tsx */
import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/auth/login-form"

export default function Login() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <div className="flex items-center justify-center gap-2 self-center">
                    {/* <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white">
                        <GalleryVerticalEnd className="h-5 w-5 text-gray-900" />
                    </div>
                    <span className="text-white text-lg font-medium">Acme Inc.</span> */}
                </div>
                <LoginForm />
            </div>
        </div>
    )
}
