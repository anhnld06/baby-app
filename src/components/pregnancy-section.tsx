import Link from "next/link";
import styles from "./pregnancy.module.css";

export function PregnancyEmpty() {
  return <><div className="rounded-2xl border border-dashed p-6 text-center"><p className="text-sm text-muted-foreground">Thêm thông tin thai kỳ để bắt đầu hành trình.</p><Link className="mt-3 inline-block font-medium text-primary" href="/profile/pregnancy">Thêm thai kỳ</Link></div></>;
}

export function PregnancyPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className={styles.panel}><h2 className="mb-3 font-semibold">{title}</h2>{children}</section>;
}
