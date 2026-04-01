# Guia de Deploy no Render

Este documento fornece instruções passo a passo para fazer deploy do sistema de gestão de imóveis no Render.

## Pré-requisitos

1. Conta no Render (https://render.com)
2. Banco de dados MySQL/TiDB configurado (pode usar Render Database ou provedor externo)
3. Repositório GitHub com o código do projeto

## Passo 1: Preparar o Banco de Dados

### Opção A: Usar Render Database (Recomendado)
1. Acesse o dashboard do Render
2. Clique em "New" → "MySQL"
3. Preencha os detalhes:
   - **Name**: `sistema-aluguel-db`
   - **Database Name**: `sistema_aluguel`
   - **User**: `admin`
4. Clique em "Create Database"
5. Copie a **External Database URL** (será necessária depois)

### Opção B: Usar Banco de Dados Externo
- Certifique-se de que o banco está acessível pela internet
- Anote a URL de conexão no formato: `mysql://usuario:senha@host:porta/banco`

## Passo 2: Criar o Serviço Web no Render

1. Acesse https://dashboard.render.com
2. Clique em "New" → "Web Service"
3. Selecione seu repositório GitHub
4. Preencha os detalhes:
   - **Name**: `sistema-aluguel`
   - **Environment**: `Node`
   - **Build Command**: `pnpm install && pnpm build`
   - **Start Command**: `node dist/index.js`
   - **Instance Type**: `Starter` (ou superior conforme necessário)

## Passo 3: Configurar Variáveis de Ambiente

No Render, vá para "Environment" e adicione as seguintes variáveis:

### Variáveis Obrigatórias

```
DATABASE_URL=mysql://usuario:senha@host:porta/banco
JWT_SECRET=gere_uma_chave_aleatoria_segura_com_32_caracteres_minimo
NODE_ENV=production
```

**Para gerar JWT_SECRET seguro, use:**
```bash
openssl rand -base64 32
```

### Variáveis Opcionais (deixe em branco se não usar Manus)

```
VITE_APP_ID=
OAUTH_SERVER_URL=
VITE_OAUTH_PORTAL_URL=
OWNER_OPEN_ID=
OWNER_NAME=
BUILT_IN_FORGE_API_URL=
BUILT_IN_FORGE_API_KEY=
VITE_FRONTEND_FORGE_API_KEY=
VITE_FRONTEND_FORGE_API_URL=
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=
VITE_APP_TITLE=Sistema de Gestão de Imóveis
VITE_APP_LOGO=
```

## Passo 4: Configurar Domínio Customizado

1. No dashboard do Render, vá para "Settings"
2. Em "Custom Domain", adicione seu domínio (ex: `imoveismesquita.com.br`)
3. Siga as instruções para configurar os registros DNS

## Passo 5: Deploy Inicial

1. Clique em "Deploy" no Render
2. Acompanhe o progresso na aba "Logs"
3. Quando terminar, você verá "Your service is live 🎉"

## Verificação Pós-Deploy

1. Acesse seu domínio no navegador
2. Você deve ver a página de login
3. Use as credenciais padrão:
   - **Usuário**: `barbara`
   - **Senha**: `mesquitaimoveis`

## Troubleshooting

### Erro: "DATABASE_URL is not configured"
- Verifique se `DATABASE_URL` foi configurada corretamente em Environment
- Certifique-se de que o banco de dados está acessível

### Erro: "JWT_SECRET is not configured"
- Adicione `JWT_SECRET` com uma chave aleatória segura

### Erro: "Build failed"
- Verifique os logs do build
- Certifique-se de que `pnpm install && pnpm build` funciona localmente

### Erro: "Cannot connect to database"
- Verifique a URL do banco de dados
- Se usar banco externo, verifique se está acessível pela internet
- Verifique firewall/security groups

### Aviso: "OAUTH_SERVER_URL is not configured"
- Este é apenas um aviso se você não estiver usando a plataforma Manus
- O sistema funcionará normalmente com autenticação local

## Atualizar Deploy

Após fazer push de alterações no GitHub:

1. O Render detectará automaticamente as mudanças
2. Clique em "Deploy latest" ou configure auto-deploy
3. Acompanhe o progresso nos logs

## Backup do Banco de Dados

Recomenda-se fazer backups regulares:

1. Se usar Render Database: Configure backups automáticos em "Backups"
2. Se usar banco externo: Configure backups conforme recomendado pelo provedor

## Segurança

- **Nunca** comita `.env` no repositório
- Use senhas fortes para o banco de dados
- Altere `JWT_SECRET` periodicamente
- Use HTTPS (Render fornece automaticamente)
- Restrinja acesso ao banco de dados apenas ao serviço web

## Próximos Passos

1. Altere as credenciais padrão em `server/auth.ts`
2. Configure backup automático do banco de dados
3. Configure monitoring e alertas no Render
4. Configure domínio customizado com SSL
