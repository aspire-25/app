'use client';

import { ChartNoAxesCombined, HandCoins, PiggyBank } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { useRouter } from "next/navigation";

const AuditorHome = () => {
    const router = useRouter();

    return (
        <div className="mx-5">
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <Card className="cursor-pointer" onClick={() => router.push('/user/input-data')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Income Statement
                        </CardTitle>
                        <HandCoins />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Fiscal Year {new Date().getFullYear()}</div>
                        <p className="text-xs text-muted-foreground">
                            View and edit company&apos;s revenues, expenses and profitability
                        </p>
                    </CardContent>
                </Card>
                <Card className="cursor-pointer" onClick={() => router.push('/user/input-data')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Balance Sheet
                        </CardTitle>
                        <PiggyBank />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Fiscal Year {new Date().getFullYear()}</div>
                        <p className="text-xs text-muted-foreground">
                            View and edit company&apos;s assets, liabilities, and capital
                        </p>
                    </CardContent>
                </Card>
                <Card className="cursor-pointer" onClick={() => router.push('/user/input-data')}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Graphs and Charts
                        </CardTitle>
                        <ChartNoAxesCombined />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Business Insight</div>
                        <p className="text-xs text-muted-foreground">
                            Learn about company&apos;s performance and identify problems
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AuditorHome;
