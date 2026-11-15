"use client";

import { createContext, useContext, useState, type ComponentProps } from "react";
import dynamic from "next/dynamic";
import { Mic } from "lucide-react";

export const VoiceLogContext = createContext<{ babyId: string } | undefined>(undefined);

const OPEN_LABEL = "Ghi nhật ký bằng giọng nói";
const loadVoiceQuickLog = () => import("@/components/voice-quick-log");

/** Lightweight stand-in that looks exactly like the real trigger in VoiceQuickLog. */
function MicButton(props: ComponentProps<"button">) {
  return (
    <button
      type="button"
      className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary transition-[background-color,transform] hover:bg-primary/15 active:scale-95"
      aria-label={OPEN_LABEL}
      {...props}
    >
      <Mic className="size-5" aria-hidden="true" />
    </button>
  );
}

// The voice sheet (speech recognition, parser, feeding fields) is only downloaded
// once the parent shows intent (hover/focus/touch) or opens it.
const VoiceQuickLog = dynamic(
  () => loadVoiceQuickLog().then((mod) => mod.VoiceQuickLog),
  { ssr: false, loading: () => <MicButton aria-busy="true" disabled /> },
);

function preload() {
  void loadVoiceQuickLog();
}

export function VoiceLogShortcut() {
  const context = useContext(VoiceLogContext);
  // Set by the first tap; from then on the real component stays mounted.
  const [launch, setLaunch] = useState<{ babyId: string; autoStart: boolean }>();
  // A baby switch remounts the sheet (key); it must not reopen by itself.
  if (launch?.autoStart && launch.babyId !== context?.babyId) {
    setLaunch({ ...launch, autoStart: false });
  }
  if (!context) return null;
  if (launch) {
    return <VoiceQuickLog key={context.babyId} {...context} autoStart={launch.autoStart} />;
  }
  return (
    <MicButton
      onPointerEnter={preload}
      onTouchStart={preload}
      onFocus={preload}
      onClick={() => setLaunch({ babyId: context.babyId, autoStart: true })}
    />
  );
}
