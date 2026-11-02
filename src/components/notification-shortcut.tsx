"use client";
import Link from "next/link";
import { createContext, useContext } from "react";
import { Bell } from "lucide-react";
export const NotificationCountContext = createContext(0);
export function NotificationShortcut() {
  const count = useContext(NotificationCountContext);
  return (
    <Link
      href="/notifications"
      aria-label={`Thông báo${count ? `, ${count} chưa đọc` : ""}`}
      className="relative grid size-11 shrink-0 place-items-center rounded-full hover:bg-secondary"
    >
      <Bell className="size-5" />
      {count > 0 && (
        <span className="absolute right-0 top-0 grid min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
