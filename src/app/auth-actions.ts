"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, deleteSession } from "@/lib/auth";
import { db } from "@/lib/db";

const loginSchema = z.object({
  username: z.string().trim().min(1).max(64),
  password: z.string().min(1).max(256),
});

export type AuthFormState = { error?: string } | undefined;

function equalSecret(actual: string, expected: string) {
  const actualHash = createHash("sha256").update(actual).digest();
  const expectedHash = createHash("sha256").update(expected).digest();
  return timingSafeEqual(actualHash, expectedHash);
}

export async function loginAction(
  _state: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Vui lòng nhập tên đăng nhập và mật khẩu." };
  }

  const configuredUsername = process.env.APP_USERNAME?.trim().toLowerCase();
  const configuredPassword = process.env.APP_PASSWORD;
  if (!configuredUsername || !configuredPassword) {
    return { error: "Ứng dụng chưa cấu hình APP_USERNAME và APP_PASSWORD." };
  }

  const usernameMatches = equalSecret(
    parsed.data.username.toLowerCase(),
    configuredUsername,
  );
  const passwordMatches = equalSecret(parsed.data.password, configuredPassword);
  if (!usernameMatches || !passwordMatches) {
    return { error: "Tên đăng nhập hoặc mật khẩu không đúng." };
  }

  const user = await db.user.upsert({
    where: { username: configuredUsername },
    update: {},
    create: {
      username: configuredUsername,
      name: process.env.APP_DISPLAY_NAME?.trim() || configuredUsername,
    },
    include: { babies: { select: { id: true }, take: 1 } },
  });

  await createSession(user.id);
  redirect(user.babies.length > 0 ? "/" : "/profile");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/login");
}
