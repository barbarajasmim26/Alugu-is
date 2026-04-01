# Configuração de Variáveis de Ambiente

Este documento descreve todas as variáveis de ambiente necessárias para executar o sistema de gestão de imóveis.

## Variáveis Obrigatórias

### DATABASE_URL
- **Descrição**: URL de conexão com o banco de dados MySQL/TiDB
- **Formato**: `mysql://usuario:senha@host:porta/banco?ssl={"rejectUnauthorized":true}`
- **Exemplo**: `mysql://root:senha123@localhost:3306/sistema_aluguel`
- **Crítica**: Sim - O sistema não funcionará sem esta variável

### JWT_SECRET
- **Descrição**: Chave secreta para assinatura de tokens JWT de sessão
- **Requisitos**: Mínimo 32 caracteres, deve ser aleatória e segura
- **Geração**: Use `openssl rand -base64 32` para gerar uma chave segura
- **Crítica**: Sim - Necessária para autenticação de usuários

## Variáveis Opcionais (Plataforma Manus)

As seguintes variáveis são necessárias **apenas** se o sistema estiver sendo executado na plataforma Manus:

### VITE_APP_ID
- **Descrição**: ID da aplicação na plataforma Manus
- **Padrão**: Deixe em branco para ambientes fora da Manus

### OAUTH_SERVER_URL
- **Descrição**: URL do servidor OAuth da Manus
- **Padrão**: Deixe em branco para ambientes fora da Manus
- **Nota**: Se não configurada, o sistema usará autenticação local (username/password)

### VITE_OAUTH_PORTAL_URL
- **Descrição**: URL do portal OAuth da Manus
- **Padrão**: Deixe em branco para ambientes fora da Manus

### OWNER_OPEN_ID
- **Descrição**: ID do proprietário na plataforma Manus
- **Padrão**: Deixe em branco para ambientes fora da Manus

### OWNER_NAME
- **Descrição**: Nome do proprietário
- **Padrão**: Deixe em branco para ambientes fora da Manus

### BUILT_IN_FORGE_API_URL
- **Descrição**: URL da API Forge interna da Manus
- **Padrão**: Deixe em branco para ambientes fora da Manus

### BUILT_IN_FORGE_API_KEY
- **Descrição**: Chave de API para Forge
- **Padrão**: Deixe em branco para ambientes fora da Manus

### VITE_FRONTEND_FORGE_API_KEY
- **Descrição**: Chave de API do Forge para o frontend
- **Padrão**: Deixe em branco para ambientes fora da Manus

### VITE_FRONTEND_FORGE_API_URL
- **Descrição**: URL da API Forge para o frontend
- **Padrão**: Deixe em branco para ambientes fora da Manus

## Variáveis Opcionais (Analytics)

### VITE_ANALYTICS_ENDPOINT
- **Descrição**: URL do endpoint de analytics (ex: Umami)
- **Padrão**: Deixe em branco para desabilitar analytics
- **Nota**: O script de analytics está comentado em `client/index.html`

### VITE_ANALYTICS_WEBSITE_ID
- **Descrição**: ID do website para analytics
- **Padrão**: Deixe em branco para desabilitar analytics

## Variáveis Opcionais (Branding)

### VITE_APP_TITLE
- **Descrição**: Título da aplicação exibido no navegador
- **Padrão**: "Sistema de Gestão de Imóveis"

### VITE_APP_LOGO
- **Descrição**: URL do logo da aplicação
- **Padrão**: Deixe em branco para usar o logo padrão

## Configuração para Render

Ao fazer deploy no Render, configure as seguintes variáveis de ambiente:

```
DATABASE_URL=mysql://usuario:senha@host:porta/banco
JWT_SECRET=sua_chave_secreta_aleatoria_com_32_caracteres_minimo
```

**Importante**: Deixe as variáveis Manus em branco se não estiver usando a plataforma Manus. O sistema funcionará perfeitamente com autenticação local.

## Configuração Local

1. Copie `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite `.env` com seus valores:
   ```bash
   nano .env
   ```

3. Certifique-se de que `DATABASE_URL` e `JWT_SECRET` estão preenchidos

4. Deixe as variáveis Manus em branco se não estiver usando a plataforma

5. Execute o projeto:
   ```bash
   pnpm dev
   ```

## Troubleshooting

### Erro: "OAUTH_SERVER_URL is not configured"
- **Solução**: Este é apenas um aviso se você não estiver usando a plataforma Manus. O sistema funcionará normalmente com autenticação local.

### Erro: "DATABASE_URL is not configured"
- **Solução**: Certifique-se de que `DATABASE_URL` está definida no arquivo `.env` ou nas variáveis de ambiente do seu servidor.

### Erro: "JWT_SECRET is not configured"
- **Solução**: Defina `JWT_SECRET` com uma chave aleatória segura em seu arquivo `.env` ou variáveis de ambiente.

## Segurança

- **Nunca** comita o arquivo `.env` no repositório
- Use valores diferentes para cada ambiente (desenvolvimento, staging, produção)
- Mantenha `JWT_SECRET` seguro e complexo
- Altere `JWT_SECRET` periodicamente em produção
- Use HTTPS em produção
