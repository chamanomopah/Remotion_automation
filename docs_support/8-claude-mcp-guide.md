# Claude Code - Model Context Protocol (MCP) Complete Guide

## 📋 Visão Geral

O Model Context Protocol (MCP) é um padrão open-source que permite ao Claude Code se conectar a centenas de ferramentas externas e fontes de dados. Este é o guia completo para usar MCP no seu projeto.

## 🎯 O que Você Pode Fazer com MCP

Com servidores MCP conectados, você pode pedir ao Claude Code para:

- **Implementar features de issue trackers**: "Add the feature described in JIRA issue ENG-4521 and create a PR on GitHub"
- **Analisar dados de monitoring**: "Check Sentry and Statsig to check the usage of feature ENG-4521"
- **Consultar databases**: "Find emails of 10 random users who used feature ENG-4521, based on our PostgreSQL database"
- **Integrar designs**: "Update our standard email template based on the new Figma designs posted in Slack"
- **Automatizar workflows**: "Create Gmail drafts inviting these 10 users to a feedback session"

## 🔌 Servidores MCP Populares

### Serviços Cloud Comuns

| Servidor | Descrição | URL |
|----------|-----------|-----|
| **GitHub** | Gerenciar repos, PRs, issues | https://api.githubcopilot.com/mcp/ |
| **Notion** | Acessar e editar páginas | https://mcp.notion.com/mcp |
| **Asana** | Gerenciar tasks e projetos | https://mcp.asana.com/sse |
| **Sentry** | Monitorar erros | https://mcp.sentry.dev/mcp |
| **Figma** | Acessar designs | - |
| **Slack** | Ler e enviar mensagens | - |
| **PostgreSQL** | Consultar database | stdio (local) |

## 📦 Instalando Servidores MCP

Existem 3 formas de configurar servidores MCP:

### Opção 1: Servidor HTTP Remoto (Recomendado)

Para serviços cloud-based.

```bash
# Sintaxe básica
claude mcp add --transport http <name> <url>

# Exemplo real: Conectar ao Notion
claude mcp add --transport http notion https://mcp.notion.com/mcp

# Com Bearer token
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer your-token"
```

### Opção 2: Servidor SSE Remoto

Para Server-Sent Events.

```bash
# Sintaxe básica
claude mcp add --transport sse <name> <url>

# Exemplo: Conectar ao Asana
claude mcp add --transport sse asana https://mcp.asana.com/sse

# Com autenticação
claude mcp add --transport sse private-api https://api.company.com/sse \
  --header "X-API-Key: your-key-here"
```

### Opção 3: Servidor stdio Local

Para processos locais na sua máquina.

```bash
# Sintaxe básica
claude mcp add --transport stdio <name> <command> [args...]

# Exemplo: Airtable server
claude mcp add --transport stdio airtable --env AIRTABLE_API_KEY=YOUR_KEY \
  -- npx -y airtable-mcp-server

# Exemplo: PostgreSQL
claude mcp add --transport stdio db -- npx -y @bytebase/dbhub \
  --dsn "postgresql://user:pass@localhost:5432/mydb"
```

## 🛠️ Gerenciando Servidores

### Comandos Principais

```bash
# Listar todos servidores configurados
claude mcp list

# Ver detalhes de um servidor específico
claude mcp get github

# Remover um servidor
claude mcp remove github

# Dentro do Claude Code: Verificar status
/mcp
```

## 🔐 Autenticação

### OAuth 2.0 para Servidores Remotos

Muitos servidores cloud requerem autenticação OAuth.

**Passo a Passo:**

1. Adicione o servidor MCP
2. No Claude Code, use `/mcp`
3. Selecione "Authenticate" para o servidor
4. Siga o flow OAuth no browser
5. Permissões são salvas automaticamente

**Exemplo:**
```bash
# 1. Adicionar GitHub
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# 2. No Claude Code
> /mcp
# Selecionar "Authenticate" para GitHub
# Browser abre para OAuth flow
```

## 📂 Escopos de Instalação

MCP servers podem ser configurados em 3 níveis:

### Local Scope (Padrão)

Privado para você, apenas no projeto atual.

```bash
# Padrão
claude mcp add --transport http stripe https://mcp.stripe.com

# Explícito
claude mcp add --transport http stripe --scope local https://mcp.stripe.com
```

**Armazenado em:** `~/.claude.json` (path do projeto)

### Project Scope

Compartilhado com time, versionado no Git.

```bash
# Adicionar ao projeto
claude mcp add --transport http paypal --scope project https://mcp.paypal.com/mcp
```

**Armazenado em:** `.mcp.json` no root do projeto

**Formato do arquivo:**
```json
{
  "mcpServers": {
    "shared-server": {
      "command": "/path/to/server",
      "args": [],
      "env": {}
    }
  }
}
```

**⚠️ Importante:** Claude Code pede aprovação antes de usar servidores de `.mcp.json` por segurança.

### User Scope

Disponível em todos os seus projetos.

```bash
# Adicionar como user server
claude mcp add --transport http hubspot --scope user https://mcp.hubspot.com/anthropic
```

**Armazenado em:** `~/.claude.json` (global)

### Hierarquia de Precedência

```
Local > Project > User
```

Se existir servidor com mesmo nome em múltiplos scopes, o Local tem prioridade.

## 🎯 Casos de Uso Práticos

### Caso 1: Monitorar Erros com Sentry

```bash
# 1. Adicionar Sentry MCP
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

# 2. Autenticar (no Claude Code)
> /mcp

# 3. Debug production issues
> "What are the most common errors in the last 24 hours?"
> "Show me the stack trace for error ID abc123"
> "Which deployment introduced these new errors?"
```

### Caso 2: GitHub Code Reviews

```bash
# 1. Adicionar GitHub
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# 2. Autenticar
> /mcp
# Selecionar "Authenticate" para GitHub

# 3. Trabalhar com GitHub
> "Review PR #456 and suggest improvements"
> "Create a new issue for the bug we just found"
> "Show me all open PRs assigned to me"
```

### Caso 3: Query PostgreSQL Database

```bash
# 1. Adicionar database server
claude mcp add --transport stdio db -- npx -y @bytebase/dbhub \
  --dsn "postgresql://readonly:pass@localhost:5432/analytics"

# 2. Query naturalmente
> "What's our total revenue this month?"
> "Show me the schema for the orders table"
> "Find customers who haven't made a purchase in 90 days"
```

## 🔧 Plugin MCP Servers

Plugins podem incluir servidores MCP que são ativados automaticamente.

### Como Funciona

**Configuração em `.mcp.json`:**
```json
{
  "database-tools": {
    "command": "${CLAUDE_PLUGIN_ROOT}/servers/db-server",
    "args": ["--config", "${CLAUDE_PLUGIN_ROOT}/config.json"],
    "env": {
      "DB_URL": "${DB_URL}"
    }
  }
}
```

**Ou inline em `plugin.json`:**
```json
{
  "name": "my-plugin",
  "mcpServers": {
    "plugin-api": {
      "command": "${CLAUDE_PLUGIN_ROOT}/servers/api-server",
      "args": ["--port", "8080"]
    }
  }
}
```

### Features de Plugin MCP

- **Lifecycle automático**: Servers iniciam quando plugin é habilitado
- **Restart necessário**: Deve reiniciar Claude Code para aplicar mudanças
- **Variáveis de ambiente**: Use `${CLAUDE_PLUGIN_ROOT}` para paths relativos
- **Múltiplos transports**: Suporta stdio, SSE, HTTP

### Visualizar Plugin Servers

```bash
# Ver todos servers MCP incluindo de plugins
> /mcp
```

## 🔒 Enterprise MCP Configuration

Para organizações que precisam de controle centralizado.

### Setup Administrator

Criar arquivo de configuração gerenciada:

**macOS:** `/Library/Application Support/ClaudeCode/managed-mcp.json`  
**Linux/WSL:** `/etc/claude-code/managed-mcp.json`  
**Windows:** `C:\Program Files\ClaudeCode\managed-mcp.json`

**Exemplo:**
```json
{
  "mcpServers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/"
    },
    "sentry": {
      "type": "http",
      "url": "https://mcp.sentry.dev/mcp"
    },
    "company-internal": {
      "type": "stdio",
      "command": "/usr/local/bin/company-mcp-server",
      "args": ["--config", "/etc/company/mcp-config.json"],
      "env": {
        "COMPANY_API_URL": "https://internal.company.com"
      }
    }
  }
}
```

### Allowlists e Denylists

Controlar quais servidores usuários podem configurar.

**Em managed settings file:**
```json
{
  "allowedMcpServers": [
    // Por nome
    { "serverName": "github" },
    { "serverName": "sentry" },
    
    // Por comando (stdio apenas)
    { "serverCommand": ["npx", "-y", "@modelcontextprotocol/server-filesystem"] },
    { "serverCommand": ["python", "/usr/local/bin/approved-server.py"] }
  ],
  "deniedMcpServers": [
    // Bloquear por nome
    { "serverName": "dangerous-server" },
    
    // Bloquear por comando
    { "serverCommand": ["npx", "-y", "unapproved-package"] }
  ]
}
```

**Como funciona:**

- **allowedMcpServers undefined**: Sem restrições
- **allowedMcpServers []**: Lockdown completo
- **deniedMcpServers**: Bloqueio explícito (tem precedência sobre allowlist)

## 📊 Limites e Warnings

### Output Limits

- **Warning threshold**: 10,000 tokens
- **Default max**: 25,000 tokens
- **Configurável via env var**:

```bash
export MAX_MCP_OUTPUT_TOKENS=50000
claude
```

Útil para tools que produzem:
- Large datasets
- Detailed reports
- Extensive logs

## 📚 MCP Resources & Prompts

### Usar MCP Resources

Resources são dados que podem ser referenciados via @ mentions.

```
# No Claude Code
> @database-schema  # Reference MCP resource
> "Show me how to query the users table"
```

### MCP Prompts como Slash Commands

MCP servers podem expor prompts que viram slash commands.

```
# Server expõe prompt "/analyze-error"
> /analyze-error
# Claude executa o prompt MCP
```

## 🔄 Import de Claude Desktop

Se já tem servidores configurados no Claude Desktop:

```bash
# Import all MCP servers
claude mcp import

# Servers são importados do claude_desktop_config.json
```

## 🚀 Claude Code como MCP Server

Claude Code pode atuar como servidor MCP para outros apps:

```bash
# Iniciar Claude como stdio MCP server
claude mcp serve
```

**Uso no Claude Desktop:**

Adicionar em `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "claude-code": {
      "type": "stdio",
      "command": "claude",
      "args": ["mcp", "serve"],
      "env": {}
    }
  }
}
```

## 💡 Best Practices

1. ✅ **Use HTTP transport** para serviços cloud
2. ✅ **Project scope** para compartilhar com time
3. ✅ **User scope** para utilities pessoais
4. ✅ **Configure limits** para large outputs
5. ✅ **Use OAuth** quando disponível
6. ✅ **Documente servers** no README do projeto
7. ⚠️ **Cuidado com credentials** em project scope
8. ⚠️ **Teste autenticação** após setup

## 🐛 Troubleshooting

### Server não aparece após adicionar
```bash
# Verificar configuração
claude mcp get server-name

# Reiniciar Claude Code
```

### Erro de autenticação
```bash
# No Claude Code
> /mcp
# Re-autenticar o servidor
```

### Environment variables não funcionam
```bash
# Verificar se variável está definida
echo $API_KEY

# Definir no shell antes de iniciar Claude
export API_KEY=your-key
claude
```

## 🔗 Recursos Oficiais

- **MCP Website**: https://modelcontextprotocol.io/
- **MCP GitHub**: https://github.com/modelcontextprotocol
- **Claude MCP Docs**: https://code.claude.com/docs/en/mcp
- **MCP Spec**: https://spec.modelcontextprotocol.io/

---

**Nota:** MCP é um padrão open-source doado à Linux Foundation's Agentic AI Foundation. Continuará evoluindo com contribuições da comunidade!
