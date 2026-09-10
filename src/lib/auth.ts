import "server-only";

import { createHmac, randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const SESSION_COOKIE = "mam_session";
const SESSION_DAYS = 30;

function hashToken(token: string) {
  const sessionKey = process.env.APP_PASSWORD;
  if (!sessionKey) throw new Error("APP_PASSWORD is not configured");
  return createHmac("sha256", sessionKey).update(token).digest("hex");
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

  await db.$transaction([
    db.session.deleteMany({ where: { userId, expiresAt: { lte: new Date() } } }),
    db.session.create({
      data: { userId, tokenHash: hashToken(token), expiresAt },
    }),
  ]);

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  cookieStore.delete(SESSION_COOKIE);
}

export const getCurrentUser = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          timezone: true,
          locale: true,
        },
      },
    },
  });

  const configuredUsername = process.env.APP_USERNAME?.trim().toLowerCase();
  if (
    !session ||
    session.expiresAt <= new Date() ||
    !configuredUsername ||
    session.user.username !== configuredUsername
  ) {
    if (session) await db.session.deleteMany({ where: { id: session.id } });
    return null;
  }

  return session.user;
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
