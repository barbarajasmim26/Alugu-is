# Sistema de Gestão de Imóveis — Mesquita Administração

Sistema completo para gerenciamento de contratos de aluguel, pagamentos, alertas e geração de recibos.

**Site publicado:** [mesquitaimoveis.manus.space](https://mesquitaimoveis.manus.space)

---

## Funcionalidades

- **Dashboard** — visão geral por endereço, ocupação e receita mensal
- **Contratos** — listagem com filtros por endereço, inquilino, status e vencimento
- **Detalhe do Contrato** — dados completos + histórico de pagamentos de 2026
- **Alertas** — contratos vencendo em 30 dias com badges visuais
- **Calendário** — pagamentos mensais com status
- **Relatórios** — receita mensal, taxa de ocupação, vencimentos futuros
- **Recibo** — gerador de recibo idêntico ao modelo da Mesquita Imóveis (logo + assinatura)
- **WhatsApp** — envio de mensagens prontas (cobrança, vencimento, confirmação, boas-vindas)
- **Busca Rápida** — busca por casa, inquilino ou endereço
- **Upload de PDF** — upload e download de contrato por inquilino

---

## Dados Importados

- 4 endereços/condomínios
- 39 contratos (ativos e encerrados)
- 769 registros de pagamentos (todos os meses de 2026)

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + TypeScript + Tailwind CSS 4 |
| Roteamento | Wouter |
| Estado/API | TanStack Query + tRPC 11 |
| Backend | Node.js + Express 4 |
| Banco de Dados | MySQL/TiDB (Drizzle ORM) |
| Build | Vite 6 |
| Testes | Vitest |

---

## Rodar Localmente

### Pré-requisitos

- Node.js 18+ (recomendado: 22+)
- pnpm (`npm install -g pnpm`)
- MySQL 8+ ou TiDB (ou use PlanetScale/TiDB Cloud gratuitamente)

### Passo a passo

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais de banco de dados

# 3. Aplicar o schema no banco de dados
# Execute o conteúdo de database/backup_banco.sql no seu MySQL
# Ou use o Drizzle para criar as tabelas:
pnpm drizzle-kit push

# 4. (Opcional) Importar os dados
# Execute o arquivo database/backup_banco.sql no seu MySQL

# 5. Iniciar o servidor de desenvolvimento
pnpm dev
```

O sistema estará disponível em `http://localhost:3000`

### Build para produção

```bash
pnpm build
pnpm start
```

---

## Estrutura do Projeto

```
sistema-aluguel/
├── client/                  # Frontend React
│   ├── src/
│   │   ├── pages/           # Páginas do sistema
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Contratos.tsx
│   │   │   ├── ContratoDetalhe.tsx
│   │   │   ├── Alertas.tsx
│   │   │   ├── Calendario.tsx
│   │   │   ├── Relatorios.tsx
│   │   │   ├── Recibo.tsx
│   │   │   ├── WhatsApp.tsx   ← NOVO
│   │   │   ├── Busca.tsx
│   │   │   └── NovoContrato.tsx
│   │   ├── components/      # Componentes reutilizáveis
│   │   └── lib/trpc.ts      # Cliente tRPC
│   └── index.html
├── server/                  # Backend Node.js
│   ├── routers.ts           # Endpoints tRPC
│   ├── db.ts                # Queries do banco
│   └── storage.ts           # Upload de arquivos (S3)
├── drizzle/                 # Schema e migrations
│   └── schema.ts
├── database/                # Backup dos dados
│   ├── backup_banco.sql     # SQL com todos os dados
│   └── dados_exportados.json
├── .env.example             # Variáveis de ambiente (exemplo)
├── package.json
└── pnpm-lock.yaml
```

---

## Deploy na Plataforma Manus

O projeto já está configurado para deploy na plataforma Manus. Para republicar:

1. Faça suas alterações no código
2. Salve um checkpoint (botão na interface Manus)
3. Clique em **Publish** na interface Manus

---

## Banco de Dados — Schema

### Tabela `propriedades`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | Chave primária |
| nome | VARCHAR(255) | Nome do condomínio/endereço |
| endereco | VARCHAR(500) | Endereço completo |
| cidade | VARCHAR(100) | Cidade |

### Tabela `contratos`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | Chave primária |
| propriedadeId | INT | FK para propriedades |
| casa | VARCHAR(20) | Número da casa/unidade |
| nomeInquilino | VARCHAR(255) | Nome do inquilino |
| dataEntrada | DATE | Data de início do contrato |
| dataSaida | DATE | Data de término do contrato |
| caucao | DECIMAL(10,2) | Valor da caução |
| aluguel | DECIMAL(10,2) | Valor mensal do aluguel |
| diaPagamento | INT | Dia do mês para pagamento |
| status | ENUM | ativo / encerrado / pendente |
| telefone | VARCHAR(20) | WhatsApp do inquilino |
| observacoes | TEXT | Observações gerais |

### Tabela `pagamentos`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT | Chave primária |
| contratoId | INT | FK para contratos |
| ano | INT | Ano de referência |
| mes | INT | Mês de referência (1-12) |
| status | ENUM | pago / caucao / pendente / atrasado |
| valorPago | DECIMAL(10,2) | Valor efetivamente pago |
| dataPagamento | DATE | Data do pagamento |
| observacao | TEXT | Observação do pagamento |

---

## Licença

Uso exclusivo — Mesquita Administração de Imóveis


## Uso local no Windows

1. Crie um arquivo `.env` com a conexão MySQL. Se a senha tiver `@`, use `%40`.

Exemplo:

```env
DATABASE_URL=mysql://root:Hanna110990%40@localhost:3306/aluguel_manager
JWT_SECRET=mesquita-chave-local-123456789
OAUTH_SERVER_URL=https://api.manus.im
VITE_ANALYTICS_ENDPOINT=http://localhost:3000
VITE_ANALYTICS_WEBSITE_ID=local
```

2. Rode `setup-local.bat`
3. Depois rode `pnpm dev`
