import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import History from "./pages/History";
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
        {/* Rota de Login (pública) */}
        <Route path="/login">
          <PageWrapper><Login /></PageWrapper>
        </Route>

        {/* Rotas protegidas */}
        <Route path="/">
          <ProtectedRoute>
            <PageWrapper><Dashboard /></PageWrapper>
          </ProtectedRoute>
        </Route>
        <Route path="/dashboard">
          <ProtectedRoute>
            <PageWrapper><Dashboard /></PageWrapper>
          </ProtectedRoute>
        </Route>
        
        {/* Outras rotas do app (protegidas) */}
        <Route path="/criativos">
          <ProtectedRoute>
            <PageWrapper><CreativeEngine /></PageWrapper>
          </ProtectedRoute>
        </Route>
        <Route path="/copys">
          <ProtectedRoute>
            <PageWrapper><CopyEngine /></PageWrapper>
          </ProtectedRoute>
        </Route>
        <Route path="/historico">
          <ProtectedRoute>
            <PageWrapper><History /></PageWrapper>
          </ProtectedRoute>
        </Route>
        <Route path="/automatico">
          <ProtectedRoute>
            <PageWrapper><AutomaticModePremium /></PageWrapper>
          </ProtectedRoute>
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
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
