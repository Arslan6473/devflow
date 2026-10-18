import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/shared/section-heading";
import { ContactForm } from "@/components/contact-form";
import { Mail, MessageSquare } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with the DevFlow team. Questions, feedback, bug reports, or feature requests — we'd love to hear from you.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <SectionHeading
        as="h1"
        eyebrow="Contact"
        title="Get in Touch"
        subtitle="Questions, bug reports, feature requests, or just saying hi — we read every message."
        className="mb-10"
      />

      <div className="grid gap-8 sm:grid-cols-5">
        {/* Form */}
        <div className="sm:col-span-3">
          <div className="glass rounded-xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6 text-muted-foreground text-sm">
              <MessageSquare className="size-4" aria-hidden="true" />
              <span>Submitting opens your email client with the message pre-filled.</span>
            </div>
            <ContactForm />
          </div>
        </div>

        {/* Sidebar info */}
        <aside className="sm:col-span-2">
          <div className="space-y-4">
            <div className="glass rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="size-4 text-primary" aria-hidden="true" />
                <h3 className="font-semibold text-foreground text-sm">Email</h3>
              </div>
              <a
                href="mailto:devteam@leadernova.com"
                className="text-sm text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
              >
                devteam@leadernova.com
              </a>
            </div>

            <div className="glass rounded-xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-2">
                What we can help with
              </h3>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li>Bug reports and issues</li>
                <li>Feature requests</li>
                <li>Privacy or security questions</li>
                <li>General feedback</li>
                <li>Partnership inquiries</li>
              </ul>
            </div>

            <div className="glass rounded-xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-2">
                Response time
              </h3>
              <p className="text-sm text-muted-foreground">
                We typically respond within 1–3 business days.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
