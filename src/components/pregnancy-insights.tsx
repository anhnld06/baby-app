"use client";

import Link from "next/link";
import { Baby, Heart, Utensils, Lightbulb, ChevronRight, BookOpen } from "lucide-react";
import { useState } from "react";
import type { LibraryArticle } from "@/features/knowledge/library";
import { normalizeLibraryText } from "@/features/knowledge/library";
import styles from "./pregnancy.module.css";

const topics = [
  { key: "baby", label: "Em bé", icon: Baby, terms: ["sieu am", "cu dong", "phat trien thai", "thai may", "tuoi thai", "tim thai", "tuan thai", "nipt"] },
  { key: "mother", label: "Của mẹ", icon: Heart, terms: ["me bau", "trieu chung", "suc khoe", "tam ly"] },
  { key: "food", label: "Dinh dưỡng", icon: Utensils, terms: ["dinh duong", "an uong", "thuc pham", "vitamin", "sat", "canxi"] },
  { key: "tips", label: "Lời khuyên", icon: Lightbulb, terms: [] },
];
export function PregnancyInsights({ articles }: { articles: LibraryArticle[] }) {
  const [selected, setSelected] = useState("baby");
  const topic = topics.find((t) => t.key === selected)!;
  const filtered = articles.filter((article) => !topic.terms.length || topic.terms.some((term) => normalizeLibraryText(`${article.title} ${article.category}`).includes(term))).slice(0, 3);
  return <section className={styles.panel}>
    <div className={styles.topicTabs} aria-label="Chủ đề cẩm nang">{topics.map(({ key, label, icon: Icon }) => <button key={key} onClick={() => setSelected(key)} aria-pressed={key === selected}><Icon size={15} />{label}</button>)}</div>
    {filtered.map((article) => <Link key={article.id} href={`/knowledge/${article.slug}`} className={styles.article}><div><span className={styles.eyebrow}>{article.category}</span><strong>{article.title}</strong><p className="line-clamp-2">{article.summary}</p><p>{article.sourceCount} nguồn tham khảo</p></div><ChevronRight size={17} className="shrink-0" /></Link>)}
    {!filtered.length && <div className="py-5"><BookOpen className="mb-3 text-rose-300" size={24} /><p className={styles.muted}>Khám phá các bài viết trong cẩm nang và lưu lại điều muốn hỏi ở lần khám tới.</p></div>}
    <Link href={`/knowledge?stage=PREGNANCY${selected === "food" ? "&q=dinh%20dưỡng" : ""}`} className={styles.textLink}>Mở cẩm nang thai kỳ <ChevronRight size={13} /></Link>
  </section>;
}
