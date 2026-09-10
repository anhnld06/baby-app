"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { loginAction, type AuthFormState } from "@/app/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuthForm() {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(loginAction, undefined);
  return (
    <div className="w-full max-w-md rounded-[2rem] border border-border/70 bg-card/90 p-5 shadow-xl shadow-primary/10 backdrop-blur sm:p-7">
      <h2 className="mb-5 text-center text-xl font-semibold">Đăng nhập</h2>
      <form action={action} className="space-y-4">
        <AuthInput id="login-username" name="username" label="Tên đăng nhập" autoComplete="username" />
        <PasswordInput id="login-password" name="password" label="Mật khẩu" autoComplete="current-password" />
        <FormError message={state?.error} />
        <Button type="submit" disabled={pending} className="h-12 w-full rounded-2xl text-base">
          {pending && <LoaderCircle className="size-4 animate-spin" />}
          {pending ? "Đang mở…" : "Mở ứng dụng"}
        </Button>
      </form>
    </div>
  );
}

function AuthInput({
  id,
  label,
  ...props
}: React.ComponentProps<"input"> & { label: string }) {
  return (
    <label htmlFor={id} className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      <Input id={id} required className="h-12 rounded-2xl px-4" autoCapitalize="none" spellCheck={false} {...props} />
    </label>
  );
}

function PasswordInput(props: React.ComponentProps<"input"> & { label: string }) {
  const [visible, setVisible] = useState(false);
  const { id, label, ...inputProps } = props;
  return (
    <label htmlFor={id} className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      <span className="relative block">
        <Input id={id} type={visible ? "text" : "password"} required maxLength={256} className="h-12 rounded-2xl px-4 pr-12" {...inputProps} />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          className="absolute inset-y-0 right-1 grid w-11 place-items-center rounded-xl text-muted-foreground"
          aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </span>
    </label>
  );
}

function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
      {message}
    </p>
  );
}
