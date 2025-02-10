import { auth } from '@/auth';
import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const session = await auth();
    if (session) {
        const { searchParams } = new URL(request.url);
        const DATA_TYPE = searchParams.get('dataType');
        const YEAR = searchParams.get('year');

        let query = `SELECT ${YEAR ? '*' : 'year'} FROM "${DATA_TYPE}"`;
        if (YEAR) {
            query += ` WHERE year = ${YEAR}`;
        }
        query += ' ORDER BY year DESC;';

        const RESULT = await sql.query(query);

        return NextResponse.json(
            {
                data: RESULT.rows
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
