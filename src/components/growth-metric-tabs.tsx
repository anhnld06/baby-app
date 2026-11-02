"use client";
import {
  useId,
  useRef,
  useState,
  type ReactNode,
  type KeyboardEvent,
} from "react";
export function GrowthMetricTabs({
  panels,
}: {
  panels: { id: string; title: string; content: ReactNode }[];
}) {
  const [selected, setSelected] = useState(panels[0]?.id);
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  function navigate(event: KeyboardEvent, index: number) {
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % panels.length
        : event.key === "ArrowLeft"
          ? (index - 1 + panels.length) % panels.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? panels.length - 1
              : null;
    if (next == null) return;
    event.preventDefault();
    setSelected(panels[next].id);
    refs.current[next]?.focus();
  }
  return (
    <div>
      <div
        role="tablist"
        aria-label="Chỉ số tăng trưởng"
        className="mb-4 grid grid-cols-3 gap-1 rounded-2xl bg-secondary p-1"
      >
        {panels.map((panel, index) => (
          <button
            key={panel.id}
            ref={(element) => {
              refs.current[index] = element;
            }}
            role="tab"
            id={`${id}-tab-${panel.id}`}
            aria-selected={selected === panel.id}
            aria-controls={`${id}-panel-${panel.id}`}
            tabIndex={selected === panel.id ? 0 : -1}
            onKeyDown={(event) => navigate(event, index)}
            onClick={() => setSelected(panel.id)}
            className={`min-h-12 rounded-xl px-2 text-xs font-medium ${selected === panel.id ? "bg-card text-primary shadow-sm" : "text-muted-foreground"}`}
          >
            {panel.title}
          </button>
        ))}
      </div>
      {panels.map((panel) => (
        <div
          key={panel.id}
          role="tabpanel"
          id={`${id}-panel-${panel.id}`}
          aria-labelledby={`${id}-tab-${panel.id}`}
          hidden={selected !== panel.id}
          tabIndex={0}
        >
          {panel.content}
        </div>
      ))}
    </div>
  );
}
