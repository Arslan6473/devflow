import Link from "next/link";
import { GradientBackground } from "@/components/shared/gradient-background";

export function Cta() {
  return (
    <section className="container mx-auto max-w-screen-xl px-4 py-16 md:px-8">
      <div className="relative overflow-hidden rounded-2xl glass py-16 px-8 text-center">
        <GradientBackground showGrid={false} />
        <div className="relative flex flex-col items-center gap-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to{" "}
            <span className="gradient-text">get flowing?</span>
          </h2>
          <p className="max-w-md text-muted-foreground">
            Open any tool in seconds. No sign-up, no tracking, no limits.
          </p>
          <Link
            href="/tools"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 glow"
          >
            Browse all tools
          </Link>
        </div>
      </div>
    </section>
  );
}
