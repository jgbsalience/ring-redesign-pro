import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { canonical } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Ring Real Estate" },
      {
        name: "description",
        content:
          "Ring Real Estate privacy policy. How we collect, use and protect your personal information.",
      },
    ],
    links: [...canonical("/privacy"), { rel: "robots" as never, content: "noindex" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="bg-background text-foreground">
      <Header />
      <section className="pt-28 md:pt-36 container-page pb-24 md:pb-32 max-w-3xl">
        <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground mb-5">
          Legal
        </div>
        <h1 className="font-serif text-4xl md:text-6xl tracking-tight leading-[1.05] mb-12">
          Privacy Policy
        </h1>
        <div className="prose prose-sm max-w-none space-y-6 text-muted-foreground leading-relaxed">
          <p className="text-foreground font-medium">Last updated: {new Date().getFullYear()}</p>
          <p>
            Ring Real Estate Pty Ltd ("<strong>Ring</strong>", "we", "our", "us") is committed to
            protecting your personal information in accordance with the <em>Privacy Act 1988</em>{" "}
            (Cth) and the Australian Privacy Principles.
          </p>

          <h2 className="font-serif text-2xl text-foreground mt-10">Information we collect</h2>
          <p>
            We may collect personal information including your name, contact details, property
            address, and enquiry details when you contact us, request an appraisal, or use our
            website.
          </p>

          <h2 className="font-serif text-2xl text-foreground mt-10">How we use your information</h2>
          <p>
            We use your information to respond to enquiries, provide real estate services, and
            communicate with you about properties and market updates. We do not sell your personal
            information to third parties.
          </p>

          <h2 className="font-serif text-2xl text-foreground mt-10">Contact</h2>
          <p>
            For privacy enquiries, contact us at{" "}
            <a
              href="mailto:ring@ring-sa.com.au"
              className="text-foreground underline underline-offset-2"
            >
              ring@ring-sa.com.au
            </a>{" "}
            or (08) 8370 3211.
          </p>

          <p className="pt-6 border-t border-border text-xs">
            <strong>Note to Ring staff:</strong> This is a placeholder page. Please replace with
            your full privacy policy before going live.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
