import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';
export default async function Layout({ children }: { children: React.ReactNode }) {
    const SESSION = await auth();

    if (!SESSION?.user) {
        redirect('/');
    }

    const shouldRenderManageUser = false; 

    if (!shouldRenderManageUser) {
        return null;
    }

    return (
        <>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                {children}
            </div>
        </>
    );
}
