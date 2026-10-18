import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  /** Use "h1" when this is the page's main heading (one per page for SEO). */
  as?: "h1" | "h2";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  as: Heading = "h2",
  className,
}: SectionHeadingProps) {
  const isPageTitle = Heading === "h1";

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-3",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <span className="inline-flex w-fit items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          <span
            className="h-px w-6 rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
            aria-hidden="true"
          />
          {eyebrow}
        </span>
      )}
      <Heading
        className={cn(
          "font-bold tracking-tight text-foreground text-balance",
          isPageTitle ? "text-3xl sm:text-4xl lg:text-5xl" : "text-2xl sm:text-3xl"
        )}
      >
        {title}
      </Heading>
      {subtitle && (
        <p
          className={cn(
            "max-w-2xl text-muted-foreground text-pretty",
            isPageTitle ? "text-base sm:text-lg" : "text-base"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
