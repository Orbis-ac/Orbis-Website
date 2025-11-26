import { getAuth } from "./auth.js";

export const auth = getAuth();
export { getAuth } from "./auth.js";
export { initializeEmail, sendVerificationEmail, sendResetPasswordEmail } from './email';
export type Session = typeof auth.$Infer.Session;