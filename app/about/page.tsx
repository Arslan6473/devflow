import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/shared/section-heading";
import { Shield, Zap, Code2, Lock, Globe, Heart } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "DevFlow is a suite of fast, private, client-side developer tools. No servers, no accounts, no tracking — just tools that work.",
  path: "/about",
});

const values = [
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Every tool runs entirely in your browser. Nothing you paste is ever transmitted to a server, logged, or stored. Your data is yours.",
  },
  {
    icon: Zap,
    title: "Instant Performance",
    description:
      "No server round-trips means no latency. Format a 1MB JSON file, decode a JWT, or test a regex — all in milliseconds.",
  },
  {
    icon: Code2,
    title: "Developer-Focused",
    description:
      "Built by developers, for developers. Every UI decision is made with keyboard-first workflows and developer ergonomics in mind.",
  },
  {
    icon: Lock,
    title: "No Account Required",
    description:
      "Open a tool and start working. No sign-up, no email, no subscription, no cookie banners. Just tools.",
  },
  {
    icon: Globe,
    title: "Works Offline",
    description:
      "Once loaded, DevFlow tools work without an internet connection. On a plane, in a basement, wherever you need to work.",
  },
  {
    icon: Heart,
    title: "Free Forever",
    description:
      "All DevFlow tools are free to use — no ads, no paywalls, no premium tier.",
  },
];

const stack = [
  { name: "Next.js 16", role: "React framework with App Router" },
  { name: "TypeScript", role: "Type-safe JavaScript" },
  { name: "Tailwind CSS v4", role: "Utility-first styling" },
  { name: "shadcn/ui", role: "Accessible UI components" },
  { name: "Monaco Editor", role: "Code editing in JSON formatter" },
  { name: "jose", role: "JWT decoding (runs client-side)" },
];

export default function AboutPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12 sm:py-16">
      {/* Hero */}
      <section className="mb-16">
        <SectionHeading
          eyebrow="About DevFlow"
          title="Fast, private developer tools — no compromises."
          subtitle="DevFlow exists because developer tools should not require you to send sensitive data to strangers on the internet."
          align="center"
          className="mb-6"
        />
        <p className="text-center text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          We built DevFlow as a suite of high-quality, browser-based tools that handle everything client-side. JSON formatting, JWT decoding, Base64 encoding, URL encoding, regex testing — all the things you reach for every day, running locally in your browser with zero network requests.
        </p>
      </section>

      {/* Values */}
      <section className="mb-16">
        <SectionHeading
          title="Our Principles"
          subtitle="Every product decision is guided by these values."
          className="mb-8"
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <li
              key={value.title}
              className="glass rounded-xl p-5 flex flex-col gap-3"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <value.icon className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  {value.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Tech Stack */}
      <section className="mb-16">
        <SectionHeading
          title="The Technology"
          subtitle="DevFlow is built on modern, open-source web technology."
          className="mb-8"
        />
        <div className="glass rounded-xl divide-y divide-border overflow-hidden">
          {stack.map((item) => (
            <div key={item.name} className="flex items-center gap-4 px-5 py-3.5">
              <span className="font-mono text-sm font-medium text-foreground w-36 shrink-0">
                {item.name}
              </span>
              <span className="text-sm text-muted-foreground">{item.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy Stance */}
      <section className="mb-12">
        <div className="glass rounded-xl p-8 border-l-4 border-primary">
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Our Privacy Commitment
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Many online developer tools send your input to servers you do not control. We believe this is unacceptable for tools that handle JWTs, API responses, or any potentially sensitive data.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-5">
            DevFlow&apos;s tools are architecturally client-side. There is no API call, no database, no logging. You can verify this by opening your browser&apos;s network inspector and watching zero requests fire when you use a tool.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/docs/privacy-and-security"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
            >
              Read the Privacy Docs
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-xl font-semibold text-foreground mb-3">
          Ready to try DevFlow?
        </h2>
        <p className="text-muted-foreground mb-6">
          No sign-up. No download. Open a tool and start working.
        </p>
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Browse Tools
        </Link>
      </section>
    </div>
  );
}
