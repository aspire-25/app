import ClientWrapper from "./client-wrapper";

const Page = async ({ params }: { params: Promise<{ year: string | null }> }) => {
    const YEAR = (await params).year;

    return (
        <>
            <ClientWrapper year={YEAR ? Number(YEAR) : null} />
        </>
    );
};

export default Page;
