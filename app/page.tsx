import { siteConfig } from "@/config/site";
import { buildMetadata, websiteLd, organizationLd, faqLd, jsonLdScript } from "@/lib/seo";
import { Hero } from "@/components/home/hero";
import { FeaturedTools } from "@/components/home/featured-tools";
import { ToolCategories } from "@/components/home/tool-categories";
import { WhyDevFlow } from "@/components/home/why-devflow";
import { Stats } from "@/components/home/stats";
import { Faq } from "@/components/home/faq";
import { Cta } from "@/components/home/cta";

export const metadata = buildMetadata({
  title: `${siteConfig.name} — Free Online Developer Tools (JSON, JWT, Base64, Regex)`,
  description: siteConfig.description,
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  const siteLd = websiteLd();
  const orgLd = organizationLd();
  const faqJsonLd = faqLd(siteConfig.faq);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(siteLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(orgLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd) }}
      />
      <Hero />
      <FeaturedTools />
      <ToolCategories />
      <WhyDevFlow />
      <Stats />
      <Faq />
      <Cta />
    </>
  );
}
