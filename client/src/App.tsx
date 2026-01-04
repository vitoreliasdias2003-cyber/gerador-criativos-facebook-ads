import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import CreativeEngine from "./pages/CreativeEngine";
import CopyEngine from "./pages/CopyEngine";
// CopyHistory removido por não existir no projeto original
import AutomaticModePremium from "./pages/AutomaticModePremium";
import { AnimatePresence, motion } from "framer-motion";

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        {/* App inicia diretamente no Dashboard */}
        <Route path="/">
          <PageWrapper><Dashboard /></PageWrapper>
        </Route>
        <Route path="/dashboard">
          <PageWrapper><Dashboard /></PageWrapper>
        </Route>
        
        {/* Outras rotas do app */}
        <Route path="/criativos">
          <PageWrapper><CreativeEngine /></PageWrapper>
        </Route>
        <Route path="/copys">
          <PageWrapper><CopyEngine /></PageWrapper>
        </Route>
        <Route path="/historico">
          <PageWrapper><Dashboard /></PageWrapper>
        </Route>
        <Route path="/automatico">
          <PageWrapper><AutomaticModePremium /></PageWrapper>
        </Route>
        
        {/* Redirecionamento de rotas antigas */}
        <Route path="/gerador">
          <Redirect to="/dashboard" />
        </Route>
        
        <Route path="/404">
          <PageWrapper><NotFound /></PageWrapper>
        </Route>
        
        {/* Final fallback route */}
        <Route>
          <PageWrapper><NotFound /></PageWrapper>
        </Route>
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
