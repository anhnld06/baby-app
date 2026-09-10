import Link from "next/link";
import { AlertTriangle, CheckCircle2, Clock, Syringe } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { computeBabyDue, computeMotherDue, type DueItem, type DueStatus } from "@/features/vaccination/due";
import { requireUser } from "@/lib/auth";
import { getSelectedBaby } from "@/lib/data";
import { db } from "@/lib/db";
import { getDictionary, getLocale } from "@/lib/i18n";

const STATUS_STYLE: Record<DueStatus, { icon: typeof Clock; className: string }> = {
  OVERDUE: { icon: AlertTriangle, className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" },
  DUE: { icon: Clock, className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
  UPCOMING: { icon: Clock, className: "bg-secondary text-muted-foreground" },
  DONE: { icon: CheckCircle2, className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
};

function DueList({
  items,
  statusLabels,
  dueByLabel,
  programLabels,
  tierLabels,
  locale,
}: {
  items: DueItem[];
  statusLabels: Record<DueStatus, string>;
  dueByLabel: string;
  programLabels: { free: string; paid: string };
  tierLabels: { core: string; supplementary: string };
  locale: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((item) => {
        const style = STATUS_STYLE[item.status];
        const Icon = style.icon;
        return (
          <div key={item.key} className="flex flex-col gap-2 rounded-2xl bg-card p-3 shadow-sm">
            <div className="flex items-center gap-3">
              <span className={`grid size-10 shrink-0 place-items-center rounded-2xl ${style.className}`}>
                <Icon className="size-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground">
                  {dueByLabel}: {new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" }).format(item.dueDate)}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${style.className}`}>
                {statusLabels[item.status]}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 pl-[52px]">
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  item.program === "free"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                }`}
              >
                {item.program === "free" ? programLabels.free : programLabels.paid}
              </span>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {item.tier === "core" ? tierLabels.core : tierLabels.supplementary}
              </span>
              {item.priceRangeVnd && (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {item.priceRangeVnd}
                </span>
              )}
            </div>
            {item.note && <p className="pl-[52px] text-xs text-muted-foreground">{item.note}</p>}
          </div>
        );
      })}
    </div>
  );
}

export default async function VaccinationSchedulePage() {
  const [user, t, locale] = await Promise.all([requireUser(), getDictionary(), getLocale()]);
  const [baby, mother] = await Promise.all([
    getSelectedBaby(user.id),
    db.mother.findUnique({ where: { userId: user.id }, include: { pregnancies: { orderBy: { createdAt: "desc" }, take: 1 } } }),
  ]);
  const pregnancy = mother?.pregnancies[0];
  const [babyRecords, motherRecords] = await Promise.all([
    baby ? db.vaccinationRecord.findMany({ where: { babyId: baby.id }, select: { vaccineName: true, doseNumber: true } }) : [],
    mother ? db.motherVaccinationRecord.findMany({ where: { motherId: mother.id }, select: { vaccineName: true, doseNumber: true } }) : [],
  ]);
  const babyDue = baby ? computeBabyDue(baby.dateOfBirth, babyRecords).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime()) : [];
  const motherDue = pregnancy?.lastMenstrualPeriod
    ? computeMotherDue(pregnancy.lastMenstrualPeriod, motherRecords).sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    : [];
  const statusLabels: Record<DueStatus, string> = {
    OVERDUE: t.vaccinationSchedule.overdue,
    DUE: t.vaccinationSchedule.due,
    UPCOMING: t.vaccinationSchedule.upcoming,
    DONE: t.vaccinationSchedule.done,
  };
  const programLabels = { free: t.vaccinationSchedule.free, paid: t.vaccinationSchedule.paid };
  const tierLabels = { core: t.vaccinationSchedule.core, supplementary: t.vaccinationSchedule.supplementary };

  return (
    <>
      <PageHeader title={t.vaccinationSchedule.title} subtitle={t.vaccinationSchedule.subtitle} />
      {motherDue.length > 0 && (
        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t.vaccinationSchedule.mother}</h2>
            <Link href="/mother/vaccination" className="text-sm font-medium text-primary">
              {t.vaccinationSchedule.logMother}
            </Link>
          </div>
          <DueList
            items={motherDue}
            statusLabels={statusLabels}
            dueByLabel={t.vaccinationSchedule.dueBy}
            programLabels={programLabels}
            tierLabels={tierLabels}
            locale={locale}
          />
        </section>
      )}
      {baby && (
        <section className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t.vaccinationSchedule.baby}</h2>
            <Link href="/tracking/vaccination" className="text-sm font-medium text-primary">
              {t.vaccinationSchedule.logBaby}
            </Link>
          </div>
          <DueList
            items={babyDue}
            statusLabels={statusLabels}
            dueByLabel={t.vaccinationSchedule.dueBy}
            programLabels={programLabels}
            tierLabels={tierLabels}
            locale={locale}
          />
        </section>
      )}
      {!motherDue.length && !babyDue.length && (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-3 p-5 text-sm text-muted-foreground">
            <Syringe className="size-5" />
            {t.vaccinationSchedule.allDone}
          </CardContent>
        </Card>
      )}
      <p className="mt-6 text-xs text-muted-foreground">{t.vaccinationSchedule.disclaimer}</p>
    </>
  );
}
