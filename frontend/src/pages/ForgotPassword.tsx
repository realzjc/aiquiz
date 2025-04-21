/* src/pages/ForgotPassword.tsx */
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"

export default function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        // TODO: call API to send reset link
        console.log('Send reset link to', email)
        setSubmitted(true)
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 p-6">
            <Card className="bg-gray-800 text-white border-gray-700 w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Forgot Password</CardTitle>
                </CardHeader>
                <CardContent>
                    {submitted ? (
                        <p className="text-gray-300">A password reset link has been sent to <strong>{email}</strong>.</p>
                    ) : (
                        <form onSubmit={handleSubmit} className="grid gap-6">
                            <div>
                                <Label htmlFor="reset-email" className="text-gray-300">
                                    Enter your email address
                                </Label>
                                <Input
                                    id="reset-email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="bg-gray-700 text-white placeholder-gray-400 border-gray-600"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="bg-white text-black hover:bg-gray-200 transition rounded-lg py-3 shadow"
                            >
                                Send Reset Link
                            </Button>
                        </form>
                    )}
                    <div className="mt-4 text-center text-sm text-gray-400">
                        <Link to="/login" className="underline hover:text-gray-200">
                            Back to Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
