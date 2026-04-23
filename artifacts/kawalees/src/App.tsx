import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "./pages/Home";
import ArtistProfile from "./pages/ArtistProfile";
import ContactRequest from "./pages/ContactRequest";
import JoinAsArtist from "./pages/JoinAsArtist";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/artist/:id" component={ArtistProfile} />
      <Route path="/projects" component={Projects} />
      <Route path="/projects/:id" component={ProjectDetail} />
      <Route path="/join" component={JoinAsArtist} />
      <Route path="/contact" component={ContactRequest} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div dir="rtl" className="dark font-sans text-right min-h-screen bg-background text-foreground">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
