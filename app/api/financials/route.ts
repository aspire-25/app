import { auth } from '@/auth';
import { deleteFinancials, fetchFinancials, updateFinancials } from '@/lib/fetch';
import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(req: NextRequest) {
    const session = await auth();
    if (session) {
        const DATA = await req.json();

        updateFinancials(DATA);
        return NextResponse.json(
            DATA,
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

export async function DELETE(req: NextRequest) {
    const session = await auth();
    if (session) {
        const YEAR: number = (await req.json()).year;

        deleteFinancials(YEAR);
        return NextResponse.json(
            {},
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
