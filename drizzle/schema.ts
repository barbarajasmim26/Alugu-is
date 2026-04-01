import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  date,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Propriedades (endereços/condomínios)
export const propriedades = mysqlTable("propriedades", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  endereco: varchar("endereco", { length: 500 }).notNull(),
  cidade: varchar("cidade", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Propriedade = typeof propriedades.$inferSelect;

// Contratos de aluguel
export const contratos = mysqlTable("contratos", {
  id: int("id").autoincrement().primaryKey(),
  propriedadeId: int("propriedadeId").notNull(),
  casa: varchar("casa", { length: 20 }).notNull(),
  nomeInquilino: varchar("nomeInquilino", { length: 255 }).notNull(),
  dataEntrada: date("dataEntrada"),
  dataSaida: date("dataSaida"),
  caucao: decimal("caucao", { precision: 10, scale: 2 }),
  aluguel: decimal("aluguel", { precision: 10, scale: 2 }).notNull(),
  diaPagamento: int("diaPagamento"),
  status: mysqlEnum("status", ["ativo", "encerrado", "pendente", "ex-inquilino"]).default("ativo").notNull(),
  telefone: varchar("telefone", { length: 20 }),
  observacoes: text("observacoes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Contrato = typeof contratos.$inferSelect;

// Pagamentos mensais
export const pagamentos = mysqlTable("pagamentos", {
  id: int("id").autoincrement().primaryKey(),
  contratoId: int("contratoId").notNull(),
  ano: int("ano").notNull(),
  mes: int("mes").notNull(), // 1-12
  status: mysqlEnum("status", ["pago", "caucao", "pendente", "atrasado"]).default("pendente").notNull(),
  valorPago: decimal("valorPago", { precision: 10, scale: 2 }),
  dataPagamento: date("dataPagamento"),
  observacao: text("observacao"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Pagamento = typeof pagamentos.$inferSelect;

// Arquivos de contratos (PDF)
export const arquivosContrato = mysqlTable("arquivos_contrato", {
  id: int("id").autoincrement().primaryKey(),
  contratoId: int("contratoId").notNull(),
  nomeArquivo: varchar("nomeArquivo", { length: 255 }).notNull(),
  urlArquivo: text("urlArquivo").notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(),
  tamanho: int("tamanho"),
  mimeType: varchar("mimeType", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ArquivoContrato = typeof arquivosContrato.$inferSelect;


// Dados complementares do inquilino usados no recibo
export const dadosInquilinoRecibo = mysqlTable("dados_inquilino_recibo", {
  id: int("id").autoincrement().primaryKey(),
  contratoId: int("contratoId").notNull().unique(),
  nomeInquilino: varchar("nomeInquilino", { length: 255 }).notNull(),
  nacionalidade: varchar("nacionalidade", { length: 120 }),
  estadoCivil: varchar("estadoCivil", { length: 120 }),
  profissao: varchar("profissao", { length: 255 }),
  rg: varchar("rg", { length: 80 }),
  orgaoExpedidor: varchar("orgaoExpedidor", { length: 120 }),
  cpf: varchar("cpf", { length: 40 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DadosInquilinoRecibo = typeof dadosInquilinoRecibo.$inferSelect;

// Histórico de recibos emitidos
export const recibosHistorico = mysqlTable("recibos_historico", {
  id: int("id").autoincrement().primaryKey(),
  contratoId: int("contratoId"),
  nomeInquilino: varchar("nomeInquilino", { length: 255 }).notNull(),
  nacionalidade: varchar("nacionalidade", { length: 120 }),
  estadoCivil: varchar("estadoCivil", { length: 120 }),
  profissao: varchar("profissao", { length: 255 }),
  rg: varchar("rg", { length: 80 }),
  orgaoExpedidor: varchar("orgaoExpedidor", { length: 120 }),
  cpf: varchar("cpf", { length: 40 }),
  tipoRecibo: mysqlEnum("tipoRecibo", ["aluguel", "caucao"]).default("aluguel").notNull(),
  valor: decimal("valor", { precision: 10, scale: 2 }).notNull(),
  formaPagamento: varchar("formaPagamento", { length: 120 }),
  incluirPagoPor: mysqlEnum("incluirPagoPor", ["sim", "nao"]).default("sim").notNull(),
  nomePagador: varchar("nomePagador", { length: 255 }),
  mesReferencia: int("mesReferencia").notNull(),
  anoReferencia: int("anoReferencia").notNull(),
  enderecoImovel: varchar("enderecoImovel", { length: 600 }),
  cidade: varchar("cidade", { length: 120 }),
  dataRecibo: date("dataRecibo").notNull(),
  nomeLocadora: varchar("nomeLocadora", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ReciboHistorico = typeof recibosHistorico.$inferSelect;
