# Passo a Passo - Workflow n8n para Vídeos de Quadrinhos

## Configuração Inicial Obrigatória

### 1. API Keys Necessárias
- **Comic Vine API Key**: Acesse https://comicvine.gamespot.com/api/ → crie conta GameSpot gratuita → gere API key
- **OpenRouter API Key**: Acesse https://openrouter.ai → crie conta → gere API key para usar Gemini 2.5 Pro

### 2. Instalação n8n
- **Opção 1 (Recomendada)**: n8n Cloud em https://n8n.io
- **Opção 2**: Docker self-hosted:
  ```bash
  docker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n
  ```

## Workflow 1: Coleta de Dados Comic Vine

### Estrutura do Workflow
```
Manual Trigger → Set Search Queries → Search Characters → Wait → Quality Filter → Get Details → Save to JSON
```

### Configuração dos Nodes

#### Node 1: Manual Trigger
- Tipo: `Manual Trigger`
- Nome: `Iniciar Coleta`

#### Node 2: Set Search Queries (Code Node)
```javascript
const searchQueries = [
  { query: "Spider-Man", publisher: "Marvel" },
  { query: "Batman", publisher: "DC Comics" }
];
return searchQueries;
```

#### Node 3: Search Characters (HTTP Request)
- URL: `https://comicvine.gamespot.com/api/search`
- Método: GET
- Parâmetros:
  - api_key: **SUA_API_KEY_COMIC_VINE_AQUI**
  - format: json
  - query: `{{ $json.query }}`
  - resources: character
  - limit: 10
  - field_list: name,id,deck,image,count_of_issue_appearances,publisher

#### Node 4: Wait (Rate Limit)
- Tipo: Wait
- Valor: 1200 milliseconds

#### Node 5: Quality Filter (Code Node)
```javascript
const results = $input.first().json.results;
if (!results || results.length === 0) {
  return [];
}

const character = results[0];
const qualityScore = (
  (character.count_of_issue_appearances || 0) * 0.3 +
  (character.deck ? character.deck.length / 100 * 20 : 0) +
  (character.image ? 20 : 0) +
  (character.publisher ? 10 : 0)
);

if (qualityScore >= 60) {
  return [{
    json: {
      character_id: character.id,
      name: character.name,
      quality_score: qualityScore
    }
  }];
}
return [];
```

#### Node 6: Get Character Details (HTTP Request)
- URL: `https://comicvine.gamespot.com/api/character/4005-{{ $json.character_id }}/`
- Método: GET
- Parâmetros:
  - api_key: **SUA_API_KEY_COMIC_VINE_AQUI**
  - format: json
  - field_list: name,real_name,aliases,deck,description,powers,first_appeared_in_issue,story_arc_credits,issue_credits,teams,origin,publisher,image

#### Node 7: Wait (Rate Limit)
- Tipo: Wait
- Valor: 1200 milliseconds

#### Node 8: Split in Batches
- Tipo: Split in Batches
- Batch size: 1

#### Node 9: Save to JSON
- Tipo: Write Binary File
- Nome do arquivo: `n8n_output_json.json`

## Workflow 2: Geração de Script com Gemini

### Estrutura do Workflow
```
Read JSON → Prepare Context → Gemini Script → Parse Response → Save Script
```

### Configuração dos Nodes

#### Node 1: Read Comic Data
- Tipo: Read Binary File
- Nome do arquivo: `n8n_output_json.json`

#### Node 2: Prepare Context (Code Node)
```javascript
const characters = JSON.parse($json.data);
const contextData = characters.map(char => ({
  name: char.results.name,
  description: char.results.description,
  powers: char.results.powers,
  first_appearance: char.results.first_appeared_in_issue,
  story_arcs: char.results.story_arc_credits
}));

return [{ json: { characters: contextData } }];
```

#### Node 3: Prepare Messages (Code Node)
```javascript
const characters = $json.characters;

const systemPrompt = `You are an expert video essay scriptwriter specializing in comic book analysis, inspired by the analytical style of Alt Shift X.

STYLE GUIDELINES:
- Conversational yet analytical tone (first person allowed)
- Clear thesis stated early
- Use specific examples with issue citations
- Balance entertainment with education

OUTPUT FORMAT (JSON):
{
  "video_title": "string",
  "duration_estimate": "10-15 minutes",
  "scenes": [
    {
      "scene_id": 1,
      "scene_name": "Hook",
      "duration": 15,
      "narration_text": "Full narration script...",
      "visual_cues": ["description of what should be shown"]
    }
  ]
}`;

const userPrompt = `Create a 10-15 minute video essay script analyzing ${characters[0].name}.

CHARACTER DATA:
Name: ${characters[0].name}
Description: ${characters[0].description}

Generate the complete script as structured JSON.`;

const messages = [
  { role: "system", content: systemPrompt },
  { role: "user", content: userPrompt }
];

return [{ json: { messages } }];
```

#### Node 4: Gemini via OpenRouter (HTTP Request)
- URL: `https://openrouter.ai/api/v1/chat/completions`
- Método: POST
- Headers:
  - Authorization: `Bearer {{ $credentials.openRouterApi }}`
  - Content-Type: `application/json`
- Body (JSON):
```json
{
  "model": "google/gemini-2.5-pro",
  "temperature": 0.7,
  "max_tokens": 8000,
  "messages": "{{ $json.messages }}"
}
```

#### Node 5: Parse Response (Code Node)
```javascript
const response = $json;
const scriptOutput = JSON.parse(response.choices[0].message.content);

if (!scriptOutput.scenes || scriptOutput.scenes.length === 0) {
  throw new Error('Script inválido: sem cenas');
}

const totalDuration = scriptOutput.scenes.reduce(
  (sum, scene) => sum + scene.duration,
  0
);

return [{
  json: {
    ...scriptOutput,
    total_duration: totalDuration,
    validation_passed: true
  }
}];
```

#### Node 6: Save Generated Script
- Tipo: Write Binary File
- Nome do arquivo: `generated_script.json`

## Workflow 3: Storyboard Assembly

### Estrutura do Workflow
```
Read Script → Process Scenes in Batches → Generate Storyboard → Save Storyboard
```

### Configuração dos Nodes

#### Node 1: Read Generated Script
- Tipo: Read Binary File
- Nome do arquivo: `generated_script.json`

#### Node 2: Split in Batches (Scenes)
- Tipo: Split in Batches
- Batch size: 3

#### Node 3: Gemini Storyboard (Chat Model)
- **System Prompt:**
```
You are a visual director for educational video essays about comics.
Convert script scenes into detailed storyboard with specific visual instructions for each scene.

OUTPUT FORMAT (JSON):
{
  "scene_id": 1,
  "visual_elements": [
    {
      "type": "comic_panel | text_overlay | character_portrait",
      "source": "URL or asset reference",
      "description": "What this shows",
      "timing": { "start": 0, "end": 10 },
      "animation": "zoom_in | pan_right | fade_in | slide_up",
      "position": { "x": 0, "y": 0, "width": 1920, "height": 1080 }
    }
  ]
}
```

- **User Prompt:**
```
Convert these script scenes into detailed storyboard:

SCENES: {{ $json.scenes }}

Available assets from character data: Use character images from Comic Vine API

For each scene, provide visual elements with exact timing and animation details.
```

#### Node 4: Wait Between Batches
- Tipo: Wait
- Valor: 2000 milliseconds

#### Node 5: Merge All Storyboard Batches
- Tipo: Merge
- Modo: Combine

#### Node 6: Save Storyboard
- Tipo: Write Binary File
- Nome do arquivo: `approved_storyboard.json`

## Execução Passo a Passo

### 1. Teste Inicial
1. Execute o Workflow 1 com 1-2 personagens
2. Verifique se `n8n_output_json.json` é criado com dados completos
3. Execute o Workflow 2 para gerar script
4. Execute o Workflow 3 para criar storyboard

### 2. Validação
- Verifique se todos os arquivos JSON estão válidos
- Confirme que os personagens têm `quality_score >= 60`
- Valide estrutura do script com scenes array
- Confirme storyboard tem visual_elements para cada cena

### 3. Próximos Passos
Com os arquivos gerados, configure:
- Projeto Remotion para renderização de vídeo
- Gravação de narração (sua parte criativa)
- Sincronização áudio-visual

---

## Variáveis Críticas para Trocar

1. **SUA_API_KEY_COMIC_VINE_AQUI**: Substitua pela sua Comic Vine API key
2. **SUA_CHAVE_OPENROUTER_AQUI**: Configure nas credenciais do n8n
3. **searchQueries**: Adicione/remova personagens conforme necessário
4. **qualityScore**: Ajuste o valor mínimo (padrão: 60)
5. **batchSize**: Ajuste conforme seu rate limit

## Limitações Importantes

- **Comic Vine**: 200 requisições a cada 15 minutos (1 por segundo)
- **Gemini via OpenRouter**: Custos baseados em tokens utilizados
- **Rate Limiting**: Essential para não ser bloqueado pela Comic Vine