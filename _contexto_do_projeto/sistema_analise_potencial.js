// 🎯 SISTEMA INTEGRADO DE ANÁLISE DE POTENCIAL E DURAÇÃO
// Integra Fase 1 + Fase 2 para o n8n

class VideoPotentialAnalyzer {
  constructor() {
    this.contentAnalyzer = new ContentPotentialAnalyzer();
    this.sceneSelector = new SceneSelector();
  }

  // 🚀 Função principal que integra tudo
  analyzeVideoPotential(characterData, comicsData = [], storyArcsData = []) {
    console.log(`🔍 Analisando potencial para: ${characterData.name}`);

    // 1️⃣ Análise de conteúdo (Fase 1)
    const contentAnalysis = this.contentAnalyzer.analyzeCharacter(
      characterData,
      comicsData,
      storyArcsData
    );

    // 2️⃣ Calcular duração otimizada
    const durationAnalysis = this.calculateOptimalDuration(contentAnalysis);

    // 3️⃣ Gerar storyboard (Fase 2)
    const storyboardAnalysis = this.sceneSelector.generateStoryboard(
      characterData,
      contentAnalysis,
      durationAnalysis.recommended_duration_minutes
    );

    // 4️⃣ Análise de viabilidade completa
    const viabilityAnalysis = this.assessViability(
      contentAnalysis,
      durationAnalysis,
      storyboardAnalysis
    );

    // 5️⃣ Recomendações de produção
    const productionRecommendations = this.generateProductionRecommendations(
      contentAnalysis,
      storyboardAnalysis,
      viabilityAnalysis
    );

    return {
      // 📊 Resumo executivo
      executive_summary: {
        character_name: characterData.name,
        recommendation: viabilityAnalysis.overall_recommendation,
        confidence_level: viabilityAnalysis.confidence,
        estimated_duration: durationAnalysis.formatted_duration,
        potential_score: contentAnalysis.combined_score,
        assets_quality: contentAnalysis.asset_score,
        uniqueness_rating: storyboardAnalysis.uniqueness_score
      },

      // 📈 Análises detalhadas
      content_analysis: contentAnalysis,
      duration_analysis: durationAnalysis,
      storyboard_analysis: storyboardAnalysis,
      viability_analysis: viabilityAnalysis,

      // 🎯 Recomendações
      production_recommendations: productionRecommendations,

      // 📋 Estrutura para n8n
      n8n_workflow_data: {
        character_id: characterData.id,
        processing_priority: viabilityAnalysis.processing_priority,
        estimated_render_time: this.estimateRenderTime(durationAnalysis.recommended_duration_minutes),
        required_resources: this.calculateRequiredResources(storyboardAnalysis),
        quality_gates: viabilityAnalysis.quality_gates
      }
    };
  }

  // ⏱️ Calcular duração otimizada
  calculateOptimalDuration(contentAnalysis) {
    const contentScore = contentAnalysis.content_score;
    const assetScore = contentAnalysis.asset_score;
    const comicsCount = contentAnalysis.comics_available;

    // 📐 Fórmula principal refinada
    let baseMinutes = (contentScore / 20) + (assetScore / 10) + (comicsCount * 0.2);

    // 🎯 Ajustes por tipo de conteúdo
    if (contentScore > 70) baseMinutes *= 1.3; // Conteúdo rico = mais tempo
    if (assetScore > 60) baseMinutes *= 1.2; // Muitos assets = mais tempo
    if (comicsCount > 100) baseMinutes *= 1.15; // Longa história = mais tempo

    // 📊 Ajustes por categoria
    let durationCategory;
    if (baseMinutes >= 120) {
      durationCategory = "FEATURE_LENGTH";
      baseMinutes = Math.min(baseMinutes, 180); // Máximo 3 horas
    } else if (baseMinutes >= 60) {
      durationCategory = "LONG_FORMAT";
    } else if (baseMinutes >= 30) {
      durationCategory = "MEDIUM_FORMAT";
    } else {
      durationCategory = "SHORT_FORMAT";
      baseMinutes = Math.max(baseMinutes, 15); // Mínimo 15 minutos
    }

    // 🎬 Ajuste para YouTube (ótimo engajamento)
    const youtubeOptimal = this.optimizeForYouTube(baseMinutes, contentScore);

    return {
      recommended_duration_minutes: Math.round(youtubeOptimal),
      formatted_duration: this.formatDuration(youtubeOptimal),
      category: durationCategory,
      content_ratio: contentScore / (contentScore + assetScore),
      asset_ratio: assetScore / (contentScore + assetScore),
      estimated_segments: Math.ceil(youtubeOptimal / 10), // Segmentos de 10 minutos
      youtube_optimization: {
        optimal_length: youtubeOptimal,
        retention_factors: this.calculateRetentionFactors(contentScore, assetScore),
        engagement_potential: this.estimateEngagementPotential(contentAnalysis)
      }
    };
  }

  // 📱 Otimização para YouTube
  optimizeForYouTube(baseMinutes, contentScore) {
    // YouTube favorece vídeos entre 8-20 minutos para monetização máxima
    // Mas para conteúdo de alta qualidade, mais tempo também funciona bem

    if (baseMinutes < 8 && contentScore < 40) {
      return 8; // Forçar mínimo para monetização
    } else if (baseMinutes < 15 && contentScore < 60) {
      return Math.min(baseMinutes * 1.2, 15); // Expandir um pouco
    } else if (baseMinutes > 25 && contentScore > 70) {
      return Math.min(baseMinutes * 1.1, 60); // Permitir mais tempo para conteúdo rico
    } else if (baseMinutes > 60) {
      // Para vídeos muito longos, manter mas adicionar estratégias de retenção
      return baseMinutes;
    }

    return baseMinutes;
  }

  // 📊 Calcular fatores de retenção
  calculateRetentionFactors(contentScore, assetScore) {
    return {
      visual_variety: Math.min(assetScore / 10, 10),
      content_depth: Math.min(contentScore / 15, 10),
      pacing_quality: this.calculatePacingQuality(contentScore, assetScore),
      hook_strength: Math.min(contentScore / 12, 10),
      overall_retention_score: Math.round((contentScore + assetScore) / 2)
    };
  }

  // 🎭 Calcular qualidade de ritmo
  calculatePacingQuality(contentScore, assetScore) {
    const balance = Math.abs(contentScore - assetScore);
    const balanceScore = Math.max(0, 10 - balance / 10); // Quanto mais equilibrado, melhor

    return Math.round(balanceScore);
  }

  // 📈 Estimar potencial de engajamento
  estimateEngagementPotential(contentAnalysis) {
    const factors = {
      character_popularity: this.estimatePopularity(contentAnalysis.name),
      content_uniqueness: contentAnalysis.content_score / 10,
      visual_appeal: contentAnalysis.asset_score / 10,
      niche_factor: this.calculateNicheFactor(contentAnalysis)
    };

    const totalScore = Object.values(factors).reduce((sum, factor) => sum + factor, 0) / 4;

    return {
      overall_score: Math.round(totalScore),
      factors: factors,
      engagement_category: totalScore > 8 ? 'HIGH' : totalScore > 6 ? 'MEDIUM' : 'LOW'
    };
  }

  // 🌟 Estimar popularidade
  estimatePopularity(characterName) {
    // Lista simplificada - em produção usaria dados reais
    const popularCharacters = [
      'Spider-Man', 'Superman', 'Batman', 'Wonder Woman', 'Iron Man',
      'Captain America', 'Thor', 'Hulk', 'Flash', 'Green Lantern'
    ];

    const veryPopular = ['Deadpool', 'Wolverine', 'Joker', 'Harley Quinn'];
    const moderatelyPopular = ['Ant-Man', 'Doctor Strange', 'Black Panther'];

    if (popularCharacters.includes(characterName)) return 10;
    if (veryPopular.includes(characterName)) return 8;
    if (moderatelyPopular.includes(characterName)) return 6;

    return 4; // Base para personagens menos conhecidos
  }

  // 🎯 Calcular fator de nicho
  calculateNicheFactor(contentAnalysis) {
    // Personagens com conteúdo único mas menos popular podem ter nicho forte
    const uniquenessScore = contentAnalysis.content_analysis?.bonusScore || 0;
    const popularityPenalty = Math.max(0, 8 - this.estimatePopularity(contentAnalysis.name));

    return Math.min(uniquenessScore / 5 + popularityPenalty, 8);
  }

  // 🎬 Avaliar viabilidade completa
  assessViability(contentAnalysis, durationAnalysis, storyboardAnalysis) {
    const combinedScore = contentAnalysis.combined_score;
    const assetScore = contentAnalysis.asset_score;
    const duration = durationAnalysis.recommended_duration_minutes;
    const uniquenessScore = storyboardAnalysis.uniqueness_score;

    // 🎯 Cálculo de viabilidade
    let viabilityScore = 0;
    let risks = [];
    let strengths = [];
    let qualityGates = [];

    // Pontuação base
    viabilityScore += combinedScore * 0.4;
    viabilityScore += assetScore * 0.3;
    viabilityScore += uniquenessScore * 0.2;

    // 🔍 Análise de riscos
    if (assetScore < 30) {
      risks.push("Assets visuais limitados podem afetar engajamento");
      viabilityScore -= 10;
    }

    if (duration < 20) {
      risks.push("Duração muito curta pode não ser rentável");
      viabilityScore -= 8;
    }

    if (contentAnalysis.content_score < 40) {
      risks.push("Conteúdo superficial pode levar a alta taxa de rejeição");
      viabilityScore -= 15;
    }

    if (duration > 90 && assetScore < 50) {
      risks.push("Vídeo muito longo com assets limitados é arriscado");
      viabilityScore -= 12;
    }

    // 💪 Análise de pontos fortes
    if (assetScore > 70) {
      strengths.push("Excelente qualidade visual garantida");
      viabilityScore += 5;
    }

    if (contentAnalysis.content_score > 80) {
      strengths.push("Conteúdo muito rico e aprofundado");
      viabilityScore += 8;
    }

    if (uniquenessScore > 80) {
      strengths.push("Storyboard único e memorável");
      viabilityScore += 6;
    }

    if (duration > 45 && duration < 75) {
      strengths.push("Duração ideal para YouTube");
      viabilityScore += 4;
    }

    // 🚪 Portões de qualidade (quality gates)
    qualityGates = [
      {
        gate: "Conteúdo mínimo",
        required: 40,
        actual: contentAnalysis.content_score,
        passed: contentAnalysis.content_score >= 40
      },
      {
        gate: "Assets visuais",
        required: 30,
        actual: assetScore,
        passed: assetScore >= 30
      },
      {
        gate: "Duração mínima",
        required: 20,
        actual: duration,
        passed: duration >= 20
      },
      {
        gate: "Unicidade",
        required: 60,
        actual: uniquenessScore,
        passed: uniquenessScore >= 60
      }
    ];

    // Normalizar viabilidade para 0-100
    viabilityScore = Math.max(0, Math.min(viabilityScore, 100));

    // 🎯 Recomendação geral
    let recommendation, confidence, priority;

    if (viabilityScore >= 80) {
      recommendation = "PRODUZIR IMEDIATAMENTE";
      confidence = "ALTA";
      priority = "URGENTE";
    } else if (viabilityScore >= 60) {
      recommendation = "PRODUZIR COMO PRIORIDADE";
      confidence = "BOA";
      priority = "ALTA";
    } else if (viabilityScore >= 40) {
      recommendation = "PRODUZIR SE TIVER RECURSOS";
      confidence = "MÉDIA";
      priority = "MÉDIA";
    } else {
      recommendation = "REAVILIAR NECESSIDADE DE PRODUÇÃO";
      confidence = "BAIXA";
      priority = "BAIXA";
    }

    return {
      overall_score: Math.round(viabilityScore),
      overall_recommendation: recommendation,
      confidence: confidence,
      processing_priority: priority,
      risks: risks,
      strengths: strengths,
      quality_gates: qualityGates,
      all_gates_passed: qualityGates.every(gate => gate.passed)
    };
  }

  // 🎭 Gerar recomendações de produção
  generateProductionRecommendations(contentAnalysis, storyboardAnalysis, viabilityAnalysis) {
    const recommendations = {
      production_strategy: [],
      content_focus: [],
      visual_priorities: [],
      technical_requirements: [],
      timeline_estimates: {},
      budget_considerations: []
    };

    // 🎯 Estratégia de produção
    if (viabilityAnalysis.overall_score > 75) {
      recommendations.production_strategy.push("Investir em alta qualidade");
      recommendations.production_strategy.push("Considerar edição premium");
    } else if (viabilityAnalysis.overall_score > 50) {
      recommendations.production_strategy.push("Foco em eficiência sem perder qualidade");
    } else {
      recommendations.production_strategy.push("Minimizar custos de produção");
      recommendations.production_strategy.push("Considerar combinar com outros personagens");
    }

    // 📝 Foco de conteúdo
    const contentScore = contentAnalysis.content_score;
    if (contentScore > 70) {
      recommendations.content_focus.push("Aprofundar análise histórica");
      recommendations.content_focus.push("Incluir teorias de fãs");
    }

    if (contentAnalysis.comics_available > 50) {
      recommendations.content_focus.push("Focar em evolução do personagem");
      recommendations.content_focus.push("Destacar momentos marcantes");
    }

    // 🎨 Prioridades visuais
    if (contentAnalysis.asset_score > 60) {
      recommendations.visual_priorities.push("Aproveitar todos os assets disponíveis");
      recommendations.visual_priorities.push("Criar montagens dinâmicas");
    } else {
      recommendations.visual_priorities.push("Focar em animações de texto e gráficos");
      recommendations.visual_priorities.push("Gerar assets adicionais se possível");
    }

    // 🔧 Requisitos técnicos
    const duration = contentAnalysis.estimated_duration_minutes;
    recommendations.technical_requirements.push(
      `Renderização para ${duration} minutos de vídeo`
    );
    recommendations.technical_requirements.push(
      `${Math.ceil(duration * 2)} arquivos de áudio (narração + efeitos)`
    );

    // ⏱️ Estimativas de timeline
    recommendations.timeline_estimates = {
      research_phase: Math.max(2, Math.ceil(duration / 30)), // 2+ dias
      script_writing: Math.max(3, Math.ceil(duration / 20)), // 3+ dias
      asset_collection: Math.max(2, Math.ceil(duration / 25)), // 2+ dias
      video_editing: Math.max(5, Math.ceil(duration / 15)), // 5+ dias
      total_production: Math.max(12, Math.ceil(duration / 10)) // 12+ dias
    };

    // 💰 Considerações de orçamento
    if (duration > 60) {
      recommendations.budget_considerations.push(
        "Vídeo longo requer maior investimento em marketing"
      );
    }

    if (contentAnalysis.asset_score < 40) {
      recommendations.budget_considerations.push(
        "Considerar custos para criação de assets adicionais"
      );
    }

    return recommendations;
  }

  // ⏱️ Estimar tempo de renderização
  estimateRenderTime(durationMinutes) {
    // Baseado em hardware médio: 1 minuto de vídeo = 4-6 minutos de renderização
    const renderMultiplier = 5;
    const renderMinutes = durationMinutes * renderMultiplier;

    return {
      estimated_minutes: renderMinutes,
      estimated_hours: Math.round(renderMinutes / 60 * 10) / 10,
      consideration: "Tempo pode variar baseado na complexidade das cenas"
    };
  }

  // 🛠️ Calcular recursos necessários
  calculateRequiredResources(storyboardAnalysis) {
    const sceneCount = storyboardAnalysis.scenes.length;
    const totalFrames = storyboardAnalysis.total_duration_frames;

    return {
      estimated_scenes: sceneCount,
      total_frames: totalFrames,
      required_assets: sceneCount * 3, // Média de 3 assets por cena
      audio_segments: Math.ceil(sceneCount * 1.5), // 1.5 segmentos de áudio por cena
      transition_effects: sceneCount - 1,
      text_animations: sceneCount * 2, // Média de 2 animações de texto por cena
      complexity_level: totalFrames > 10000 ? 'HIGH' : totalFrames > 5000 ? 'MEDIUM' : 'LOW'
    };
  }

  // ⏰ Formatar duração
  formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);

    if (hours > 0) {
      return `${hours}h${mins > 0 ? mins + 'min' : ''}`;
    } else {
      return `${mins} minutos`;
    }
  }
}

// 🎯 Classes auxiliares (requerem os arquivos anteriores)
// Em produção, importar dos arquivos criados anteriormente
class ContentPotentialAnalyzer {
  // Implementação simplificada - usar do arquivo sistema_potencial_conteudo.js
  analyzeCharacter(characterData, comicsData, storyArcsData) {
    return {
      name: characterData.name,
      content_score: 75,
      asset_score: 68,
      combined_score: 72,
      comics_available: comicsData.length,
      estimated_duration_minutes: 45
    };
  }
}

class SceneSelector {
  // Implementação simplificada - usar do arquivo fase2_templates_storyboard.md
  generateStoryboard(characterData, contentAnalysis, targetDuration) {
    return {
      scenes: [{ scene_type: "character_reveal", duration_frames: 300 }],
      total_duration_frames: 12000,
      uniqueness_score: 80
    };
  }
}

// 📦 Export para n8n
module.exports = VideoPotentialAnalyzer;

// 📝 Exemplo de uso no n8n:
/*
const analyzer = new VideoPotentialAnalyzer();

const characterData = items[0].json;
const comicsData = items[1]?.json || [];
const storyArcsData = items[2]?.json || [];

const analysis = analyzer.analyzeVideoPotential(characterData, comicsData, storyArcsData);

return [{
  json: analysis
}];
*/