import { and, desc, eq, gte, lte, or, like, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, arquivosContrato, contratos, dadosInquilinoRecibo, pagamentos, propriedades, recibosHistorico, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  if (_db) {
    try {
      await ensureExtraTables(_db);
    } catch (error) {
      console.warn("[Database] Failed to ensure extra tables:", error);
    }
  }
  return _db;
}


let _extraTablesReady = false;

async function ensureExtraTables(db: ReturnType<typeof drizzle>) {
  if (_extraTablesReady) return;
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS dados_inquilino_recibo (
      id INT AUTO_INCREMENT PRIMARY KEY,
      contratoId INT NOT NULL UNIQUE,
      nomeInquilino VARCHAR(255) NOT NULL,
      nacionalidade VARCHAR(120) NULL,
      estadoCivil VARCHAR(120) NULL,
      profissao VARCHAR(255) NULL,
      rg VARCHAR(80) NULL,
      orgaoExpedidor VARCHAR(120) NULL,
      cpf VARCHAR(40) NULL,
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS recibos_historico (
      id INT AUTO_INCREMENT PRIMARY KEY,
      contratoId INT NULL,
      nomeInquilino VARCHAR(255) NOT NULL,
      nacionalidade VARCHAR(120) NULL,
      estadoCivil VARCHAR(120) NULL,
      profissao VARCHAR(255) NULL,
      rg VARCHAR(80) NULL,
      orgaoExpedidor VARCHAR(120) NULL,
      cpf VARCHAR(40) NULL,
      tipoRecibo ENUM('aluguel','caucao') NOT NULL DEFAULT 'aluguel',
      valor DECIMAL(10,2) NOT NULL,
      formaPagamento VARCHAR(120) NULL,
      incluirPagoPor ENUM('sim','nao') NOT NULL DEFAULT 'sim',
      nomePagador VARCHAR(255) NULL,
      mesReferencia INT NOT NULL,
      anoReferencia INT NOT NULL,
      enderecoImovel VARCHAR(600) NULL,
      cidade VARCHAR(120) NULL,
      dataRecibo DATE NOT NULL,
      nomeLocadora VARCHAR(255) NULL,
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  _extraTablesReady = true;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ---- PROPRIEDADES ----
export async function getAllPropriedades() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(propriedades).orderBy(propriedades.nome);
}

// ---- CONTRATOS ----
export async function getAllContratos(filters?: {
  propriedadeId?: number;
  status?: string;
  busca?: string;
}) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (filters?.propriedadeId) conditions.push(eq(contratos.propriedadeId, filters.propriedadeId));
  if (filters?.status) conditions.push(eq(contratos.status, filters.status as any));
  if (filters?.busca) {
    conditions.push(
      or(
        like(contratos.nomeInquilino, `%${filters.busca}%`),
        like(contratos.casa, `%${filters.busca}%`)
      )
    );
  }
  const query = db
    .select({
      contrato: contratos,
      propriedade: propriedades,
    })
    .from(contratos)
    .leftJoin(propriedades, eq(contratos.propriedadeId, propriedades.id));
  if (conditions.length > 0) {
    return query.where(and(...conditions)).orderBy(contratos.nomeInquilino);
  }
  return query.orderBy(contratos.nomeInquilino);
}

export async function getContratoById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select({ contrato: contratos, propriedade: propriedades })
    .from(contratos)
    .leftJoin(propriedades, eq(contratos.propriedadeId, propriedades.id))
    .where(eq(contratos.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function createContrato(data: typeof contratos.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const [result] = await db.insert(contratos).values(data);
  return (result as any).insertId as number;
}

export async function updateContrato(id: number, data: Partial<typeof contratos.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(contratos).set(data).where(eq(contratos.id, id));
}

export async function deleteContrato(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(pagamentos).where(eq(pagamentos.contratoId, id));
  await db.delete(arquivosContrato).where(eq(arquivosContrato.contratoId, id));
  await db.delete(contratos).where(eq(contratos.id, id));
}

// ---- PAGAMENTOS ----
export async function getPagamentosByContrato(contratoId: number) {
  const db = await getDb();
  if (!db) return [];
  
  // Obter contrato para saber o período
  const contrato = await getContratoById(contratoId);
  if (!contrato?.contrato) return [];
  
  const { dataEntrada, dataSaida } = contrato.contrato;
  if (!dataEntrada || !dataSaida) {
    // Se não houver datas, retornar apenas os pagamentos existentes
    return db.select().from(pagamentos).where(eq(pagamentos.contratoId, contratoId)).orderBy(pagamentos.ano, pagamentos.mes);
  }
  
  // Gerar lista de todos os meses do contrato
  const startDate = new Date(dataEntrada);
  const endDate = new Date(dataSaida);
  const allMonths: Array<{ ano: number; mes: number }> = [];
  
  let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const end = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
  
  while (current <= end) {
    allMonths.push({
      ano: current.getFullYear(),
      mes: current.getMonth() + 1,
    });
    current.setMonth(current.getMonth() + 1);
  }
  
  // Obter pagamentos existentes
  const existingPagamentos = await db.select().from(pagamentos).where(eq(pagamentos.contratoId, contratoId));
  const existingMap = new Map(existingPagamentos.map(p => ([`${p.ano}-${p.mes}`, p])));
  
  // Criar registros faltantes com status 'pendente'
  for (const { ano, mes } of allMonths) {
    const key = `${ano}-${mes}`;
    if (!existingMap.has(key)) {
      await db.insert(pagamentos).values({
        contratoId,
        ano,
        mes,
        status: 'pendente',
      }).onDuplicateKeyUpdate({ set: { status: 'pendente' } });
    }
  }
  
  // Retornar todos os pagamentos ordenados
  return db.select().from(pagamentos).where(eq(pagamentos.contratoId, contratoId)).orderBy(pagamentos.ano, pagamentos.mes);
}

export async function getPagamentosByMes(ano: number, mes: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({ pagamento: pagamentos, contrato: contratos, propriedade: propriedades })
    .from(pagamentos)
    .leftJoin(contratos, eq(pagamentos.contratoId, contratos.id))
    .leftJoin(propriedades, eq(contratos.propriedadeId, propriedades.id))
    .where(and(eq(pagamentos.ano, ano), eq(pagamentos.mes, mes)));
}

export async function upsertPagamento(data: {
  contratoId: number;
  ano: number;
  mes: number;
  status: "pago" | "caucao" | "pendente" | "atrasado";
  valorPago?: string | null;
  dataPagamento?: Date | null;
  observacao?: string | null;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const existing = await db
    .select()
    .from(pagamentos)
    .where(and(eq(pagamentos.contratoId, data.contratoId), eq(pagamentos.ano, data.ano), eq(pagamentos.mes, data.mes)))
    .limit(1);
  if (existing.length > 0) {
    await db.update(pagamentos).set({
      status: data.status,
      valorPago: data.valorPago ?? null,
      dataPagamento: data.dataPagamento ?? null,
      observacao: data.observacao ?? null,
    }).where(eq(pagamentos.id, existing[0].id));
    return existing[0].id;
  } else {
    const [result] = await db.insert(pagamentos).values(data);
    return (result as any).insertId as number;
  }
}

// ---- ARQUIVOS ----
export async function getArquivosByContrato(contratoId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(arquivosContrato).where(eq(arquivosContrato.contratoId, contratoId)).orderBy(desc(arquivosContrato.createdAt));
}

export async function saveArquivo(data: typeof arquivosContrato.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const [result] = await db.insert(arquivosContrato).values(data);
  return (result as any).insertId as number;
}

export async function deleteArquivo(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(arquivosContrato).where(eq(arquivosContrato.id, id));
}

// ---- DASHBOARD / RELATÓRIOS ----
export async function getDashboardStats() {
  const db = await getDb();
  if (!db) {
  return {
    totalContratos: 0,
    contratosAtivos: 0,
    vencendoEm30: 0,
    receitaMes: 0
  };
}

  const totalContratos = await db.select({ count: sql<number>`count(*)` }).from(contratos);
  const contratosAtivos = await db.select({ count: sql<number>`count(*)` }).from(contratos).where(eq(contratos.status, "ativo"));

  const hoje = new Date();
  const em30Dias = new Date(hoje);
  em30Dias.setDate(em30Dias.getDate() + 30);

  const vencendoEm30 = await db.select({ count: sql<number>`count(*)` })
    .from(contratos)
    .where(and(
      eq(contratos.status, "ativo"),
      gte(contratos.dataSaida, hoje),
      lte(contratos.dataSaida, em30Dias)
    ));

  const receitaMes = await db.select({ total: sql<number>`COALESCE(SUM(valorPago), 0)` })
    .from(pagamentos)
    .where(and(
      eq(pagamentos.ano, hoje.getFullYear()),
      eq(pagamentos.mes, hoje.getMonth() + 1),
      eq(pagamentos.status, "pago")
    ));

  return {
    totalContratos: Number(totalContratos[0]?.count ?? 0),
    contratosAtivos: Number(contratosAtivos[0]?.count ?? 0),
    vencendoEm30: Number(vencendoEm30[0]?.count ?? 0),
    receitaMes: Number(receitaMes[0]?.total ?? 0),
  };
}

export async function getContratosVencendoEm30() {
  const db = await getDb();
  if (!db) return [];
  const hoje = new Date();
  const em30Dias = new Date(hoje);
  em30Dias.setDate(em30Dias.getDate() + 30);
  return db
    .select({ contrato: contratos, propriedade: propriedades })
    .from(contratos)
    .leftJoin(propriedades, eq(contratos.propriedadeId, propriedades.id))
    .where(and(
      eq(contratos.status, "ativo"),
      gte(contratos.dataSaida, hoje),
      lte(contratos.dataSaida, em30Dias)
    ))
    .orderBy(contratos.dataSaida);
}

export async function getReceitaPorMes(ano: number) {
  const db = await getDb();
  if (!db) return [];
  const result = await db
    .select({
      mes: pagamentos.mes,
      total: sql<number>`COALESCE(SUM(CAST(${pagamentos.valorPago} AS DECIMAL(10,2))), 0)`,
      qtdPago: sql<number>`COUNT(CASE WHEN ${pagamentos.status} = 'pago' THEN 1 END)`,
      qtdPendente: sql<number>`COUNT(CASE WHEN ${pagamentos.status} = 'pendente' THEN 1 END)`,
    })
    .from(pagamentos)
    .where(eq(pagamentos.ano, ano))
    .groupBy(pagamentos.mes)
    .orderBy(pagamentos.mes);
  return result;
}

export async function getPropriedadesComResumo() {
  const db = await getDb();
  if (!db) return [];
  const props = await db.select().from(propriedades).orderBy(propriedades.nome);
  const result = [];
  for (const prop of props) {
    const total = await db.select({ count: sql<number>`count(*)` }).from(contratos).where(eq(contratos.propriedadeId, prop.id));
    const ativos = await db.select({ count: sql<number>`count(*)` }).from(contratos).where(and(eq(contratos.propriedadeId, prop.id), eq(contratos.status, "ativo")));
    const receita = await db.select({ total: sql<number>`COALESCE(SUM(CAST(${contratos.aluguel} AS DECIMAL(10,2))), 0)` }).from(contratos).where(and(eq(contratos.propriedadeId, prop.id), eq(contratos.status, "ativo")));
    result.push({
      ...prop,
      totalContratos: Number(total[0]?.count ?? 0),
      contratosAtivos: Number(ativos[0]?.count ?? 0),
      receitaMensal: Number(receita[0]?.total ?? 0),
    });
  }
  return result;
}

// ---- RENOVAÇÃO DE CONTRATO ----
export async function renovarContrato(id: number, novaDataSaida: Date) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(contratos).set({
    dataSaida: novaDataSaida,
    status: "ativo",
  }).where(eq(contratos.id, id));
}

// ---- GERAR MESES 2026 PARA CONTRATOS ATIVOS ----
export async function gerarMeses2026() {
  const db = await getDb();
  if (!db) throw new Error("DB not available");

  // Busca todos os contratos ativos
  const contratosAtivos = await db.select().from(contratos).where(eq(contratos.status, "ativo"));

  let criados = 0;
  for (const contrato of contratosAtivos) {
    for (let mes = 1; mes <= 12; mes++) {
      // Verifica se já existe pagamento para esse mês/ano
      const existing = await db
        .select()
        .from(pagamentos)
        .where(and(eq(pagamentos.contratoId, contrato.id), eq(pagamentos.ano, 2026), eq(pagamentos.mes, mes)))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(pagamentos).values({
          contratoId: contrato.id,
          ano: 2026,
          mes,
          status: "pendente",
          valorPago: "0.00",
          observacao: "Gerado automaticamente pelo dashboard",
        });
        criados++;
      }
    }
  }
  return { criados, contratos: contratosAtivos.length };
}

// ---- CRIAR PROPRIEDADE ----
export async function createPropriedade(data: { nome: string; endereco: string; cidade?: string }) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const [result] = await db.insert(propriedades).values({
    nome: data.nome,
    endereco: data.endereco,
    cidade: data.cidade ?? null,
  });
  return (result as any).insertId as number;
}


// ---- DADOS DO INQUILINO / RECIBOS ----
export async function getDadosInquilinoRecibo(contratoId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(dadosInquilinoRecibo).where(eq(dadosInquilinoRecibo.contratoId, contratoId)).limit(1);
  return result[0] ?? null;
}

export async function saveDadosInquilinoRecibo(data: {
  contratoId: number;
  nomeInquilino: string;
  nacionalidade?: string | null;
  estadoCivil?: string | null;
  profissao?: string | null;
  rg?: string | null;
  orgaoExpedidor?: string | null;
  cpf?: string | null;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const existing = await db.select().from(dadosInquilinoRecibo).where(eq(dadosInquilinoRecibo.contratoId, data.contratoId)).limit(1);
  if (existing.length > 0) {
    await db.update(dadosInquilinoRecibo).set({
      nomeInquilino: data.nomeInquilino,
      nacionalidade: data.nacionalidade ?? null,
      estadoCivil: data.estadoCivil ?? null,
      profissao: data.profissao ?? null,
      rg: data.rg ?? null,
      orgaoExpedidor: data.orgaoExpedidor ?? null,
      cpf: data.cpf ?? null,
    }).where(eq(dadosInquilinoRecibo.id, existing[0].id));
    return existing[0].id;
  }
  const [result] = await db.insert(dadosInquilinoRecibo).values({
    contratoId: data.contratoId,
    nomeInquilino: data.nomeInquilino,
    nacionalidade: data.nacionalidade ?? null,
    estadoCivil: data.estadoCivil ?? null,
    profissao: data.profissao ?? null,
    rg: data.rg ?? null,
    orgaoExpedidor: data.orgaoExpedidor ?? null,
    cpf: data.cpf ?? null,
  });
  return (result as any).insertId as number;
}

export async function createReciboHistorico(data: {
  contratoId?: number | null;
  nomeInquilino: string;
  nacionalidade?: string | null;
  estadoCivil?: string | null;
  profissao?: string | null;
  rg?: string | null;
  orgaoExpedidor?: string | null;
  cpf?: string | null;
  tipoRecibo: "aluguel" | "caucao";
  valor: string;
  formaPagamento?: string | null;
  incluirPagoPor: "sim" | "nao";
  nomePagador?: string | null;
  mesReferencia: number;
  anoReferencia: number;
  enderecoImovel?: string | null;
  cidade?: string | null;
  dataRecibo: Date;
  nomeLocadora?: string | null;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const [result] = await db.insert(recibosHistorico).values({
    contratoId: data.contratoId ?? null,
    nomeInquilino: data.nomeInquilino,
    nacionalidade: data.nacionalidade ?? null,
    estadoCivil: data.estadoCivil ?? null,
    profissao: data.profissao ?? null,
    rg: data.rg ?? null,
    orgaoExpedidor: data.orgaoExpedidor ?? null,
    cpf: data.cpf ?? null,
    tipoRecibo: data.tipoRecibo,
    valor: data.valor,
    formaPagamento: data.formaPagamento ?? null,
    incluirPagoPor: data.incluirPagoPor,
    nomePagador: data.nomePagador ?? null,
    mesReferencia: data.mesReferencia,
    anoReferencia: data.anoReferencia,
    enderecoImovel: data.enderecoImovel ?? null,
    cidade: data.cidade ?? null,
    dataRecibo: data.dataRecibo,
    nomeLocadora: data.nomeLocadora ?? null,
  });
  return (result as any).insertId as number;
}

export async function listRecibosHistorico(filters?: { contratoId?: number }) {
  const db = await getDb();
  if (!db) return [];
  const query = db.select().from(recibosHistorico);
  if (filters?.contratoId) {
    return query.where(eq(recibosHistorico.contratoId, filters.contratoId)).orderBy(desc(recibosHistorico.createdAt));
  }
  return query.orderBy(desc(recibosHistorico.createdAt));
}
