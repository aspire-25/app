import { auth } from "@/auth";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";

export default async function Layout({
    children
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect('/');
    }

    return (
        <SidebarProvider>
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
