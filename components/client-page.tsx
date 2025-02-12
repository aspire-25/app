import { auth } from "@/auth";
import AuditorHome from "./home/auditor/auditor-home";
import AnalystHome from "./home/analyst/analyst-home";
import ExecutiveHome from "./home/executive/executive-home";

const Page = async () => {
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
        if (session?.user.role === 'admin') {
            return <ExecutiveHome />
        } else if (session?.user.role === 'analyst') {
            return <AnalystHome />
        }
        else if(session?.user.role === 'executive') {
          return <ExecutiveHome />
        }
        return <DefaultContent />
    };

    return (
        <PageContent />
    );
}

export default Page;
