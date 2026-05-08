import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { canonical } from "@/lib/seo";

export const Route = createFileRoute("/complaints")({
  head: () => ({
    meta: [
      { title: "Complaints — Ring Real Estate" },
      { name: "description", content: "Ring Real Estate complaints handling procedure." },
    ],
    links: canonical("/complaints"),
  }),
  component: ComplaintsPage,
});

function ComplaintsPage() {
  return (
    <div className="bg-background text-foreground">
      <Header />
      <section className="pt-28 md:pt-36 container-page pb-24 md:pb-32 max-w-3xl">
        <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground mb-5">Legal</div>
        <h1 className="font-serif text-4xl md:text-6xl tracking-tight leading-[1.05] mb-12">Complaints</h1>
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Ring Real Estate takes all complaints seriously. If you are dissatisfied with any aspect of our service, we encourage you to contact us directly in the first instance.
          </p>

          <h2 className="font-serif text-2xl text-foreground mt-10">Step 1 — Contact us directly</h2>
          <p>
            Speak with or write to the principal agent. We aim to resolve all complaints within 5 business days.
          </p>
          <address className="not-italic space-y-1">
            <div><a href="tel:+61883703211" className="text-foreground underline underline-offset-2">(08) 8370 3211</a></div>
            <div><a href="mailto:ring@ring-sa.com.au" className="text-foreground underline underline-offset-2">ring@ring-sa.com.au</a></div>
            <div className="pt-1">140 Shepherds Hill Road, Bellevue Heights SA 5050</div>
          </address>

          <h2 className="font-serif text-2xl text-foreground mt-10">Step 2 — Consumer and Business Services</h2>
          <p>
            If your complaint is not resolved to your satisfaction, you may contact Consumer and Business Services (CBS) South Australia:
          </p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Phone: 131 882</li>
            <li>Website: <a href="https://www.cbs.sa.gov.au" className="text-foreground underline underline-offset-2" target="_blank" rel="noopener noreferrer">cbs.sa.gov.au</a></li>
          </ul>

          <p className="pt-6 border-t border-border text-xs">
            <strong>Note to Ring staff:</strong> This is a placeholder page. Please replace with your full complaints procedure before going live.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
