import Image from 'next/image';

import { LoginForm } from "@/components/login-form";

export default async function LoginPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Image
                        src="/spirelogo.png"
                        alt="Logo"
                        width={125}
                        height={0}
                    />
                </div>
                <div className="flex flex-1 items-center justify-center mb-12">
                    <div className="w-full max-w-xs">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-muted lg:block">
                <Image
                    src="https://images.unsplash.com/photo-1554224154-22dec7ec8818"
                    alt="Image"
                    layout="fill"
                    className="absolute inset-0 object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}
