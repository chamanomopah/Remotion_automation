# PRD - Sistema Inteligente de Vídeos de Comics

## 🎯 **Visão do Produto**
Criar um sistema automatizado de produção de vídeos no estilo Alt Shift X para um canal de YouTube focado em análises profundas de quadrinhos Marvel e DC.

## 👥 **Público-Alvo**
- Criador de conteúdo que quer produzir vídeos longos e detalhados
- Conhecimento básico/médio em programação
- Deseja escalar produção mantendo qualidade profissional

## 🔥 **Problema Principal**
Produção manual de vídeos complexos no estilo Alt Shift X exige:
- 40-80 horas por vídeo
- Conhecimento avançado de Adobe After Effects
- Trabalho manual de sincronização visual-auditiva
- Pesquisa extensiva de conteúdo

## 💡 **Solução Proposta**
Sistema automatizado em 3 fases:
1. **n8n**: Pesquisa + roteiro + storyboard automáticos
2. **Claude Code + Remotion**: Geração programática de vídeo
3. **Manual**: Áudio + finalização

---

## 🏗️ **Arquitetura do Sistema**

### **FASE 1: Motor de Workflow n8n**
**Responsabilidade**: Inteligência de conteúdo

#### **Entradas**:
- Nome do personagem (ex: "Spider-Man")
- API Key Comic Vine
- Opções de qualidade

#### **Processo**:
1. **Integração Comic Vine API**:
   - `/search/` → Encontrar personagem
   - `/character/4005-{id}/` → Detalhes completos
   - `/issues/` → Quadrinhos do personagem
   - `/story_arcs/` → Arcos narrativos

2. **Motor de Análise de Conteúdo**:
   - Sistema de pontuação de potencial
   - Cálculo de duração estimada
   - Validação de assets visuais

3. **Geração de Storyboard**:
   - Templates paramétricos de cenas
   - Mapeamento info ↔ visual
   - Geração de roteiro completo

#### **Saídas**:
```json
{
  "character": { "name": "Spider-Man", "id": "5760" },
  "analysis": { "potential_score": 85, "duration_minutes": 127 },
  "storyboard": { "scenes": [...], "assets": [...] },
  "script": { "segments": [...], "total_words": 15000 }
}
```

---

### **FASE 2: Claude Code + Remotion**
**Responsabilidade**: Geração programática de vídeo

#### **Método: "V0 to Code"**
- Não codificar animações manualmente
- Gerar componentes React via prompts
- Compor vídeos como "Lego"

#### **Componentes Principais**:
1. **VirtualCamera**: Simulação de câmera 2D estilo Alt Shift X
2. **CharacterCard**: Cartões de personagem paramétricos
3. **RelationshipGraph**: Grafos de relacionamentos SVG
4. **TimelineScroll**: Linhas de tempo animadas
5. **HighlightText**: Texto destacado animado

#### **Workflow**:
1. Claude Code gera componentes baseados no JSON do n8n
2. Remotion renderiza vídeo em alta qualidade
3. Output: MP4 sem áudio final

---

### **FASE 3: Finalização Manual**
**Responsabilidade**: Toque humano essencial

#### **Processo**:
1. Gravação de áudio (narrativa própria)
2. Sincronização áudio-vídeo
3. Ajustes finos e upload

---

## 📊 **Métricas de Sucesso**

### **Métricas Técnicas**:
- Tempo de produção por vídeo: < 8 horas (vs 40-80h manual)
- Taxa de sucesso de automação: > 90%
- Qualidade visual: equivalente a After Effects

### **Métricas de Conteúdo**:
- Duração dos vídeos: 45-120 minutos
- Engajamento: Similar a canais profissionais
- Consistência visual: 100% entre vídeos

### **Métricas de Negócio**:
- Frequência de upload: 1-2 vídeos/semana (vs 1/mês manual)
- Custo de produção: Redução de 80%
- Escalabilidade: Fácil expansão para outros nichos

---

## 🎨 **Requisitos de Estilo**

### **Estilo Alt Shift X**:
- **Câmera Virtual 2D**: Movimentos suaves sobre mosaico visual
- **Composição Multi-camadas**: Múltiplos elementos simultâneos
- **Tipografia Cinética**: Texto animado sincronizado
- **Motion Blur Profissional**: `<CameraMotionBlur>` do Remotion

### **Especificações Técnicas**:
- Resolução: 1920x1080 @ 30fps
- Container: 10.000x10.000px (TheWorld)
- Components: TypeScript + React + Remotion
- Export: MP4 H.264

---

## 📁 **Arquivos de Suporte por Fase**

### **FASE 1 - n8n + Comic Vine API**
**Documentação Técnica:**
- `docs_support/comic-vine-api-complete-guide.md` - Guia completo de URLs e endpoints
- `docs_support/comicvine_api_docs.md` - Referência oficial da API
- `_contexto_do_projeto/fase1_mapeamento_api.md` - Mapeamento de campos e pontuação

**Código Base:**
- `_contexto_do_projeto/sistema_potencial_conteudo.js` - Analisador de potencial (implementar)
- `_contexto_do_projeto/sistema_analise_potencial.js` - Motor de análise (implementar)
- `_contexto_do_projeto/checklist_qualidade_gap_detection.js` - Controle de qualidade (implementar)
- `_contexto_do_projeto/integracao_n8n_completa.md` - Workflow completo de 10 nodes

### **FASE 2 - Remotion + Claude Code**
**Documentação Técnica:**
- `docs_support/remotion_docs.md` - Documentação oficial do Remotion
- `docs_video_creation/remotion+claudecode.md` - Método "V0 to Code"
- `docs_video_creation/JHart_method_creating_technical_videos_with_claude_code_and_remotion.md` - Método JHart
- `_contexto_do_projeto/fase2_templates_storyboard.md` - Templates paramétricos de cenas

**Estilo e Referência Visual:**
- `docs_support/01-alt-shift-x-video-analysis.md` - Análise completa do estilo Alt Shift X
- `docs_support/02-kinetic-typography-guide.md` - Guia completo de tipografia cinética
- `docs_support/03-marvel-dc-style-guides.md` - Referências visuais Marvel/DC
- `docs_video_creation/alt_shift_x_style.md` - Guia completo do estilo Alt Shift X
- `scripts/spider-man-script.md` - Exemplo de roteiro completo

**Implementação Áudio-Visual:**
- `docs_support/04-deepgram-api-documentation.md` - Documentação completa Deepgram API
- `docs_support/05-audio-sync-react-patterns.md` - Padrões React para sincronização áudio

### **FASE 3 - Finalização**
**Referência de Conteúdo:**
- `_contexto_do_projeto/resumo_simples.md` - Resumo das 3 fases
- `scripts/spider-man-script.md` - Modelo de roteiro para narração

---

## 🔧 **Requisitos Técnicos**

### **Dependências**:
- **n8n**: Automação de workflows
- **Remotion**: Framework de geração de vídeo
- **Comic Vine API**: Fonte de dados
- **Claude Code**: Codificação assistida por IA
- **Deepgram API**: Transcrição com timestamps precisos
- **React**: Componentes para sincronização áudio-visual

### **Performance**:
- Tempo de render: < 2 horas para vídeo de 1 hora
- Uso de memória: < 16GB RAM
- Armazenamento: 50GB para assets médios
- FPS: 60 FPS constante em dispositivos de baixa potência
- Sincronização: < 50ms precisão palavra-a-palavra

---

## 🎨 **Implementação Técnica Detalhada**

### **Virtual Camera 2D (Estilo Alt Shift X)**

**Arquitetura:**
- Container "TheWorld": 10.000x10.000px
- VirtualCamera: coordenadas {x, y, zoom} interpoladas
- `<CameraMotionBlur>` para profissionalismo

**Especificações Técnicas:**
```javascript
// Core camera component
const VirtualCamera = ({ x, y, zoom, children }) => (
  <div
    style={{
      position: 'absolute',
      width: '10000px',
      height: '10000px',
      transform: `translate(${x}px, ${y}px) scale(${zoom})`,
      transition: 'transform 0.3s ease-out'
    }}
  >
    {children}
  </div>
);
```

### **Tipografia Cinética Avançada**

**Padrões de Animação (Baseado em docs_support/02-kinetic-typography-guide.md):**

1. **Create/Destroy**: Elementos criados através de agregação
2. **Enter/Exit**: Transições de entrada/saída suaves
3. **Morphing**: Transformação palavra → gráfico
4. **Arc Motion**: Movimentos ao longo de arcos orgânicos
5. **Storytelling**: Animações narrativas sincronizadas

**Implementação React:**
```javascript
// Kinetic typography component com performance otimizada
const KineticText = ({ word, isActive, index, total }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (isActive && ref.current) {
      // Direct DOM manipulation para 60 FPS
      ref.current.classList.add('active-word');
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isActive]);

  return (
    <span
      ref={ref}
      className="word"
      style={{
        animationDelay: `${index * 0.1}s`
      }}
    >
      {word.text}
    </span>
  );
};
```

### **Sistema de Cores Marvel/DC**

**Paletas Oficiais (docs_support/03-marvel-dc-style-guides.md):**
- **Superman**: Blue (#0476D0), Red (#E23636), Yellow (#FCD116)
- **Batman**: Dark Gray (#4A4A4A), Black (#000000), Yellow (#FFC72C)
- **Spider-Man**: Red (#DF1F2D), Blue (#2B3784), Black webbing
- **Wonder Woman**: Red (#C8102E), Blue (#012169), Gold (#FFD700)

**Implementação Dinâmica:**
```javascript
const CharacterTheme = ({ character, children }) => {
  const theme = CHARACTER_THEMES[character];
  return (
    <div
      style={{
        '--primary-color': theme.primary,
        '--secondary-color': theme.secondary,
        '--accent-color': theme.accent
      }}
      className="character-themed-scene"
    >
      {children}
    </div>
  );
};
```

### **Deepgram API - Sincronização Precisa**

**Configuração para Transcrição com Timestamps:**
```javascript
const deepgramConfig = {
  model: "nova-3",
  utterances: true,    // Segmentação semântica
  diarize: true,       // Identificação de falantes
  smart_format: true,  // Capitalização e pontuação
  utterance_split: 1.0 // Sensibilidade de segmentação
};

// Processamento de resposta
const processTranscript = (response) => {
  return response.results.utterances.map(utt => ({
    id: utt.id,
    speaker: utt.speaker,
    start: utt.start,
    end: utt.end,
    text: utt.transcript,
    words: utt.words.map(w => ({
      text: w.word,
      start: w.start,
      end: w.end,
      confidence: w.confidence
    }))
  }));
};
```

### **Audio Sync Patterns (Performance Otimizada)**

**Padrão 1: Direct DOM Manipulation**
- Modificação DOM fora do React render cycle
- <1ms por timeupdate event vs >400ms com state
- 60 FPS constante mesmo em low-end devices

**Implementação:**
```javascript
const AudioSyncComponent = ({ transcript, audioSrc }) => {
  const playerRef = useRef(null);
  const wordsRef = useRef(null);
  const activeWordRef = useRef(-1);

  useEffect(() => {
    const onTimeUpdate = () => {
      const currentTime = playerRef.current.currentTime;
      const activeIndex = binarySearchWord(transcript.words, currentTime);

      // Apenas atualizar se mudou (evita renders desnecessários)
      if (activeIndex !== activeWordRef.current) {
        updateActiveWord(wordsRef.current, activeIndex, activeWordRef.current);
        activeWordRef.current = activeIndex;
      }
    };

    playerRef.current.addEventListener('timeupdate', onTimeUpdate);
    return () => playerRef.current.removeEventListener('timeupdate', onTimeUpdate);
  }, [transcript]);
};
```

### **Componentes "Lego" Paramétricos**

**CharacterCard:**
```javascript
const CharacterCard = ({ character, stats, image, position }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="character-card"
    style={position}
  >
    <img src={image} alt={character.name} />
    <h3>{character.name}</h3>
    <div className="stats">
      {stats.map(stat => (
        <StatBar key={stat.name} value={stat.value} label={stat.name} />
      ))}
    </div>
  </motion.div>
);
```

**RelationshipGraph:**
```javascript
const RelationshipGraph = ({ characters, relationships }) => {
  const nodes = characters.map(char => ({ id: char.id, label: char.name }));
  const links = relationships.map(rel => ({
    source: rel.from,
    target: rel.to,
    type: rel.type,
    strength: rel.strength
  }));

  return (
    <svg className="relationship-graph">
      {links.map(link => (
        <Link key={`${link.source}-${link.target}`} {...link} />
      ))}
      {nodes.map(node => (
        <Node key={node.id} {...node} />
      ))}
    </svg>
  );
};
```

### **Workflow de Render Otimizado**

**Pipeline de Processamento:**
1. **Pre-render**: Validação de assets e otimização
2. **Scene Composition**: Montagem de cenas com componentes paramétricos
3. **Camera Animation**: Movimentos suaves da câmera virtual
4. **Audio Sync**: Sincronização palavra-a-palavra com Deepgram timestamps
5. **Final Render**: Exportação MP4 H.264 1920x1080@30fps

**Otimizações de Performance:**
- Virtual scrolling para transcripts longos
- Memoization de componentes React
- Binary search O(log n) para word lookup
- Throttle de updates para 100ms intervals
- Direct DOM manipulation para sincronização visual

---

## 🛠️ **Arquitetura de Componentes React**

### **Estrutura de Pastas:**
```
src/
├── components/
│   ├── camera/
│   │   ├── VirtualCamera.tsx
│   │   └── CameraMotionBlur.tsx
│   ├── typography/
│   │   ├── KineticText.tsx
│   │   └── HighlightText.tsx
│   ├── comic/
│   │   ├── CharacterCard.tsx
│   │   ├── RelationshipGraph.tsx
│   │   └── TimelineScroll.tsx
│   └── audio/
│       ├── AudioSync.tsx
│       └── TranscriptionPlayer.tsx
├── hooks/
│   ├── useTranscriptSync.ts
│   └── useVirtualCamera.ts
└── utils/
    ├── deepgram.ts
    ├── binarySearch.ts
    └── colorThemes.ts
```

---

## 🚧 **Riscos e Mitigações**

### **Alto Risco**:
- **Limites da Comic Vine API**: Rate limiting, dados incompletos
  - *Mitigação*: Cache local, API backup, fallback manual

- **Curva de Aprendizado Remotion**: Curva íngreme
  - *Mitigação*: Templates pré-prontos, slash commands

### **Risco Médio**:
- **Consistência de Qualidade**: Variação na qualidade automática
  - *Mitigação*: Quality gates, review manual obrigatório

- **Sincronização de Áudio**: Complexa sincronização áudio-vídeo
  - *Mitigação*: Deepgram API para timestamps

---

## 📅 **Timeline MVP**

### **Sprint 1 (2 semanas)**: Fase 1 - n8n
- [ ] Configurar Comic Vine API
- [ ] Implementar analisadores JavaScript
- [ ] Testar com 3 personagens
- [ ] Validar output JSON

### **Sprint 2 (2 semanas)**: Fase 2 - Remotion
- [ ] Setup projeto Remotion
- [ ] Implementar VirtualCamera
- [ ] Criar componentes Lego
- [ ] Slash commands para Claude Code

### **Sprint 3 (1 semana)**: Fase 3 - Integração
- [ ] Processo de áudio
- [ ] Sistema de sincronização
- [ ] Pipeline completo

### **Sprint 4 (1 semana)**: QA & Otimização
- [ ] Teste completo
- [ ] Otimização de performance
- [ ] Documentação final

---

## 🎯 **Definição MVP**

**Produto Mínimo Viável** = Sistema capaz de:
1. Receber nome de personagem → Gerar vídeo completo de 45+ minutos
2. Manter qualidade visual estilo Alt Shift X
3. Produzir em < 8 horas vs 40+ horas manual
4. Funcionar para personagens principais Marvel/DC

---

## 📋 **Roadmap Futuro**

### **Fase 2 (Pós-MVP)**:
- Integração com outras APIs (Marvel oficial, DC)
- Templates para outros nichos (filmes, jogos)
- Sistema de sugestão automática de conteúdo

### **Fase 3 (Escala)**:
- Upload automático para YouTube
- Otimização SEO
- Integração de analytics
- Suporte multi-idiomas

---

## 🔄 **Loop de Feedback**

### **Testes com Usuário**:
- Teste com 3 vídeos completos
- Coleta de feedback visual
- Métricas de engajamento
- Ajuste iterativo

### **Monitoramento Técnico**:
- Acompanhamento de performance
- Registro de erros
- Analytics de uso da API
- Otimização de tempo de render

---

## 📈 **Impacto no Negócio**

### **Redução de Custos**:
- Tempo de produção: -80%
- Custos de software: Adobe CC → Free/Open source
- Horas de trabalho: 40h → 8h por vídeo

### **Potencial de Receita**:
- Frequência de upload: 4x/mês → 16x/mês
- Consistência de conteúdo: Qualidade profissional sempre
- Escalabilidade: Fácil expansão

---

*Este PRD serve como guia estratégico para o desenvolvimento, mantendo o foco no valor real: automatizar produção de vídeos profissionais sem sacrificar qualidade.*