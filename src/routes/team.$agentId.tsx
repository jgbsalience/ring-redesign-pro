import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { agents, listings, type Agent } from "@/data/site";
import { ListingCard } from "@/components/site/ListingCard";
import { TeamMemberImage } from "@/components/site/TeamMemberImage";
import { ArrowRight, Mail, Phone } from "lucide-react";

export const Route = createFileRoute("/team/$agentId")({
  loader: ({ params }) => {
    const a = agents.find((x) => x.id === params.agentId);
    if (!a) throw notFound();
    return { agent: a };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.agent.name} — ${loaderData.agent.role} · Ring Real Estate` },
          {
            name: "description",
            content: loaderData.agent.shortBio ?? loaderData.agent.bio[0] ?? "",
          },
          { property: "og:title", content: `${loaderData.agent.name} — Ring Real Estate` },
          {
            property: "og:description",
            content: loaderData.agent.shortBio ?? loaderData.agent.bio[0] ?? "",
          },
          { property: "og:image", content: loaderData.agent.photo },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center text-center">
      <div>
        <div className="font-serif text-6xl">Not found</div>
        <Link to="/about" className="mt-6 inline-block underline">
          Meet the team
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center">
      <div>{error.message}</div>
    </div>
  ),
  component: AgentPage,
});

function AgentPage() {
  const { agent } = Route.useLoaderData() as { agent: Agent };
  const myListings = listings.filter((l) => l.agentIds.includes(agent.id));

  return (
    <div className="bg-background text-foreground">
      <Header overlay={false} />

      <section className="container-page pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
          <Link to="/about" className="hover:text-foreground">
            Our inner circle
          </Link>
        </div>
        <div className="mt-8 grid md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-5">
            <div className="aspect-[3/4] bg-muted overflow-hidden">
              <TeamMemberImage agent={agent} size="xl" priority />
            </div>
          </div>
          <div className="md:col-span-7">
            <h1 className="font-serif text-5xl md:text-7xl tracking-tight leading-[0.95]">
              {agent.name}
            </h1>
            <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mt-4">
              {agent.role}
            </div>

            <div className="mt-8 grid sm:grid-cols-2 gap-3 max-w-lg">
              <a
                href={`tel:${agent.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center justify-center gap-2 bg-foreground text-background py-3.5 text-xs uppercase tracking-[0.2em] hover:bg-foreground/90"
              >
                <Phone size={14} /> {agent.phone}
              </a>
              <a
                href={`mailto:${agent.email}`}
                className="inline-flex items-center justify-center gap-2 border border-foreground py-3.5 text-xs uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-colors"
              >
                <Mail size={14} /> Email
              </a>
            </div>
            {agent.office && (
              <div className="mt-4 text-sm text-muted-foreground">
                Office{" "}
                <a
                  href={`tel:${agent.office.replace(/\s+/g, "")}`}
                  className="hover:text-foreground"
                >
                  {agent.office}
                </a>
              </div>
            )}

            <div className="mt-12 space-y-5 text-base md:text-lg leading-relaxed">
              {agent.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {myListings.length > 0 && (
        <section className="bg-secondary/50 py-24">
          <div className="container-page">
            <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
              <h2 className="font-serif text-3xl md:text-5xl tracking-tight">
                {agent.name.split(" ")[0]}'s current listings
              </h2>
              <Link
                to="/listings"
                className="text-sm inline-flex items-center gap-2 hover:gap-3 transition-all"
              >
                All listings <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
              {myListings.slice(0, 6).map((l) => (
                <ListingCard key={l.id} l={l} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-page py-24">
        <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground mb-8">
          The rest of the team
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {agents
            .filter((a) => a.id !== agent.id)
            .map((a) => (
              <Link
                key={a.id}
                to="/team/$agentId"
                params={{ agentId: a.id }}
                className="hover-lift block group"
              >
                <div className="aspect-[3/4] img-zoom bg-muted">
                  <TeamMemberImage
                    agent={a}
                    size="lg"
                    className="grayscale group-hover:grayscale-0 transition-[filter] duration-700"
                  />
                </div>
                <div className="mt-4">
                  <div className="font-serif text-lg group-hover:text-[var(--ringgreen)] transition-colors">
                    {a.name}
                  </div>
                  <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-1">
                    {a.role}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
