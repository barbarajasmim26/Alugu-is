import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useState } from "react";
import {
  Building2,
  Users,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Home,
  ChevronRight,
  CheckCircle2,
  CalendarPlus,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = trpc.dashboard.stats.useQuery();
  const { data: propriedades, isLoading: propsLoading } = trpc.propriedades.listComResumo.useQuery();
  const { data: vencendo } = trpc.contratos.vencendoEm30.useQuery();
  const [gerandoMeses, setGerandoMeses] = useState(false);

  const gerarMeses = trpc.utils.gerarMeses2026.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.criados} meses gerados para ${data.contratos} contratos!`);
      setGerandoMeses(false);
    },
    onError: (err) => {
      toast.error("Erro ao gerar meses: " + err.message);
      setGerandoMeses(false);
    },
  });

  const loading = statsLoading || propsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Visão geral dos seus imóveis</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => { setGerandoMeses(true); gerarMeses.mutate(); }}
            disabled={gerandoMeses || gerarMeses.isPending}
            title="Gera os meses de 2026 para todos os contratos ativos (apenas cria os que ainda não existem)"
            className="flex items-center gap-1.5 border-2 border-dashed border-primary/50 text-primary px-3 py-2 rounded-xl text-xs font-semibold hover:bg-primary/5 transition-colors disabled:opacity-50"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            {gerandoMeses ? "Gerando..." : "Gerar Meses 2026"}
          </button>
          <Link href="/contratos/novo">
            <a className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-colors">
              <UserPlus className="w-3.5 h-3.5" />
              Novo Inquilino
            </a>
          </Link>
          <Link href="/contratos">
            <a className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
              Ver todos os contratos
              <ChevronRight className="w-4 h-4" />
            </a>
          </Link>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-hover border-0 shadow-sm" style={{ background: "oklch(0.50 0.22 255)" }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <FileTextIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-white/70 text-xs font-medium">Total</span>
            </div>
            <p className="text-white text-2xl font-bold">{loading ? "..." : stats?.totalContratos ?? 0}</p>
            <p className="text-white/80 text-xs mt-0.5">Contratos</p>
          </CardContent>
        </Card>

        <Card className="card-hover border-0 shadow-sm" style={{ background: "oklch(0.55 0.20 145)" }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-white/70 text-xs font-medium">Ativos</span>
            </div>
            <p className="text-white text-2xl font-bold">{loading ? "..." : stats?.contratosAtivos ?? 0}</p>
            <p className="text-white/80 text-xs mt-0.5">Contratos ativos</p>
          </CardContent>
        </Card>

        <Card className="card-hover border-0 shadow-sm" style={{ background: "oklch(0.72 0.16 55)" }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-900" />
              </div>
              <span className="text-amber-900/70 text-xs font-medium">Atenção</span>
            </div>
            <p className="text-amber-900 text-2xl font-bold">{loading ? "..." : stats?.vencendoEm30 ?? 0}</p>
            <p className="text-amber-900/80 text-xs mt-0.5">Vencem em 30 dias</p>
          </CardContent>
        </Card>

        <Card className="card-hover border-0 shadow-sm" style={{ background: "oklch(0.62 0.20 310)" }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-white/70 text-xs font-medium">Mês atual</span>
            </div>
            <p className="text-white text-xl font-bold">{loading ? "..." : formatBRL(stats?.receitaMes ?? 0)}</p>
            <p className="text-white/80 text-xs mt-0.5">Receita recebida</p>
          </CardContent>
        </Card>
      </div>

      {/* Alerta de contratos vencendo */}
      {vencendo && vencendo.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="font-bold text-amber-800 text-sm">
              {vencendo.length} contrato(s) vencendo nos próximos 30 dias!
            </h2>
            <Link href="/alertas">
              <a className="ml-auto text-xs text-amber-700 underline font-semibold">Ver todos</a>
            </Link>
          </div>
          <div className="space-y-2">
            (Array.isArray(vencendo) ? vencendo : []).slice(0, 3).map(({ contrato, propriedade }) => (
              <div key={contrato.id} className="flex items-center justify-between bg-white rounded-xl px-3 py-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-amber-500" />
                  <span className="font-semibold text-sm text-foreground">{contrato.nomeInquilino}</span>
                  <span className="text-xs text-muted-foreground">Casa {contrato.casa}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-amber-700">
                    Vence: {contrato.dataSaida ? new Date(contrato.dataSaida).toLocaleDateString("pt-BR") : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">{propriedade?.nome}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Propriedades */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Imóveis por Endereço
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-40 bg-muted rounded-2xl animate-pulse" />
              ))
            : propriedades?.map((prop) => (
                <Card key={prop.id} className="card-hover border border-border shadow-sm rounded-2xl overflow-hidden">
                  <div className="h-2" style={{ background: "oklch(0.50 0.22 255)" }} />
                  <CardHeader className="pb-2 pt-4 px-5">
                    <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary" />
                      {prop.nome}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{prop.endereco}</p>
                  </CardHeader>
                  <CardContent className="px-5 pb-4">
                    <div className="grid grid-cols-3 gap-3 mt-1">
                      <div className="bg-blue-50 rounded-xl p-3 text-center">
                        <p className="text-xl font-bold text-blue-600">{prop.totalContratos}</p>
                        <p className="text-xs text-blue-500 font-medium">Total</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-3 text-center">
                        <p className="text-xl font-bold text-green-600">{prop.contratosAtivos}</p>
                        <p className="text-xs text-green-500 font-medium">Ativos</p>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-3 text-center">
                        <p className="text-lg font-bold text-purple-600">
                          {formatBRL(prop.receitaMensal).replace("R$", "").trim()}
                        </p>
                        <p className="text-xs text-purple-500 font-medium">Receita/mês</p>
                      </div>
                    </div>
                    <Link href={`/contratos?propriedadeId=${prop.id}`}>
                      <a className="mt-3 flex items-center justify-center gap-1 w-full py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors">
                        Ver contratos
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    </Link>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </div>
  );
}

// Ícone inline para evitar importação extra
function FileTextIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
