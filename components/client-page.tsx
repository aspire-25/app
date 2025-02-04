import { auth } from "@/auth";
import AuditorHome from "./home/auditor-home";

const Page = async ({ tab }: { tab: string }) => {
    const session = await auth();

    const DefaultContent = () => {
        return (
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                </div>
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            </div>
        ); 
    }

    const PageContent = () => {
        switch (tab) {
            case 'home':
                if (session?.user.role === 'admin') {
                    // checking for admin because roles in db are all admin atm
                    return <AuditorHome />
                }
                return <DefaultContent />
            default: 
                return <DefaultContent />;
        }
    };

    return (
        <PageContent />
    );
}

export default Page;
