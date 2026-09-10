import type { ReactNode } from "react";
import { Check, ChevronDown, CircleAlert } from "lucide-react";
import Image from "next/image";

import {
  type ArticleBlock,
  isCalloutText,
  parseArticleContent,
} from "@/features/knowledge/content";
import {
  getArticleSectionGuide,
  getSectionVisual,
  type SectionVisual,
} from "@/features/knowledge/visuals";
import { cn } from "@/lib/utils";

function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={`${part}-${index}`} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

function ArticleBlockView({ block }: { block: ArticleBlock }) {
  if (block.type === "bullets") {
    return (
      <ul className="mb-4 space-y-2">
        {block.items.map((item, index) => (
          <li
            key={`${item}-${index}`}
            className="flex gap-2 rounded-xl bg-secondary/45 px-3 py-2.5 leading-6 text-muted-foreground"
          >
            <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
            <span><InlineText text={item} /></span>
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "steps") {
    return (
      <ol className="mb-4 space-y-2.5">
        {block.items.map((item, index) => (
          <li key={`${item}-${index}`} className="flex gap-3 leading-6 text-muted-foreground">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/12 text-xs font-semibold text-primary">
              {index + 1}
            </span>
            <span className="pt-0.5"><InlineText text={item} /></span>
          </li>
        ))}
      </ol>
    );
  }

  if (isCalloutText(block.text)) {
    return (
      <div className="my-4 flex gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-100">
        <CircleAlert className="mt-1 size-4 shrink-0" aria-hidden="true" />
        <p><InlineText text={block.text} /></p>
      </div>
    );
  }

  return (
    <p className="mb-4 leading-7 text-muted-foreground">
      <InlineText text={block.text} />
    </p>
  );
}

function Disclosure({
  blocks,
  label = "Xem giải thích thêm",
}: {
  blocks: ArticleBlock[];
  label?: string;
}) {
  if (blocks.length === 0) return null;
  return (
    <details className="group mb-4 rounded-2xl border border-border/70 bg-secondary/25 px-3.5 py-2.5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
        {label}
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-3 border-t border-border/60 pt-3 [&>*:last-child]:mb-0">
        {blocks.map((block, index) => (
          <ArticleBlockView key={index} block={block} />
        ))}
      </div>
    </details>
  );
}

function CondensedBlocks({
  blocks,
  showFirstParagraph,
}: {
  blocks: ArticleBlock[];
  showFirstParagraph: boolean;
}) {
  const output: ReactNode[] = [];
  let hidden: ArticleBlock[] = [];
  let hasShownParagraph = false;

  const flushHidden = () => {
    if (hidden.length === 0) return;
    output.push(<Disclosure key={`details-${output.length}`} blocks={hidden} />);
    hidden = [];
  };

  blocks.forEach((block, index) => {
    const isPlainParagraph = block.type === "paragraph" && !isCalloutText(block.text);
    if (isPlainParagraph && (!showFirstParagraph || hasShownParagraph)) {
      hidden.push(block);
      return;
    }

    flushHidden();
    if (isPlainParagraph) hasShownParagraph = true;
    output.push(<ArticleBlockView key={`block-${index}`} block={block} />);
  });
  flushHidden();

  return <>{output}</>;
}

function SpotIllustration({
  visual,
  alignLeft,
}: {
  visual: SectionVisual;
  alignLeft: boolean;
}) {
  return (
    <figure
      className={cn(
        "relative mb-2 aspect-square w-28 overflow-hidden rounded-2xl bg-secondary shadow-sm sm:w-36",
        alignLeft ? "float-left mr-3" : "float-right ml-3",
      )}
    >
      <Image
        alt={visual.alt}
        className="object-cover"
        fill
        sizes="(max-width: 640px) 112px, 144px"
        src={visual.src}
      />
    </figure>
  );
}

export function ArticleContent({
  content,
  slug,
  category,
}: {
  content: string;
  slug: string;
  category: string;
}) {
  const sections = parseArticleContent(content);
  const guides = sections.map((section) => getArticleSectionGuide(slug, section.heading));
  const hasSpecificGuide = guides.some(Boolean);
  const genericVisuals = new Map<number, SectionVisual>();

  if (!hasSpecificGuide && sections.length > 0) {
    const targetIndexes = sections.length >= 4 ? [0, Math.floor(sections.length / 2)] : [0];
    const usedSources = new Set<string>();
    targetIndexes.forEach((index) => {
      const visual = getSectionVisual(category, sections[index]?.heading);
      if (!usedSources.has(visual.src)) {
        genericVisuals.set(index, visual);
        usedSources.add(visual.src);
      }
    });
  }

  return (
    <>
      {sections.map((section, sectionIndex) => {
        const guide = guides[sectionIndex];
        const genericVisual = genericVisuals.get(sectionIndex);
        const callouts = guide
          ? section.blocks.filter(
              (block) => block.type === "paragraph" && isCalloutText(block.text),
            )
          : [];
        const guideDetails = guide
          ? section.blocks.filter((block) => !callouts.includes(block))
          : [];

        return (
          <section key={`${section.heading}-${sectionIndex}`} className="flow-root">
            {section.heading ? (
              <h2 className="mb-3 mt-7 text-lg font-semibold first:mt-0">
                {section.heading}
              </h2>
            ) : null}

            {guide ? (
              <>
                {guide.note ? (
                  <div
                    className={cn(
                      "mb-4 flex gap-2 rounded-2xl border p-3 text-sm leading-6",
                      guide.urgent
                        ? "border-red-200 bg-red-50 text-red-950 dark:border-red-900 dark:bg-red-950/50 dark:text-red-100"
                        : "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-100",
                    )}
                  >
                    <CircleAlert className="mt-1 size-4 shrink-0" aria-hidden="true" />
                    <p>{guide.note}</p>
                  </div>
                ) : null}
                <figure className="mb-3 overflow-hidden rounded-2xl border border-border/70 bg-secondary/30">
                  <div className="relative aspect-[3/2] overflow-hidden bg-muted">
                    <Image
                      alt={guide.alt}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, 620px"
                      src={guide.src}
                    />
                  </div>
                  <figcaption className="p-3 text-sm leading-6 text-muted-foreground">
                    <strong className="block text-foreground">{guide.title}</strong>
                    {guide.caption}
                  </figcaption>
                </figure>
                {callouts.map((block, index) => (
                  <ArticleBlockView key={index} block={block} />
                ))}
                <Disclosure blocks={guideDetails} label={guide.detailsLabel} />
              </>
            ) : (
              <>
                {genericVisual ? (
                  <SpotIllustration
                    visual={genericVisual}
                    alignLeft={sectionIndex % 2 === 1}
                  />
                ) : null}
                <CondensedBlocks
                  blocks={section.blocks}
                  showFirstParagraph={sectionIndex === 0}
                />
              </>
            )}
          </section>
        );
      })}
    </>
  );
}
