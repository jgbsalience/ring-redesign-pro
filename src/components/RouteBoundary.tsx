import { Link, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

function logRouterState(label: string, extra?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  console.warn(`[RouteBoundary] ${label}`, {
    href: window.location.href,
    pathname: window.location.pathname,
    readyState: document.readyState,
    hydrated: !!(window as unknown as { __TSR_HYDRATED__?: boolean }).__TSR_HYDRATED__,
    ...extra,
  });
}

export function RouteErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    logRouterState("error", {
      message: error?.message,
      stack: error?.stack?.split("\n").slice(0, 4).join("\n"),
    });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4 py-16">
      <div className="max-w-md text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Something went wrong
        </p>
        <h1 className="mt-3 font-serif text-3xl text-foreground">We couldn't load this page</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          A temporary issue stopped this section from loading. Try again, or return home and we'll
          get you back on track.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export function RouteNotFoundBoundary() {
  useEffect(() => {
    logRouterState("not-found");
  }, []);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4 py-16">
      <div className="max-w-md text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Not found</p>
        <h1 className="mt-3 font-serif text-3xl text-foreground">
          We couldn't find what you were looking for
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page may have moved, or the link may be out of date. Browse our listings or head back
          to the homepage.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            to="/buy"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Browse listings
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
