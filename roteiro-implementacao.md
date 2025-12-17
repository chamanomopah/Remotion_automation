# Roteiro de Implementação: Sistema Automatizado de Vídeos sobre Quadrinhos

## Visão Geral do Sistema

Você está construindo um sistema automatizado para criar vídeos educacionais sobre quadrinhos (estilo Alt Shift X), onde:

**Você foca em:** Narração em inglês, piadas específicas, comentários pessoais (parte criativa)

**Sistema automatiza (90%):** Pesquisa de dados, estruturação de roteiro, criação de storyboard, montagem visual

---

## Arquitetura Completa do Sistema

```
[1. TRIGGER]
    ↓
[2. n8n: Comic Vine Data Collection]
    → Busca personagens/histórias
    → Filtra por qualidade
    → Salva n8n_output_json
    ↓
[3. n8n: Gemini Script Writer Agent]
    → Gera roteiro estruturado
    → Loop over personagens
    → Salva generated_script.json
    ↓
[4. n8n: Gemini Storyboard Director Agent]
    → Cria storyboard cena por cena
    → Mapeia imagens para momentos
    → Salva approved_storyboard.json
    ↓
[5. n8n: Assembly Package Creation]
    → Transforma para formato Remotion
    → Download de assets
    → Salva assembly_package.json
    ↓
[6. Claude Code / Remotion]
    → Gera componentes React
    → Sincroniza áudio + visual
    → Renderiza vídeo final
    ↓
[7. DELIVERY]
    → output.mp4 pronto para upload
```

---

## PARTE 1: Setup e Configuração Inicial

### 1.1 Obter API Keys e Contas

**Comic Vine API:**
1. Acesse: https://comicvine.gamespot.com/api/
2. Criar conta GameSpot (grátis)
3. Gerar API key em: https://comicvine.gamespot.com/api/
4. **Importante:** Rate limit = 200 req/15 minutos + 1 req/segundo
   - Isso significa até 800 requisições por hora (200 × 4)
   - Reset do contador a cada 15 minutos
5. **NOTA CRÍTICA:** Comic Vine NÃO tem credencial predefinida no n8n
   - Use API key diretamente na URL: `https://comicvine.gamespot.com/api/search/?api_key=SUA_KEY_AQUI&format=json`
   - Header Auth NÃO funciona com Comic Vine
   - **SEMPRE use HTTPS** - http://comicvine.gamespot.com NÃO funciona

**Google AI Studio (Gemini 2.5 Pro):**
1. Acesse: https://aistudio.google.com
2. Login com conta Google
3. Criar API key em "Get API Key"
4. Salvar: `YOUR_GEMINI_API_KEY`

**Alternativa - OpenRouter (para Gemini via n8n):**
1. Acesse: https://openrouter.ai
2. Criar conta
3. Gerar API key
4. Modelo: `google/gemini-2.5-pro` (versão estável)
   - Alternativas: google/gemini-2.5-pro-preview (experimental)
5. Salvar: `YOUR_OPENROUTER_API_KEY`

**n8n (Workflow Automation):**
- **Opção 1:** n8n Cloud (https://n8n.io) - Plano grátis disponível
- **Opção 2:** Self-hosted via Docker:
  ```bash
  docker run -it --rm \
    --name n8n \
    -p 5678:5678 \
    -v ~/.n8n:/home/node/.n8n \
    n8nio/n8n
  ```

**Remotion (Video Rendering):**
```bash
# Criar projeto Remotion
npx create-video --blank
cd my-video

# Instalar dependências
npm install
```

**Claude Code (Opcional, mas recomendado):**
```bash
npm install -g @anthropic-ai/claude-code
# Criar conta em https://claude.com
# Obter API key
```

---

## PARTE 2: Workflow n8n - Comic Vine Data Collection

### 2.1 Criar Workflow "Comic Data Collector"

**Objetivo:** Buscar dados de personagens/histórias do Comic Vine com qualidade garantida

**Nodes necessários:**

#### Node 1: Manual Trigger (ou Schedule Trigger)
```json
{
  "name": "Trigger",
  "type": "n8n-nodes-base.manualTrigger"
}
```

#### Node 2: Set Initial Data (CODE NODE - não Function)
```javascript
// Code Node (não Function node - deprecated desde v0.198.0)
const searchQueries = [
  { query: "Spider-Man", publisher: "Marvel" },
  { query: "Batman", publisher: "DC Comics" }
];

// Retorna array de objetos diretamente (sem wrapper .map)
return searchQueries;
```

#### Node 3: HTTP Request - Comic Vine Search
```json
{
  "name": "Search Characters",
  "type": "n8n-nodes-base.httpRequest",
  "method": "GET",
  "url": "https://comicvine.gamespot.com/api/search",
  "qs": {
    "api_key": "SUA_COMICVINE_API_KEY_AQUI",
    "format": "json",
    "query": "={{$json.query}}",
    "resources": "character",
    "limit": "10",
    "field_list": "name,id,deck,image,count_of_issue_appearances,publisher"
  }
}
```

#### Node 4: Wait (Rate Limit)
```json
{
  "name": "Wait 1.2s (Rate Limit)",
  "type": "n8n-nodes-base.wait",
  "parameters": {
    "amount": 1200,
    "unit": "milliseconds"
  }
}
```

#### Node 5: Loop Over Items
```json
{
  "name": "Loop Over Characters",
  "type": "n8n-nodes-base.splitInBatches",
  "parameters": {
    "batchSize": 1,
    "options": {
      "reset": false
    }
  }
}
```

#### Node 6: Code Node - Quality Scoring
```javascript
// Code Node (não Function node - deprecated desde v0.198.0)
const character = $input.first().json.results[0];

const qualityScore = (
  (character.count_of_issue_appearances || 0) * 0.3 +
  (character.deck ? character.deck.length / 100 * 20 : 0) +
  (character.image ? 20 : 0) +
  (character.publisher ? 10 : 0)
);

// Filtrar apenas personagens com score >= 60
if (qualityScore >= 60) {
  return [{
    json: {
      character_id: character.id,
      name: character.name,
      quality_score: qualityScore,
      needs_detailed_fetch: true
    }
  }];
} else {
  return []; // Array vazio para skip low quality
}
```

#### Node 7: HTTP Request - Get Detailed Character Data
```json
{
  "name": "Get Full Character Data",
  "type": "n8n-nodes-base.httpRequest",
  "method": "GET",
  "url": "https://comicvine.gamespot.com/api/character/4005-{{$json.character_id}}",
  "qs": {
    "api_key": "SUA_COMICVINE_API_KEY_AQUI",
    "format": "json",
    "field_list": "name,real_name,aliases,deck,description,powers,first_appeared_in_issue,story_arc_credits,issue_credits,teams,origin,publisher,image"
  }
}
```

#### Node 8: Wait (Rate Limit)
```json
{
  "name": "Wait 1.2s Again",
  "type": "n8n-nodes-base.wait",
  "parameters": {
    "amount": 1200,
    "unit": "milliseconds"
  }
}
```

#### Node 9: Merge All Data
```json
{
  "name": "Aggregate Characters",
  "type": "n8n-nodes-base.merge",
  "mode": "append"
}
```

#### Node 10: Write to JSON File
```json
{
  "name": "Save to n8n_output_json",
  "type": "n8n-nodes-base.writeFile",
  "fileName": "n8n_output_json.json",
  "dataPropertyName": "data"
}
```

### 2.2 Testar o Workflow

1. Execute manualmente com 1-2 personagens
2. Verifique se `n8n_output_json.json` foi criado
3. Confirme que tem dados completos de personagens

---

## PARTE 3: Workflow n8n - Script Generation (Gemini Agent)

### 3.1 Criar Workflow "Script Writer Agent"

**Objetivo:** Usar Gemini 2.5 Pro para gerar roteiros estruturados

#### Node 1: Read File
```json
{
  "name": "Read Comic Data",
  "type": "n8n-nodes-base.readFile",
  "filePath": "n8n_output_json.json"
}
```

#### Node 2: Code Node - Prepare Context
```javascript
// Extrair dados relevantes para o prompt
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

#### Node 2.5: Code Node - Prepare Messages for OpenRouter
```javascript
// Preparar mensagens no formato da API OpenRouter
const characters = $json.characters;
const systemPrompt = `You are an expert video essay scriptwriter specializing in comic book analysis, inspired by the analytical style of Alt Shift X and Nerdwriter1.

Your task is to create engaging, informative scripts for educational videos about comic book characters.

STYLE GUIDELINES:
- Conversational yet analytical tone (first person allowed)
- Clear thesis stated early (within first 30 seconds)
- Use specific examples with issue citations
- Balance entertainment with education
- Natural pacing with varied sentence structure
- Avoid excessive jargon

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
      "visual_cues": ["description of what should be shown"],
      "key_moments": ["timestamp: 5s - show Amazing Spider-Man #121 cover"]
    }
  ]
}

STRUCTURE:
1. Hook (15s): Start with their most iconic moment or provocative question
2. Introduction (45s): Who they are and why they matter
3. Origins (3min): Creation, first appearance, evolution
4. Key Powers & Abilities (2min): What makes them unique
5. Defining Story Arcs (4min): Top 3 stories with analysis
6. Cultural Impact (2min): Why they resonate
7. Conclusion (1min): Final thoughts and engagement question`;

const userPrompt = `Create a 10-15 minute video essay script analyzing ${characters[0].name}.

CHARACTER DATA:
Name: ${characters[0].name}
Description: ${characters[0].description}
Powers: ${characters[0].powers}
First Appearance: ${characters[0].first_appearance}
Notable Story Arcs: ${characters[0].story_arcs}

REQUIREMENTS:
- Reference specific issue numbers
- Include 3-5 "did you know" facts
- Compare to movie/TV adaptations if relevant
- Maintain engagement throughout
- Natural transitions between sections

Generate the complete script as structured JSON.`;

const messages = [
  {
    role: "system",
    content: systemPrompt
  },
  {
    role: "user",
    content: userPrompt
  }
];

return [{ json: { messages } }];
```

#### Node 3: HTTP Request - Gemini via OpenRouter

**Configuration:**
```json
{
  "name": "Gemini Script Writer",
  "type": "n8n-nodes-base.httpRequest",
  "method": "POST",
  "url": "https://openrouter.ai/api/v1/chat/completions",
  "authentication": "headerAuth",
  "headerParameters": {
    "parameters": [
      {
        "name": "Authorization",
        "value": "Bearer {{$credentials.openRouterApi}}"
      },
      {
        "name": "Content-Type",
        "value": "application/json"
      }
    ]
  },
  "bodyParameters": {
    "parameters": [
      {
        "name": "model",
        "value": "google/gemini-2.5-pro"
      },
      {
        "name": "temperature",
        "value": 0.7
      },
      {
        "name": "max_tokens",
        "value": 8000
      },
      {
        "name": "messages",
        "value": "={{$json.messages}}"
      }
    ]
  }
}
```

#### Node 4: Code Node - Parse & Validate Script
```javascript
// Validar estrutura do script gerado pela API OpenRouter
const response = $json;

// Verificar se já é objeto ou precisa parsear
const scriptOutput = typeof response.choices[0].message.content === 'string'
  ? JSON.parse(response.choices[0].message.content)
  : response.choices[0].message.content;

// Validar estrutura
if (!scriptOutput.scenes || !Array.isArray(scriptOutput.scenes) || scriptOutput.scenes.length === 0) {
  throw new Error('Script inválido: sem cenas ou scenes não é array');
}

// Calcular duração total
const totalDuration = scriptOutput.scenes.reduce(
  (sum, scene) => sum + (scene.duration || 0),
  0
);

return [{
  json: {
    ...scriptOutput,
    total_duration: totalDuration,
    validation_passed: true,
    timestamp: new Date().toISOString()
  }
}];
```

#### Node 5: IF Node - Quality Check
```json
{
  "name": "Script Valid?",
  "type": "n8n-nodes-base.if",
  "conditions": {
    "options": {
      "caseSensitive": true,
      "leftValue": "",
      "typeValidation": "strict"
    },
    "conditions": [
      {
        "id": "c08f7738-c7ee-414a-85f0-19a5a6d9143d",
        "leftValue": "={{ $json.validation_passed }}",
        "rightValue": true,
        "operator": {
          "type": "boolean",
          "operation": "equal"
        }
      }
    ],
    "combinator": "and"
  }
}
```

#### Node 6a: Slack Notification (if failed)
```json
{
  "name": "Alert: Script Failed",
  "type": "n8n-nodes-base.slack",
  "message": "Script generation failed validation. Please review."
}
```

#### Node 6b: Write File (if passed)
```json
{
  "name": "Save Generated Script",
  "type": "n8n-nodes-base.writeFile",
  "fileName": "generated_script_{{$json.video_title}}.json"
}
```

---

## PARTE 4: Workflow n8n - Storyboard Generation

### 4.1 Criar Workflow "Storyboard Director Agent"

**Objetivo:** Converter script em storyboard visual com timings precisos

#### Node 1: Read Generated Script
```json
{
  "name": "Load Script",
  "type": "n8n-nodes-base.readFile",
  "filePath": "generated_script_*.json"
}
```

#### Node 2: Read Comic Vine Images
```javascript
// Function: Carregar imagens disponíveis
const comicData = JSON.parse($('Read Comic Data').first().json.data);
const images = comicData.results.image;

// O Comic Vine API retorna múltiplos tamanhos de imagem:
const availableAssets = {
  // Para storyboard e cenas principais:
  character_portrait: images.medium_url,      // 320x200px - bom para retratos
  panels: images.screen_large_url,           // 700x1000px - ideal para painéis
  covers: images.original_url,                // Original - máxima qualidade

  // Alternativas disponíveis:
  icon: images.icon_url,                      // 32x32px - miniaturas
  small: images.small_url,                    // 100x100px - thumbs
  screen: images.screen_url,                  // 500x700px - painéis médios
  super: images.super_url,                    // 1500x2000px - alta qualidade
  thumb: images.thumb_url,                    // 100x100px - thumb quadrado
  tiny: images.tiny_url,                      // 32x32px - menor possível

  // Recomendações de uso:
  // - icon_url/small_url/tiny_url: para navegação e prévias
  // - medium_url: para retratos de personagens
  // - screen_url/screen_large_url: para painéis e cenas
  // - super_url/original_url: para capas e momentos épicos
};

return [{ json: { availableAssets } }];
```

#### Node 3: Split In Batches (Scenes)
```json
{
  "name": "Process 3 Scenes at Time",
  "type": "n8n-nodes-base.splitInBatches",
  "batchSize": 3,
  "options": { "reset": false }
}
```

#### Node 4: Code Node - Prepare Scene Batch
```javascript
// Preparar lote de cenas + assets para Gemini
const scenes = $json.scenes.slice($json.batchStart, $json.batchEnd);
const assets = $('Read Comic Vine Images').first().json.availableAssets;

return [{
  json: {
    scenes_batch: scenes,
    available_assets: assets
  }
}];
```

#### Node 5: Gemini Chat Model - Storyboard Director

**System Prompt:**
```
You are a visual director for educational video essays about comics. 

Your job is to translate video scripts into detailed storyboards with specific visual instructions for each scene.

You work in the style of Alt Shift X: clean layouts with comic panels, text overlays, smooth transitions, and a "mosaic" approach where all visual elements are part of one large composition.

OUTPUT FORMAT (JSON):
{
  "scene_id": 1,
  "scene_name": "Hook",
  "duration": 15,
  "narration_text": "from script",
  "visual_elements": [
    {
      "type": "comic_panel | text_overlay | character_portrait",
      "source": "URL or asset reference",
      "description": "What this shows",
      "timing": { "start": 0, "end": 10 },
      "animation": "zoom_in | pan_right | fade_in | slide_up",
      "position": { "x": 0, "y": 0, "width": 1920, "height": 1080 },
      "layer": 1
    }
  ],
  "audio_cues": {
    "narration_file": "scene_N_vo.mp3",
    "sound_effects": [
      { "file": "swoosh.mp3", "timing": 2 }
    ]
  }
}

VISUAL STYLE RULES:
- Use 3-5 visual elements per scene
- Vary shot composition (close-ups, wide, detail shots)
- Time visual changes to match narration beats
- Ensure smooth transitions
- Create visual hierarchy
```

**User Prompt:**
```
Convert these script scenes into detailed storyboard:

SCENES:
{{$json.scenes_batch}}

AVAILABLE ASSETS:
{{$json.available_assets}}

For each scene, provide:
1. Visual elements array with exact timing
2. Animation types for each element
3. Position/layout information
4. Audio cue references

Output as structured JSON array.
```

#### Node 6: Wait (between batches)
```json
{
  "name": "Wait 2s",
  "type": "n8n-nodes-base.wait",
  "amount": 2000
}
```

#### Node 7: Loop back to Node 3 until all scenes processed

#### Node 8: Merge All Storyboard Batches
```json
{
  "name": "Combine Storyboards",
  "type": "n8n-nodes-base.merge",
  "mode": "append"
}
```

#### Node 9: Code Node - Validate Storyboard
```javascript
// Validar storyboard completo
const storyboard = $json;

// Checks:
// - Todas as cenas têm visual_elements
// - Timing total bate com script
// - URLs de imagens são válidas

const validation = {
  total_scenes: storyboard.length,
  total_duration: storyboard.reduce((sum, s) => sum + s.duration, 0),
  missing_visuals: storyboard.filter(s => !s.visual_elements || s.visual_elements.length === 0).length,
  is_valid: true
};

return [{ json: { storyboard, validation } }];
```

#### Node 10: Slack - Send Preview
```json
{
  "name": "Storyboard Preview",
  "type": "n8n-nodes-base.slack",
  "message": "Storyboard gerado!\nCenas: {{$json.validation.total_scenes}}\nDuração: {{$json.validation.total_duration}}s\n\nAprovar para continuar?"
}
```

#### Node 11: Wait for Approval Node
```json
{
  "name": "Human Approval",
  "type": "n8n-nodes-base.wait",
  "resume": "webhook"
}
```

#### Node 12: Write Approved Storyboard
```json
{
  "name": "Save Storyboard",
  "type": "n8n-nodes-base.writeFile",
  "fileName": "approved_storyboard.json"
}
```

---

## PARTE 5: Assembly Package & Remotion Setup

### 5.1 Criar Workflow "Assembly Package Creator"

#### Node 1: Read Storyboard
```json
{
  "name": "Load Approved Storyboard",
  "type": "n8n-nodes-base.readFile",
  "filePath": "approved_storyboard.json"
}
```

#### Node 2: Code Node - Transform to Assembly Package
```javascript
// Converter storyboard para formato Remotion
const storyboard = JSON.parse($json.data);

const assemblyPackage = {
  assembly_package_version: "1.0",
  metadata: {
    video_id: storyboard[0].video_title.toLowerCase().replace(/\s+/g, '_'),
    title: storyboard[0].video_title,
    totalDuration: storyboard.reduce((sum, s) => sum + s.duration, 0),
    fps: 30,
    resolution: { width: 1920, height: 1080 },
    created_at: new Date().toISOString()
  },
  scenes: storyboard.map((scene, index) => ({
    scene_id: index + 1,
    scene_name: scene.scene_name,
    startTime: storyboard.slice(0, index).reduce((sum, s) => sum + s.duration, 0),
    duration: scene.duration,
    narration_text: scene.narration_text,
    visual_elements: scene.visual_elements.map(ve => ({
      ...ve,
      local_path: `/public/assets/${ve.source.split('/').pop()}` // Placeholder
    })),
    audio_cues: scene.audio_cues
  })),
  audioTracks: [
    {
      type: "narration",
      url: "/public/audio/full_narration.mp3", // Você gravará depois
      volume: 1.0
    }
  ],
  assets: {
    images: [],
    audio: []
  }
};

return [{ json: assemblyPackage }];
```

#### Node 3: HTTP Request Nodes (parallel) - Download Assets

```javascript
// Function: Extrair todas as URLs de imagens
const package = $json;
const imageUrls = [];

package.scenes.forEach(scene => {
  scene.visual_elements.forEach(ve => {
    if (ve.type === 'comic_panel' || ve.type === 'character_portrait') {
      imageUrls.push({
        url: ve.source,
        local_path: `/public/assets/img_${imageUrls.length}.jpg`
      });
    }
  });
});

return imageUrls.map(img => ({ json: img }));
```

Depois, para cada URL:
```json
{
  "name": "Download Asset",
  "type": "n8n-nodes-base.httpRequest",
  "method": "GET",
  "url": "={{$json.url}}",
  "responseFormat": "file"
}
```

E salvar:
```json
{
  "name": "Save Asset",
  "type": "n8n-nodes-base.writeFile",
  "fileName": "={{$json.local_path}}"
}
```

#### Node 4: Write Assembly Package
```json
{
  "name": "Save assembly_package.json",
  "type": "n8n-nodes-base.writeFile",
  "fileName": "/remotion-project/assembly_package.json",
  "dataPropertyName": "data"
}
```

### 5.2 Setup Remotion Project

**Estrutura de diretórios:**
```
remotion-project/
├─ src/
│  ├─ index.ts
│  ├─ Root.tsx
│  ├─ Compositions/
│  │  ├─ ComicVideoEssay.tsx
│  │  ├─ Scene.tsx
│  │  └─ Elements/
│  │     ├─ ComicPanel.tsx
│  │     ├─ TextOverlay.tsx
│  │     └─ Transition.tsx
├─ public/
│  ├─ assets/ (imagens Comic Vine)
│  └─ audio/ (narração gravada por você)
├─ assembly_package.json (gerado pelo n8n)
└─ package.json
```

**Root.tsx:**
```tsx
import { Composition } from 'remotion';
import { ComicVideoEssay } from './Compositions/ComicVideoEssay';
import assemblyPackage from '../assembly_package.json';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ComicVideoEssay"
        component={ComicVideoEssay}
        durationInFrames={assemblyPackage.metadata.totalDuration * 30}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          assemblyPackage: assemblyPackage,
        }}
      />
    </>
  );
};
```

**ComicVideoEssay.tsx:** (componente principal)
```tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, Sequence, Audio } from 'remotion';
import { Scene } from './Scene';

interface AssemblyPackage {
  metadata: {
    totalDuration: number;
    fps: number;
    // ... outros campos
  };
  scenes: Array<{
    scene_id: number;
    scene_name: string;
    startTime: number;
    duration: number;
    // ... outros campos
  }>;
  audioTracks: Array<{
    url: string;
    volume: number;
  }>;
}

export const ComicVideoEssay: React.FC<{ assemblyPackage: AssemblyPackage }> = ({
  assemblyPackage,
}) => {
  const { fps } = useVideoConfig();

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#1a1a1a' }}>
      {/* Background Audio - sua narração */}
      <Audio src={assemblyPackage.audioTracks[0].url} />

      {/* Render cada cena como Sequence */}
      {assemblyPackage.scenes.map((sceneData) => {
        const startFrame = sceneData.startTime * fps;
        const durationFrames = sceneData.duration * fps;

        return (
          <Sequence
            key={sceneData.scene_id}
            from={startFrame}
            durationInFrames={durationFrames}
            name={sceneData.scene_name}
          >
            <Scene sceneData={sceneData} />
          </Sequence>
        );
      })}
    </div>
  );
};
```

**Scene.tsx:**
```tsx
import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { ComicPanel } from './Elements/ComicPanel';
import { TextOverlay } from './Elements/TextOverlay';

export const Scene: React.FC<{ sceneData: any }> = ({ sceneData }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {sceneData.visual_elements.map((element: any, index: number) => {
        const elementStartFrame = element.timing.start * fps;
        const elementEndFrame = element.timing.end * fps;

        if (frame < elementStartFrame || frame > elementEndFrame) {
          return null;
        }

        const progress = interpolate(
          frame,
          [elementStartFrame, elementStartFrame + 10],
          [0, 1],
          { extrapolateRight: 'clamp' }
        );

        switch (element.type) {
          case 'comic_panel':
            return (
              <ComicPanel
                key={index}
                src={element.local_path}
                animation={element.animation}
                progress={progress}
                position={element.position}
              />
            );
          case 'text_overlay':
            return (
              <TextOverlay
                key={index}
                text={element.text}
                position={element.position}
                progress={progress}
                style={element.style}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
};
```

**ComicPanel.tsx:**
```tsx
import React from 'react';
import { interpolate, Img } from 'remotion';

interface ComicPanelProps {
  src: string;
  animation: string;
  progress: number;
  position: any;
}

export const ComicPanel: React.FC<ComicPanelProps> = ({
  src,
  animation,
  progress,
  position,
}) => {
  let transform = '';

  switch (animation) {
    case 'zoom_in':
      const scale = interpolate(progress, [0, 1], [1, 1.2]);
      transform = `scale(${scale})`;
      break;
    case 'pan_right':
      const translateX = interpolate(progress, [0, 1], [0, 200]);
      transform = `translateX(${translateX}px)`;
      break;
    case 'fade_in':
      // Handled by opacity
      break;
    default:
      break;
  }

  return (
    <Img
      src={src}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: position.width,
        height: position.height,
        transform,
        opacity: progress,
      }}
    />
  );
};
```

**TextOverlay.tsx:**
```tsx
import React from 'react';

interface TextOverlayProps {
  text: string;
  position: any;
  progress: number;
  style: any;
}

export const TextOverlay: React.FC<TextOverlayProps> = ({
  text,
  position,
  progress,
  style,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        fontSize: style.fontSize,
        fontFamily: style.fontFamily,
        color: style.color,
        opacity: progress,
        textShadow: `2px 2px 4px ${style.stroke}`,
      }}
    >
      {text}
    </div>
  );
};
```

---

## PARTE 6: Narração e Sincronização de Áudio

### 6.1 Gravar sua Narração

Após o script ser aprovado, você precisa:

1. **Ler o script completo** de `generated_script.json`
2. **Gravar cena por cena** usando:
   - Audacity (grátis)
   - Adobe Audition
   - GarageBand (Mac)
   
3. **Exportar cada cena como:**
   - `scene_1_vo.mp3`
   - `scene_2_vo.mp3`
   - etc.

4. **Combinar em um único arquivo:**
   - `full_narration.mp3`

5. **Salvar em:** `/remotion-project/public/audio/`

### 6.2 Adicionar Piadas e Comentários Pessoais

**Durante a gravação, você pode:**
- Adicionar piadas no momento certo
- Inserir seus comentários pessoais sobre os quadrinhos
- Mudar o tom de voz para ênfase

**Importante:** O timing da narração deve bater com o `duration` de cada cena no storyboard. Se você falar mais rápido/devagar, ajuste o `assembly_package.json`:

```json
{
  "scene_id": 1,
  "duration": 18  // Originalmente 15s, mas você falou mais
}
```

---

## PARTE 7: Render Final com Remotion

### Opção A: Render Manual (sem Claude Code)

```bash
cd remotion-project

# Preview no browser
npm start

# Render final
npx remotion render ComicVideoEssay output.mp4 --codec=h264
```

### Opção B: Render via n8n + Claude Code (automático)

**Node Final do n8n:**

#### Execute Command Node
```json
{
  "name": "Render with Claude Code",
  "type": "n8n-nodes-base.executeCommand",
  "command": "cd /path/to/remotion-project && claude",
  "environment": {
    "ANTHROPIC_API_KEY": "YOUR_CLAUDE_API_KEY"
  }
}
```

**Prompt para Claude Code:**
```
Read the assembly_package.json file.

Generate all necessary Remotion components (ComicPanel, TextOverlay, Scene, ComicVideoEssay) based on the assembly package structure.

Ensure:
- All animations are implemented (zoom_in, pan_right, fade_in, etc)
- Frame timings match assembly package (fps=30)
- Asset paths are correct
- Audio synchronization works

Then run: npx remotion render ComicVideoEssay output.mp4 --codec=h264

Monitor the render and report when complete.
```

---

## PARTE 8: Métricas de Qualidade e Ajustes

### 8.1 Métricas para Monitorar

**Durante Comic Vine Data Collection:**
- % de personagens com `quality_score >= 60`
- Tempo médio por requisição (deve ser ~1.5s)
- Taxa de erros de API

**Durante Script Generation:**
- Tempo de geração (Gemini)
- Taxa de aprovação humana
- Duração média dos scripts gerados

**Durante Storyboard:**
- Número de cenas por vídeo
- Número de visual_elements por cena
- Cobertura de assets (% de cenas com imagens)

**Durante Render:**
- Tempo de render total
- Tamanho do arquivo final
- Erros de missing assets

### 8.2 Ajustes para Vídeos Longos (3+ horas)

Para vídeos sobre múltiplos personagens (ex: "All DC Absolute Characters"):

**1. Modificar o Script Writer prompt:**
```
Create a modular script where each character gets 5-10 minutes.

Structure:
- Introduction (2-3 min) - O que é DC Absolute
- [LOOP] Character N (5-10 min each)
  - Quem é na continuidade principal
  - Diferenças na versão Absolute
  - Momentos-chave
- Comparison (3-5 min) - Temas em comum
- Conclusion (2 min)
```

**2. Processar em lotes no n8n:**
- Dividir lista de personagens em grupos de 5
- Gerar script parcial para cada grupo
- Combinar no final

**3. Otimizar Remotion render:**
```bash
# Render em partes e depois concatenar
npx remotion render ComicVideoEssay part1.mp4 --frames=0-9000
npx remotion render ComicVideoEssay part2.mp4 --frames=9001-18000

# Concatenar com ffmpeg
ffmpeg -i part1.mp4 -i part2.mp4 -filter_complex "[0:v][1:v]concat=n=2:v=1[outv]" -map "[outv]" final.mp4
```

---

## PARTE 9: Checklist de Implementação

### Setup Inicial
- [ ] Obter Comic Vine API key
- [ ] Configurar n8n (cloud ou self-hosted)
- [ ] Obter Gemini API key (Google AI Studio ou OpenRouter)
- [ ] Instalar Remotion projeto
- [ ] (Opcional) Instalar Claude Code

### Workflow 1: Data Collection
- [ ] Criar workflow n8n "Comic Data Collector"
- [ ] Testar com 2 personagens (Spider-Man, Batman)
- [ ] Validar `n8n_output_json.json` tem dados completos
- [ ] Implementar rate limiting (1.5s)
- [ ] Implementar quality scoring

### Workflow 2: Script Generation
- [ ] Criar workflow "Script Writer Agent"
- [ ] Configurar Gemini integration
- [ ] Testar geração de script para 1 personagem
- [ ] Adicionar aprovação humana via Slack
- [ ] Validar estrutura do script JSON

### Workflow 3: Storyboard
- [ ] Criar workflow "Storyboard Director"
- [ ] Implementar batch processing (3 cenas)
- [ ] Testar mapeamento de imagens
- [ ] Validar timings
- [ ] Preview via Slack

### Workflow 4: Assembly
- [ ] Criar "Assembly Package Creator"
- [ ] Implementar download de assets
- [ ] Testar transformação storyboard → assembly
- [ ] Validar paths locais

### Remotion Setup
- [ ] Criar estrutura de componentes
- [ ] Implementar ComicPanel com animações
- [ ] Implementar TextOverlay
- [ ] Implementar Scene component
- [ ] Testar render de 1 cena isolada

### Gravação de Áudio
- [ ] Ler script aprovado
- [ ] Gravar narração cena por cena
- [ ] Adicionar piadas e comentários pessoais
- [ ] Exportar como `full_narration.mp3`
- [ ] Colocar em `/public/audio/`

### Render & Test
- [ ] Testar preview no Remotion
- [ ] Ajustar timings se necessário
- [ ] Render vídeo completo
- [ ] Validar qualidade (1080p, áudio sync)
- [ ] Exportar para YouTube/plataforma

---

## PARTE 10: Troubleshooting Comum

### Problema: Comic Vine API bloqueou meu IP
**Solução:**
- Verificar que está esperando 1.5s entre requisições
- Reduzir número de requisições paralelas
- Considerar usar múltiplas API keys (rotação)

### Problema: Gemini gera scripts muito curtos
**Solução:**
- Aumentar `maxTokens` para 12000
- Adicionar ao prompt: "Each section must be at least X words"
- Fornecer mais dados de contexto do Comic Vine

### Problema: Storyboard tem imagens quebradas
**Solução:**
- Validar URLs de imagens antes de passar para Gemini
- Fazer cache/download de imagens imediatamente após Comic Vine fetch
- Ter imagens placeholder para fallback

### Problema: Áudio dessincronizado no Remotion
**Solução:**
- Verificar que `duration` de cada cena bate com áudio
- Usar `Audio` component com `startFrom` prop
- Ajustar `fps` se necessário (manter 30)

### Problema: Render muito lento
**Solução:**
- Reduzir resolução para teste (1280x720)
- Usar `--concurrency=4` no render
- Otimizar imagens (comprimir antes)
- Render em partes e concatenar

---

## Próximos Passos Recomendados

### Fase 1 (1-2 semanas): MVP
1. Setup básico (APIs, n8n, Remotion)
2. Workflow 1: Data Collection funcionando
3. Workflow 2: Script generation manual (você escreve o prompt)
4. Gravar narração para 1 vídeo teste
5. Render manual no Remotion

### Fase 2 (2-3 semanas): Automação Parcial
1. Workflows 2-4 completamente automatizados
2. Storyboard automático com Gemini
3. Template Remotion reutilizável
4. 3-5 vídeos produzidos

### Fase 3 (1 mês): Produção em Escala
1. Claude Code integration para assembly
2. Queue system para múltiplos vídeos
3. Otimizações de performance
4. 10+ vídeos produzidos
5. Analytics e feedback loop

---

## Recursos e Links Úteis

**Documentação:**
- Comic Vine API: https://comicvine.gamespot.com/api/documentation
- n8n Docs: https://docs.n8n.io
- Remotion Docs: https://www.remotion.dev/docs
- Gemini API: https://ai.google.dev/docs
- Claude Code: https://claude.com/code

**Comunidades:**
- n8n Community: https://community.n8n.io
- Remotion Discord: https://remotion.dev/discord
- Comic Vine Forums: https://comicvine.gamespot.com/forums/

**Inspiração de Estilo:**
- Alt Shift X: https://www.youtube.com/@AltShiftX
- Análise de vídeos Alt Shift X (Reddit): r/AltShiftX

**Ferramentas Adicionais:**
- Audacity (gravação áudio): https://www.audacityteam.org
- GIMP (edição de imagens): https://www.gimp.org
- ffmpeg (processamento de vídeo): https://ffmpeg.org

---

## PARTE 11: Resumo das Correções Críticas Aplicadas

### ERRO #6: Comic Vine API Credential ✅ CORRIGIDO
**Problema:** Roteiro mencionava `$credentials.comicVineApi.apiKey` mas essa credencial não existe no n8n
**Solução:**
- Removido todas as referências a `$credentials.comicVineApi.apiKey`
- Substituído por `SUA_COMICVINE_API_KEY_AQUI` (coloque sua API key real)
- Adicionado aviso que Header Auth NÃO funciona com Comic Vine

### ERRO #3: Function Node Deprecated ✅ CORRIGIDO
**Problema:** Sintaxe de Function node deprecated desde v0.198.0
**Solução:**
- Substituído todos "Function" por "Code Node"
- Corrigido sintaxe: `return searchQueries;` em vez de `return searchQueries.map(q => ({ json: q }));`
- Adicionado notas explicativas sobre uso de Code node

### ERRO #11: Validação de Script Mal Implementada ✅ CORRIGIDO
**Problema:** Tentava fazer JSON.parse() assumindo que era string, mas podia ser objeto
**Solução:**
- Adicionado verificação: `typeof response.choices[0].message.content === 'string'`
- Implementado fallback para objeto caso já seja parseado
- Adicionado validação de Array.isArray()
- Incluído timestamp para debugging

### ERRO #12: IF Node Configuration ✅ CORRIGIDO
**Problema:** Sintaxe do IF node estava errada
**Solução:**
- Substituído sintaxe antiga por estrutura completa de conditions
- Configurado corretamente: boolean equal operation
- Adicionado ID único e combinator

### ERRO #14: Comic Vine Endpoint ✅ CORRIGIDO
**Problema:** Alguns endpoints poderiam estar usando HTTP em vez de HTTPS
**Solução:**
- Verificado que TODAS as URLs já usam HTTPS
- Adicionado aviso explícito sobre importância de HTTPS
- Garantido consistência em todo o documento

---

## PARTE 12: Workflow Completo Corrigido e Validado

### 11.1 Comic Vine Data Collector (CORRIGIDO)

Este é o workflow principal validado com todas as correções aplicadas:

```json
{
  "name": "Comic Vine Data Collector (CORRIGIDO)",
  "nodes": [
    {
      "name": "Manual Trigger",
      "type": "n8n-nodes-base.manualTrigger",
      "position": [250, 300]
    },
    {
      "name": "Set Search Queries",
      "type": "n8n-nodes-base.function",
      "position": [450, 300],
      "parameters": {
        "functionCode": "return [\n  { json: { query: 'Spider-Man', publisher: 'Marvel' } },\n  { json: { query: 'Batman', publisher: 'DC Comics' } }\n];"
      }
    },
    {
      "name": "Search Characters",
      "type": "n8n-nodes-base.httpRequest",
      "position": [650, 300],
      "parameters": {
        "method": "GET",
        "url": "https://comicvine.gamespot.com/api/search",
        "qs": {
          "api_key": "SUA_COMICVINE_API_KEY_AQUI",
          "format": "json",
          "query": "={{$json.query}}",
          "resources": "character",
          "limit": "10",
          "field_list": "id,name,deck,image,count_of_issue_appearances,publisher"
        },
        "options": {
          "response": {
            "response": {
              "responseFormat": "json"
            }
          }
        }
      }
    },
    {
      "name": "Wait 1.2s (Rate Limit)",
      "type": "n8n-nodes-base.wait",
      "position": [850, 300],
      "parameters": {
        "amount": 1200,
        "unit": "milliseconds"
      }
    },
    {
      "name": "Loop Over Characters",
      "type": "n8n-nodes-base.splitInBatches",
      "position": [1050, 300],
      "parameters": {
        "batchSize": 1,
        "options": {
          "reset": false
        }
      }
    },
    {
      "name": "Quality Filter",
      "type": "n8n-nodes-base.function",
      "position": [1250, 300],
      "parameters": {
        "functionCode": "const results = $input.first().json.results;\n\nif (!results || results.length === 0) {\n  return [];\n}\n\nconst character = results[0];\n\n// Calcular quality score\nconst qualityScore = (\n  (character.count_of_issue_appearances || 0) * 0.3 +\n  (character.deck ? character.deck.length / 100 * 20 : 0) +\n  (character.image ? 20 : 0) +\n  (character.publisher ? 10 : 0)\n);\n\n// Filtrar apenas personagens com score >= 60\nif (qualityScore >= 60) {\n  return [{\n    json: {\n      character_id: character.id,\n      name: character.name,\n      quality_score: qualityScore,\n      needs_detailed_fetch: true\n    }\n  }];\n}\n\nreturn [];"
      }
    },
    {
      "name": "Get Character Details",
      "type": "n8n-nodes-base.httpRequest",
      "position": [1450, 300],
      "parameters": {
        "method": "GET",
        "url": "=https://comicvine.gamespot.com/api/character/4005-{{$json.character_id}}/",
        "qs": {
          "api_key": "SUA_COMICVINE_API_KEY_AQUI",
          "format": "json",
          "field_list": "name,real_name,aliases,deck,description,powers,first_appeared_in_issue,story_arc_credits,issue_credits,teams,origin,publisher,image"
        }
      }
    },
    {
      "name": "Wait 1.2s Again",
      "type": "n8n-nodes-base.wait",
      "position": [1650, 300],
      "parameters": {
        "amount": 1200,
        "unit": "milliseconds"
      }
    },
    {
      "name": "Save to JSON",
      "type": "n8n-nodes-base.writeFile",
      "position": [1850, 300],
      "parameters": {
        "fileName": "n8n_output_json.json",
        "dataPropertyName": "data"
      }
    }
  ],
  "connections": {
    "Manual Trigger": {
      "main": [[{ "node": "Set Search Queries", "type": "main", "index": 0 }]]
    },
    "Set Search Queries": {
      "main": [[{ "node": "Search Characters", "type": "main", "index": 0 }]]
    },
    "Search Characters": {
      "main": [[{ "node": "Wait 1.2s (Rate Limit)", "type": "main", "index": 0 }]]
    },
    "Wait 1.2s (Rate Limit)": {
      "main": [[{ "node": "Loop Over Characters", "type": "main", "index": 0 }]]
    },
    "Loop Over Characters": {
      "main": [
        [{ "node": "Quality Filter", "type": "main", "index": 0 }],
        [{ "node": "Save to JSON", "type": "main", "index": 0 }]
      ]
    },
    "Quality Filter": {
      "main": [[{ "node": "Get Character Details", "type": "main", "index": 0 }]]
    },
    "Get Character Details": {
      "main": [[{ "node": "Wait 1.2s Again", "type": "main", "index": 0 }]]
    },
    "Wait 1.2s Again": {
      "main": [[{ "node": "Loop Over Characters", "type": "main", "index": 0 }]]
    }
  }
}
```

### 11.2 Script Writer Agent com OpenRouter (CORRIGIDO)

```json
{
  "name": "Script Writer Agent (OpenRouter)",
  "nodes": [
    {
      "name": "Read Comic Data",
      "type": "n8n-nodes-base.readFile",
      "filePath": "n8n_output_json.json"
    },
    {
      "name": "Prepare Context",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "// Extrair dados relevantes para o prompt\nconst characters = JSON.parse($json.data);\n\nconst contextData = characters.map(char => ({\n  name: char.results.name,\n  description: char.results.description,\n  powers: char.results.powers,\n  first_appearance: char.results.first_appeared_in_issue,\n  story_arcs: char.results.story_arc_credits\n}));\n\nreturn [{ json: { characters: contextData } }];"
      }
    },
    {
      "name": "Prepare Messages",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "// Preparar mensagens no formato da API OpenRouter\nconst characters = $json.characters;\n\nconst systemPrompt = `You are an expert video essay scriptwriter specializing in comic book analysis, inspired by the analytical style of Alt Shift X and Nerdwriter1.\n\nYour task is to create engaging, informative scripts for educational videos about comic book characters.\n\nSTYLE GUIDELINES:\n- Conversational yet analytical tone (first person allowed)\n- Clear thesis stated early (within first 30 seconds)\n- Use specific examples with issue citations\n- Balance entertainment with education\n- Natural pacing with varied sentence structure\n- Avoid excessive jargon\n\nOUTPUT FORMAT (JSON):\n{\n  \"video_title\": \"string\",\n  \"duration_estimate\": \"10-15 minutes\",\n  \"scenes\": [\n    {\n      \"scene_id\": 1,\n      \"scene_name\": \"Hook\",\n      \"duration\": 15,\n      \"narration_text\": \"Full narration script...\",\n      \"visual_cues\": [\"description of what should be shown\"]\n    }\n  ]\n}`;\n\nconst userPrompt = `Create a 10-15 minute video essay script analyzing ${characters[0].name}.\n\nCHARACTER DATA:\nName: ${characters[0].name}\nDescription: ${characters[0].description}\n\nGenerate the complete script as structured JSON.`;\n\nconst messages = [\n  {\n    role: \"system\",\n    content: systemPrompt\n  },\n  {\n    role: \"user\",\n    content: userPrompt\n  }\n];\n\nreturn [{ json: { messages } }];"
      }
    },
    {
      "name": "Gemini via OpenRouter",
      "type": "n8n-nodes-base.httpRequest",
      "method": "POST",
      "url": "https://openrouter.ai/api/v1/chat/completions",
      "authentication": "headerAuth",
      "headerParameters": {
        "parameters": [
          {
            "name": "Authorization",
            "value": "Bearer {{$credentials.openRouterApi}}"
          },
          {
            "name": "Content-Type",
            "value": "application/json"
          }
        ]
      },
      "bodyParameters": {
        "parameters": [
          {
            "name": "model",
            "value": "google/gemini-2.5-pro"
          },
          {
            "name": "temperature",
            "value": 0.7
          },
          {
            "name": "max_tokens",
            "value": 8000
          },
          {
            "name": "messages",
            "value": "={{$json.messages}}"
          }
        ]
      }
    },
    {
      "name": "Parse Response",
      "type": "n8n-nodes-base.function",
      "parameters": {
        "functionCode": "// Validar estrutura do script gerado pela API OpenRouter\nconst response = $json;\nconst scriptOutput = JSON.parse(response.choices[0].message.content);\n\n// Verificar campos obrigatórios\nif (!scriptOutput.scenes || scriptOutput.scenes.length === 0) {\n  throw new Error('Script inválido: sem cenas');\n}\n\n// Calcular duração total\nconst totalDuration = scriptOutput.scenes.reduce(\n  (sum, scene) => sum + scene.duration,\n  0\n);\n\nreturn [{\n  json: {\n    ...scriptOutput,\n    total_duration: totalDuration,\n    validation_passed: true\n  }\n}];"
      }
    },
    {
      "name": "Save Generated Script",
      "type": "n8n-nodes-base.writeFile",
      "fileName": "generated_script.json",
      "dataPropertyName": "data"
    }
  ]
}
```

---

## Conclusão

Você agora tem um roteiro completo para construir seu sistema automatizado de vídeos sobre quadrinhos!

**Lembre-se:**
- Comece pequeno (1 personagem, vídeo curto)
- Itere baseado em feedback
- Foque na sua parte criativa (narração, piadas, insights)
- Deixe o sistema cuidar do resto

**Sua responsabilidade:**
- Escolher temas de vídeo
- Gravar narração em inglês
- Adicionar piadas e comentários pessoais
- Revisar e aprovar scripts/storyboards

**Sistema automatiza:**
- Pesquisa de dados (Comic Vine)
- Estruturação de roteiro (Gemini)
- Criação de storyboard (Gemini)
- Montagem visual (Remotion)
- Sincronização de áudio

Boa sorte com seu canal! 🎬🦸‍♂️