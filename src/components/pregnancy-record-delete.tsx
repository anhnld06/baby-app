"use client";

import { useFormStatus } from "react-dom";
import { Trash2 } from "lucide-react";
import { deletePregnancyTrackingRecord } from "@/features/mother/tracking-actions";
import styles from "./pregnancy.module.css";
function DeleteButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending} aria-label="Xóa bản ghi" className={styles.iconButton}><Trash2 size={15} /></button>;
}
export function PregnancyRecordDelete({ id, recordType }: { id: string; recordType: "session" | "measurement" }) {
  return <form action={deletePregnancyTrackingRecord} onSubmit={(event) => { if (!window.confirm("Xóa bản ghi này?")) event.preventDefault(); }}><input type="hidden" name="id" value={id} /><input type="hidden" name="recordType" value={recordType} /><DeleteButton /></form>;
}
