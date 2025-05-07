import { auth } from "@/auth";
import { fetchFinancials } from "@/lib/fetch";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function Layout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ year: string | null }>
}) {
    const SESSION = await auth();
    const YEAR = (await params).year

    if (!SESSION?.user) {
        redirect('/');
    }

    const FINANCIALS = await fetchFinancials();
    if (YEAR && !Object.keys(FINANCIALS).includes(YEAR[0])) {
        redirect('/user/financials');
    }

    return (
        <>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                {children}
            </div>
        </>
    );
}
