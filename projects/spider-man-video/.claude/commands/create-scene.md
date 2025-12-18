# Create Scene - Gera cena específica do vídeo
# Uso: /create-scene [scene-type] [content] [duration]
# Exemplo: /create-scene "character-intro" "Spider-Man origins" "30s"

Transforme o conteúdo em uma cena Remotion completa seguindo os templates do projeto:

## Input:
Tipo de Cena: {scene-type}
Conteúdo: {content}
Duração: {duration}

## Tipos de Cena Disponíveis:

### character-intro
- Slide de título com nome do personagem
- Imagem principal com zoom suave
- Texto de introdução animado
- Background temático (cores do personagem)

### comparison
- Split screen: duas versões lado a lado
- Labels animados (ex: "Comic" vs "Filme")
- Zoom focus alternado entre lados
- Efeito de transição suave

### timeline
- Linha do tempo horizontal
- Marcadores de eventos importantes
- Imagens de capas/quadrinhos
- Animação progressiva ao longo da timeline

### relationship-graph
- Nós (personagens) e conexões
- Animação de surgimento progressivo
- Cores por tipo de relação (aliado/inimigo/família)
- Zoom e foco em conexões específicas

### evidence-panel
- Quote destacado ou evidência específica
- Imagem de support (quadrinho/cena)
- Texto explicativo animado
- Highlight no elemento importante

## Requisitos:
- Usar componentes existentes do projeto
- Manter consistência visual
- Otimizado para performance
- Incluir timing preciso
- Coordenar com sistema VirtualCamera

## Output:
Código .tsx completo da cena + instruções de integração

Gere a cena específica agora.