import { siteConfig } from "@/config/site";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function Faq() {
  return (
    <section className="container mx-auto max-w-screen-xl px-4 py-16 md:px-8">
      <div className="mx-auto max-w-2xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Common questions"
          align="center"
          className="mb-10"
        />
        <Accordion>
          {siteConfig.faq.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">{item.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
