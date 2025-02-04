import Page from "@/components/client-page";
import AppSidebar from "@/components/sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { getTab, getTabUrl } from "@/lib/sidebar";

const Tab = async ({ params }: { params: Promise<{ tab: string }> }) => {
    const tab = (await params).tab;

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="/user/home">
                                        Aspire Financial Tracker
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {tab !== 'home' &&
                                    <>
                                        <BreadcrumbSeparator className="hidden md:block" />
                                        <BreadcrumbItem>
                                            <BreadcrumbLink href={getTabUrl(tab)}>
                                                {getTab(tab)}
                                            </BreadcrumbLink>
                                        </BreadcrumbItem>
                                    </>
                                }
                                
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <Page tab={tab} />
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Tab;
