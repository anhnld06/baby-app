"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import styles from "./pregnancy.module.css";

const sections = [
  ["/mother/pregnancy", "Tổng quan"],
  ["/mother/pregnancy/baby", "Em bé"],
  ["/mother/pregnancy/health", "Sức khỏe mẹ"],
  ["/mother/pregnancy/checkups", "Khám & lịch"],
  ["/mother/pregnancy/memories", "Kỷ niệm"],
] as const;

export function PregnancyTopbar() {
  const pathname = usePathname();
  const navigation = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const container = navigation.current;
    const current = container?.querySelector<HTMLElement>('[aria-current="page"]');
    if (container && current) {
      const frame = container.getBoundingClientRect();
      const tab = current.getBoundingClientRect();
      if (tab.left < frame.left || tab.right > frame.right) {
        container.scrollTo({ left: container.scrollLeft + tab.left - frame.left - (container.clientWidth - tab.width) / 2, behavior: "instant" });
      }
    }
  }, [pathname]);

  return (
    <nav ref={navigation} aria-label="Các mục thai kỳ"
      className={styles.topbar}>
      {sections.map(([href, label]) => {
        const active = pathname === href || (href !== "/mother/pregnancy" && pathname.startsWith(`${href}/`));
        return <Link key={href} href={href} aria-current={active ? "page" : undefined}
          className={styles.tab}>
          {label}
        </Link>;
      })}
    </nav>
  );
}
