# Create New Project - Cria estrutura completa de novo projeto autônomo
# Uso: /create-new-project [project-name] [main-theme] [sub-theme]
# Exemplo: /create-new-project "spider-man-evolution" "Spider-Man" "Evolução do personagem através das décadas"

Crie um novo projeto de vídeo completamente autônomo com estrutura completa:

## Input Parameters:
- **Project Name:** {project-name}
- **Main Theme:** {main-theme}
- **Sub Theme:** {sub-theme}

## Ações Automáticas:

### 1. Criar Estrutura de Pastas
```
projects/{project-name}/
├── .claude/commands/
├── docs/research/
├── src/components/
├── src/scenes/
├── public/images/comics/
├── public/images/characters/
├── public/images/graphics/
├── public/audio/narration/
├── public/audio/music/
├── public/audio/sfx/
├── public/fonts/
├── exports/final/
├── exports/drafts/
├── exports/social/
└── scripts/
```

### 2. Copiar Template Base
- Copiar `_project_template/` inteiro
- Personalizar arquivos de configuração
- Adaptar documentação para o tema específico

### 3. Personalizar Slash Commands
Substituir placeholders nos arquivos .claude/commands/:
- {PROJECT_NAME} → {project-name}
- {MAIN_THEME} → {main-theme}
- {SUB_THEME} → {sub-theme}
- {DESCRIPTION} → descrição gerada automaticamente

### 4. Configurar Arquivos Base
- **package.json** com nome do projeto
- **README.md** com informações específicas
- **remotion.config.ts** otimizado para tema
- **.gitignore** apropriado

### 5. Criar Documentação Inicial
- **docs/research/** com links de pesquisa
- **docs/script.md** template vazio pronto
- **docs/storyboard.md** checklist visual
- **docs/production-notes.md** guia de produção

### 6. Setup Técnico
- Estrutura Remotion básica
- Componentes VirtualCamera adaptados
- Scene templates personalizados
- Scripts de build/render/export

## Configuração Personalizada:

### Cores e Branding:
Baseado no {main-theme}:
- **Comics Marvel:** Vermelho, azul, amarelo
- **Comics DC:** Preto, azul prata, amarelo dourado
- **Análise Crítica:** Cinza, branco, destaque em cor única

### Fontes Sugeridas:
- **Narrativas Épicas:** Serif (Georgia, Playfair Display)
- **Análise Técnica:** Sans-serif (Inter, Roboto)
- **Conteúdo Moderno:** Mix serif/sans-serif

### Estilo Visual:
- Inspiração: Alt Shift X
- Técnica: JHart Method
- Duração padrão: 18 minutos
- Resolução: 1920x1080

## Arquivos Personalizados:

### 1. README.md
```markdown
# 🎬 {project-name}

## 📋 Descrição
**Tema:** {main-theme}
**Subtema:** {sub-theme}
**Duração:** 18-20 minutos
**Estilo:** Alt Shift X

## 🚀 Início Rápido
[comandos específicos do projeto]
```

### 2. package.json
```json
{
  "name": "{project-name}",
  "description": "Análise profunda de {main-theme}: {sub-theme}",
  "version": "1.0.0"
}
```

### 3. remotion.config.ts
Configuração otimizada para tema e duração específicos

## Scripts de Automação Criados:

### build.sh
```bash
#!/bin/bash
npm install
npm run build
echo "✅ Build completo para {project-name}"
```

### render.sh
```bash
#!/bin/bash
npm run render
echo "🎬 Renderização concluída"
echo "📍 Vídeo salvo em: exports/final/"
```

### export.sh
```bash
#!/bin/bash
npm run export
echo "📤 Exportação finalizada"
echo "🎯 Ready para upload!"
```

## Comandos Disponíveis Após Criação:

Dentro do novo projeto:
```bash
/claude generate-script "foco específico"
/claude create-scene "tipo" "conteúdo" "duração"
/claude assets-needed "docs/script.md"
/claude storyboard
```

## Verificação de Criação:

### ✅ Estrutura Criada:
- [ ] Pasta do projeto em `projects/`
- [ ] Todos os subdiretórios presentes
- [ ] Arquivos de configuração personalizados
- [ ] Slash commands adaptados
- [ ] Scripts de automação funcionais

### ✅ Setup Técnico:
- [ ] package.json configurado
- [ ] remotion.config.ts otimizado
- [ ] Estrutura Remotion básica
- [ ] Dependencies instaladas

### ✅ Documentação:
- [ ] README.md personalizado
- [ ] Guia de início rápido
- [ ] Estrutura de pastas documentada
- [ ] Exemplos de uso

## Próximos Passos:

1. **cd projects/{project-name}/**
2. **npm install**
3. **/claude generate-script "seu-foco-específico"**
4. **/claude assets-needed**
5. **Começar coleta de assets**
6. **Produzir vídeo!**

## Benefícios da Estrutura:

- **Autonomia Total:** Cada projeto é completamente independente
- **Escala Infinita:** Quantos projetos quiser simultaneamente
- **Organização Perfeita:** Nunca mistura conteúdo de projetos diferentes
- **Backup Fácil:** Cada projeto tem seu próprio backup
- **Performance Isolada:** Problemas em um projeto não afetam outros
- **Versionamento Individual:** Git por projeto se desejar

Crie o projeto completo agora com todos estes elementos!