import { auth } from '@/auth';
import { fetchFinancials } from '@/lib/fetch';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await auth();
    if (session) {
        const DATA = await fetchFinancials();
        return NextResponse.json(
            {
                data: DATA
            },
            {
                status: 200
            }
        );
    } else {
        return NextResponse.json(
            {},
            {
                status: 401
            }
        );
    }
}
