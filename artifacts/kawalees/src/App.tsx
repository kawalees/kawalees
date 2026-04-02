import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { AuthProvider } from "@/hooks/useAuth";

import Home from "./pages/Home";
import ArtistProfile from "./pages/ArtistProfile";
import ContactRequest from "./pages/ContactRequest";
import JoinAsArtist from "./pages/JoinAsArtist";
import AdminPanel from "./pages/AdminPanel";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import ArtistDashboard from "./pages/ArtistDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import Pricing from "./pages/Pricing";
import Settings from "./pages/Settings";
import Onboarding from "./pages/Onboarding";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/artist/:id" component={ArtistProfile} />
      <Route path="/contact" component={ContactRequest} />
      <Route path="/join" component={JoinAsArtist} />
      <Route path="/admin" component={AdminPanel} />
      {/* Auth */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      {/* Casting MVP */}
      <Route path="/projects" component={Projects} />
      <Route path="/projects/:id" component={ProjectDetail} />
      <Route path="/dashboard/artist" component={ArtistDashboard} />
      <Route path="/dashboard/company" component={CompanyDashboard} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/settings" component={Settings} />
      <Route path="/onboarding" component={Onboarding} />
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
            <AuthProvider>
              <Router />
            </AuthProvider>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
