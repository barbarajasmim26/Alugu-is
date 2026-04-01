import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Link, useSearch } from "wouter";
import { FileText, Search, Filter, ChevronRight, Building2, Plus, AlertOctagon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import StatusBadge from "@/components/StatusBadge";

function formatBRL(v: string | number | null) {
  if (!v) return "—";
  return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(d: Date | string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("pt-BR");
}

function diasParaVencer(dataSaida: Date | string | null): number | null {
  if (!dataSaida) return null;
  const hoje = new Date();
  const saida = new Date(dataSaida);
  const diff = Math.ceil((saida.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function Contratos() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const propIdFromUrl = params.get("propriedadeId") ? Number(params.get("propriedadeId")) : undefined;

  const [busca, setBusca] = useState("");
  const [propFiltro, setPropFiltro] = useState<number | undefined>(propIdFromUrl);
  const [statusFiltro, setStatusFiltro] = useState("");

  const { data: propriedades } = trpc.propriedades.list.useQuery();
  const { data: contratos, isLoading } = trpc.contratos.list.useQuery({
    propriedadeId: propFiltro,
    status: statusFiltro || undefined,
    busca: busca || undefined,
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Contratos
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {contratos?.length ?? 0} contrato(s) encontrado(s)
          </p>
        </div>
        <Link href="/contratos/novo">
          <a className="flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" />
            Novo Contrato
          </a>
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl shadow-sm border border-border p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm text-foreground">Filtros</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nome ou casa..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <select
            value={propFiltro ?? ""}
            onChange={(e) => setPropFiltro(e.target.value ? Number(e.target.value) : undefined)}
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">Todos os endereços</option>
            {propriedades?.map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
          <select
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">Todos os status</option>
            <option value="ativo">✅ Ativo</option>
            <option value="encerrado">⚠ Contrato Vencido</option>
            <option value="pendente">⏳ Pendente</option>
            <option value="ex-inquilino">👤 Ex-Inquilino</option>
          </select>
        </div>
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : contratos?.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Nenhum contrato encontrado</p>
          <p className="text-sm">Tente ajustar os filtros</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contratos?.map(({ contrato, propriedade }) => {
            const dias = diasParaVencer(contrato.dataSaida);
            const vencendoBreve = dias !== null && dias >= 0 && dias <= 30;
            const vencido = contrato.status === "encerrado" || (dias !== null && dias < 0);

            return (
              <Link key={contrato.id} href={`/contratos/${contrato.id}`}>
                <Card className={`card-hover border shadow-sm rounded-2xl overflow-hidden cursor-pointer ${vencido ? "border-red-300 bg-red-50/30" : vencendoBreve ? "border-amber-300 bg-amber-50/30" : "border-border bg-white"}`}>
                    <CardContent className="p-0">
                      <div className="flex items-stretch">
                        {/* Barra lateral colorida */}
                        <div
                          className="w-1.5 flex-shrink-0 rounded-l-2xl"
                          style={{
                            background: vencendoBreve
                              ? "oklch(0.78 0.16 55)"
                              : vencido
                              ? "oklch(0.60 0.22 25)"
                              : contrato.status === "ativo"
                              ? "oklch(0.50 0.22 255)"
                              : "oklch(0.70 0.02 240)",
                          }}
                        />
                        <div className="flex-1 px-4 py-3">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-foreground">{contrato.nomeInquilino}</span>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                                  Casa {contrato.casa}
                                </span>
                                {vencido ? (
                                  <span className="text-xs bg-red-100 text-red-700 border border-red-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                    <AlertOctagon className="w-3 h-3" />
                                    Contrato Vencido
                                  </span>
                                ) : (
                                  <StatusBadge status={contrato.status} />
                                )}
                                {vencendoBreve && !vencido && (
                                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold animate-pulse">
                                    ⚠ Vence em {dias} dia(s)
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1.5 mt-1">
                                <Building2 className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{propriedade?.nome}</span>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-primary text-base">{formatBRL(contrato.aluguel)}/mês</p>
                              <p className="text-xs text-muted-foreground">Dia {contrato.diaPagamento ?? "—"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                            <span>Entrada: <b className="text-foreground">{formatDate(contrato.dataEntrada)}</b></span>
                            <span>Saída: <b className={vencido ? "text-red-600" : vencendoBreve ? "text-amber-600" : "text-foreground"}>{formatDate(contrato.dataSaida)}</b></span>
                            {vencido && dias !== null && (
                              <span className="text-red-500 font-semibold">Venceu há {Math.abs(dias)} dia(s)</span>
                            )}
                            <span>Caução: <b className="text-foreground">{formatBRL(contrato.caucao)}</b></span>
                          </div>
                        </div>
                        <div className="flex items-center pr-4">
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
