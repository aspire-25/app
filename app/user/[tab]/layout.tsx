import { auth } from "@/auth";
import { doesTabExist } from "@/lib/sidebar";
import { redirect } from "next/navigation";

export default async function Layout({
    children,
    params
}: { 
    children: React.ReactNode; 
    params: { tab: string };
}) {
    const session = await auth();

    if (!session?.user) {
        redirect('/');
    }
    if (!doesTabExist(params.tab)) {
        redirect('/user/input-data');
    }

    return <>{children}</>;
}
