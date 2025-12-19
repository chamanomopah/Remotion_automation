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

## 📁 **Arquivos de Suporte por Fase**

### **FASE 1 - n8n + Comic Vine API**
**APIs Principais:**
- `docs_support/comic-vine-api-complete-guide.md` - Guia completo de URLs e endpoints
- `docs_support/comicvine_api_docs.md` - Referência oficial da API
- `docs_support/1-marvel-api-mediawiki.md` - API Marvel oficial (backup)
- `docs_support/2-dc-comics-api-mediawiki.md` - API DC Comics (backup)
- `_contexto_do_projeto/fase1_mapeamento_api.md` - Mapeamento de campos e pontuação

**n8n Avançado:**
- `docs_support/3-n8n-http-request-advanced.md` - Padrões avançados HTTP Request
- `docs_support/4-n8n-code-node-examples.md` - Exemplos JavaScript Code Node

**Código Base:**
- `_contexto_do_projeto/sistema_potencial_conteudo.js` - Analisador de potencial (implementar)
- `_contexto_do_projeto/sistema_analise_potencial.js` - Motor de análise (implementar)
- `_contexto_do_projeto/checklist_qualidade_gap_detection.js` - Controle de qualidade (implementar)
- `_contexto_do_projeto/integracao_n8n_completa.md` - Workflow completo de 10 nodes

### **FASE 2 - Remotion + Claude Code**
**Remotion Avançado:**
- `docs_support/remotion_docs.md` - Documentação oficial do Remotion
- `docs_support/5-remotion-animation-patterns.md` - Padrões de animação avançados
- `docs_support/7-remotion-svg-graphics.md` - Gráficos SVG complexos
- `docs_video_creation/remotion+claudecode.md` - Método "V0 to Code"
- `docs_video_creation/JHart_method_creating_technical_videos_with_claude_code_and_remotion.md` - Método JHart

**Claude Code MCP:**
- `docs_support/8-claude-mcp-guide.md` - Model Context Protocol para integração de APIs

**Estilo e Design:**
- `docs_support/01-alt-shift-x-video-analysis.md` - Análise completa do estilo Alt Shift X
- `docs_support/02-kinetic-typography-guide.md` - Guia de tipografia cinética
- `docs_support/03-marvel-dc-style-guides.md` - Guias de estilo Marvel/DC
- `docs_video_creation/alt_shift_x_style.md` - Guia completo do estilo Alt Shift X
- `_contexto_do_projeto/fase2_templates_storyboard.md` - Templates paramétricos de cenas
- `scripts/spider-man-script.md` - Exemplo de roteiro completo

### **FASE 3 - Finalização**
**Áudio e Sincronização:**
- `docs_support/04-deepgram-api-documentation.md` - API para transcrição com timestamps
- `docs_support/05-audio-sync-react-patterns.md` - Padrões de sincronização áudio-visual

**Referência de Conteúdo:**
- `_contexto_do_projeto/resumo_simples.md` - Resumo das 3 fases
- `scripts/spider-man-script.md` - Modelo de roteiro para narração

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

## 🔧 **Requisitos Técnicos**

### **Dependências**:
- **n8n**: Automação de workflows
- **Remotion**: Framework de geração de vídeo
- **Comic Vine API**: Fonte de dados
- **Claude Code**: Codificação assistida por IA

### **Performance**:
- Tempo de render: < 2 horas para vídeo de 1 hora
- Uso de memória: < 16GB RAM
- Armazenamento: 50GB para assets médios

---

## 🚧 **Riscos e Mitigações**

### **Alto Risco**:
- **Limites da Comic Vine API**: Rate limiting, dados incompletos
  - *Mitigação*: Cache local, API backup (Marvel/DC), fallback manual

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