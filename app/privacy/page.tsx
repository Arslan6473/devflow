import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/shared/section-heading";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "DevFlow's privacy policy. All tool processing is 100% client-side — no data is transmitted, stored, or shared.",
  path: "/privacy",
});

const lastUpdated = "January 15, 2025";

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <SectionHeading
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle={`Last updated: ${lastUpdated}`}
        className="mb-10"
      />

      <div className="prose-container space-y-8">
        {/* Intro */}
        <section>
          <p className="text-foreground/90 leading-7">
            DevFlow (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is operated by the DevFlow team and accessible at{" "}
            <strong>{siteConfig.url}</strong>. This Privacy Policy explains how we handle (or rather, how we intentionally do not handle) your data.
          </p>
          <p className="text-foreground/90 leading-7 mt-3">
            The short version: <strong>DevFlow&apos;s tools process all data locally in your browser. Nothing you input is transmitted to our servers or any third party.</strong>
          </p>
        </section>

        {/* Core principle */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            1. The Core Principle: Client-Side Processing
          </h2>
          <p className="text-foreground/90 leading-7">
            Every DevFlow tool — including the JSON formatter, JWT decoder, Base64 encoder, URL encoder, and regex tester — runs entirely as JavaScript in your web browser. When you paste data into a DevFlow tool:
          </p>
          <ul className="mt-3 ml-6 list-disc space-y-1 text-foreground/90">
            <li>The data is processed by your browser&apos;s JavaScript engine</li>
            <li>The result is displayed in your browser</li>
            <li>No data is sent over the network for processing</li>
            <li>No data is stored on our servers</li>
            <li>No data is stored in your browser beyond the current session</li>
          </ul>
        </section>

        {/* What we collect */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            2. What Data We Collect
          </h2>
          <p className="text-foreground/90 leading-7">
            We do not collect or store your tool input data. We may collect the following minimal, non-identifying information:
          </p>
          <ul className="mt-3 ml-6 list-disc space-y-2 text-foreground/90">
            <li>
              <strong>Server access logs:</strong> Standard web server logs (IP address, browser type, pages visited, timestamps) that are retained briefly for security and uptime monitoring, then deleted.
            </li>
            <li>
              <strong>Browser preferences:</strong> Your theme preference (light/dark) may be stored in your browser&apos;s <code className="rounded px-1 py-0.5 text-sm font-mono bg-muted border border-border">localStorage</code>. This data never leaves your device.
            </li>
          </ul>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            3. Cookies
          </h2>
          <p className="text-foreground/90 leading-7">
            DevFlow does not use tracking cookies. We do not use advertising cookies, analytics cookies, or any cookies that track you across websites.
          </p>
          <p className="text-foreground/90 leading-7 mt-3">
            We may use strictly necessary session cookies for basic site functionality. These are not used for tracking or advertising.
          </p>
        </section>

        {/* Analytics */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            4. Analytics
          </h2>
          <p className="text-foreground/90 leading-7">
            We do not currently use any third-party analytics services (such as Google Analytics). If we introduce analytics in the future, we will update this policy and use only privacy-preserving, server-side analytics that do not track individual users.
          </p>
        </section>

        {/* Advertising */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            5. Advertising
          </h2>
          <p className="text-foreground/90 leading-7">
            DevFlow does not show advertisements. If we ever introduce advertising, we will:
          </p>
          <ul className="mt-3 ml-6 list-disc space-y-1 text-foreground/90">
            <li>Update this Privacy Policy before doing so</li>
            <li>Use non-intrusive, contextual ad formats</li>
            <li>Comply with applicable privacy regulations</li>
            <li>Provide opt-out mechanisms where required by law</li>
          </ul>
        </section>

        {/* Third parties */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            6. Third-Party Services
          </h2>
          <p className="text-foreground/90 leading-7">
            DevFlow&apos;s fonts are self-hosted and served from our own domain, so no request is made to Google Fonts or any other font CDN when you load the site.
          </p>
          <p className="text-foreground/90 leading-7 mt-3">
            We do not use any other third-party services that receive your tool input data.
          </p>
        </section>

        {/* Data retention */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            7. Data Retention
          </h2>
          <p className="text-foreground/90 leading-7">
            Because we do not collect personal data, there is no personal data to delete. Server access logs are purged on a rolling basis. Browser-stored preferences (theme) are stored only in your browser and can be cleared at any time by clearing your browser&apos;s local storage.
          </p>
        </section>

        {/* Your rights */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            8. Your Rights
          </h2>
          <p className="text-foreground/90 leading-7">
            Under GDPR, CCPA, and similar regulations, you have rights regarding your personal data. Since we do not collect personal data linked to your identity, most of these rights are satisfied by our architecture. If you have questions or concerns, contact us at{" "}
            <a
              href={`mailto:${process.env.CONTACT_EMAIL ?? "devteam@leadernova.com"}`}
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              devteam@leadernova.com
            </a>
            .
          </p>
        </section>

        {/* Changes */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            9. Changes to This Policy
          </h2>
          <p className="text-foreground/90 leading-7">
            We will update this Privacy Policy if our practices change. The &ldquo;Last updated&rdquo; date at the top of this page will reflect any changes. Significant changes (such as introducing advertising) will be communicated proactively.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            10. Contact
          </h2>
          <p className="text-foreground/90 leading-7">
            Questions about this Privacy Policy? Email us at{" "}
            <a
              href="mailto:devteam@leadernova.com"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              devteam@leadernova.com
            </a>{" "}
            or use the{" "}
            <Link
              href="/contact"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              contact form
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
