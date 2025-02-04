import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { sql } from '@vercel/postgres';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google],
    callbacks: {
        async signIn({ profile }) {
            const RESULT = await sql`SELECT * FROM Users WHERE email = ${profile?.email};`;
            const USER = RESULT.rows[0];
            if (USER) {
                return true;
            }
            return '/';
        },
        session: async ({ session }) => {
            const RESULT = await sql`SELECT * FROM Users WHERE email = ${session.user.email};`;
            const USER = RESULT.rows[0];
            return {
                ...session,
                user: {
                    ...session.user,
                    role: USER.role || null
                }
            }
        }
    }
});
