"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch { /* Private browsing can disable storage. */ }
  }
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-11"
      onClick={toggle}
      aria-label="Đổi giao diện sáng hoặc tối"
    >
      <Moon className="dark:hidden" />
      <Sun className="hidden dark:block" />
    </Button>
  );
}
