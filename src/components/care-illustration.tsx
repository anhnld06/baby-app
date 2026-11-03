"use client";
import { useEffect, useId, useRef, useState } from "react";
export type CareIllustrationKind =
  "breast" | "bottle" | "sleep" | "diaper" | "pumping" | "meal" | "temperature" | "growth" | "medicine" | "vaccine" | "wellbeing" | "milestone" | "routine" | "tooth" | "medical" | "shield" | "pregnancy" | "cycle";
function BabyFace() {
  return (
    <g className="care-head">
      <circle
        cx="35"
        cy="66"
        r="7"
        fill="#ffd8b8"
        stroke="#e7b58d"
        strokeWidth="2"
      />
      <circle
        cx="93"
        cy="66"
        r="7"
        fill="#ffd8b8"
        stroke="#e7b58d"
        strokeWidth="2"
      />
      <circle
        cx="64"
        cy="65"
        r="29"
        fill="#ffe4c8"
        stroke="#e7b58d"
        strokeWidth="2.5"
      />
      <path
        d="M61 36c-5-13 13-16 12-6-1 6-8 5-7 1"
        stroke="#9e7656"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <g className="care-eyes" fill="#54465f">
        <circle cx="54" cy="63" r="2.5" />
        <circle cx="74" cy="63" r="2.5" />
      </g>
      <ellipse cx="47" cy="73" rx="5" ry="3" fill="#f5a8b2" />
      <ellipse cx="81" cy="73" rx="5" ry="3" fill="#f5a8b2" />
      <path
        d="M60 75q4 5 8 0"
        stroke="#9d6870"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  );
}
function LittleHeart({
  x,
  y,
  delay = 0,
}: {
  x: number;
  y: number;
  delay?: number;
}) {
  return (
    <path
      className="care-heart"
      style={{ animationDelay: `${delay}s` }}
      d={`M${x} ${y + 3}c-8-6-6-13-1-10 3-4 9 1 1 10Z`}
      fill="#ed94b4"
    />
  );
}
export function CareIllustration({
  kind,
  small = false,
  amountMl,
}: {
  kind: CareIllustrationKind;
  small?: boolean;
  amountMl?: number | null;
}) {
  const id = useId().replace(/:/g, "");
  const node = useRef<HTMLSpanElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (small || !node.current) return;
    let inView = true;
    const update = () =>
      setPlaying(inView && document.visibilityState === "visible");
    const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(
      (entries) => {
        inView = entries[0].isIntersecting;
        update();
      },
      { threshold: 0.15 },
    );
    observer?.observe(node.current);
    const frame = requestAnimationFrame(update);
    window.addEventListener("pageshow", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("pageshow", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [small]);
  return (
    <span
      ref={node}
      aria-hidden="true"
      data-care-kind={kind}
      data-playing={playing}
      className={`care-illustration relative inline-grid shrink-0 place-items-center ${small ? "size-12" : "care-animated size-20 sm:size-24"}`}
    >
      <svg
        viewBox="0 0 128 128"
        className="size-full overflow-visible"
        fill="none"
      >
        <defs>
          <clipPath id={`${id}-bottle`}>
            <rect x="39" y="43" width="50" height="66" rx="13" />
          </clipPath>
          <linearGradient id={`${id}-milk`} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#fff1c7" />
            <stop offset="1" stopColor="#efd6a4" />
          </linearGradient>
        </defs>
        <ExtraCareDrawing kind={kind} />
        {kind === "breast" && (
          <>
            <ellipse
              cx="64"
              cy="108"
              rx="32"
              ry="5"
              fill="#e5bba2"
              opacity=".2"
            />
            <BabyFace />
            <g className="care-droplet">
              <path
                d="M20 57C4 79 8 92 21 93c16 0 20-17-1-36Z"
                fill="#fff4d8"
                stroke="#87b6dc"
                strokeWidth="2"
              />
              <circle cx="17" cy="82" r="1.5" fill="#72668a" />
              <circle cx="25" cy="82" r="1.5" fill="#72668a" />
              <path
                d="m18 87 3 2 3-2"
                stroke="#b08fa4"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>
            <g className="care-droplet care-delay">
              <path
                d="M107 62c-18 22-17 34-2 35 16 0 20-15 2-35Z"
                fill="#fff4d8"
                stroke="#b5bce8"
                strokeWidth="2"
              />
              <circle cx="102" cy="85" r="1.5" fill="#72668a" />
              <circle cx="110" cy="85" r="1.5" fill="#72668a" />
            </g>
            <LittleHeart x={49} y={22} />
            <LittleHeart x={83} y={29} delay={1.2} />
          </>
        )}
        {kind === "bottle" && (
          <>
            <ellipse
              cx="64"
              cy="114"
              rx="28"
              ry="5"
              fill="#5d999b"
              opacity=".15"
            />
            <g className="care-bottle">
              <path
                d="M53 26v-7c0-12 22-12 22 0v7l7 7H46Z"
                fill="#ffdfba"
                stroke="#fff9ee"
                strokeWidth="2"
              />
              <rect
                x="36"
                y="31"
                width="56"
                height="14"
                rx="5"
                fill="#a0d9e8"
              />
              <path d="M42 38h44" stroke="#68b6d0" strokeWidth="1.5" />
              <rect
                x="37"
                y="42"
                width="54"
                height="69"
                rx="15"
                fill="#eaf6f7"
                stroke="#fff"
                strokeWidth="3"
              />
              <g clipPath={`url(#${id}-bottle)`}>
                <path
                  className="care-wave"
                  d={`M23 ${amountMl===undefined ? 72 : 108-Math.max(0,Math.min(1,(amountMl??0)/300))*57}q14-5 28 0t28 0 28 0V117H23Z`}
                  fill={`url(#${id}-milk)`}
                />
                <circle
                  className="care-bubble"
                  cx="56"
                  cy="96"
                  r="2"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
                <circle
                  className="care-bubble care-delay"
                  cx="73"
                  cy="91"
                  r="1.5"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
              </g>
              <path
                d="M47 53v45"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                opacity=".65"
              />
              <path
                d="M80 56h5m-5 10h5m-5 10h5m-5 10h5"
                stroke="#87c4d5"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </g>
          </>
        )}
        {kind === "pumping" && (
          <>
            <g className="care-pump-arm">
              <path
                d="m48 49-22-12-7 14 22 9m39-11 22-12 7 14-22 9"
                stroke="#80b9d8"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <path
                d="m24 53-9 17m89-17 9 17"
                stroke="#bca5df"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>
            <g className="care-pump">
              <rect
                x="44"
                y="32"
                width="40"
                height="37"
                rx="13"
                fill="#f7b8cc"
                stroke="#e292b0"
                strokeWidth="2.5"
              />
              <rect x="52" y="26" width="24" height="7" rx="3" fill="#aaa0de" />
              <g
                className="care-eyes"
                stroke="#7c5b80"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="m53 46 4 3-4 3m22-6-4 3 4 3" />
              </g>
              <path
                d="M61 57h6"
                stroke="#7c5b80"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
            {[12, 88].map((x, i) => (
              <g
                key={x}
                className={i ? "care-pump-jar care-delay" : "care-pump-jar"}
              >
                <rect
                  x={x}
                  y="73"
                  width="28"
                  height="36"
                  rx="8"
                  fill="#f2f8fa"
                  stroke="white"
                  strokeWidth="3"
                />
                <path
                  d={`M${x + 3} 89q5-4 11 0t11 0v12q0 5-6 5h-10q-6 0-6-5Z`}
                  fill="#f3dfaf"
                />
                <rect
                  x={x + 1}
                  y="68"
                  width="26"
                  height="7"
                  rx="3"
                  fill="#d6c9ed"
                />
                <path
                  d={`M${x + 7} 81v18`}
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </g>
            ))}
          </>
        )}
        {kind === "sleep" && (
          <>
            <circle cx="64" cy="65" r="45" fill="#525d9c" />
            <g className="care-sleep">
              <path
                d="M77 39C40 30 26 82 61 93c20 6 36-8 37-22-17 8-38-5-21-32Z"
                fill="#ffdf8d"
              />
              <path
                d="M55 68q4 5 8 0m10 6q4 5 8 0"
                stroke="#8b7090"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M62 81q4 3 7 0"
                stroke="#b58c90"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <ellipse cx="51" cy="76" rx="4" ry="2.5" fill="#f6b3a6" />
            </g>
            <g className="care-stars" fill="#ffecb0">
              <path d="m34 37 2-5 2 5 5 2-5 2-2 5-2-5-5-2Zm57 54 1-4 2 4 4 2-4 1-2 4-1-4-4-1Z" />
              <circle cx="91" cy="43" r="2" />
            </g>
            <text
              className="care-sleep-z"
              x="87"
              y="31"
              fill="#e1dff4"
              fontSize="14"
              fontWeight="700"
            >
              z
            </text>
          </>
        )}
        {kind === "diaper" && (
          <>
            <ellipse
              cx="64"
              cy="110"
              rx="36"
              ry="4"
              fill="#94b8d1"
              opacity=".15"
            />
            <g className="care-diaper">
              <path
                d="M25 43h78l-9 47c-2 10-15 18-30 18s-28-8-30-18Z"
                fill="#f8f9ff"
                stroke="#b5c8eb"
                strokeWidth="3"
              />
              <path d="M25 43h78v13H25Z" fill="#b5d8ec" />
              <rect
                x="19"
                y="43"
                width="16"
                height="20"
                rx="5"
                fill="#71b4df"
              />
              <rect
                x="93"
                y="43"
                width="16"
                height="20"
                rx="5"
                fill="#71b4df"
              />
              <path
                d="M40 68q2 24 11 28m37-28q-2 24-11 28"
                stroke="#d5dff5"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <g className="care-eyes" fill="#63779b">
                <circle cx="54" cy="72" r="2" />
                <circle cx="74" cy="72" r="2" />
              </g>
              <path
                d="M59 81q5 5 10 0"
                stroke="#ad91ac"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
            <g
              className="care-fresh"
              stroke="#99b896"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M49 31q-5-6 0-11m15 9q5-6 0-11m15 13q-5-6 0-11" />
            </g>
          </>
        )}
        {kind === "meal" && (
          <>
            <g transform="translate(-9 -12) scale(.87)">
              <BabyFace />
            </g>
            <path
              d="M31 71h46v15a23 23 0 0 1-46 0Z"
              fill="#8ccbaa"
              stroke="#f7fff8"
              strokeWidth="3"
            />
            <circle cx="54" cy="86" r="4" fill="#d4efde" />
            <g className="care-spoon">
              <path
                d="m85 53-15 17"
                stroke="#b8b9e6"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <ellipse
                cx="69"
                cy="72"
                rx="7"
                ry="4"
                transform="rotate(-38 69 72)"
                fill="#d8dcf3"
                stroke="#b8b9e6"
                strokeWidth="2"
              />
            </g>
            <g className="care-bowl">
              <path
                d="M77 88h37c-1 15-9 23-19 23s-17-8-18-23Z"
                fill="#ffbd99"
                stroke="#ed9d7b"
                strokeWidth="2"
              />
              <ellipse
                cx="95"
                cy="88"
                rx="19"
                ry="5"
                fill="#fff2d8"
                stroke="#ed9d7b"
                strokeWidth="2"
              />
              <circle cx="86" cy="84" r="4" fill="#92c47e" />
              <circle cx="95" cy="82" r="4" fill="#efb45c" />
              <circle cx="104" cy="84" r="3.5" fill="#e99194" />
              <circle cx="91" cy="97" r="1.5" fill="#936b83" />
              <circle cx="100" cy="97" r="1.5" fill="#936b83" />
            </g>
          </>
        )}
      </svg>
    </span>
  );
}

function ExtraCareDrawing({kind}:{kind:CareIllustrationKind}) {
  if (["breast","bottle","sleep","diaper","pumping","meal"].includes(kind)) return null;
  return <>
    <ellipse cx="64" cy="114" rx="39" ry="5" fill="#719ca7" opacity=".12"/>
    {kind === "temperature" && <><BabyFace/><g className="care-instrument" transform="rotate(-30 86 80)"><rect x="80" y="29" width="16" height="64" rx="8" fill="#fff" stroke="#a8bfea" strokeWidth="3"/><path d="M88 82V49" stroke="#f17696" strokeWidth="6" strokeLinecap="round"/><circle cx="88" cy="94" r="13" fill="#f17696" stroke="#fff" strokeWidth="3"/><circle cx="85" cy="91" r="4" fill="#ffa4b8"/><path d="M92 43h4m-4 12h4m-4 12h4" stroke="#a8bfea" strokeWidth="2"/></g></>}
    {kind === "growth" && <><rect x="13" y="19" width="17" height="80" rx="5" fill="#b5d8fa"/>{[28,42,56,70,84].map((y,i)=><path key={y} d={`M${i%2?18:22} ${y}h8`} stroke="white" strokeWidth="2"/>)}<g transform="translate(18 -14) scale(.8)"><BabyFace/></g><rect x="39" y="93" width="70" height="24" rx="10" fill="#fff" stroke="#a8b9e6" strokeWidth="3"/><circle cx="74" cy="103" r="8" fill="#f2f5ff" stroke="#b1bee5"/><path className="care-needle" d="M74 104l5-5" stroke="#f18b9f" strokeWidth="2" strokeLinecap="round"/></>}
    {kind === "medicine" && <><g className="care-instrument"><rect x="22" y="38" width="48" height="65" rx="13" fill="#fff" stroke="#c5b5ed" strokeWidth="3"/><rect x="27" y="26" width="38" height="17" rx="5" fill="#b4a0e3"/><rect x="25" y="59" width="42" height="26" rx="4" fill="#ede6fc"/><path d="M46 65v14m-7-7h14" stroke="#b091dd" strokeWidth="4" strokeLinecap="round"/><circle cx="40" cy="94" r="2" fill="#e4d2f7"/></g><g className="care-capsule"><rect x="78" y="61" width="24" height="49" rx="12" transform="rotate(30 90 85)" fill="#f7adc7" stroke="#fff" strokeWidth="3"/><path d="M81 72l20 12" stroke="white" strokeWidth="3"/></g><LittleHeart x={86} y={30}/></>}
    {kind === "vaccine" && <><path d="M31 26q33 12 66 0v36c0 24-18 39-33 47C49 101 31 86 31 62Z" fill="#daf5ee" stroke="#94d5c4" strokeWidth="3"/><g className="care-instrument" transform="rotate(35 65 61)"><rect x="53" y="38" width="24" height="44" rx="5" fill="#fff" stroke="#75c8c3" strokeWidth="3"/><rect x="56" y="59" width="18" height="18" rx="3" fill="#b8ece4"/><path d="M65 82v17M65 38V25M56 25h18M49 38h32m-8 10h4m-4 8h4" stroke="#69b7bb" strokeWidth="3" strokeLinecap="round"/></g><path className="care-stars" d="m95 20 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" fill="#f2d77f"/></>}
    {kind === "wellbeing" && <><BabyFace/><LittleHeart x={26} y={36}/><LittleHeart x={102} y={32} delay={1}/><path className="care-stars" d="M44 98q20 20 40 0" stroke="#e8acc5" strokeWidth="5" strokeLinecap="round"/></>}
    {kind === "milestone" && <><path d="m39 76-9 39 22-10 13 14 8-43" fill="#f2b6c9"/><path d="m70 75 16 40 7-19 22 4-26-36" fill="#bba7e7"/><g className="care-medal"><path d="m64 12 38 22v44l-38 22-38-22V34Z" fill="#ffd88c" stroke="#fff" strokeWidth="4"/><path d="m64 31 7 15 17 2-12 12 3 17-15-8-15 8 3-17-12-12 17-2Z" fill="#fff8d9" stroke="#e8b660" strokeWidth="2"/></g><circle className="care-stars" cx="106" cy="22" r="4" fill="#e1c2ef"/></>}
    {kind === "routine" && <><circle cx="64" cy="64" r="43" fill="#fff" stroke="#c7b9ee" strokeWidth="5"/>{[0,90,180,270].map(angle=><path key={angle} d="M64 27v5" transform={`rotate(${angle} 64 64)`} stroke="#c0b1e5" strokeWidth="3" strokeLinecap="round"/>)}<path className="care-clock-hand" d="M64 64V39" stroke="#9d88d3" strokeWidth="5" strokeLinecap="round"/><path d="m64 64 20 12" stroke="#edb476" strokeWidth="5" strokeLinecap="round"/><circle cx="64" cy="64" r="5" fill="#b8a4e6"/><path className="care-stars" d="m23 15 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" fill="#f4ce78"/></>}
    {kind === "tooth" && <><g className="care-instrument"><path d="M64 30c-28-16-42 4-31 33 6 14 5 44 17 43 8-1 5-28 14-28s6 27 14 28c12 1 11-29 17-43 11-29-3-49-31-33Z" fill="#fff" stroke="#a5d5e9" strokeWidth="3"/><path d="M48 39q-10 2-8 14" stroke="#d9f0fa" strokeWidth="5" strokeLinecap="round"/><circle cx="52" cy="57" r="2" fill="#7f91b3"/><circle cx="76" cy="57" r="2" fill="#7f91b3"/><path d="M57 66q7 7 14 0" stroke="#b593aa" strokeWidth="2" strokeLinecap="round"/></g><path className="care-stars" d="m103 20 3 9 9 3-9 3-3 9-3-9-9-3 9-3Z" fill="#f6d788"/></>}
    {kind === "medical" && <><g className="care-instrument"><rect x="25" y="28" width="78" height="77" rx="18" fill="#ffedf1" stroke="#e9afc3" strokeWidth="3"/><path d="M48 28V18h32v10" stroke="#d8a2b7" strokeWidth="5" strokeLinejoin="round"/><path d="M64 47v38M45 66h38" stroke="#ed9bb6" strokeWidth="13" strokeLinecap="round"/></g><LittleHeart x={108} y={24}/></>}
    {kind === "shield" && <><g className="care-medal"><path d="M29 25q35 13 70 0v40c0 22-20 37-35 45-15-8-35-23-35-45Z" fill="#d8f3e9" stroke="#8ecfbd" strokeWidth="3"/><path d="m47 65 12 12 23-27" stroke="#69bba4" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/></g><path className="care-stars" d="m105 26 2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" fill="#ebcf82"/></>}
    {kind === "pregnancy" && <><path className="care-medal" d="M64 108C-5 68 23 9 64 40c41-31 69 28 0 68Z" fill="#f8c9d9" stroke="#fff" strokeWidth="4"/><g transform="translate(20 21) scale(.68)"><BabyFace/></g><LittleHeart x={103} y={20}/></>}
    {kind === "cycle" && <><circle cx="64" cy="64" r="42" fill="#fff0f5" stroke="#edbed3" strokeWidth="3"/><g className="care-cycle">{[0,60,120,180,240,300].map(angle=><ellipse key={angle} cx="64" cy="42" rx="9" ry="17" transform={`rotate(${angle} 64 64)`} fill="#f4b5cf" stroke="#fff" strokeWidth="2"/>)}</g><circle cx="64" cy="64" r="10" fill="#fce1a3"/></>}
  </>;
}
