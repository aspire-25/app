import { auth } from "@/auth";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { fetchFinancials } from "@/lib/fetch";
import Link from "next/link";
import { redirect } from "next/navigation";
import SpireHeader from "@/components/spire-header";

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
            <SpireHeader />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                {children}
            </div>
        </>
    );
}
