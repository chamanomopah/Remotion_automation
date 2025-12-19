// 🔍 SISTEMA DE QUALIDADE E GAP DETECTION
// Identifica problemas antes da produção e garante consistência

class QualityControlSystem {
  constructor() {
    // 📊 Critérios mínimos de qualidade
    this.qualityThresholds = {
      content_score: 40,
      asset_score: 30,
      duration_minutes: 20,
      uniqueness_score: 60,
      visual_variety: 70,
      narrative_coherence: 65,
      engagement_potential: 50
    };

    // 🎯 Pesos para diferentes aspectos de qualidade
    this.qualityWeights = {
      content_depth: 0.25,
      visual_quality: 0.20,
      pacing: 0.15,
      uniqueness: 0.15,
      engagement: 0.15,
      technical_feasibility: 0.10
    };

    // 🚨 Tipos de problemas críticos
    this.criticalIssues = [
      'MISSING_ESSENTIAL_DATA',
      'INSUFFICIENT_ASSETS',
      'INADEQUATE_DURATION',
      'LOW_NARRATIVE_COHERENCE',
      'TECHNICAL_LIMITATIONS'
    ];

    // ⚠️ Tipos de problemas de alerta
    this.warningIssues = [
      'LIMITED_VISUAL_VARIETY',
      'SHORT_DURATION',
      'MODERATE_CONTENT_DEPTH',
      'UNIQUEITY_CONCERNS'
    ];
  }

  // 🔍 Verificação completa de qualidade
  performQualityCheck(videoAnalysis, characterData, comicsData, storyArcsData) {
    console.log(`🔍 Realizando controle de qualidade para: ${characterData.name}`);

    const qualityGates = this.checkQualityGates(videoAnalysis);
    const gapAnalysis = this.detectGaps(characterData, comicsData, storyArcsData);
    const consistencyCheck = this.checkConsistency(videoAnalysis);
    const feasibilityAnalysis = this.assessTechnicalFeasibility(videoAnalysis);
    const qualityScore = this.calculateOverallQuality(qualityGates, gapAnalysis, consistencyCheck);

    return {
      overall_quality_score: qualityScore,
      quality_grade: this.getQualityGrade(qualityScore),
      quality_gates: qualityGates,
      gap_analysis: gapAnalysis,
      consistency_check: consistencyCheck,
      feasibility_analysis: feasibilityAnalysis,
      recommendations: this.generateQualityRecommendations(qualityGates, gapAnalysis),
      production_readiness: this.assessProductionReadiness(qualityGates, qualityScore)
    };
  }

  // 🚪 Verificar portões de qualidade
  checkQualityGates(videoAnalysis) {
    const gates = [];
    let passedGates = 0;
    let criticalFailures = 0;
    let warnings = 0;

    // 📊 Portão 1: Pontuação de conteúdo
    const contentGate = {
      name: "Conteúdo Mínimo",
      threshold: this.qualityThresholds.content_score,
      actual: videoAnalysis.content_analysis.content_score,
      status: videoAnalysis.content_analysis.content_score >= this.qualityThresholds.content_score ? 'PASSED' : 'FAILED',
      severity: videoAnalysis.content_analysis.content_score < this.qualityThresholds.content_score * 0.5 ? 'CRITICAL' : 'WARNING',
      impact: "Conteúdo insuficiente resulta em vídeos rasos e alta taxa de rejeição",
      recommendations: []
    };

    if (contentGate.status === 'PASSED') passedGates++;
    else if (contentGate.severity === 'CRITICAL') criticalFailures++;
    else warnings++;

    if (contentGate.status === 'FAILED') {
      if (contentGate.actual < 20) {
        contentGate.recommendations.push("Personagem não possui biografia adequada");
        contentGate.recommendations.push("Considerar pesquisa manual de conteúdo");
      } else {
        contentGate.recommendations.push("Expandir pesquisa com fontes adicionais");
        contentGate.recommendations.push("Focar em aspectos específicos do personagem");
      }
    }

    // 🖼️ Portão 2: Assets visuais
    const assetGate = {
      name: "Assets Visuais",
      threshold: this.qualityThresholds.asset_score,
      actual: videoAnalysis.content_analysis.asset_score,
      status: videoAnalysis.content_analysis.asset_score >= this.qualityThresholds.asset_score ? 'PASSED' : 'FAILED',
      severity: videoAnalysis.content_analysis.asset_score < this.qualityThresholds.asset_score * 0.5 ? 'CRITICAL' : 'WARNING',
      impact: "Assets limitados causam baixo engajamento visual",
      recommendations: []
    };

    if (assetGate.status === 'PASSED') passedGates++;
    else if (assetGate.severity === 'CRITICAL') criticalFailures++;
    else warnings++;

    if (assetGate.status === 'FAILED') {
      if (assetGate.actual < 15) {
        assetGate.recommendations.push("Personagem não possui imagem principal");
        assetGate.recommendations.push("Quase nenhuma capa de quadrinho disponível");
      } else {
        assetGate.recommendations.push("Gerar assets manualmente usando IA");
        assetGate.recommendations.push("Procurar em fontes alternativas de imagens");
      }
    }

    // ⏱️ Portão 3: Duração adequada
    const durationGate = {
      name: "Duração Adequada",
      threshold: this.qualityThresholds.duration_minutes,
      actual: videoAnalysis.duration_analysis.recommended_duration_minutes,
      status: videoAnalysis.duration_analysis.recommended_duration_minutes >= this.qualityThresholds.duration_minutes ? 'PASSED' : 'FAILED',
      severity: videoAnalysis.duration_analysis.recommended_duration_minutes < 10 ? 'CRITICAL' : 'WARNING',
      impact: "Duração inadequada afeta monetização e engajamento",
      recommendations: []
    };

    if (durationGate.status === 'PASSED') passedGates++;
    else if (durationGate.severity === 'CRITICAL') criticalFailures++;
    else warnings++;

    if (durationGate.status === 'FAILED') {
      if (durationGate.actual < 10) {
        durationGate.recommendations.push("Conteúdo extremamente limitado");
        durationGate.recommendations.push("Considerar combinar com outros personagens");
      } else {
        durationGate.recommendations.push("Expandir análise com aspectos secundários");
        durationGate.recommendations.push("Incluir contexto histórico/cultural");
      }
    }

    // 🎨 Portão 4: Unicidade
    const uniquenessGate = {
      name: "Unicidade do Storyboard",
      threshold: this.qualityThresholds.uniqueness_score,
      actual: videoAnalysis.storyboard_analysis.uniqueness_score,
      status: videoAnalysis.storyboard_analysis.uniqueness_score >= this.qualityThresholds.uniqueness_score ? 'PASSED' : 'FAILED',
      severity: videoAnalysis.storyboard_analysis.uniqueness_score < this.qualityThresholds.uniqueness_score * 0.7 ? 'WARNING' : 'INFO',
      impact: "Baixa unicidade resulta em vídeos genéricos",
      recommendations: []
    };

    if (uniquenessGate.status === 'PASSED') passedGates++;
    else if (uniquenessGate.severity === 'WARNING') warnings++;

    if (uniquenessGate.status === 'FAILED') {
      uniquenessGate.recommendations.push("Adicionar elementos temáticos únicos do personagem");
      uniquenessGate.recommendations.push("Usar transições personalizadas");
      uniquenessGate.recommendations.push("Incluir referências a momentos marcantes");
    }

    // 📈 Portão 5: Potencial de engajamento
    const engagementGate = {
      name: "Potencial de Engajamento",
      threshold: this.qualityThresholds.engagement_potential,
      actual: videoAnalysis.duration_analysis.youtube_optimization?.engagement_potential?.overall_score || 50,
      status: (videoAnalysis.duration_analysis.youtube_optimization?.engagement_potential?.overall_score || 50) >= this.qualityThresholds.engagement_potential ? 'PASSED' : 'FAILED',
      severity: 'WARNING',
      impact: "Baixo potencial de engajamento afeta desempenho no YouTube",
      recommendations: []
    };

    if (engagementGate.status === 'PASSED') passedGates++;
    else warnings++;

    if (engagementGate.status === 'FAILED') {
      engagementGate.recommendations.push("Incluir hooks mais fortes no início");
      engagementGate.recommendations.push("Adicionar elementos surpresa e revelações");
      engagementGate.recommendations.push("Considerar formato mais dinâmico");
    }

    gates.push(contentGate, assetGate, durationGate, uniquenessGate, engagementGate);

    return {
      total_gates: gates.length,
      passed_gates: passedGates,
      critical_failures: criticalFailures,
      warnings: warnings,
      gates: gates,
      overall_status: criticalFailures > 0 ? 'CRITICAL_ISSUES' : warnings > 2 ? 'NEEDS_IMPROVEMENT' : passedGates === gates.length ? 'READY' : 'MINOR_ISSUES'
    };
  }

  // 🔍 Detectar gaps (lacunas) de conteúdo
  detectGaps(characterData, comicsData, storyArcsData) {
    const gaps = {
      critical_gaps: [],
      moderate_gaps: [],
      minor_gaps: [],
      content_distribution: this.analyzeContentDistribution(characterData, comicsData),
      visual_gaps: this.detectVisualGaps(characterData, comicsData, storyArcsData),
      narrative_gaps: this.detectNarrativeGaps(characterData, comicsData)
    };

    // 🚨 Gaps críticos
    if (!characterData.description || characterData.description.length < 100) {
      gaps.critical_gaps.push({
        type: 'MISSING_BIOGRAPHY',
        severity: 'CRITICAL',
        description: 'Biografia do personagem ausente ou muito curta',
        impact: 'Impossível criar narrativa coesa',
        suggestions: ['Pesquisar manualmente em wikis', 'Usar fontes alternativas', 'Considerar personagem diferente']
      });
    }

    if (!characterData.image || !characterData.image.medium_url) {
      gaps.critical_gaps.push({
        type: 'NO_MAIN_IMAGE',
        severity: 'CRITICAL',
        description: 'Personagem não possui imagem principal',
        impact: 'Storyboard inviável sem imagem principal',
        suggestions: ['Gerar imagem com IA', 'Procurar em fontes alternativas', 'Usar arte conceitual']
      });
    }

    if ((comicsData || []).length < 3) {
      gaps.critical_gaps.push({
        type: 'INSUFFICIENT_COMIC_DATA',
        severity: 'CRITICAL',
        description: 'Menos de 3 quadrinhos disponíveis',
        impact: 'Impossível criar linha do tempo visual',
        suggestions: ['Expandir pesquisa para quadrinhos relacionados', 'Incluir graphic novels', 'Considerar personagem diferente']
      });
    }

    // ⚠️ Gaps moderados
    if (!characterData.powers || characterData.powers.length === 0) {
      gaps.moderate_gaps.push({
        type: 'NO_POWERS_DOCUMENTED',
        severity: 'MODERATE',
        description: 'Poderes e habilidades não documentados',
        impact: 'Seção de poderes será limitada',
        suggestions: ['Inferir poderes de histórias', 'Focar em habilidades físicas', 'Destacar outros aspectos']
      });
    }

    if (!characterData.real_name || characterData.real_name === characterData.name) {
      gaps.moderate_gaps.push({
        type: 'NO_SECRET_IDENTITY',
        severity: 'MODERATE',
        description: 'Personagem não possui identidade secreta documentada',
        impact: 'Seção de identidade secreta será omitida',
        suggestions: ['Focar em outros aspectos pessoais', 'Explorar origem familiar', 'Criar seção sobre personalidade']
      });
    }

    const enemyCount = (characterData.enemies || []).length;
    if (enemyCount < 2) {
      gaps.moderate_gaps.push({
        type: 'LIMITED_ROGUES_GALLERY',
        severity: 'MODERATE',
        description: `Apenas ${enemyCount} inimigos documentados`,
        impact: 'Galeria de vilões será limitada',
        suggestions: ['Incluir inimigos de histórias relacionadas', 'Focar em arcos narrativos', 'Expandir pesquisa']
      });
    }

    // 📋 Gaps menores
    if (!characterData.creators || characterData.creators.length === 0) {
      gaps.minor_gaps.push({
        type: 'NO_CREATORS_INFO',
        severity: 'MINOR',
        description: 'Informações sobre criadores ausentes',
        impact: 'Seção de criação será limitada',
        suggestions: ['Pesquisar criadores manualmente', 'Omitir esta seção', 'Usar informações gerais da editora']
      });
    }

    if (!characterData.first_appearance) {
      gaps.minor_gaps.push({
        type: 'NO_FIRST_APPEARANCE',
        severity: 'MINOR',
        description: 'Primeira aparição não documentada',
        impact: 'Linha do tempo terá lacuna inicial',
        suggestions: ['Estimar basedo em dados disponíveis', 'Pesquisar manualmente', 'Omitir data específica']
      });
    }

    return gaps;
  }

  // 📊 Analisar distribuição de conteúdo
  analyzeContentDistribution(characterData, comicsData) {
    const sections = {
      biography: {
        available: !!(characterData.description && characterData.description.length > 200),
        quality: this.assessContentQuality(characterData.description),
        estimated_duration: this.estimateSectionDuration(characterData.description)
      },
      powers: {
        available: !!(characterData.powers && characterData.powers.length > 0),
        count: (characterData.powers || []).length,
        estimated_duration: Math.max(0, (characterData.powers || []).length * 2)
      },
      relationships: {
        available: !!(characterData.enemies || characterData.allies || characterData.teams),
        total_count: (characterData.enemies?.length || 0) + (characterData.allies?.length || 0) + (characterData.teams?.length || 0),
        estimated_duration: Math.max(0, ((characterData.enemies?.length || 0) + (characterData.allies?.length || 0) + (characterData.teams?.length || 0)) * 1.5)
      },
      history: {
        available: !!(comicsData && comicsData.length > 0),
        comics_count: (comicsData || []).length,
        estimated_duration: Math.max(0, (comicsData || []).length * 0.5)
      }
    };

    const totalEstimatedDuration = Object.values(sections).reduce((sum, section) => sum + (section.estimated_duration || 0), 0);
    const balanceScore = this.calculateContentBalance(sections);

    return {
      sections: sections,
      total_estimated_duration: totalEstimatedDuration,
      balance_score: balanceScore,
      distribution_issues: this.identifyDistributionIssues(sections)
    };
  }

  // 🎨 Detectar gaps visuais
  detectVisualGaps(characterData, comicsData, storyArcsData) {
    const visualAssets = {
      main_character_image: !!(characterData.image && characterData.image.medium_url),
      comic_covers: (comicsData || []).filter(comic => comic.image && comic.image.medium_url).length,
      team_images: (characterData.teams || []).filter(team => team.image).length,
      enemy_images: (characterData.enemies || []).filter(enemy => enemy.image).length,
      story_arc_images: (storyArcsData || []).filter(arc => arc.image).length,
      power_grid_visual: !!(characterData.power_grid && Object.keys(characterData.power_grid).length > 0)
    };

    const totalAssets = Object.values(visualAssets).filter(Boolean).length;
    const possibleAssets = Object.keys(visualAssets).length;
    const visualCompleteness = (totalAssets / possibleAssets) * 100;

    const gaps = [];

    if (!visualAssets.main_character_image) {
      gaps.push({
        type: 'NO_HERO_IMAGE',
        severity: 'CRITICAL',
        description: 'Imagem principal do personagem ausente'
      });
    }

    if (visualAssets.comic_covers < 5) {
      gaps.push({
        type: 'LIMITED_COMIC_COVERS',
        severity: 'MODERATE',
        description: `Apenas ${visualAssets.comic_covers} capas disponíveis`,
        count: visualAssets.comic_covers
      });
    }

    if (visualAssets.enemy_images === 0 && (characterData.enemies?.length || 0) > 0) {
      gaps.push({
        type: 'NO_ENEMY_IMAGES',
        severity: 'MODERATE',
        description: 'Inimigos não possuem imagens'
      });
    }

    return {
      assets: visualAssets,
      completeness_percentage: Math.round(visualCompleteness),
      total_available: totalAssets,
      gaps: gaps
    };
  }

  // 📖 Detectar gaps narrativos
  detectNarrativeGaps(characterData, comicsData) {
    const gaps = [];

    // Verificar arco narrativo completo
    if (!characterData.origin && !characterData.birth) {
      gaps.push({
        type: 'MISSING_ORIGIN',
        severity: 'MODERATE',
        description: 'Origem do personagem não documentada',
        narrative_impact: 'Dificulta criação de abertura envolvente'
      });
    }

    // Verificar evolução do personagem
    if ((comicsData || []).length > 50) {
      const hasStoryArcs = characterData.story_arcs && characterData.story_arcs.length > 0;
      if (!hasStoryArcs) {
        gaps.push({
          type: 'NO_STORY_ARCS',
          severity: 'MODERATE',
          description: 'Personagem com longa história mas sem arcos narrativos documentados',
          narrative_impact: 'Dificulta criação de estrutura narrativa clara'
        });
      }
    }

    // Verificar transformações
    const hasDifferentVersions = characterData.different_versions || characterData.costume_changes;
    if (!hasDifferentVersions && (comicsData || []).length > 100) {
      gaps.push({
        type: 'NO_EVOLUTION_DOCUMENTED',
        severity: 'MINOR',
        description: 'Personagem com longa história mas sem evolução visual documentada',
        narrative_impact: 'Seção de evolução será limitada'
      });
    }

    return {
      gaps: gaps,
      narrative_coherence_score: this.calculateNarrativeCoherence(gaps),
      storytelling_potential: this.assessStorytellingPotential(characterData, comicsData)
    };
  }

  // 🔄 Verificar consistência
  checkConsistency(videoAnalysis) {
    const consistencyChecks = {
      duration_consistency: this.checkDurationConsistency(videoAnalysis),
      visual_consistency: this.checkVisualConsistency(videoAnalysis),
      narrative_consistency: this.checkNarrativeConsistency(videoAnalysis),
      quality_consistency: this.checkQualityConsistency(videoAnalysis)
    };

    const overallConsistencyScore = Object.values(consistencyChecks).reduce((sum, check) => sum + check.score, 0) / Object.keys(consistencyChecks).length;

    return {
      overall_score: Math.round(overallConsistencyScore),
      checks: consistencyChecks,
      issues: this.identifyConsistencyIssues(consistencyChecks)
    };
  }

  // 🛠️ Avaliar viabilidade técnica
  assessTechnicalFeasibility(videoAnalysis) {
    const feasibility = {
      render_feasibility: this.assessRenderFeasibility(videoAnalysis),
      asset_management: this.assessAssetManagement(videoAnalysis),
      audio_requirements: this.assessAudioRequirements(videoAnalysis),
      editing_complexity: this.assessEditingComplexity(videoAnalysis)
    };

    const overallFeasibilityScore = Object.values(feasibility).reduce((sum, check) => sum + check.score, 0) / Object.keys(feasibility).length;

    return {
      overall_score: Math.round(overallFeasibilityScore),
      feasibility_level: overallFeasibilityScore > 80 ? 'HIGH' : overallFeasibilityScore > 60 ? 'MEDIUM' : 'LOW',
      assessments: feasibility,
      technical_challenges: this.identifyTechnicalChallenges(feasibility)
    };
  }

  // 📊 Calcular pontuação geral de qualidade
  calculateOverallQuality(qualityGates, gapAnalysis, consistencyCheck) {
    const gateScore = (qualityGates.passed_gates / qualityGates.total_gates) * 40;
    const gapScore = this.calculateGapScore(gapAnalysis) * 35;
    const consistencyScore = consistencyCheck.overall_score * 25;

    return Math.round(gateScore + gapScore + consistencyScore);
  }

  // 🏅 Obter grau de qualidade
  getQualityGrade(score) {
    if (score >= 90) return { grade: 'A+', description: 'Excelente - Pronto para produção imediata' };
    if (score >= 80) return { grade: 'A', description: 'Ótimo - Pronto com melhorias menores' };
    if (score >= 70) return { grade: 'B+', description: 'Bom - Requer algumas melhorias' };
    if (score >= 60) return { grade: 'B', description: 'Aceitável - Requer melhorias significativas' };
    if (score >= 50) return { grade: 'C', description: 'Limitado - Requer muitas melhorias' };
    if (score >= 40) return { grade: 'D', description: 'Fraco - Requer trabalho extensivo' };
    return { grade: 'F', description: 'Inviável - Considerar cancelamento' };
  }

  // 🎯 Gerar recomendações de qualidade
  generateQualityRecommendations(qualityGates, gapAnalysis) {
    const recommendations = [];

    // Recomendações baseadas nos portões
    qualityGates.gates.forEach(gate => {
      if (gate.status === 'FAILED') {
        recommendations.push({
          type: 'GATE_FAILURE',
          gate: gate.name,
          severity: gate.severity,
          recommendations: gate.recommendations,
          priority: gate.severity === 'CRITICAL' ? 'URGENT' : 'HIGH'
        });
      }
    });

    // Recomendações baseadas nos gaps
    [...gapAnalysis.critical_gaps, ...gapAnalysis.moderate_gaps].forEach(gap => {
      recommendations.push({
        type: 'CONTENT_GAP',
        gap: gap.type,
        severity: gap.severity,
        recommendations: gap.suggestions,
        priority: gap.severity === 'CRITICAL' ? 'URGENT' : 'MEDIUM'
      });
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { 'URGENT': 3, 'HIGH': 2, 'MEDIUM': 1, 'LOW': 0 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  // 🚀 Avaliar prontidão para produção
  assessProductionReadiness(qualityGates, qualityScore) {
    if (qualityGates.critical_failures > 0) {
      return {
        ready: false,
        reason: 'Problemas críticos precisam ser resolvidos',
        estimated_delay: '1-2 semanas',
        blocking_issues: qualityGates.critical_failures
      };
    }

    if (qualityScore < 60) {
      return {
        ready: false,
        reason: 'Qualidade geral abaixo do mínimo aceitável',
        estimated_delay: '3-5 dias',
        blocking_issues: 'Múltiplos gaps de qualidade'
      };
    }

    if (qualityGates.warnings > 2) {
      return {
        ready: true,
        reason: 'Pronto com advertências - monitorar durante produção',
        estimated_delay: '0 dias',
        notes: `${qualityGates.warnings} melhorias recomendadas`
      };
    }

    return {
      ready: true,
      reason: 'Totalmente pronto para produção',
      estimated_delay: '0 dias',
      confidence: 'ALTA'
    };
  }

  // 🛠️ Métodos auxiliares (implementações simplificadas)
  assessContentQuality(text) {
    if (!text) return 0;
    const length = text.length;
    if (length > 2000) return 10;
    if (length > 1000) return 8;
    if (length > 500) return 6;
    if (length > 200) return 4;
    return 2;
  }

  estimateSectionDuration(text) {
    if (!text) return 0;
    return Math.max(2, Math.min(15, text.length / 150)); // 150 caracteres ≈ 1 minuto falado
  }

  calculateContentBalance(sections) {
    const availableSections = Object.values(sections).filter(section => section.available).length;
    const totalSections = Object.keys(sections).length;
    return (availableSections / totalSections) * 100;
  }

  identifyDistributionIssues(sections) {
    const issues = [];
    Object.entries(sections).forEach(([key, section]) => {
      if (!section.available) {
        issues.push(`${key} não disponível`);
      }
    });
    return issues;
  }

  calculateGapScore(gapAnalysis) {
    const criticalPenalty = gapAnalysis.critical_gaps.length * 15;
    const moderatePenalty = gapAnalysis.moderate_gaps.length * 8;
    const minorPenalty = gapAnalysis.minor_gaps.length * 3;

    return Math.max(0, 100 - criticalPenalty - moderatePenalty - minorPenalty);
  }

  calculateNarrativeCoherence(gaps) {
    const criticalGaps = gaps.filter(gap => gap.severity === 'CRITICAL').length;
    const moderateGaps = gaps.filter(gap => gap.severity === 'MODERATE').length;

    return Math.max(0, 100 - (criticalGaps * 20) - (moderateGaps * 10));
  }

  assessStorytellingPotential(characterData, comicsData) {
    const hasBiography = !!(characterData.description && characterData.description.length > 200);
    const hasEvolution = (comicsData || []).length > 20;
    const hasConflict = !!(characterData.enemies && characterData.enemies.length > 0);

    if (hasBiography && hasEvolution && hasConflict) return 'HIGH';
    if ((hasBiography || hasEvolution) && hasConflict) return 'MEDIUM';
    return 'LOW';
  }

  checkDurationConsistency(videoAnalysis) {
    const estimatedDuration = videoAnalysis.duration_analysis.recommended_duration_minutes;
    const contentBasedDuration = videoAnalysis.content_analysis.estimated_duration_minutes || estimatedDuration;

    const difference = Math.abs(estimatedDuration - contentBasedDuration);
    const score = Math.max(0, 100 - difference * 2);

    return { score, difference, consistent: difference < 10 };
  }

  checkVisualConsistency(videoAnalysis) {
    const assetScore = videoAnalysis.content_analysis.asset_score;
    return { score: assetScore, consistent: assetScore > 40 };
  }

  checkNarrativeConsistency(videoAnalysis) {
    const contentScore = videoAnalysis.content_analysis.content_score;
    return { score: contentScore, consistent: contentScore > 40 };
  }

  checkQualityConsistency(videoAnalysis) {
    const overallScore = videoAnalysis.viability_analysis.overall_score;
    return { score: overallScore, consistent: overallScore > 50 };
  }

  identifyConsistencyIssues(consistencyChecks) {
    const issues = [];
    Object.entries(consistencyChecks).forEach(([check, data]) => {
      if (!data.consistent) {
        issues.push(`${check}: inconsistência detectada`);
      }
    });
    return issues;
  }

  assessRenderFeasibility(videoAnalysis) {
    const duration = videoAnalysis.duration_analysis.recommended_duration_minutes;
    const score = duration > 180 ? 60 : duration > 120 ? 80 : 90;
    return { score, render_time: duration * 5 };
  }

  assessAssetManagement(videoAnalysis) {
    const assetCount = videoAnalysis.content_analysis.total_visual_assets || 0;
    const score = assetCount > 50 ? 90 : assetCount > 20 ? 80 : 60;
    return { score, asset_count: assetCount };
  }

  assessAudioRequirements(videoAnalysis) {
    const sceneCount = videoAnalysis.storyboard_analysis.scenes.length;
    const score = sceneCount > 15 ? 80 : sceneCount > 8 ? 90 : 85;
    return { score, scenes: sceneCount };
  }

  assessEditingComplexity(videoAnalysis) {
    const uniquenessScore = videoAnalysis.storyboard_analysis.uniqueness_score;
    const score = uniquenessScore > 80 ? 70 : uniquenessScore > 60 ? 80 : 90;
    return { score, complexity: uniquenessScore > 80 ? 'HIGH' : 'MEDIUM' };
  }

  identifyTechnicalChallenges(feasibility) {
    const challenges = [];
    Object.entries(feasibility).forEach(([area, assessment]) => {
      if (assessment.score < 70) {
        challenges.push(`${area}: ${assessment.score}/100`);
      }
    });
    return challenges;
  }
}

// 📦 Export para n8n
module.exports = QualityControlSystem;

// 📝 Exemplo de uso no n8n:
/*
const qualityControl = new QualityControlSystem();

const videoAnalysis = items[0].json; // Análise completa do vídeo
const characterData = items[1].json; // Dados do personagem
const comicsData = items[2]?.json || []; // Quadrinhos
const storyArcsData = items[3]?.json || []; // Arcos narrativos

const qualityReport = qualityControl.performQualityCheck(videoAnalysis, characterData, comicsData, storyArcsData);

return [{
  json: qualityReport
}];
*/