import { ShieldCheck, Zap, Sparkles, Keyboard } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: ShieldCheck,
    title: "Private & client-side",
    blurb:
      "Every tool runs entirely in your browser. No data ever leaves your device — no tracking, no telemetry, no backend.",
  },
  {
    icon: Zap,
    title: "Lightning fast",
    blurb:
      "Results appear instantly as you type. No network round-trips, no spinners, no waiting.",
  },
  {
    icon: Sparkles,
    title: "Beautiful & modern",
    blurb:
      "Dark-first design with a polished UI. Subtle gradients, glass cards, and smooth animations that stay out of your way.",
  },
  {
    icon: Keyboard,
    title: "Keyboard-first",
    blurb:
      "Open any tool from anywhere with ⌘K. Shortcuts and focus management throughout — built for people who live in the terminal.",
  },
];

export function WhyDevFlow() {
  return (
    <section className="container mx-auto max-w-screen-xl px-4 py-16 md:px-8">
      <SectionHeading
        eyebrow="Why DevFlow"
        title="Built different"
        subtitle="Tools that respect your time and your privacy."
        align="center"
        className="mb-10"
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className={cn(
                "glass rounded-xl p-6 flex flex-col gap-4 transition-shadow hover:shadow-lg hover:shadow-primary/10"
              )}
            >
              <div className="inline-flex items-center justify-center rounded-lg p-2.5 bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-primary/20 w-fit">
                <Icon className="size-5 text-primary" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-semibold text-sm">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {f.blurb}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
