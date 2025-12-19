# n8n HTTP Request Node - Advanced Patterns

## 📋 Visão Geral

O HTTP Request node é um dos nós mais versáteis do n8n, permitindo fazer requisições HTTP para qualquer API REST. Este guia cobre padrões avançados incluindo retry logic, pagination, error handling e otimizações.

## 🎯 Configuração Básica

### Parâmetros Principais

**Method**: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS

**URL**: Endpoint completo ou base URL

**Authentication**: 
- Predefined Credential Type (recomendado)
- Generic Auth (Basic, OAuth1/2, Header, Query, etc)

## 🔄 Pagination - Paginação Avançada

### Modo 1: Response Contains Next URL

Quando a API retorna a URL da próxima página na resposta.

```javascript
// Configuração
Pagination Mode: Response Contains Next URL
Next URL: {{ $response.body.next }}
// ou
Next URL: {{ $response.body.pagination.nextPageUrl }}
```

**Exemplo Real - GitHub API:**
```javascript
// A resposta contém headers com link
Next URL: {{ $response.headers.link?.match(/<([^>]+)>;\s*rel="next"/)?.[1] }}
```

### Modo 2: Update Parameter (Page Number)

Para APIs que usam número de página.

```javascript
// Configuração
Pagination Mode: Update a Parameter in Each Request
Type: Query
Name: page
Value: {{ $pageCount + 1 }}

// Complete When
{{ !$response.body.data || $response.body.data.length === 0 }}
```

**Exemplo com Offset:**
```javascript
// Para APIs que usam offset em vez de page
Name: offset
Value: {{ $pageCount * 100 }}  // 100 items por página

// Complete When
{{ $response.body.results.length < 100 }}
```

### Modo 3: Cursor-Based Pagination

Para APIs que usam cursors.

```javascript
// Configuração
Type: Body (JSON)
Name: cursor
Value: {{ $response.body.nextCursor || $response.body.pagination?.cursor }}

// Complete When
{{ !$response.body.nextCursor }}
```

### Variáveis Disponíveis em Pagination

```javascript
$pageCount  // Número de páginas já buscadas (começa em 0)
$request    // Objeto da requisição atual
$response   // Objeto da resposta
  - $response.body
  - $response.headers
  - $response.statusCode
```

## 🛡️ Error Handling - Tratamento de Erros

### Configuração de Retry

**Options > Retry On Fail:**
```
Max Tries: 3
Wait Between Tries (ms): 1000
```

### Never Error Option

**Options > Response > Never Error**: ON

Útil quando você quer processar erros manualmente.

```javascript
// Code node após HTTP Request
if ($input.first().json.statusCode >= 400) {
  // Tratar erro
  throw new Error(`API Error: ${$input.first().json.body.message}`);
}
```

### Tratamento de Rate Limits

```javascript
// Function node antes do HTTP Request
const RATE_LIMIT_DELAY = 1000; // 1 segundo
const lastRequestTime = $execution.getGlobalVariable('lastApiCall') || 0;
const now = Date.now();
const timeSinceLastRequest = now - lastRequestTime;

if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
  await new Promise(resolve => 
    setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest)
  );
}

$execution.setGlobalVariable('lastApiCall', Date.now());
return $input.all();
```

## 🎨 Query Parameters - Padrões Avançados

### Array Format Options

**Options > Array Format in Query Parameters:**

```javascript
// No Brackets: foo=bar&foo=qux
// Brackets Only: foo[]=bar&foo[]=qux
// Brackets with Indices: foo[0]=bar&foo[1]=qux
```

**Exemplo Dinâmico:**
```javascript
// Send Query Parameters: Using Fields Below
Add Parameter:
  Name: tags
  Value: {{ $json.tags.join(',') }}
```

### Query Parameters from Object

```javascript
// Send Query Parameters: Using JSON
{
  "page": {{ $json.currentPage }},
  "limit": 50,
  "sort": "created_at",
  "order": "desc",
  "filter[status]": "active"
}
```

## 📤 Request Body - Padrões Avançados

### JSON Body com Dados Dinâmicos

```javascript
// Send Body: ON
// Body Content Type: JSON
// Specify Body: Using JSON

{
  "user": {
    "name": "{{ $json.name }}",
    "email": "{{ $json.email }}",
    "metadata": {{ $json.metadata }}  // Objeto completo
  },
  "timestamp": "{{ new Date().toISOString() }}",
  "items": {{ JSON.stringify($json.items) }}
}
```

### Form Data com Arquivo

```javascript
// Body Content Type: Form-Data
// Add Parameter:

Parameter Type: Form Data
Name: file
Value: [Reference to binary data]

Parameter Type: n8n Binary File
Name: attachment
Input Data Field Name: data
```

### Raw Body com Template

```javascript
// Body Content Type: Raw
// Content Type: application/xml

<?xml version="1.0"?>
<request>
  <user>
    <id>{{ $json.userId }}</id>
    <action>{{ $json.action }}</action>
  </user>
</request>
```

## 🔐 Authentication - Padrões Avançados

### OAuth2 com Token Refresh

```javascript
// Predefined Credential Type: OAuth2 API
// Grant Type: Authorization Code
// Access Token URL: https://api.example.com/oauth/token
// Authorization URL: https://api.example.com/oauth/authorize
// Scope: read write
```

### Custom Header Auth

```javascript
// Send Headers: Using Fields Below
Add Parameter:
  Name: Authorization
  Value: Bearer {{ $credentials.apiToken }}
  
Add Parameter:
  Name: X-API-Key
  Value: {{ $credentials.apiKey }}
```

### API Key em Query

```javascript
// Authentication: Query Auth
// Name: api_key
// Value: [From credentials]
```

## 🚀 Performance Optimization

### Batching Requests

**Options > Batching:**
```
Items per Batch: 10
Batch Interval (ms): 100
```

Útil para evitar sobrecarga do servidor.

### Parallel Requests com SplitInBatches

```javascript
// Workflow:
// 1. Code node - Preparar lista
// 2. SplitInBatches - Dividir em lotes
// 3. HTTP Request - Fazer requests em paralelo
// 4. Loop back até completar
```

### Timeout Configuration

**Options > Timeout:**
```
Timeout (ms): 30000  // 30 segundos
```

## 📊 Response Handling

### Include Headers and Status

**Options > Response > Include Response Headers and Status:** ON

```javascript
// Output incluirá:
{
  "headers": { ... },
  "statusCode": 200,
  "body": { ... }
}
```

### Response Format Options

```javascript
// Response Format: Autodetect (padrão)
// Response Format: JSON
// Response Format: Text
// Response Format: File (Put Output in Field: fileData)
```

### Extract Specific Fields

```javascript
// Code node após HTTP Request
const items = $input.all();
return items.map(item => ({
  json: {
    id: item.json.body.data.id,
    name: item.json.body.data.attributes.name,
    createdAt: item.json.body.data.attributes.created_at
  }
}));
```

## 🔧 Advanced Patterns

### Pattern 1: Retry com Backoff Exponencial

```javascript
// Code node wrapper
async function fetchWithBackoff(url, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Faz a requisição
      return await makeRequest(url);
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;
      
      // Backoff exponencial: 1s, 2s, 4s, 8s...
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

### Pattern 2: Conditional Requests

```javascript
// HTTP Request com expressão no URL
URL: {{ $json.type === 'user' ? 'https://api.example.com/users' : 'https://api.example.com/groups' }}

// Headers condicionais
Name: X-Custom-Header
Value: {{ $json.isPremium ? 'premium-token' : 'basic-token' }}
```

### Pattern 3: Dynamic Endpoint Construction

```javascript
// Code node antes do HTTP Request
const baseUrl = 'https://api.example.com';
const endpoint = $json.resource;
const id = $json.id;

return [{
  json: {
    ...$json,
    fullUrl: `${baseUrl}/${endpoint}/${id}`,
    queryParams: {
      include: ['details', 'metadata'],
      expand: true
    }
  }
}];
```

### Pattern 4: Response Caching

```javascript
// Function node com cache
const cacheKey = `api_${$json.endpoint}_${$json.params}`;
const cached = $execution.getGlobalVariable(cacheKey);

if (cached && Date.now() - cached.timestamp < 300000) { // 5 min
  return [{ json: cached.data }];
}

// Continue para HTTP Request
// Depois, em outro Function node:
$execution.setGlobalVariable(cacheKey, {
  data: $input.first().json,
  timestamp: Date.now()
});
```

## 📝 Import cURL Command

**Feature no Node:**
- Clique em "Import cURL"
- Cole o comando cURL
- n8n configura automaticamente os parâmetros

**Exemplo:**
```bash
curl -X POST https://api.example.com/users \
  -H "Authorization: Bearer token123" \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com"}'
```

## 🐛 Debugging Tips

### 1. Use o Browser Developer Tools
```javascript
// No Code node
console.log('Request:', $input.first().json);
console.log('Response:', $response);
```

### 2. Webhook para Inspecionar Requests
- Crie um Webhook node
- Use como destino temporário
- Inspecione o que está sendo enviado

### 3. HTTP Request Logging
```javascript
// Options > Response > Include Response Headers: ON
// Depois analise headers, status, body completo
```

## 📚 Exemplos Práticos

### Exemplo 1: REST API com Paginação Completa
```javascript
// HTTP Request Settings:
URL: https://api.example.com/items
Method: GET
Query Parameters:
  - page: {{ $pageCount + 1 }}
  - per_page: 100

Pagination:
  Mode: Update a Parameter in Each Request
  Complete When: {{ $response.body.length < 100 }}
```

### Exemplo 2: GraphQL Request
```javascript
Method: POST
URL: https://api.example.com/graphql
Body Content Type: JSON
Body:
{
  "query": "query { users(first: 10) { id name email } }",
  "variables": {{ JSON.stringify($json.variables) }}
}
```

### Exemplo 3: Multipart Upload
```javascript
Body Content Type: Form-Data
Parameters:
  - Type: Form Data, Name: title, Value: {{ $json.title }}
  - Type: n8n Binary File, Name: file, Field: fileData
```

---

**Recursos Oficiais:**
- [HTTP Request Docs](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/)
- [Pagination Guide](https://docs.n8n.io/code/cookbook/http-node/pagination/)
- [Common Issues](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/common-issues/)
