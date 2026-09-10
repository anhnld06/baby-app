"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, ExternalLink, Send, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { AssistantAnswer } from "@/features/ai/types";

const schema = z.object({ question: z.string().trim().min(3).max(1000) });
type Values = z.infer<typeof schema>;

export function AssistantForm({
  babyId,
  labels,
  locale,
}: {
  babyId?: string;
  locale: "vi" | "en";
  labels: {
    placeholder: string;
    ask: string;
    disclaimer: string;
    insufficient: string;
  };
}) {
  const [answer, setAnswer] = useState<AssistantAnswer>();
  const [failed, setFailed] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<Values>({ resolver: zodResolver(schema) });
  async function submit(values: Values) {
    setFailed(false);
    const response = await fetch("/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, babyId, locale }),
    });
    if (!response.ok) {
      setFailed(true);
      return;
    }
    setAnswer((await response.json()) as AssistantAnswer);
  }
  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSubmit(submit)}
        className="rounded-3xl bg-card p-4 shadow-sm"
      >
        <Textarea
          {...register("question")}
          placeholder={labels.placeholder}
          className="min-h-28 resize-none border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
        />
        {errors.question && (
          <p className="px-2 text-xs text-destructive">
            {errors.question.message}
          </p>
        )}
        <div className="mt-3 flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="h-11 rounded-xl">
            <Send className="size-4" />
            {isSubmitting ? "…" : labels.ask}
          </Button>
        </div>
      </form>
      {failed && (
        <p
          role="alert"
          className="rounded-2xl bg-destructive/10 p-4 text-sm text-destructive"
        >
          {labels.insufficient}
        </p>
      )}
      {answer && (
        <div className="rounded-3xl bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-secondary text-primary">
              <Bot className="size-4" />
            </span>
            <BadgeLike>{answer.evidenceLevel}</BadgeLike>
            <BadgeLike>{answer.safetyLevel}</BadgeLike>
          </div>
          <p className="whitespace-pre-wrap text-[15px] leading-7">
            {answer.answer}
          </p>
          {answer.sources.length > 0 && (
            <div className="mt-5 space-y-2 border-t pt-4">
              {answer.sources.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-2 text-sm text-primary"
                >
                  <ExternalLink className="mt-0.5 size-4 shrink-0" />
                  {source.organization}: {source.title}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="flex gap-3 rounded-2xl border border-border/70 p-4 text-xs leading-5 text-muted-foreground">
        <ShieldCheck className="size-5 shrink-0 text-primary" />
        {labels.disclaimer}
      </div>
    </div>
  );
}

function BadgeLike({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold tracking-wide text-muted-foreground">
      {children}
    </span>
  );
}
