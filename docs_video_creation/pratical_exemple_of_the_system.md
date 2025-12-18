# Resumo curto (o que você pediu)

Você quer inverter onde o **storyboard** / *infinite canvas* é gerado: em vez de Claude Code criar o storyboard e também montar tudo, **o n8n deve gerar/agregar o storyboard (e versões de revisão)**. O **Claude Code** passa a ser *responsável apenas por montar/gerar o vídeo a partir desse storyboard usando templates* (e por sincronizar áudio), ou seja: RECEBE roteiro + storyboard + imagens + templates e gera o pacote Remotion / TSX / pipeline de render. Também atualizei o diagrama (Mermaid) e os contratos JSON + prompts para refletir essa responsabilidade nova.

Abaixo está a estrutura proposta (passo-a-passo), os formatos de dados atualizados, prompts novos/revisados e o diagrama mermaid atualizado.

# # Fluxo proposto (visão prática — 7 passos, revisado)

1. **Trigger (criação do Job)**
    
    Você cria um job (`title`, `style`, `scope`, `sourceList`, `templatePreference`, etc.) — esse job vai para o **n8n** via webhook.
    
2. **n8n — coleta, agregação e geração de Storyboard**
    
    n8n coleta dados (MediaWiki/Fandom, ComicVine, Google Images, Reddit, etc.), baixa assets e **gera o storyboard estático** (logical layout + shots + callouts + voice segments) — *n8n gera `storyboard_package.json`*. n8n também registra fontes/licenças e gera thumbs.
    
3. **Preview UI (Infinity Canvas / Storyboard Editor)**
    
    O app React carrega `storyboard_package.json` para revisão. Usuário edita (drag/drop, durations), gera `feedback.json`. As edições salvam novas versões: `storyboard_package.v2.json`, etc.
    
4. **n8n envia versão aprovada para Claude Code — *Assembly Only***
    
    Quando aprovado, n8n cria um **assembly_package.json** (storyboard + assets + template id + render options + optional audioUrl placeholder) e envia para **Claude Code** com o prompt `/assemble-from-template`.
    
5. **Claude Code — monta o vídeo usando templates (Remotion .tsx)**
    
    Claude Code **não gera o storyboard** — ele *consome* o storyboard e mapeia cada shot para components/templates (Camera, TheWorld, Scene_X), gerando um pacote `.zip` com `.tsx`, `index.tsx`, `render_pipeline.sh`, `README` e placeholders de áudio. Também gera um `assembly_log.json` (mapping shot -> Scene file).
    
6. **Áudio & Sincronização (opcional / iterativo)**
    
    Você grava a VO, envia `audioUrl` (ou n8n faz upload) para Claude Code com `/sync-audio` — Claude ajusta `durationFrames` e atualiza os Scene_*.tsx (fps configurável). Se desejar precisão além da heurística, usar forced-aligner externo e enviar timestamps.
    
7. **Render & entrega**
    
    Scripts npm remotion executam render. Resultado final: `final_video.mp4` e `render_report.json`. Arquivos são colocados no local de armazenamento (CDN/drive) e o job se completa.
    

---

# # O que muda (resumo rápido de responsabilidades)

- **n8n**: coleta, agrega, gera storyboard estático, gerencia versões, expõe preview, controla feedback loop. — **Autoridade do storyboard**.
- **Preview UI**: edição visual do storyboard (salva feedback).
- **Claude Code**: **somente** montagem/assembly a partir do storyboard + templates; geração de .tsx e pipeline; sincronização de áudio quando receber audioUrl.
- **Remotion**: permanece como runtime de render; Claude Code produz os arquivos para Remotion.

---

# # Formatos de dados atualizados (contratos)

### 1) `n8n_output.json` (de coleta; input para geração do storyboard)

```json
{
  "jobId": "job_20251215_dc_absolute",
  "title": "All DC Absolute characters Explained",
  "scope": "Batman Absolute",
  "style": "altshiftx",
  "sourceList": ["https://fandom.example/wiki/Batman", "comicvine:12345"],
  "characters": [
    {"id":"batman","name":"Batman","first_appearance":"Detective Comics #27","notes":"..."}
  ],
  "assets": [
    {"id":"batman_cover","type":"image","src":"https://cdn.example.com/batman_abs_cover.jpg","w":1200,"h":1800,"source":"ComicVine","license":"fair_use?"},
    {"id":"joker_panel1","type":"image","src":"https://cdn.example.com/joker_panel1.jpg"}
  ],
  "meta": {"requestedBy":"you","requestedAt":"2025-12-01T12:00:00Z"}
}

```

### 2) `storyboard_package.json` (AGORA gerado pelo **n8n** — *fonte de verdade do storyboard*)

```json
{
  "meta": {
    "jobId":"job_20251215_dc_absolute",
    "title":"All DC Absolute characters Explained",
    "canvasSize":{"w":10000,"h":10000},
    "version":"v1",
    "generatedBy":"n8n",
    "generatedAt":"2025-12-02T09:00:00Z"
  },
  "narrative": {
    "script":"No universo Absolute de Batman...",
    "chapters":[
      {"id":"ch_01","label":"Intro","startParagraph":0,"endParagraph":1}
    ]
  },
  "assets":[ /* same as n8n_output.assets but normalized, includes thumbnail */ ],
  "nodes":[
    {"id":"node_batman_cover","assetId":"batman_cover","x":1200,"y":800,"scale":0.9,"layer":1,"notes":["callout: primeira publicação"]}
  ],
  "shots":[
    {
      "id":"shot_001_intro",
      "label":"Intro - Batman cover to panel",
      "start":{"x":1000,"y":700,"zoom":1.0},
      "end":{"x":3000,"y":900,"zoom":1.8},
      "durationFrames":150,
      "voiceSegment":{"id":"v_01","text":"No universo Absolute de Batman...","estimatedSeconds":6}
    }
  ],
  "comments":[{"nodeId":"node_batman_cover","text":"Use callout: 'primeira publicação'"}],
  "credits":[{"assetId":"batman_cover","source":"ComicVine","license":"copyright-holder"}]
}

```

### 3) `assembly_package.json` (n8n envia PARA CLAUDE CODE quando aprovado)

```json
{
  "meta": {"jobId":"job_20251215_dc_absolute", "approvedBy":"user_x", "approvedAt":"2025-12-03T10:00:00Z"},
  "storyboard": { /* embed entire storyboard_package.json */ },
  "templates": {
    "style":"altshiftx",
    "templateId":"altshiftx_v2",
    "templateRules": {
      "gridColumns":3,
      "calloutStyle":"postit_yellow",
      "characterCard":"CharacterCardGrid"
    }
  },
  "renderOptions": {"resolution":"1920x1080","fps":30,"outputFormat":"mp4"},
  "assets": [ /* full-urls or signed-urls para todos os assets no storyboard */ ],
  "audio": {"audioUrl": null, "expectedFormat":"mp3","notes":"send later if not available"}
}

```

### 4) `assembly_log.json` (saída de Claude Code — mapeamento)

```json
{
  "meta":{"generatedBy":"ClaudeCode","generatedAt":"2025-12-03T11:00:00Z"},
  "files":["Camera.tsx","TheWorld.tsx","Scene_shot_001_intro.tsx","index.tsx","render_pipeline.sh"],
  "shot_map":[
    {"shotId":"shot_001_intro","sceneFile":"Scene_shot_001_intro.tsx","durationFrames":150}
  ],
  "notes":["used template altshiftx_v2; replaced missing asset joker_panel1 with placeholder 'missing_image.png'"]
}

```

---

# # Prompts / Endpoints (exemplos prontos — atualizar no Claude Code / n8n)

### A) Prompt que o n8n NÃO mais envia (antigo `/generate-static-storyboard`) — agora o n8n gera storyboard internamente.

### B) Prompt novo: `/assemble-from-template` — **n8n envia assembly_package.json para Claude Code**

```
Entrada: {assembly_package.json} (storyboard aprovado + templates + assets)
Tarefa:
1. Para cada shot em storyboard.shots, gere um Scene_{shot_id}.tsx que importe Camera e TheWorld templates.
2. Use as regras em templates.templateRules para mapear nodes -> components (ex.: CharacterCardGrid para cartões).
3. Preencha durationFrames, start/end, zoom, voiceSegment.id placeholders.
4. Gere index.tsx com Composition(s) adequadas para Remotion e export padrão para render.
5. Crie render_pipeline.sh com scripts: "render:preview" (low res) e "render:final".
6. Gere assembly_log.json com mapeamento shot->arquivo e warnings (missing assets, licenças).
Saída: zip com .tsx files + assembly_log.json + README.
Regras: não altere o storyboard (apenas mapear). IDs snake_case.

```

### C) Prompt novo: `/sync-audio` — quando audioUrl é enviado ao Claude Code