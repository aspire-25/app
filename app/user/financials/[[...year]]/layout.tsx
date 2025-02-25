import { auth } from "@/auth";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { fetchFinancials } from "@/lib/fetch";
import Link from "next/link";
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
            {JSON.stringify(Object.keys(FINANCIALS))}
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="/user">
                                    Aspire Financial Tracker
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbLink href={'/user/financials'}>
                                    Statement Editor
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {Object.keys(FINANCIALS).length > 0 &&
                                <>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="flex items-center gap-1">
                                                {YEAR || 'Select Year'}
                                                <BreadcrumbSeparator className="hidden md:block rotate-90" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start">
                                                {Object.keys(FINANCIALS).map((yearKey) => (
                                                        <Link key={yearKey} href={`/user/financials/${yearKey}`}>
                                                            <DropdownMenuItem>
                                                                {yearKey}
                                                            </DropdownMenuItem>
                                                        </Link>
                                                    ))
                                                }
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </BreadcrumbItem>
                                </>
                            }
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                {children}
            </div>
        </>
    );
}
