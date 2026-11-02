"use client";

import { useEffect, useState } from "react";
import {
  ExternalLink,
  MoonStar,
  Music2,
  Play,
  Square,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  LULLABIES,
  LULLABY_AGES,
  lullabiesForAge,
  type LullabyAge,
} from "@/features/lullabies/catalog";
import { cn } from "@/lib/utils";

export function LullabyLibrary({
  recommendedAge,
  babyName,
}: {
  recommendedAge: LullabyAge;
  babyName?: string;
}) {
  const [age, setAge] = useState<LullabyAge | "all">(recommendedAge);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [notice, setNotice] = useState("");
  const [repeat, setRepeat] = useState(true);
  const playing = LULLABIES.find((item) => item.id === playingId);
  const group = LULLABY_AGES.find((item) => item.id === age);
  const tracks = lullabiesForAge(age);

  useEffect(() => {
    if (deadline === null) return;
    const tick = () => {
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1_000));
      setRemaining(left);
      if (left === 0) {
        setPlayingId(null);
        setDeadline(null);
        setNotice("Đã dừng nhạc theo giờ hẹn.");
      }
    };
    const first = window.setTimeout(tick, 0);
    const interval = window.setInterval(tick, 1_000);
    // Re-check when returning from a backgrounded/suspended tab.
    document.addEventListener("visibilitychange", tick);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [deadline]);

  function stop() {
    setPlayingId(null);
    setDeadline(null);
    setNotice("Đã dừng nhạc.");
  }
  function play(id: string) {
    setPlayingId(id);
    setNotice("");
  }

  return (
    <div className="space-y-5">
      <section className="relative overflow-hidden rounded-3xl bg-indigo-950 p-5 text-indigo-50 sm:p-6">
        <MoonStar className="mb-3 size-7 text-amber-200" />
        <h2 className="text-xl font-semibold">
          Một giai điệu, một chút bình yên
        </h2>
        <p className="mt-2 text-sm leading-6 text-indigo-100/80">
          {babyName ? `Gợi ý cho ${babyName}: ` : "Bắt đầu với nhóm "}
          {LULLABY_AGES.find((item) => item.id === recommendedAge)?.label}. Bố
          mẹ có thể chọn nhóm khác hoặc nghe tất cả bài.
        </p>
      </section>

      <div
        role="group"
        aria-label="Chọn độ tuổi"
        className="flex flex-wrap gap-2"
      >
        {[...LULLABY_AGES, { id: "all" as const, label: "Tất cả bài" }].map(
          (item) => (
            <button
              type="button"
              key={item.id}
              aria-pressed={age === item.id}
              onClick={() => setAge(item.id)}
              className={cn(
                "min-h-11 rounded-full border border-border/60 bg-card px-4 text-sm font-medium transition-colors",
                age === item.id && "border-primary bg-secondary text-primary",
              )}
            >
              {item.label}
              {item.id === recommendedAge && (
                <span className="sr-only"> · Gợi ý cho bé</span>
              )}
            </button>
          ),
        )}
      </div>
      <p className="text-sm leading-6 text-muted-foreground">
        {group?.description ??
          "Tất cả bài hát trong thư viện nhỏ của gia đình."}
      </p>

      {playing && (
        <section
          aria-label="Trình phát nhạc hát ru"
          className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm"
        >
          <div className="flex items-start justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Đang chọn nghe</p>
              <h3 className="mt-1 break-words font-semibold">
                {playing.title}
              </h3>
            </div>
            <Button
              type="button"
              variant="outline"
              className="min-h-11 rounded-xl"
              onClick={stop}
            >
              <Square className="size-4" />
              Dừng phát
            </Button>
          </div>
          <div className="px-4">
            <audio
              key={playing.id}
              aria-label={`Nghe ${playing.title}`}
              src={playing.audioSrc}
              controls
              autoPlay
              loop={repeat}
              preload="none"
              className="w-full"
              onError={() => setNotice("Chưa tải được nhạc. Thử lại khi có mạng hoặc mở bản MP3 đã tải về máy.")}
            />
          </div>
          <div className="space-y-3 p-4">
            <label className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <span className="inline-flex items-center gap-2">
                <Timer className="size-4 text-primary" />
                Hẹn dừng nhạc
              </span>
              <select
                aria-label="Hẹn dừng nhạc"
                className="min-h-11 rounded-xl border bg-background px-3"
                value={deadline === null ? "off" : "active"}
                onChange={(event) => {
                  if (event.target.value === "off") {
                    setDeadline(null);
                    return;
                  }
                  const minutes = Number(event.target.value);
                  if (!Number.isFinite(minutes) || minutes <= 0) return;
                  setRemaining(minutes * 60);
                  setDeadline(Date.now() + minutes * 60_000);
                  setNotice("");
                }}
              >
                {deadline !== null && (
                  <option value="active">
                    Còn {Math.floor(remaining / 60)}:
                    {String(remaining % 60).padStart(2, "0")}
                  </option>
                )}
                <option value="off">Không hẹn</option>
                <option value="10">Sau 10 phút</option>
                <option value="20">Sau 20 phút</option>
                <option value="30">Sau 30 phút</option>
              </select>
            </label>
            <label className="flex min-h-11 items-center gap-3 text-sm">
              <input type="checkbox" checked={repeat} onChange={(event) => setRepeat(event.target.checked)} className="size-4 accent-indigo-600" />
              Lặp lại bài đang nghe
            </label>
            <p className="text-xs leading-5 text-muted-foreground">
              Chạm nút phát nếu nhạc chưa bắt đầu. Có thể tải MP3 về máy để nghe khi không có mạng.
              Hẹn dừng khi khóa màn hình tùy trình duyệt.
            </p>
          </div>
        </section>
      )}
      {notice && (
        <p
          role="status"
          className="rounded-2xl bg-secondary p-3 text-sm text-primary"
        >
          {notice}
        </p>
      )}

      <div className="space-y-3" aria-label="Danh sách nhạc hát ru">
        {tracks.map((track) => (
          <article
            key={track.id}
            className="rounded-3xl border border-border/60 bg-card p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                <Music2 className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="break-words font-semibold">{track.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {track.language} · {track.publisher}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {track.subtitle}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                className="min-h-11 rounded-xl px-4"
                variant={playingId === track.id ? "secondary" : "default"}
                onClick={() =>
                  playingId === track.id ? stop() : play(track.id)
                }
                aria-label={
                  playingId === track.id
                    ? `Dừng ${track.title}`
                    : `Nghe ${track.title}`
                }
              >
                {playingId === track.id ? (
                  <Square className="size-4" />
                ) : (
                  <Play className="size-4" />
                )}
                {playingId === track.id ? "Dừng" : "Nghe bài này"}
              </Button>
              <a href={track.audioSrc} download className="inline-flex min-h-11 items-center rounded-xl border px-3 text-sm font-medium text-primary" aria-label={`Tải MP3 ${track.title}`}>
                Tải MP3
              </a>
              <a
                href={track.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-1 text-xs text-muted-foreground"
              >
                {track.license} · Nguồn
                <ExternalLink className="size-3" />
              </a>
            </div>
          </article>
        ))}
      </div>
      <p className="text-xs leading-5 text-muted-foreground">
        Nhóm tuổi chỉ để sắp xếp gợi ý, không phải giới hạn độ tuổi của bài hát.
        Gia đình có thể chọn theo sở thích của bé. Nhạc phát trực tiếp từ thư viện của gia đình.
        Các bài ru Nam Bộ là những đoạn diễn xướng ngắn, có thể bật lặp lại.
      </p>
    </div>
  );
}
