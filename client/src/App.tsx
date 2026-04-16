import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "./pages/Home";
import NewDocument from "./pages/NewDocument";
import DocumentDetail from "./pages/DocumentDetail";
import LawLibrary from "./pages/LawLibrary";
import DocumentWriter from "./pages/DocumentWriter";
import LegalAdviserNearby from "./pages/LegalAdviserNearby";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/documents/new" component={NewDocument} />
      <Route path="/documents/:id" component={DocumentDetail} />
      <Route path="/document-writer" component={DocumentWriter} />
      <Route path="/legal-adviser-nearby" component={LegalAdviserNearby} />
      <Route path="/law-library" component={LawLibrary} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;