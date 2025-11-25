import {prismaAdapter} from "better-auth/adapters/prisma";
import {betterAuth} from "better-auth";
import {prisma} from "@repo/db";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: {
        enabled: true
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    socialProviders: {
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
});