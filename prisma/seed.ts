import { prisma } from "../src/lib/prisma";
import { auth } from "../src/lib/auth";

async function main() {
  await auth.api.signUpEmail({
    body: {
      name: "Admin",
      email: "admin@baunyos.com",
      password: "değiştir123!",
    },
  });

  console.log("Admin kullanıcısı oluşturuldu.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());