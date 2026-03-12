import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
//import { logSessionInfo } from "@/lib/session-debug";

export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  //logSessionInfo("requireAuth", session);

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}