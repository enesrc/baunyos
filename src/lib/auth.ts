import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { createAuthMiddleware, APIError } from "better-auth/api";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    sendResetPassword: async ({ user, url }) => {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Şifre Sıfırlama",
        html: `
          <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
          <a href="${url}">${url}</a>
          <p>Bu bağlantı 1 saat geçerlidir.</p>
        `,
      });
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/reset-password") return;
      const password = ctx.body?.newPassword;
      if (typeof password !== "string") return;
      const strong =
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /\d/.test(password);
      if (!strong) {
        throw new APIError("BAD_REQUEST", {
          message: "Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir.",
        });
      }
    }),
  },
  session: {
    expiresIn: 60 * 60,      // 1 saat
    updateAge: 30 * 10,      // 15 dakikada bir güncelle (45. dakikada işlem yapınca yenilenir)
  },
  trustedOrigins: ["http://localhost:3000"],
  plugins: [nextCookies()],
});