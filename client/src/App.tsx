import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Contratos from "./pages/Contratos";
import ContratoDetalhe from "./pages/ContratoDetalhe";
import Alertas from "./pages/Alertas";
import Calendario from "./pages/Calendario";
import Relatorios from "./pages/Relatorios";
import Busca from "./pages/Busca";
import NovoContrato from "./pages/NovoContrato";
import Recibo from "./pages/Recibo";
import WhatsApp from "./pages/WhatsApp";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/contratos" component={Contratos} />
        <Route path="/contratos/novo" component={NovoContrato} />
        <Route path="/recibo" component={Recibo} />
        <Route path="/contratos/:id" component={ContratoDetalhe} />
        <Route path="/alertas" component={Alertas} />
        <Route path="/calendario" component={Calendario} />
        <Route path="/relatorios" component={Relatorios} />
        <Route path="/busca" component={Busca} />
        <Route path="/whatsapp" component={WhatsApp} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
