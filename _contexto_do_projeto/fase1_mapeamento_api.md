# 📊 Fase 1: Mapeamento Completo da Comic Vine API

## 🎯 **Objetivo**
Identificar e pontuar TODOS os campos úteis da Comic Vine API para determinar o potencial de conteúdo de cada personagem.

## 🗂️ **Endpoints Principais e Campos Úteis**

### **1. `/search/` - Busca Inicial**
```json
{
  "endpoint": "/search/",
  "parametros": {
    "query": "nome_personagem",
    "resources": "character",
    "api_key": "sua_chave",
    "format": "json"
  },
  "campos_uteis": ["id", "name", "site_detail_url"],
  "pontuacao": {
    "id": 10, // Essencial para detalhes
    "name": 8, // Nome do personagem
    "site_detail_url": 5 // Link para detalhes
  }
}
```

### **2. `/character/4005-{id}/` - Detalhes do Personagem**
```json
{
  "endpoint": "/character/4005-{id}/",
  "campos_criticidade": {
    // 🔴 CRÍTICOS (Pontuação: 10)
    "name": 10, // Nome oficial
    "real_name": 10, // Identidade secreta
    "description": 10, // Biografia completa
    "image": 10, // Foto principal do personagem

    // 🟡 MUITO IMPORTANTES (Pontuação: 8-9)
    "aliases": 9, // Apelidos e nomes alternativos
    "birth": 8, // Data/local de nascimento
    "gender": 8, // Gênero
    "origin": 9, // Origem dos poderes

    // 🟠 IMPORTANTES (Pontuação: 6-7)
    "powers": 7, // Lista de poderes e habilidades
    "abilities": 7, // Habilidades especiais
    "strength_class": 6, // Nível de força
    "intelligence": 6, // Nível de inteligência
    "speed": 6, // Nível de velocidade
    "durability": 6, // Nível de resistência
    "power_grid": 7, // Gráfico de poderes completo
    "appearance": 7, // Aparência física

    // 🔴 AZUL RELEVANTES (Pontuação: 4-5)
    "first_appearance": 5, // Primeira aparição
    "creators": 5, // Criadores do personagem
    "teams": 5, // Times e grupos
    "enemies": 5, // Inimigos principais
    "allies": 5, // Aliados principais
    "relatives": 4, // Familiares
    "publisher": 4, // Editora (Marvel, DC, etc.)
    "deck": 4, // Descrição curta

    // ⚪ OPCIONAIS (Pontuação: 1-3)
    "character_friends": 3, // Lista de amigos
    "character_enemies": 3, // Lista detalhada de inimigos
    "movies": 2, // Aparições em filmes
    "games": 2, // Aparições em jogos
    "issue_credits": 3 // Lista de quadrinhos onde aparece
  }
}
```

### **3. `/issues/` - Quadrinhos do Personagem**
```json
{
  "endpoint": "/issues/",
  "parametros": {
    "filter": "character:4005-{id}",
    "sort": "cover_date:desc",
    "limit": 100
  },
  "campos_uteis": {
    "id": 8, // ID do quadrinho
    "name": 7, // Título do quadrinho
    "issue_number": 6, // Número da edição
    "cover_date": 7, // Data da capa
    "image": 10, // Capa do quadrinho (ESSENCIAL para storyboard)
    "description": 8, // Sinopse
    "volume": 6, // Série a que pertence
    "person_credits": 5, // Autores (roteiristas, desenhistas)
    "character_credits": 4, // Outros personagens
    "team_credits": 4, // Times envolvidos
    "location_credits": 3, // Locais importantes
    "concept_credits": 3, // Conceitos abordados
    "story_arc_credits": 7, // Arcos narrativos
    "store_date": 3, // Data de lançamento
    "price": 2 // Preço
  }
}
```

### **4. `/story_arcs/` - Arcos Narrativos**
```json
{
  "endpoint": "/story_arcs/",
  "campos_uteis": {
    "id": 8,
    "name": 9, // Nome do arco narrativo
    "description": 8, // Descrição completa
    "image": 9, // Imagem do arco
    "first_issue": 7, // Primeiro quadrinho
    "last_issue": 7, // Último quadrinho
    "issue_count": 6, // Quantidade de edições
    "publisher": 5
  }
}
```

### **5. `/volumes/` - Séries/Comics**
```json
{
  "endpoint": "/volumes/",
  "campos_uteis": {
    "id": 7,
    "name": 8, // Nome da série
    "description": 7, // Descrição da série
    "image": 8, // Logo/capa da série
    "start_year": 6, // Ano de início
    "count_of_issues": 6, // Total de edições
    "publisher": 6, // Editora
    "first_issue": 5, // Primeira edição
    "last_issue": 5 // Última edição
  }
}
```

## 📈 **Sistema de Pontuação de Potencial de Conteúdo**

### **Fórmula de Cálculo**
```
PONTUACAO_TOTAL =
  (CAMPOS_CRITICOS * 10) +
  (CAMPOS_MUITO_IMPORTANTES * 8.5) +
  (CAMPOS_IMPORTANTES * 6.5) +
  (CAMPOS_RELEVANTES * 4.5) +
  (CAMPOS_OPCIONAIS * 2)

PONTUACAO_ASSETS =
  (IMAGENS_DISPONIVEIS * 15) +
  (QUADRINHOS_COM_CAPA * 8) +
  (ARCOS_COM_IMAGEM * 10)

POTENCIAL_VIDEO_MINUTOS =
  (PONTUACAO_TOTAL / 50) +
  (PONTUACAO_ASSETS / 30) +
  (NUMERO_QUADRINHOS * 0.5)
```

### **Classificação de Potencial**
- **🔴 Excelente (80+ pontos)**: Vídeos de 2+ horas
- **🟡 Ótimo (60-79 pontos)**: Vídeos de 1-2 horas
- **🟠 Bom (40-59 pontos)**: Vídeos de 45-60 minutos
- **🔵 Médio (20-39 pontos)**: Vídeos de 20-45 minutos
- **⚪ Baixo (<20 pontos)**: Vídeos curtos ou inviáveis

## 🔍 **Validação de Assets Visuais**

### **Checklist de Assets Essenciais**
```javascript
const assetsEssential = {
  // 🔴 OBRIGATÓRIOS
  character_image: 20, // Foto principal do personagem
  comic_covers: 15, // Capas de quadrinhos

  // 🟡 MUITO IMPORTANTES
  team_images: 10, // Fotos dos times
  enemy_images: 10, // Fotos dos inimigos
  power_grid_image: 8, // Gráfico de poderes

  // 🟠 IMPORTANTES
  story_arc_images: 6, // Imagens dos arcos
  volume_covers: 5, // Capas das séries
  creator_photos: 3, // Fotos dos criadores

  // 🔵 DESEJÁVEIS
  comic_pages: 4, // Páginas internas dos quadrinhos
  location_images: 3, // Locais importantes
  concept_art: 2 // Arte conceitual
}
```

### **Fórmula de Viabilidade Visual**
```
VIABILIDADE_VISUAL =
  (ASSETS_ESSENCIAIS * peso) +
  (QUALIDADE_DAS_IMAGENS * fator) +
  (VARIEDADE_DE_TIPOS * bonus)

VIABILIDADE_MINIMA = 70 // Ponto de corte para vídeos longos
```

## 📋 **Estrutura de Dados para n8n**

### **Output esperado para cada personagem**
```json
{
  "character_id": "4005-1234",
  "name": "Spider-Man",
  "potencial_score": 85,
  "video_duration_minutes": 127,
  "assets_score": 78,
  "viability": "EXCELLENT",

  "available_content": {
    "biografia": {
      "has_data": true,
      "word_count": 2500,
      "visual_assets": 3
    },
    "poderes": {
      "has_data": true,
      "power_count": 8,
      "visual_assets": 2
    },
    "historia": {
      "has_data": true,
      "comics_count": 342,
      "cover_images": 85,
      "story_arcs": 12
    },
    "relacionamentos": {
      "has_data": true,
      "allies_count": 15,
      "enemies_count": 23,
      "teams_count": 4
    }
  },

  "recommendations": [
    "Foco na evolução do personagem (muitos quadrinhos)",
    "Muitos inimigos para explorar",
    "Ótimo potencial para cenas de batalha"
  ],

  "missing_content": [
    "Poucas aparições em jogos",
    "Limitado conceitual art disponível"
  ]
}
```

## 🎯 **Próximos Passos**
1. Implementar função de coleta e pontuação
2. Criar validador de assets visuais
3. Desenvolver calculadora de duração
4. Gerar recomendações automáticas
5. Integrar com template do n8n