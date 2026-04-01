<div className="space-y-2">
  {(Array.isArray(vencendo) ? vencendo : []).slice(0, 3).map(({ contrato, propriedade }) => (
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
