# 🎬 Spider-Man Video

## 📋 Descrição
**Tema:** Spider-Man
**Subtema:** Teste do que a criação de vídeo com código pode fazer e criar
**Duração Estimada:** 18-20 minutos
**Estilo:** Alt Shift X - Análise Profunda

## 🚀 Início Rápido

### 1. Instalação
```bash
npm install
npm run dev
```

### 2. Desenvolvimento
```bash
# Gerar roteiro
/claude generate-script

# Criar cenas
/claude create-scene [tipo] [conteúdo]

# Listar assets necessários
/claude assets-needed

# Gerar storyboard
/claude storyboard
```

### 3. Produção
```bash
# Build do projeto
npm run build

# Renderização
npm run render

# Exportar vídeo final
npm run export
```

## 📁 Estrutura do Projeto

```
spider-man-video/
├── .claude/commands/          # Slash commands personalizados
├── docs/                     # Documentação do projeto
├── src/                      # Código-fonte Remotion
├── public/                   # Assets do projeto
├── exports/                  # Vídeos gerados
├── scripts/                  # Scripts de automação
└── package.json              # Dependências
```

## 🎯 Slash Commands Disponíveis

- **generate-script** - Gera roteiro completo estilo Alt Shift X
- **create-scene** - Cria cenas específicas (intro, comparison, timeline, etc.)
- **assets-needed** - Lista de assets necessários baseada no roteiro
- **storyboard** - Gera storyboard mínimo obrigatório

## 📊 Progresso do Projeto

### ✅ Planejamento
- [x] Estrutura criada
- [ ] Pesquisa inicial
- [ ] Roteiro gerado
- [ ] Storyboard definido

### ⏳ Produção
- [ ] Assets coletados
- [ ] Cenas criadas
- [ ] Áudio gravado/gerado
- [ ] Vídeo renderizado

### ⏳ Finalização
- [ ] Revisão final
- [ ] Ajustes de qualidade
- [ ] Exportação
- [ ] Upload

## 🎨 Estilo Visual

- **Cores Primárias:** Vermelho #EF233C, Azul #2B2D42, Amarelo #FFD60A
- **Fontes:** Inter (sans-serif), Playfair Display (serif)
- **Estilo:** Dinâmico, jovem, heroico
- **Inspiração:** Alt Shift X, JHart Method, quadrinhos Marvel

## 📚 Referências

- Template universal de roteiro
- Documentação Remotion
- Guia de estilo Alt Shift X
- Método JHart
- Amazing Fantasy #15
- História do Spider-Man

## 🔧 Configuração

### Remotion Config
- FPS: 30
- Resolução: 1920x1080
- Duração: 20 minutos (1200 segundos)
- Codec: H.264

### Performance
- Otimizado para longa duração
- CameraMotionBlur habilitado
- Assets pré-carregados
- Lazy loading implementado

## 📝 Notas de Produção

Este é um projeto teste para demonstrar o poder da criação de vídeo automatizada usando código. Foco em explorar técnicas avançadas de animação, narrativa e visual effects através da plataforma Remotion.

---

**Criado em:** 2025-12-18
**Última atualização:** 2025-12-18
**Status:** Em desenvolvimento