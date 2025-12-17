# 🔍 Guia Completo: URLs e Query Parameters da Comic Vine API

## 📚 Documentação Oficial Consultada

Consultei a documentação oficial do Comic Vine em: https://comicvine.gamespot.com/api/documentation

Aqui está tudo que você precisa para configurar corretamente cada HTTP Request.

---

## 🏗️ ESTRUTURA FUNDAMENTAL

### Base URL para Todas as Requisições

```
https://comicvine.gamespot.com/api/
```

### Padrão de URLs da Comic Vine API

**Para LISTAS (múltiplos resultados):**
```
https://comicvine.gamespot.com/api/[resource]s/
                                       ↑
                              Plural! Sempre com "s"
```

**Para DETALHES (um item específico):**
```
https://comicvine.gamespot.com/api/[resource]/[type]-[id]/
                                     ↑                 ↑
                              Singular!          ID do item
```

---

## ✅ TODOS OS ENDPOINTS DISPONÍVEIS

### TIPO 1: Listas (Plural + Query Parameters)

Essas URLs SEMPRE recebem query parameters (limit, offset, filter, sort, etc.)

| Endpoint | Completo | Para Quê |
|----------|----------|----------|
| **characters** | `https://comicvine.gamespot.com/api/characters/` | Buscar múltiplos personagens |
| **issues** | `https://comicvine.gamespot.com/api/issues/` | Buscar múltiplos quadrinhos |
| **story_arcs** | `https://comicvine.gamespot.com/api/story_arcs/` | Buscar múltiplos arcos |
| **volumes** | `https://comicvine.gamespot.com/api/volumes/` | Buscar múltiplas séries |
| **teams** | `https://comicvine.gamespot.com/api/teams/` | Buscar múltiplos times |
| **locations** | `https://comicvine.gamespot.com/api/locations/` | Buscar múltiplas locações |
| **concepts** | `https://comicvine.gamespot.com/api/concepts/` | Buscar múltiplos conceitos |
| **objects** | `https://comicvine.gamespot.com/api/objects/` | Buscar múltiplos objetos |
| **people** | `https://comicvine.gamespot.com/api/people/` | Buscar múltiplas pessoas (criadores) |
| **powers** | `https://comicvine.gamespot.com/api/powers/` | Buscar múltiplos poderes |
| **publishers** | `https://comicvine.gamespot.com/api/publishers/` | Buscar múltiplas editoras |
| **search** | `https://comicvine.gamespot.com/api/search/` | Busca genérica (qual tipo de recurso?) |

### TIPO 2: Detalhes (Singular + ID)

Essas URLs retornam UM item específico. **Geralmente NÃO precisam de query parameters** (mas podem ter `format` e `field_list`).

| Endpoint | Completo | Exemplo | Para Quê |
|----------|----------|---------|----------|
| **character** | `/character/4005-[id]/` | `/character/4005-5760/` | Detalhes de 1 personagem |
| **issue** | `/issue/4000-[id]/` | `/issue/4000-123456/` | Detalhes de 1 quadrinho |
| **story_arc** | `/story_arc/4045-[id]/` | `/story_arc/4045-1234/` | Detalhes de 1 arco |
| **volume** | `/volume/4050-[id]/` | `/volume/4050-1234/` | Detalhes de 1 série |
| **team** | `/team/4060-[id]/` | `/team/4060-1234/` | Detalhes de 1 time |
| **location** | `/location/4035-[id]/` | `/location/4035-1234/` | Detalhes de 1 locação |
| **concept** | `/concept/4015-[id]/` | `/concept/4015-1234/` | Detalhes de 1 conceito |
| **object** | `/object/4055-[id]/` | `/object/4055-1234/` | Detalhes de 1 objeto |
| **person** | `/person/4040-[id]/` | `/person/4040-1234/` | Detalhes de 1 pessoa |
| **power** | `/power/4025-[id]/` | `/power/4025-1234/` | Detalhes de 1 poder |
| **publisher** | `/publisher/4010-[id]/` | `/publisher/4010-1234/` | Detalhes de 1 editora |

---

## 🎯 ENTENDENDO OS IDs NA URL

### O Padrão: `[type]-[id]`

Na Comic Vine, cada recurso tem um tipo e um ID:

```
/character/4005-5760/
           ↑     ↑
        Tipo   ID do personagem

4005 = Código tipo SEMPRE é 4005 para characters
5760 = ID específico do personagem (Spider-Man = 5760)
```

### Códigos de Tipo (Type IDs)

```
4005 = character
4000 = issue
4045 = story_arc
4050 = volume
4060 = team
4035 = location
4015 = concept
4055 = object
4040 = person
4025 = power
4010 = publisher
```

### Exemplo Prático

**Spider-Man (personagem):**
```
ID no Comic Vine: 5760
Type para character: 4005
URL: https://comicvine.gamespot.com/api/character/4005-5760/
```

**Amazing Spider-Man #1 (issue):**
```
ID no Comic Vine: 458576
Type para issue: 4000
URL: https://comicvine.gamespot.com/api/issue/4000-458576/
```

---

## 📋 QUERY PARAMETERS (O que você coloca depois do ?)

### Parâmetros Universais (Funcionam em TODAS as listas)

| Parâmetro | Tipo | Exemplo | Descrição |
|-----------|------|---------|-----------|
| **api_key** | Obrigatório | `{{ $credentials.comicVineApiKey }}` | Sua chave da API (sempre necessário) |
| **format** | Obrigatório | `json` | Formato da resposta (xml, json, jsonp) |
| **field_list** | Opcional | `name,id,description,image` | Quais campos retornar (reduz tamanho) |
| **limit** | Opcional | `100` | Quantos resultados por página (máx 100) |
| **offset** | Opcional | `0` | A partir de qual resultado começar |

### Parâmetros para Listas Específicas

| Parâmetro | Uso | Exemplo |
|-----------|-----|---------|
| **sort** | Ordenação | `cover_date:desc` ou `name:asc` |
| **filter** | Filtrar resultados | `character:5760` ou `name:Batman` |

### Parâmetro especial para /search

| Parâmetro | Descrição |
|-----------|-----------|
| **query** | O que procurar (obrigatório) |
| **resources** | Quais tipos buscar (character, issue, story_arc, etc.) |

---

## 🔧 EXEMPLOS PRÁTICOS: COMO MONTAR AS URLs

### EXEMPLO 1: Buscar múltiplos personagens

**O QUE FAZER:** Listar todos os personagens da Marvel

**URL Base:** `/characters/`

**Query Parameters:**
```
- api_key: (sua chave)
- format: json
- filter: publisher:Marvel
- limit: 100
```

**URL Completa:**
```
https://comicvine.gamespot.com/api/characters/?api_key=abc123&format=json&filter=publisher:Marvel&limit=100
```

**No n8n:**
```
URL: https://comicvine.gamespot.com/api/characters/
Method: GET
Query Parameters:
  - api_key: {{ $credentials.comicVineApiKey }}
  - format: json
  - filter: publisher:Marvel
  - limit: 100
```

---

### EXEMPLO 2: Buscar issues de um personagem

**O QUE FAZER:** Encontrar todos os quadrinhos de Spider-Man

**URL Base:** `/issues/`

**Query Parameters:**
```
- api_key: (sua chave)
- format: json
- filter: character:5760
- limit: 100
- sort: cover_date:desc
- field_list: name,issue_number,cover_date,volume
```

**URL Completa:**
```
https://comicvine.gamespot.com/api/issues/?api_key=abc123&format=json&filter=character:5760&limit=100&sort=cover_date:desc&field_list=name,issue_number,cover_date,volume
```

**No n8n:**
```
URL: https://comicvine.gamespot.com/api/issues/
Method: GET
Query Parameters:
  - api_key: {{ $credentials.comicVineApiKey }}
  - format: json
  - filter: character:{{ $json.results.id }}
  - limit: 100
  - sort: cover_date:desc
  - field_list: name,issue_number,cover_date,volume
```

---

### EXEMPLO 3: Obter detalhes de UM personagem

**O QUE FAZER:** Pegar todos os dados de Spider-Man

**URL Padrão:** `/character/4005-[id]/`

**Se o ID é 5760:**
```
https://comicvine.gamespot.com/api/character/4005-5760/
```

**Com query parameters opcionais:**
```
https://comicvine.gamespot.com/api/character/4005-5760/?api_key=abc123&format=json&field_list=name,real_name,description,powers,teams,character_enemies,character_friends
```

**No n8n:**
```
URL: https://comicvine.gamespot.com/api/character/4005-{{ $json.character_id }}/
Method: GET
Query Parameters (opcionais):
  - api_key: {{ $credentials.comicVineApiKey }}
  - format: json
  - field_list: name,real_name,description,powers,teams,character_enemies,character_friends
```

---

### EXEMPLO 4: Buscar story arcs de um personagem

**O QUE FAZER:** Encontrar todos os arcos narrativos de Batman

**URL Base:** `/story_arcs/`

**Query Parameters:**
```
- api_key: (sua chave)
- format: json
- filter: character:430 (Batman's ID)
- limit: 100
```

**URL Completa:**
```
https://comicvine.gamespot.com/api/story_arcs/?api_key=abc123&format=json&filter=character:430&limit=100
```

**No n8n:**
```
URL: https://comicvine.gamespot.com/api/story_arcs/
Method: GET
Query Parameters:
  - api_key: {{ $credentials.comicVineApiKey }}
  - format: json
  - filter: character:{{ $json.results.id }}
  - limit: 100
```

---

### EXEMPLO 5: Busca genérica (Search)

**O QUE FAZER:** Procurar por "Spider-Man" em tudo

**URL Base:** `/search/`

**Query Parameters:**
```
- api_key: (sua chave)
- format: json
- query: Spider-Man
- resources: character,issue,story_arc,volume
- limit: 10
```

**URL Completa:**
```
https://comicvine.gamespot.com/api/search/?api_key=abc123&format=json&query=Spider-Man&resources=character,issue,story_arc,volume&limit=10
```

**No n8n:**
```
URL: https://comicvine.gamespot.com/api/search/
Method: GET
Query Parameters:
  - api_key: {{ $credentials.comicVineApiKey }}
  - format: json
  - query: {{ $json.query }}
  - resources: character,issue,story_arc,volume
  - limit: 10
```

---

## 🎯 COMO DESCOBRIR SE DEVE USAR SINGULAR OU PLURAL

### Regra Simples

**Use PLURAL (`/characters/`) quando:**
- Você quer buscar MÚLTIPLOS items
- Você vai usar `filter`, `limit`, `offset`, ou `sort`
- A resposta é uma LISTA de resultados

**Use SINGULAR (`/character/4005-[id]/`) quando:**
- Você já sabe o ID do item
- Você quer DETALHES completos de UM item específico
- Você NÃO precisa de filtros

### Teste de Confirmação

**URL Plural retorna:**
```json
{
  "status_code": 1,
  "results": [ { ... }, { ... } ],  ← LISTA!
  "number_of_page_results": 50
}
```

**URL Singular retorna:**
```json
{
  "status_code": 1,
  "results": { "id": 5760, "name": "Spider-Man", ... }  ← OBJETO!
}
```

---

## 🔍 FILTROS DISPONÍVEIS POR ENDPOINT

### /characters/ (Lista de Personagens)

**Parâmetros suportados para `filter`:**
```
publisher:Marvel
name:Batman
count_of_issue_appearances:100
gender:Male
```

**Exemplos:**
```
filter=publisher:Marvel
filter=name:Spider-Man
filter=gender:Female
```

### /issues/ (Lista de Quadrinhos)

**Parâmetros suportados para `filter`:**
```
character:5760
volume:4025-63412
cover_date:2020-01-01|2020-12-31
```

**Exemplos:**
```
filter=character:5760
filter=volume:4025-63412
filter=cover_date:2020-01-01|2020-12-31
```

### /story_arcs/ (Lista de Arcos)

**Parâmetros suportados para `filter`:**
```
character:5760
name:Civil War
```

**Exemplos:**
```
filter=character:5760
filter=name:Civil+War
```

### /volumes/ (Lista de Séries)

**Parâmetros suportados para `filter`:**
```
publisher:Marvel
name:Amazing Spider-Man
start_year:1963
```

**Exemplos:**
```
filter=publisher:Marvel
filter=start_year:1963
```

---

## 📊 TABELA DE DECISÃO: QUAL URL USAR?

```
Você quer...                          → Use...
────────────────────────────────────────────────────────────────

Listar personagens?                  → /characters/
  + com filtros?                     → /characters/?filter=...

Detalhes de UM personagem?           → /character/4005-[id]/
  + com field_list?                  → /character/4005-[id]/?field_list=...

Listar quadrinhos?                   → /issues/
  + de um personagem?                → /issues/?filter=character:[id]
  + ordenados por data?              → /issues/?sort=cover_date:desc

Detalhes de UM quadrinho?            → /issue/4000-[id]/

Listar story arcs?                   → /story_arcs/
  + de um personagem?                → /story_arcs/?filter=character:[id]

Detalhes de UM arco?                 → /story_arc/4045-[id]/

Listar volumes (séries)?             → /volumes/
  + de uma editora?                  → /volumes/?filter=publisher:Marvel

Detalhes de UM volume?               → /volume/4050-[id]/

Busca genérica?                      → /search/?query=...&resources=...
```

---

## ⚠️ ERROS COMUNS

### ERRO 1: Confundir singular/plural
❌ ERRADO:
```
URL: https://comicvine.gamespot.com/api/character/
(singular quando deveria ser plural para listar)
```

✅ CORRETO:
```
URL: https://comicvine.gamespot.com/api/characters/
(plural para listar múltiplos)
```

### ERRO 2: Esquecer o Type ID no singular
❌ ERRADO:
```
URL: https://comicvine.gamespot.com/api/character/5760/
(falta o type 4005)
```

✅ CORRETO:
```
URL: https://comicvine.gamespot.com/api/character/4005-5760/
(type-id correto)
```

### ERRO 3: Usar query parameters em URL singular
❌ Pode funcionar, mas desnecessário:
```
URL: https://comicvine.gamespot.com/api/character/4005-5760/?filter=something
(filter não faz sentido para um item específico)
```

✅ CORRETO:
```
URL: https://comicvine.gamespot.com/api/character/4005-5760/
(sem filtros, já estou pedindo um item específico)
```

---

## 📝 RESUMO: COMO DESCOBRIR TUDO SOZINHO

**Sempre que tiver dúvida:**

1. **Quer MÚLTIPLOS resultados?**
   - Use a forma PLURAL: `/characters/`, `/issues/`, `/story_arcs/`
   - Coloque query parameters para filtrar
   - Exemplo: `/characters/?filter=publisher:Marvel&limit=100`

2. **Quer DETALHES de UM item?**
   - Use a forma SINGULAR: `/character/4005-[id]/`
   - O ID vem do resultado anterior ou você descobre com /search/
   - Exemplo: `/character/4005-5760/`

3. **Não sabe o ID?**
   - Use `/search/?query=nome&resources=character`
   - Você receberá a lista com IDs
   - Use o ID na URL singular

4. **Dúvida sobre filtros?**
   - Consulte a documentação para aquele endpoint
   - Ou tente com filter simples: `filter=name:valor`

---

## 🔗 Sua Prática Imediata

Você mencionou que viu:
- `/search/` ← Para buscar
- `/character/4005-{{ $json.character_id }}/` ← Para detalhes de 1 personagem

Agora você entende:
- `/search/` = busca genérica (plural, com query params)
- `/character/4005-[id]/` = detalhes de 1 personagem (singular, type-id)

**Próximo passo:** Tente construir você mesmo:
- `/issues/` com `filter=character:{{ $json.character_id }}`
- `/story_arcs/` com `filter=character:{{ $json.character_id }}`
- `/volumes/` com `filter=character:{{ $json.character_id }}`

Todos seguem o mesmo padrão! 🎉
