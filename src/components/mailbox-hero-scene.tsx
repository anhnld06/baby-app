"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Heart, Sparkles } from "lucide-react";

const MailboxThreeCanvas = dynamic(() => import("./mailbox-three-canvas"), {
  ssr: false,
});

export function MailboxHeroScene() {
  const [ready, setReady] = useState(false);

  return (
    <>
      {!ready && (
        <div aria-hidden="true" className="memory-welcome-art">
          <div className="memory-art-stamp">
            <Sparkles className="size-8" strokeWidth={1} />
            <span>GỬI CON ♡</span>
          </div>
          <div className="memory-art-envelope">
            <Heart className="size-6" fill="currentColor" />
          </div>
          <span className="memory-art-sparkle">✧</span>
        </div>
      )}
      <div
        aria-hidden="true"
        data-ready={ready ? "true" : undefined}
        className="memory-welcome-canvas"
      >
        <MailboxThreeCanvas onReady={() => setReady(true)} />
      </div>
    </>
  );
}
