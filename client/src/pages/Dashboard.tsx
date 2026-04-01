import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { useState } from "react";
import {
  Building2,
  DollarSign,
  AlertTriangle,
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
      toast.success(`${data.criados} meses gerados!`);
      setGerandoMeses(false);
    },
    onError: (err) => {
      toast.error("Erro: " + err.message);
      setGerandoMeses(false);
    },
  });

  const loading = statsLoading || propsLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="flex gap-2">
          <button
            onClick={() => { setGerandoMeses(true); gerarMeses.mutate(); }}
            className="bg-blue-500 text-white px-3 py-2 rounded"
          >
            Gerar Meses
          </button>

          <Link href="/contratos">
            <a className="bg-green-500 text-white px-3 py-2 rounded">
              Ver contratos
            </a>
          </Link>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            Total: {loading ? "..." : stats?.totalContratos ?? 0}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            Ativos: {loading ? "..." : stats?.contratosAtivos ?? 0}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            Vencendo: {loading ? "..." : stats?.vencendoEm30 ?? 0}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            Receita: {loading ? "..." : formatBRL(stats?.receitaMes ?? 0)}
          </CardContent>
        </Card>
      </div>

      {/* Vencendo */}
      {(Array.isArray(vencendo) ? vencendo : []).length > 0 && (
        <div className="bg-yellow-100 p-4 rounded">
          <h2 className="font-bold mb-2">Contratos vencendo</h2>

          <div className="space-y-2">
            {(Array.isArray(vencendo) ? vencendo : []).slice(0, 3).map(({ contrato }) => (
              <div key={contrato.id} className="flex justify-between bg-white p-2 rounded">
                <span>{contrato.nomeInquilino}</span>
                <span>{contrato.casa}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Propriedades */}
      <div className="grid gap-4">
        {(Array.isArray(propriedades) ? propriedades : []).map((prop) => (
          <Card key={prop.id}>
            <CardHeader>
              <CardTitle>{prop.nome}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Total: {prop.totalContratos}</p>
              <p>Ativos: {prop.contratosAtivos}</p>
              <p>Receita: {formatBRL(prop.receitaMensal)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
