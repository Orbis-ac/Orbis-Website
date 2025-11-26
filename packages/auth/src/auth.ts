import {prismaAdapter} from "better-auth/adapters/prisma";
import {betterAuth} from "better-auth";
import {prisma} from "@repo/db";
import {sendResetPasswordEmail, sendVerificationEmail} from "./email";

let authInstance: ReturnType<typeof betterAuth> | null = null;

export const getAuth = () => {
    if (!authInstance) {
        console.log('Initializing Better Auth...'); // Pour debug
        authInstance = betterAuth({
            baseURL: process.env.BETTER_AUTH_URL,
            secret: process.env.BETTER_AUTH_SECRET!,
            emailAndPassword: {
                enabled: true,
                requireEmailVerification: true,
                sendResetPassword: async ({user, url, token}, request) => {
                    await sendResetPasswordEmail(user.email, url);
                },
            },
            emailVerification:{
                sendVerificationEmail: async ({ user, url, token }) => {
                    await sendVerificationEmail(user.email, url);
                },
                sendOnSignUp: true,
                autoSignInAfterVerification: true,
                expiresIn: 3600,
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
    }
    return authInstance;
};

export const auth = getAuth(); // Export compatible