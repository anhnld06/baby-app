import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Đăng nhập" };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/");

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-4 py-10">
      <div className="absolute -left-24 top-10 size-72 rounded-full bg-secondary/80 blur-3xl" />
      <div className="absolute -right-28 bottom-0 size-80 rounded-full bg-accent/70 blur-3xl" />
      <div className="relative flex w-full max-w-md flex-col items-center">
        <div className="mb-5 size-16 overflow-hidden rounded-[1.6rem] shadow-lg shadow-primary/25">
          <Image
            src="/icons/vani-family-192.png"
            alt="Biểu tượng Vani Family"
            width={64}
            height={64}
            preload
            className="size-16 object-cover"
          />
        </div>
        <h1 className="text-center text-3xl font-semibold tracking-tight">Vani Family</h1>
        <p className="mb-7 mt-2 max-w-sm text-center text-sm leading-6 text-muted-foreground">
          Không gian riêng để lưu hành trình của mẹ và bé.
        </p>
        <AuthForm />
        <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4 text-primary" />
          Thông tin đăng nhập chỉ được kiểm tra ở phía máy chủ.
        </p>
      </div>
    </main>
  );
}
