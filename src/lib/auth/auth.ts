import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { prisma } from "@/lib/prisma";
import { sendResetPasswordEmail } from "@/lib/auth/mail";

function isStrongPassword(password: string) {
  return (
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password)
  );
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 64,
    sendResetPassword: async ({ user, url }) => {
      void sendResetPasswordEmail(user.email, url).catch((error) => {
        console.error("Reset password email gönderilemedi:", error);
      });
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/reset-password") return;
      const password = ctx.body?.newPassword;
      if (typeof password !== "string") return;
      if (!isStrongPassword(password)) {
        throw new APIError("BAD_REQUEST", {
          message:
            "Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir.",
        });
      }
    }),
  },
  session: {
    expiresIn: 60,   // 1 dakika
    updateAge: 20   // 20 saniyede bir refresh kontrolü
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ],
  plugins: [nextCookies()],
});