"use client";

import { createContext, useContext } from "react";
import type { Locale } from "@/lib/i18n";
import { VoiceQuickLog } from "@/components/voice-quick-log";

export const VoiceLogContext = createContext<{ babyId: string; locale: Locale } | undefined>(undefined);

export function VoiceLogShortcut() {
  const context = useContext(VoiceLogContext);
  return context ? <VoiceQuickLog key={context.babyId} {...context} /> : null;
}
