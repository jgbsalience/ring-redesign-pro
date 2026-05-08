import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { canonical } from "@/lib/seo";

export const Route = createFileRoute("/trust-account")({
  head: () => ({
    meta: [
      { title: "Trust Account — Ring Real Estate" },
      { name: "description", content: "Ring Real Estate trust account details and statutory information." },
    ],
    links: canonical("/trust-account"),
  }),
  component: TrustAccountPage,
});

function TrustAccountPage() {
  return (
    <div className="bg-background text-foreground">
      <Header />
      <section className="pt-28 md:pt-36 container-page pb-24 md:pb-32 max-w-3xl">
        <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground mb-5">Legal</div>
        <h1 className="font-serif text-4xl md:text-6xl tracking-tight leading-[1.05] mb-12">Trust Account</h1>
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            Ring Real Estate Pty Ltd holds all client monies in a dedicated trust account in accordance with the <em>Land Agents Act 1994</em> (SA) and the <em>Land Agents (Exemptions) Regulations</em>.
          </p>

          <h2 className="font-serif text-2xl text-foreground mt-10">Statutory details</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Licence number</dt>
              {/* TODO: Replace RLA 12345 with the real RLA number */}
              <dd className="mt-1 text-foreground">RLA 12345</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Registered business name</dt>
              <dd className="mt-1 text-foreground">Ring Real Estate Pty Ltd</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Office address</dt>
              <dd className="mt-1 text-foreground">140 Shepherds Hill Road, Bellevue Heights SA 5050</dd>
            </div>
          </dl>

          <p>
            For any questions regarding trust account transactions, please contact our office directly.
          </p>

          <p className="pt-6 border-t border-border text-xs">
            <strong>Note to Ring staff:</strong> This is a placeholder page. Please replace with full statutory trust account disclosure and update the RLA number before going live.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
