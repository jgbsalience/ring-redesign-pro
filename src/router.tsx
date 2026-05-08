import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { RouteErrorBoundary, RouteNotFoundBoundary } from "./components/RouteBoundary";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Cache scroll per pathname + search string so visiting the same
    // filtered/sorted URL again restores its scroll position.
    getScrollRestorationKey: (location) => location.pathname + location.searchStr,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: RouteErrorBoundary,
    defaultNotFoundComponent: RouteNotFoundBoundary,
  });

  return router;
};
