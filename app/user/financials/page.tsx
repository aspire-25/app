'use client'

export const getFinancials = async (dataType: string, year?: number) => {
    const queryParams = new URLSearchParams({ dataType });

    if (year) {
        queryParams.append('year', year.toString());
    }

    const res = await fetch(`../api/financials?${queryParams.toString()}`, {
        method: 'GET',
        cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch financial data: ${res.status} ${res.statusText}`);
    }
    return res.json();
};


const Page = () => {

    return (
        <>
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="aspect-video rounded-xl bg-muted/50" onClick={()=> console.log(getFinancials('IncomeStatements'))} />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </>
    );
};

export default Page;
