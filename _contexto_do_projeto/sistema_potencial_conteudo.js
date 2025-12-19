// 🧠 SISTEMA DE POTENCIAL DE CONTEÚDO - n8n Function Node
// Uso: Colar este código no Function Node do n8n

class ContentPotentialAnalyzer {
  constructor() {
    // 🎯 Pesos dos campos (baseado no mapeamento API)
    this.fieldWeights = {
      // 🔴 CRÍTICOS (Peso: 10)
      critical: {
        name: 10,
        real_name: 10,
        description: 10,
        image: 10
      },

      // 🟡 MUITO IMPORTANTES (Peso: 8.5)
      very_important: {
        aliases: 9,
        origin: 9,
        powers: 8,
        abilities: 8,
        birth: 8,
        gender: 8,
        power_grid: 8,
        appearance: 7
      },

      // 🟠 IMPORTANTES (Peso: 6.5)
      important: {
        first_appearance: 7,
        creators: 7,
        teams: 6,
        enemies: 6,
        allies: 6,
        strength_class: 6,
        intelligence: 6,
        speed: 6,
        durability: 6
      },

      // 🔴 AZUL RELEVANTES (Peso: 4.5)
      relevant: {
        publisher: 5,
        deck: 5,
        relatives: 4,
        character_friends: 4,
        character_enemies: 4,
        issue_credits: 3,
        movies: 3,
        games: 3
      }
    };

    // 🖼️ Pesos de assets visuais
    this.assetWeights = {
      character_image: 20,
      comic_covers: 8,
      team_images: 10,
      enemy_images: 10,
      power_grid_image: 8,
      story_arc_images: 6,
      volume_covers: 5,
      creator_photos: 3,
      comic_pages: 4,
      location_images: 3,
      concept_art: 2
    };
  }

  // 📊 Calcular pontuação de conteúdo textual
  calculateContentScore(characterData) {
    let totalScore = 0;
    let fieldCount = 0;
    let analysis = {};

    // 🔴 Campos críticos
    for (const [field, weight] of Object.entries(this.fieldWeights.critical)) {
      if (characterData[field] && characterData[field] !== '') {
        totalScore += weight;
        fieldCount++;
        analysis[field] = { present: true, weight, contribution: weight };
      } else {
        analysis[field] = { present: false, weight, contribution: 0 };
      }
    }

    // 🟡 Campos muito importantes
    for (const [field, weight] of Object.entries(this.fieldWeights.very_important)) {
      if (characterData[field] && characterData[field] !== '') {
        // Bônus para campos longos
        let bonus = 0;
        if (typeof characterData[field] === 'string') {
          if (characterData[field].length > 500) bonus = 2;
          else if (characterData[field].length > 200) bonus = 1;
        } else if (Array.isArray(characterData[field])) {
          if (characterData[field].length > 5) bonus = 2;
          else if (characterData[field].length > 2) bonus = 1;
        }

        totalScore += weight + bonus;
        fieldCount++;
        analysis[field] = { present: true, weight, contribution: weight + bonus, bonus };
      } else {
        analysis[field] = { present: false, weight, contribution: 0, bonus: 0 };
      }
    }

    // 🟠 Campos importantes
    for (const [field, weight] of Object.entries(this.fieldWeights.important)) {
      if (characterData[field] && characterData[field] !== '') {
        totalScore += weight;
        fieldCount++;
        analysis[field] = { present: true, weight, contribution: weight };
      } else {
        analysis[field] = { present: false, weight, contribution: 0 };
      }
    }

    // 🔴 Azul campos relevantes
    for (const [field, weight] of Object.entries(this.fieldWeights.relevant)) {
      if (characterData[field] && characterData[field] !== '') {
        totalScore += weight;
        fieldCount++;
        analysis[field] = { present: true, weight, contribution: weight };
      } else {
        analysis[field] = { present: false, weight, contribution: 0 };
      }
    }

    // 🎯 Bônus especiais
    let bonusScore = 0;

    // Bônus para biografia longa
    if (characterData.description && characterData.description.length > 1000) {
      bonusScore += 5;
    }

    // Bônus para muitos poderes/habilidades
    const powerCount = (characterData.powers?.length || 0) + (characterData.abilities?.length || 0);
    if (powerCount > 10) bonusScore += 3;
    else if (powerCount > 5) bonusScore += 2;

    // Bônus para muitos relacionamentos
    const relationshipCount = (characterData.allies?.length || 0) +
                             (characterData.enemies?.length || 0) +
                             (characterData.teams?.length || 0);
    if (relationshipCount > 20) bonusScore += 3;
    else if (relationshipCount > 10) bonusScore += 2;

    // Bônus para identidade secreta
    if (characterData.real_name && characterData.real_name !== characterData.name) {
      bonusScore += 2;
    }

    totalScore += bonusScore;

    return {
      totalScore: totalScore,
      fieldCount: fieldCount,
      analysis: analysis,
      bonusScore: bonusScore
    };
  }

  // 🖼️ Calcular pontuação de assets visuais
  calculateAssetScore(characterData, comicsData, storyArcsData) {
    let assetScore = 0;
    let assetAnalysis = {};

    // Foto principal do personagem
    if (characterData.image && characterData.image.small_url) {
      assetScore += this.assetWeights.character_image;
      assetAnalysis.character_image = { available: true, contribution: this.assetWeights.character_image };
    } else {
      assetAnalysis.character_image = { available: false, contribution: 0 };
    }

    // Capas de quadrinhos
    const comicCovers = comicsData?.filter(comic => comic.image?.medium_url).length || 0;
    const comicScore = Math.min(comicCovers * this.assetWeights.comic_covers / 10, 40);
    assetScore += comicScore;
    assetAnalysis.comic_covers = { available: comicCovers, contribution: comicScore };

    // Imagens de times
    const teamImages = characterData.teams?.filter(team => team.image).length || 0;
    const teamScore = teamImages * this.assetWeights.team_images;
    assetScore += teamScore;
    assetAnalysis.team_images = { available: teamImages, contribution: teamScore };

    // Imagens de inimigos
    const enemyImages = characterData.enemies?.filter(enemy => enemy.image).length || 0;
    const enemyScore = Math.min(enemyImages * this.assetWeights.enemy_images / 5, 20);
    assetScore += enemyScore;
    assetAnalysis.enemy_images = { available: enemyImages, contribution: enemyScore };

    // Imagens de arcos narrativos
    const storyArcImages = storyArcsData?.filter(arc => arc.image).length || 0;
    const storyArcScore = storyArcImages * this.assetWeights.story_arc_images;
    assetScore += storyArcScore;
    assetAnalysis.story_arc_images = { available: storyArcImages, contribution: storyArcScore };

    // Verificar gráfico de poderes
    if (characterData.power_grid && Object.keys(characterData.power_grid).length > 0) {
      assetScore += this.assetWeights.power_grid_image;
      assetAnalysis.power_grid_image = { available: true, contribution: this.assetWeights.power_grid_image };
    } else {
      assetAnalysis.power_grid_image = { available: false, contribution: 0 };
    }

    return {
      totalScore: assetScore,
      analysis: assetAnalysis,
      totalAssets: comicCovers + teamImages + enemyImages + storyArcImages
    };
  }

  // ⏱️ Calcular duração estimada do vídeo
  calculateVideoDuration(contentScore, assetScore, comicsCount) {
    // Fórmula principal
    let baseMinutes = (contentScore / 15) + (assetScore / 8) + (comicsCount * 0.3);

    // Ajustes baseados na qualidade
    const contentQuality = contentScore > 80 ? 1.3 : contentScore > 60 ? 1.1 : 1.0;
    const assetQuality = assetScore > 70 ? 1.2 : assetScore > 50 ? 1.1 : 1.0;

    baseMinutes *= contentQuality * assetQuality;

    // Mínimo e máximo
    baseMinutes = Math.max(15, Math.min(baseMinutes, 180)); // 15min a 3h

    return {
      estimatedMinutes: Math.round(baseMinutes),
      formattedDuration: this.formatDuration(baseMinutes)
    };
  }

  // 🏆 Classificar potencial
  classifyPotential(totalScore, assetScore, duration) {
    const combinedScore = totalScore * 0.6 + assetScore * 0.4;

    if (combinedScore >= 80) {
      return {
        category: 'EXCELLENT',
        description: 'Potencial para vídeo longo (2+ horas)',
        confidence: 'ALTA',
        recommendation: 'ALTAMENTE RECOMENDADO'
      };
    } else if (combinedScore >= 60) {
      return {
        category: 'GREAT',
        description: 'Potencial para vídeo longo (1-2 horas)',
        confidence: 'BOA',
        recommendation: 'RECOMENDADO'
      };
    } else if (combinedScore >= 40) {
      return {
        category: 'GOOD',
        description: 'Potencial para vídeo médio (45-60 minutos)',
        confidence: 'MÉDIA',
        recommendation: 'VIÁVEL'
      };
    } else if (combinedScore >= 20) {
      return {
        category: 'MEDIUM',
        description: 'Potencial para vídeo curto (20-45 minutos)',
        confidence: 'BAIXA',
        recommendation: 'ACEITÁVEL'
      };
    } else {
      return {
        category: 'LOW',
        description: 'Potencial limitado (<20 minutos)',
        confidence: 'MUITO BAIXA',
        recommendation: 'EVITAR'
      };
    }
  }

  // 🔍 Gerar recomendações
  generateRecommendations(characterData, contentAnalysis, assetAnalysis, totalScore) {
    const recommendations = [];
    const missingContent = [];

    // Recomendações baseadas no conteúdo
    if (contentAnalysis.totalScore > 60) {
      recommendations.push('Excelente biografia para explorar');
    }

    if ((characterData.powers?.length || 0) > 5) {
      recommendations.push('Muitos poderes para demonstrar visualmente');
    }

    if ((characterData.enemies?.length || 0) > 10) {
      recommendations.push('Grande potencial para cenas de batalha');
    }

    if ((characterData.teams?.length || 0) > 0) {
      recommendations.push('História em times pode ser um segmento');
    }

    // Conteúdo faltante
    if (!characterData.description || characterData.description.length < 100) {
      missingContent.push('Biografia curta ou inexistente');
    }

    if ((characterData.powers?.length || 0) === 0) {
      missingContent.push('Sem poderes documentados');
    }

    if (assetAnalysis.totalScore < 30) {
      missingContent.push('Assets visuais limitados');
    }

    return {
      recommendations: recommendations,
      missingContent: missingContent
    };
  }

  // 📋 Formatar duração
  formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);

    if (hours > 0) {
      return `${hours}h${mins > 0 ? mins + 'min' : ''}`;
    } else {
      return `${mins} minutos`;
    }
  }

  // 🚀 Função principal de análise
  analyzeCharacter(characterData, comicsData = [], storyArcsData = []) {
    // Calcular pontuações
    const contentAnalysis = this.calculateContentScore(characterData);
    const assetAnalysis = this.calculateAssetScore(characterData, comicsData, storyArcsData);
    const durationAnalysis = this.calculateVideoDuration(
      contentAnalysis.totalScore,
      assetAnalysis.totalScore,
      comicsData.length
    );

    const potentialClassification = this.classifyPotential(
      contentAnalysis.totalScore,
      assetAnalysis.totalScore,
      durationAnalysis.estimatedMinutes
    );

    const recommendations = this.generateRecommendations(
      characterData,
      contentAnalysis,
      assetAnalysis,
      contentAnalysis.totalScore
    );

    // Resultado final
    return {
      character_id: characterData.id,
      name: characterData.name,

      // 📊 Pontuações
      content_score: contentAnalysis.totalScore,
      asset_score: assetAnalysis.totalScore,
      combined_score: Math.round(contentAnalysis.totalScore * 0.6 + assetAnalysis.totalScore * 0.4),

      // ⏱️ Duração
      estimated_duration_minutes: durationAnalysis.estimatedMinutes,
      formatted_duration: durationAnalysis.formattedDuration,

      // 🏆 Classificação
      potential_category: potentialClassification.category,
      potential_description: potentialClassification.description,
      confidence_level: potentialClassification.confidence,
      recommendation: potentialClassification.recommendation,

      // 📊 Análises detalhadas
      content_analysis: contentAnalysis,
      asset_analysis: assetAnalysis,

      // 🎯 Recomendações
      recommendations: recommendations.recommendations,
      missing_content: recommendations.missingContent,

      // 📈 Estatísticas
      comics_available: comicsData.length,
      story_arcs_available: storyArcsData.length,
      total_visual_assets: assetAnalysis.totalAssets
    };
  }
}

// 🎯 EXPORT para uso no n8n
module.exports = ContentPotentialAnalyzer;

// 📝 Exemplo de uso no n8n Function Node:
/*
const analyzer = new ContentPotentialAnalyzer();

// Supondo que você receba os dados da API nos itens anteriores
const characterData = items[0].json; // Dados do personagem
const comicsData = items[1]?.json || []; // Dados dos quadrinhos
const storyArcsData = items[2]?.json || []; // Dados dos arcos narrativos

const analysis = analyzer.analyzeCharacter(characterData, comicsData, storyArcsData);

return [{
  json: analysis
}];
*/