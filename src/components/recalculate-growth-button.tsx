"use client";
import { useActionState } from "react";
import { recalculateLatestGrowthAction } from "@/app/actions";

export function RecalculateGrowthButton({ babyId }: { babyId: string }) {
  const [state, action, pending] = useActionState(recalculateLatestGrowthAction, { status: "idle", message: "" });
  return <form action={action} className="mt-4">
    <input type="hidden" name="babyId" value={babyId} />
    <button disabled={pending} className="min-h-11 rounded-xl bg-secondary px-4 text-sm font-medium text-primary disabled:opacity-50" type="submit">{pending ? "Đang tính…" : "Tính lại lần đo gần nhất"}</button>
    {state.message && <p role={state.status === "error" ? "alert" : "status"} className="mt-2 text-sm leading-6">{state.message}</p>}
  </form>;
}
