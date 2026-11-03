import type { ReactNode } from "react";
import { PageHeader } from "@/components/page-header";
import { PregnancyTopbar } from "@/components/pregnancy-topbar";
import styles from "@/components/pregnancy.module.css";
import { getPregnancyContext } from "@/features/mother/pregnancy-data";

export default async function PregnancyLayout({ children }: { children: ReactNode }) {
  const { mother, pregnancy } = await getPregnancyContext();
  return <div className={styles.shell}>
    <PageHeader compact title="Thai kỳ" subtitle={mother ? `Của ${mother.name}` : undefined} backHref="/mother" />
    {pregnancy && <PregnancyTopbar />}
    {children}
  </div>;
}
