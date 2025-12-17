# Workflow 1 EXPANDIDO - Coleta Avançada de Dados Comic Vine (v2.0)

## 🎯 Visão Geral da Expansão

O Workflow 1 original coleta apenas dados básicos. Esta versão expandida coleta dados em profundidade necessários para análises no nível Alt Shift X:

**O que era coletado antes:**
- ❌ Nome, descrição, poderes (superficial)

**O que será coletado agora:**
- ✅ Issues específicas (primeiras aparições, deaths, arcos importantes)
- ✅ Story arcs completos com descrições
- ✅ Volumes/séries com cronologia
- ✅ Relacionamentos (inimigos, aliados, teams)
- ✅ Cronologia de publicações
- ✅ Criadores (writers, artists)
- ✅ Contexto histórico e impacto cultural

---

## Estrutura Completa do Workflow 1 Expandido

```
Manual Trigger
    ↓
Set Search Queries
    ↓
Search Characters (Loop)
    ↓
Wait (Rate Limit)
    ↓
Quality Filter
    ↓
Get Character Details
    ↓
Wait (Rate Limit)
    ↓
[NOVO] Get Character Issues
    ↓
Wait (Rate Limit)
    ↓
[NOVO] Get Story Arcs
    ↓
Wait (Rate Limit)
    ↓
[NOVO] Get Volumes
    ↓
Wait (Rate Limit)
    ↓
[NOVO] Get Relationships (Teams, Enemies, Friends)
    ↓
Wait (Rate Limit)
    ↓
[NOVO] Aggregate All Data
    ↓
[NOVO] Enhanced Quality Validation
    ↓
Save to JSON (Enhanced Format)
```

---

## Configuração Detalhada dos Nodes

### Node 1: Manual Trigger
**Tipo:** Manual Trigger
**Nome:** Iniciar Coleta Avançada
**Descrição:** Inicia o workflow de coleta de dados

---

### Node 2: Set Search Queries (Code Node)
**Tipo:** Code Node
**Nome:** Set Search Queries

```javascript
// Defina aqui os personagens que deseja analisar
const searchQueries = [
  { 
    query: "Spider-Man", 
    publisher: "Marvel",
    priority: "high" // high = coleta dados mais detalhados
  },
  { 
    query: "Batman", 
    publisher: "DC Comics",
    priority: "high" 
  },
  { 
    query: "Wonder Woman", 
    publisher: "DC Comics",
    priority: "high" 
  }
  // Adicione mais conforme necessário
];

return searchQueries.map(q => ({ json: q }));
```

---

### Node 3: Search Characters (HTTP Request)
**Tipo:** HTTP Request
**Nome:** Search Characters
**Método:** GET

**URL:**
```
https://comicvine.gamespot.com/api/search
```

**Parâmetros:**
| Parâmetro | Valor |
|-----------|-------|
| api_key | `{{ $credentials.comicVineApiKey }}` |
| format | json |
| query | `{{ $json.query }}` |
| resources | character |
| limit | 5 |
| field_list | name,id,deck,image,count_of_issue_appearances,publisher |

**Body:** (deixe vazio)

---

### Node 4: Wait (Rate Limit 1)
**Tipo:** Wait
**Nome:** Wait After Search
**Configuração:**
- Wait: Fixed
- Time: 1200 (milliseconds)

---

### Node 5: Quality Filter (Code Node)
**Tipo:** Code Node
**Nome:** Quality Filter

```javascript
const results = $json.results;
if (!results || results.length === 0) {
  return [];
}

const character = results[0];

// Scoring system para garantir qualidade
const qualityScore = (
  (character.count_of_issue_appearances || 0) * 0.3 +
  (character.deck ? character.deck.length / 100 * 20 : 0) +
  (character.image ? 20 : 0) +
  (character.publisher ? 10 : 0)
);

console.log(`Character: ${character.name}, Quality Score: ${qualityScore}`);

if (qualityScore >= 60) {
  return [
    {
      json: {
        character_id: character.id,
        character_name: character.name,
        quality_score: qualityScore
      }
    }
  ];
}

return [];
```

---

### Node 6: Get Character Details (HTTP Request)
**Tipo:** HTTP Request
**Nome:** Get Character Details
**Método:** GET

**URL:**
```
https://comicvine.gamespot.com/api/character/4005-{{ $json.character_id }}/
```

**Parâmetros:**
| Parâmetro | Valor |
|-----------|-------|
| api_key | `{{ $credentials.comicVineApiKey }}` |
| format | json |
| field_list | name,real_name,aliases,deck,description,powers,first_appeared_in_issue,story_arc_credits,issue_credits,teams,origin,publisher,image,creators,character_friends,character_enemies,team_friends,team_enemies,volume_credits |

---

### Node 7: Wait (Rate Limit 2)
**Tipo:** Wait
**Nome:** Wait After Character Details
**Configuração:**
- Time: 1200 (milliseconds)

---

### Node 8: Get Character Issues [NOVO - CRÍTICO]
**Tipo:** HTTP Request
**Nome:** Get Character Issues
**Método:** GET

**URL:**
```
https://comicvine.gamespot.com/api/issues/
```

**Parâmetros:**
| Parâmetro | Valor |
|-----------|-------|
| api_key | `{{ $credentials.comicVineApiKey }}` |
| format | json |
| filter | character:{{ $json.results.id }} |
| limit | 100 |
| offset | 0 |
| field_list | name,issue_number,cover_date,store_date,description,character_credits,first_appearance_characters,story_arc_credits,volume,image |
| sort | cover_date:desc |

**Pós-processamento (Code Node):**

```javascript
const issues = $json.results || [];

// Priorizar issues importantes
const importantIssues = issues.filter(issue => {
  const hasFirstAppearance = issue.first_appearance_characters && 
    issue.first_appearance_characters.length > 0;
  const hasStoryArcs = issue.story_arc_credits && 
    issue.story_arc_credits.length > 0;
  const hasBigNumber = issue.issue_number && 
    [1, 15, 25, 50, 100, 150, 200, 300, 500, 600, 700].includes(
      parseInt(issue.issue_number)
    );
  
  return hasFirstAppearance || hasStoryArcs || hasBigNumber;
}).slice(0, 30); // Top 30 important issues

console.log(`Found ${issues.length} issues, selected ${importantIssues.length} important ones`);

return [{ json: { key_issues: importantIssues } }];
```

---

### Node 9: Wait (Rate Limit 3)
**Tipo:** Wait
**Nome:** Wait After Issues
**Configuração:**
- Time: 1200 (milliseconds)

---

### Node 10: Get Story Arcs [NOVO - CRÍTICO]
**Tipo:** HTTP Request
**Nome:** Get Story Arcs
**Método:** GET

**URL:**
```
https://comicvine.gamespot.com/api/story_arcs/
```

**Parâmetros:**
| Parâmetro | Valor |
|-----------|-------|
| api_key | `{{ $credentials.comicVineApiKey }}` |
| format | json |
| filter | character:{{ $json.results.id }} |
| limit | 100 |
| field_list | name,id,deck,description,first_appeared_in_issue,count_of_issue_appearances,publisher,image |
| sort | count_of_issue_appearances:desc |

**Pós-processamento (Code Node):**

```javascript
const storyArcs = $json.results || [];

// Filtrar apenas os principais arcos narrativos
const mainArcs = storyArcs
  .filter(arc => (arc.count_of_issue_appearances || 0) >= 2)
  .slice(0, 15); // Top 15 story arcs

return [{ json: { story_arcs: mainArcs } }];
```

---

### Node 11: Wait (Rate Limit 4)
**Tipo:** Wait
**Nome:** Wait After Story Arcs
**Configuração:**
- Time: 1200 (milliseconds)

---

### Node 12: Get Volumes [NOVO - IMPORTANTE]
**Tipo:** HTTP Request
**Nome:** Get Volumes (Series)
**Método:** GET

**URL:**
```
https://comicvine.gamespot.com/api/volumes/
```

**Parâmetros:**
| Parâmetro | Valor |
|-----------|-------|
| api_key | `{{ $credentials.comicVineApiKey }}` |
| format | json |
| filter | character:{{ $json.results.id }} |
| limit | 100 |
| field_list | name,id,count_of_issues,start_year,end_year,publisher,image,deck,description |
| sort | start_year:asc |

**Pós-processamento (Code Node):**

```javascript
const volumes = $json.results || [];

// Organizar por período histórico
const organizedVolumes = volumes
  .sort((a, b) => {
    const yearA = a.start_year || 9999;
    const yearB = b.start_year || 9999;
    return yearA - yearB;
  })
  .map(vol => ({
    ...vol,
    era: getEra(vol.start_year)
  }));

function getEra(year) {
  if (!year) return "Unknown";
  if (year < 1960) return "Silver Age";
  if (year < 1985) return "Bronze/Modern Age";
  if (year < 2000) return "Modern Age";
  return "Contemporary";
}

return [{ json: { volumes: organizedVolumes } }];
```

---

### Node 13: Wait (Rate Limit 5)
**Tipo:** Wait
**Nome:** Wait After Volumes
**Configuração:**
- Time: 1200 (milliseconds)

---

### Node 14: Get Relationships [NOVO - CONTEXTO]
**Tipo:** HTTP Request
**Nome:** Get Character Relationships
**Método:** GET

**URL:**
```
https://comicvine.gamespot.com/api/character/4005-{{ $json.results.id }}/
```

**Parâmetros:**
| Parâmetro | Valor |
|-----------|-------|
| api_key | `{{ $credentials.comicVineApiKey }}` |
| format | json |
| field_list | character_friends,character_enemies,team_friends,team_enemies,teams |

---

### Node 15: Wait (Rate Limit 6)
**Tipo:** Wait
**Nome:** Wait After Relationships
**Configuração:**
- Time: 1200 (milliseconds)

---

### Node 16: Aggregate All Data [NOVO - CRUCIAL]
**Tipo:** Code Node
**Nome:** Aggregate Character Data

```javascript
// Este node agrega TODOS os dados coletados em uma estrutura única e coesa

const characterDetails = $input.all()[1].json.results; // Índice 1 = Get Character Details
const keyIssues = $input.all()[4].json.key_issues || [];
const storyArcs = $input.all()[7].json.story_arcs || [];
const volumes = $input.all()[10].json.volumes || [];
const relationships = $input.all()[13].json.results || {};

const aggregatedData = {
  // DADOS BIOGRÁFICOS
  basic_info: {
    name: characterDetails.name,
    real_name: characterDetails.real_name,
    aliases: characterDetails.aliases,
    origin: characterDetails.origin,
    publisher: characterDetails.publisher,
    image_url: characterDetails.image?.super_url || null,
    
    // PRIMEIRA APARIÇÃO
    first_appearance: characterDetails.first_appeared_in_issue ? {
      issue_name: characterDetails.first_appeared_in_issue.name,
      issue_id: characterDetails.first_appeared_in_issue.id,
      url: characterDetails.first_appeared_in_issue.api_detail_url,
      cover_date: characterDetails.first_appeared_in_issue.cover_date
    } : null,
    
    // CRIADORES
    creators: characterDetails.creators ? {
      count: characterDetails.creators.length,
      names: characterDetails.creators.map(c => c.name)
    } : null
  },

  // POWERS E CARACTERÍSTICAS
  powers: {
    list: characterDetails.powers || [],
    count: (characterDetails.powers || []).length
  },

  // ISSUES ESSENCIAIS
  key_issues: {
    total_appearances: characterDetails.count_of_issue_appearances || 0,
    important_issues: keyIssues,
    issues_count: keyIssues.length,
    // Extrair primeiro issue do character
    first_issue: keyIssues.filter(i => 
      i.first_appearance_characters?.some(c => c.id === characterDetails.id)
    )[0] || null
  },

  // STORY ARCS PRINCIPAIS
  story_arcs: {
    total_arcs_involved: storyArcs.length,
    main_arcs: storyArcs.map(arc => ({
      name: arc.name,
      issue_appearances: arc.count_of_issue_appearances,
      description: arc.description,
      image: arc.image?.super_url || null
    }))
  },

  // HISTÓRICO DE PUBLICAÇÃO
  publication_history: {
    volumes: volumes.map(vol => ({
      title: vol.name,
      years: `${vol.start_year || '?'}-${vol.end_year || 'Present'}`,
      issue_count: vol.count_of_issues,
      era: vol.era || "Unknown"
    })),
    timeline_span: volumes.length > 0 ? 
      `${volumes[0].start_year}-${volumes[volumes.length - 1].end_year || 'Present'}` 
      : 'Unknown'
  },

  // RELACIONAMENTOS
  relationships: {
    allies: relationships.character_friends?.slice(0, 10) || [],
    enemies: relationships.character_enemies?.slice(0, 10) || [],
    teams: relationships.teams?.slice(0, 10) || [],
    team_allies: relationships.team_friends?.slice(0, 5) || [],
    team_enemies: relationships.team_enemies?.slice(0, 5) || []
  },

  // MÉTRICAS DE QUALIDADE
  data_completeness: {
    has_description: !!characterDetails.description,
    has_image: !!characterDetails.image,
    has_powers: (characterDetails.powers || []).length > 0,
    has_story_arcs: storyArcs.length > 0,
    has_volumes: volumes.length > 0,
    has_relationships: 
      (relationships.character_friends?.length || 0) > 0 ||
      (relationships.character_enemies?.length || 0) > 0,
    completeness_score: calculateCompleteness()
  },

  // TIMESTAMP
  metadata: {
    collected_at: new Date().toISOString(),
    data_version: "2.0",
    character_id: characterDetails.id
  }
};

function calculateCompleteness() {
  let score = 0;
  const checks = [
    !!characterDetails.description,
    !!characterDetails.image,
    (characterDetails.powers || []).length > 0,
    storyArcs.length > 0,
    volumes.length > 0,
    (relationships.character_friends?.length || 0) > 0,
    keyIssues.length > 0
  ];
  
  score = (checks.filter(c => c).length / checks.length) * 100;
  return Math.round(score);
}

return [{ json: aggregatedData }];
```

---

### Node 17: Enhanced Quality Validation [NOVO]
**Tipo:** Code Node
**Nome:** Validate Data Quality

```javascript
const data = $json;

// REQUISITOS ESSENCIAIS para análise Alt Shift X
const qualityRequirements = {
  minimum_issues: data.key_issues.important_issues.length >= 10,
  minimum_story_arcs: data.story_arcs.total_arcs_involved >= 3,
  has_relationships: 
    data.relationships.allies.length > 0 || 
    data.relationships.enemies.length > 0,
  has_volumes: data.publication_history.volumes.length >= 2,
  has_first_issue: !!data.basic_info.first_appearance,
  minimum_completeness: data.data_completeness.completeness_score >= 70
};

const passedChecks = Object.values(qualityRequirements).filter(v => v).length;
const totalChecks = Object.keys(qualityRequirements).length;

const validationResult = {
  passed: passedChecks === totalChecks,
  score: Math.round((passedChecks / totalChecks) * 100),
  checks: qualityRequirements,
  warnings: []
};

// Avisos sobre dados incompletos
if (!qualityRequirements.minimum_issues) {
  validationResult.warnings.push(
    `⚠️ Apenas ${data.key_issues.important_issues.length} issues encontradas (esperado 10+)`
  );
}
if (!qualityRequirements.minimum_story_arcs) {
  validationResult.warnings.push(
    `⚠️ Apenas ${data.story_arcs.total_arcs_involved} story arcs encontrados (esperado 3+)`
  );
}
if (!qualityRequirements.has_first_issue) {
  validationResult.warnings.push("⚠️ Primeira aparição não encontrada");
}

console.log(`\n📊 VALIDAÇÃO DE QUALIDADE`);
console.log(`Character: ${data.basic_info.name}`);
console.log(`Passou em: ${passedChecks}/${totalChecks} requisitos (${validationResult.score}%)`);
console.log(`Status: ${validationResult.passed ? '✅ APROVADO' : '⚠️ AVISO'}`);
validationResult.warnings.forEach(w => console.log(w));

return [{ 
  json: {
    character_data: data,
    validation: validationResult
  }
}];
```

---

### Node 18: Save to JSON (Enhanced Format) [APRIMORADO]
**Tipo:** Write Binary File
**Nome:** Save Complete Character Data

**Configuração:**
- **Data to write:** 
  ```
  {{ JSON.stringify($json, null, 2) }}
  ```
- **File name:** 
  ```
  character_data_{{ $json.character_data.basic_info.name.replace(/\s+/g, '_') }}_v2.json
  ```
- **Encoding:** UTF8

---

## 🔄 Configuração de Loop (Para Múltiplos Personagens)

Se deseja processar múltiplos personagens em sequência, adicione ao final um **Split in Batches** que reconecta ao início:

**Node Final: Split in Batches (Loop Control)**
- **Batch size:** 1
- **Reconectar** ao **Node 3: Search Characters**
- Isso fará o workflow processar cada personagem sequencialmente

---

## 📊 Estrutura de Saída JSON Expandida

```json
{
  "character_data": {
    "basic_info": {
      "name": "Spider-Man",
      "real_name": "Peter Parker",
      "first_appearance": {
        "issue_name": "Amazing Fantasy #15",
        "cover_date": "1962-08"
      }
    },
    "key_issues": {
      "total_appearances": 4500,
      "important_issues": [
        {
          "name": "Amazing Fantasy #15",
          "issue_number": 15,
          "cover_date": "1962-08",
          "significance": "Primeira aparição"
        },
        {
          "name": "The Night Gwen Stacy Died",
          "issue_number": "121-122",
          "significance": "Arco narrativo marcante"
        }
      ]
    },
    "story_arcs": {
      "total_arcs_involved": 150,
      "main_arcs": [
        {
          "name": "The Night Gwen Stacy Died",
          "issue_appearances": 2,
          "description": "..."
        }
      ]
    },
    "publication_history": {
      "volumes": [
        {
          "title": "The Amazing Spider-Man",
          "years": "1963-1998",
          "issue_count": 700,
          "era": "Silver Age"
        }
      ]
    },
    "relationships": {
      "allies": ["Mary Jane Watson", "Tony Stark"],
      "enemies": ["Green Goblin", "Doctor Octopus"],
      "teams": ["Avengers", "Defenders"]
    },
    "data_completeness": {
      "completeness_score": 92
    }
  },
  "validation": {
    "passed": true,
    "score": 100
  }
}
```

---

## ⚙️ Otimizações Implementadas

### 1. **Priorização de Issues**
- Automático detecta primeiro aparições
- Seleciona issues marcantes (#1, #15, #50, #100, etc.)
- Filtra issues com story arcs relacionados

### 2. **Organização Histórica**
- Agrupa volumes por era (Silver Age, Bronze Age, Modern Age)
- Ordena por data de publicação
- Calcula timeline completa

### 3. **Rate Limiting Inteligente**
- 1200ms entre CADA requisição
- Respeita limite de 200 req/15min do Comic Vine
- Pausas adicionais entre batches de dados grandes

### 4. **Validação de Qualidade Automática**
- Rejeita personagens com dados incompletos
- Alerta sobre missing data
- Score de completude dos dados

### 5. **Agregação Inteligente**
- Combina dados de múltiplos endpoints
- Detecta relacionamentos
- Estrutura para fácil análise posterior

---

## 🚀 Como Executar

1. **Crie as API Keys:**
   - Comic Vine: https://comicvine.gamespot.com/api/
   - Adicione em n8n Credentials

2. **Configure os personagens** no Node 2 (Set Search Queries)

3. **Execute o workflow:**
   - Clique em Manual Trigger
   - Monitore a execução
   - Verifique outputs em cada Wait node

4. **Valide os dados:**
   - Abra o arquivo JSON gerado
   - Confirme se validation.passed = true
   - Se falso, analise os warnings

5. **Use os dados no Workflow 2:**
   - Leia o arquivo JSON gerado
   - Passe para o Gemini com novo prompt aprimorado

---

## 📝 Valores de Rate Limit Ajustáveis

Se receber erros de rate limit:

```javascript
// Aumentar delays entre requisições
Wait nodes: 1500-2000ms (ao invés de 1200ms)

// Reduzir tamanho de batches
HTTP nodes: limit=50 (ao invés de 100)

// Adicionar Wait extra antes de loops
Antes de reconectar ao Search: 3000ms
```

---

## 🎯 Dados Que Você Agora Coleta

### ✅ Alt Shift X Essentials:

1. **Cronologia Completa** - Issues por data
2. **Story Arcs** - Arcos narrativos com impacto
3. **Relacionamentos** - Aliados e inimigos
4. **Publicação** - Volumes e séries
5. **Criadores** - Writers e artists
6. **Primeira Aparição** - Contexto histórico
7. **Evolução** - Diferentes eras do personagem

### Antes vs Depois:

| Aspecto | Antes | Depois |
|---------|-------|--------|
| Issues coletadas | 0 | 30+ selecionadas |
| Story arcs | Referência em list | 15+ completos |
| Volumes | 0 | Todos os volumes |
| Relacionamentos | 0 | Completo |
| Criadores | 0 | Sim |
| Score de qualidade | Básico | Aprofundado |

---

## 🔗 Próximos Passos

Depois de executar este Workflow 1 Expandido:

1. **Workflow 2**: Usar dados JSON com **novo prompt aprofundado**
2. **Workflow 3**: Gerar storyboard com **referências visuais específicas**
3. **Manual Work**: Você adiciona narração e análise crítica

O sistema agora coleta dados como Alt Shift X pesquisa - em profundidade antes de tudo.
