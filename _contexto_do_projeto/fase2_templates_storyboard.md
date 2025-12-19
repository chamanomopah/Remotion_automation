# 🎬 Fase 2: Templates Paramétricos de Storyboard

## 🎯 **Objetivo**
Criar um sistema de storyboard modular onde cada personagem tem um storyboard único mas seguindo uma estrutura padrão de 10+ tipos de cenas.

## 📐 **Estrutura Padrão Modular**

### **🔥 Tipos de Cenas Base (Templates)**

#### **1. CENA ABERTURA - "Character Reveal"**
```javascript
{
  "scene_type": "character_reveal",
  "duration_frames": 300, // 10 segundos
  "priority": "ESSENCIAL",
  "required_data": ["name", "image", "real_name", "deck"],
  "visual_elements": [
    {
      "type": "hero_image",
      "position": "center",
      "animation": "zoom_in",
      "duration": 200
    },
    {
      "type": "name_title",
      "position": "bottom",
      "animation": "fade_in",
      "duration": 150
    },
    {
      "type": "subtitle",
      "content": "real_name",
      "position": "below_name",
      "animation": "fade_in_delayed",
      "duration": 100
    }
  ],
  "narration_template": "Hoje vamos explorar a história completa de {name}...",
  "visual_priority": 10,
  "uniqueness_factor": "hero_pose"
}
```

#### **2. CENA ORIGEM - "Origin Story"**
```javascript
{
  "scene_type": "origin_story",
  "duration_frames": 450, // 15 segundos
  "priority": "ALTA",
  "required_data": ["origin", "birth", "creators"],
  "visual_elements": [
    {
      "type": "timeline_cinematic",
      "events": ["birth", "incident", "transformation"],
      "position": "center",
      "animation": "scroll_horizontal"
    },
    {
      "type": "creator_photos",
      "position": "bottom_banner",
      "animation": "slide_in"
    }
  ],
  "narration_template": "{name} foi criado por {creators} em {birth}, e sua origem remonta a {origin}...",
  "visual_priority": 9,
  "uniqueness_factor": "era_style"
}
```

#### **3. CENA PODERES - "Powers Showcase"**
```javascript
{
  "scene_type": "powers_showcase",
  "duration_frames": 600, // 20 segundos
  "priority": "ALTA",
  "required_data": ["powers", "abilities", "power_grid"],
  "visual_elements": [
    {
      "type": "power_grid_visual",
      "position": "right",
      "animation": "progressive_fill"
    },
    {
      "type": "power_demonstration",
      "powers_list": "powers",
      "position": "left",
      "animation": "cascade_display"
    }
  ],
  "narration_template": "{name} possui {power_count} poderes incríveis, incluindo {main_powers}...",
  "visual_priority": 9,
  "uniqueness_factor": "power_animation_style"
}
```

#### **4. CENA IDENTIDADE - "Secret Identity"**
```javascript
{
  "scene_type": "secret_identity",
  "duration_frames": 300, // 10 segundos
  "priority": "MEDIA",
  "required_data": ["real_name", "aliases", "occupation"],
  "visual_elements": [
    {
      "type": "dual_identity_split",
      "hero_side": "hero_image",
      "civilian_side": "civilian_photo",
      "animation": "wipe_transition"
    },
    {
      "type": "name_comparison",
      "position": "top",
      "animation": "text_reveal"
    }
  ],
  "narration_template": "Por trás da máscara, {name} é na verdade {real_name}...",
  "visual_priority": 7,
  "uniqueness_factor": "transition_style"
}
```

#### **5. CENA TIMES - "Team Affiliations"**
```javascript
{
  "scene_type": "team_affiliations",
  "duration_frames": 450, // 15 segundos
  "priority": "MEDIA",
  "required_data": ["teams"],
  "visual_elements": [
    {
      "type": "team_logos_grid",
      "teams": "teams",
      "position": "center",
      "animation": "sequential_appear"
    },
    {
      "type": "membership_timeline",
      "position": "bottom",
      "animation": "progress_fill"
    }
  ],
  "narration_template": "Ao longo de sua história, {name} fez parte de {team_count} equipes diferentes...",
  "visual_priority": 7,
  "uniqueness_factor": "team_composition_style"
}
```

#### **6. CENA INIMIGOS - "Rogues Gallery"**
```javascript
{
  "scene_type": "rogues_gallery",
  "duration_frames": 600, // 20 segundos
  "priority": "ALTA",
  "required_data": ["enemies"],
  "visual_elements": [
    {
      "type": "enemy_wall",
      "enemies": "enemies",
      "position": "background",
      "animation": "parallax_scroll"
    },
    {
      "type": "enemy_spotlight",
      "position": "center",
      "animation": "rotate_highlight"
    }
  ],
  "narration_template": "Os maiores adversários de {name} incluem {main_enemies}...",
  "visual_priority": 8,
  "uniqueness_factor": "enemy_arrangement_pattern"
}
```

#### **7. CENA ALIADOS - "Allies Network"**
```javascript
{
  "scene_type": "allies_network",
  "duration_frames": 450, // 15 segundos
  "priority": "MEDIA",
  "required_data": ["allies"],
  "visual_elements": [
    {
      "type": "relationship_graph",
      "center": "character_image",
      "connections": "allies",
      "position": "center",
      "animation": "network_growth"
    }
  ],
  "narration_template": "Em suas jornadas, {name} contou com a ajuda de grandes aliados como {main_allies}...",
  "visual_priority": 6,
  "uniqueness_factor": "graph_connection_style"
}
```

#### **8. CENA HISTÓRIA QUADRINHOS - "Comic History Timeline"**
```javascript
{
  "scene_type": "comic_history",
  "duration_frames": 900, // 30 segundos
  "priority": "ESSENCIAL",
  "required_data": ["comics_data"],
  "visual_elements": [
    {
      "type": "comic_covers_stream",
      "comics": "comics_data",
      "position": "scroll_area",
      "animation": "horizontal_scroll"
    },
    {
      "type": "era_markers",
      "position": "top",
      "animation": "sequential_reveal"
    },
    {
      "type": "milestone_highlights",
      "position": "overlay",
      "animation": "pop_in"
    }
  ],
  "narration_template": "A história de {name} nos quadrinhos começou em {first_appearance} e se estende por {comic_count} edições...",
  "visual_priority": 10,
  "uniqueness_factor": "era_transition_effects"
}
```

#### **9. CENA ARCOS NARRATIVOS - "Story Arcs Deep Dive"**
```javascript
{
  "scene_type": "story_arcs",
  "duration_frames": 600, // 20 segundos
  "priority": "ALTA",
  "required_data": ["story_arcs"],
  "visual_elements": [
    {
      "type": "arc_covers_mosaic",
      "arcs": "story_arcs",
      "position": "center",
      "animation": "zoom_cluster"
    },
    {
      "type": "arc_timeline",
      "position": "bottom",
      "animation": "timeline_expand"
    }
  ],
  "narration_template": "Os arcos narrativos mais importantes de {name} incluem {main_arcs}...",
  "visual_priority": 8,
  "uniqueness_factor": "arc_mosaic_pattern"
}
```

#### **10. CENA EVOLUÇÃO - "Character Evolution"**
```javascript
{
  "scene_type": "character_evolution",
  "duration_frames": 450, // 15 segundos
  "priority": "MEDIA",
  "required_data": ["different_versions", "costume_changes"],
  "visual_elements": [
    {
      "type": "evolution_timeline",
      "versions": "character_versions",
      "position": "center",
      "animation": "morph_transition"
    }
  ],
  "narration_template": "{name} passou por diversas transformações ao longo dos anos...",
  "visual_priority": 7,
  "uniqueness_factor": "morph_style"
}
```

#### **11. CENA BATALHAS - "Epic Battles Montage"**
```javascript
{
  "scene_type": "epic_battles",
  "duration_frames": 450, // 15 segundos
  "priority": "ALTA",
  "required_data": ["notable_battles", "major_conflicts"],
  "visual_elements": [
    {
      "type": "battle_clips_grid",
      "battles": "battle_data",
      "position": "dynamic_grid",
      "animation": "quick_cuts"
    },
    {
      "type": "vs_animations",
      "position": "overlay",
      "animation": "impact_effects"
    }
  ],
  "narration_template": "As batalhas mais épicas de {name} incluem {major_battles}...",
  "visual_priority": 8,
  "uniqueness_factor": "battle_transition_effects"
}
```

#### **12. CENA LEGADO - "Legacy & Impact"**
```javascript
{
  "scene_type": "legacy_impact",
  "duration_frames": 300, // 10 segundos
  "priority": "ESSENCIAL",
  "required_data": ["cultural_impact", "influence", "adaptations"],
  "visual_elements": [
    {
      "type": "impact_visualization",
      "position": "center",
      "animation": "ripple_effect"
    },
    {
      "type": "adaptation_logos",
      "position": "bottom_banner",
      "animation": "logo_scroll"
    }
  ],
  "narration_template": "O legado de {name} vai muito além dos quadrinhos, influenciando {impact_areas}...",
  "visual_priority": 9,
  "uniqueness_factor": "impact_visualization_style"
}
```

## 🎲 **Sistema de Variação por Personagem**

### **Algoritmo de Seleção de Cenas**
```javascript
class SceneSelector {
  constructor() {
    this.scenePriorities = {
      "character_reveal": 10,
      "origin_story": 8,
      "powers_showcase": 9,
      "comic_history": 10,
      "legacy_impact": 9,
      "rogues_gallery": 8,
      "story_arcs": 7,
      "epic_battles": 7,
      "team_affiliations": 6,
      "allies_network": 5,
      "character_evolution": 5,
      "secret_identity": 4
    };
  }

  generateStoryboard(characterData, contentAnalysis, targetDuration) {
    let storyboard = [];
    let currentDuration = 0;

    // 🔴 Cenas essenciais (sempre incluídas)
    const essentialScenes = ["character_reveal", "comic_history", "legacy_impact"];
    for (const sceneType of essentialScenes) {
      const scene = this.generateScene(sceneType, characterData);
      if (scene) {
        storyboard.push(scene);
        currentDuration += scene.duration_frames;
      }
    }

    // 🟡 Cenas baseadas em dados disponíveis
    const dataBasedScenes = this.selectDataBasedScenes(characterData, contentAnalysis);
    for (const sceneType of dataBasedScenes) {
      if (currentDuration >= targetDuration * 30) break; // 30 frames = 1 segundo

      const scene = this.generateScene(sceneType, characterData);
      if (scene) {
        storyboard.push(scene);
        currentDuration += scene.duration_frames;
      }
    }

    // 🟡 Preencher tempo restante com cenas variadas
    const fillerScenes = this.selectFillerScenes(currentDuration, targetDuration, characterData);
    storyboard = storyboard.concat(fillerScenes);

    // 🎯 Adicionar elementos únicos do personagem
    storyboard = this.addUniqueElements(storyboard, characterData);

    return {
      scenes: storyboard,
      total_duration_frames: currentDuration,
      estimated_duration_seconds: Math.round(currentDuration / 30),
      uniqueness_score: this.calculateUniquenessScore(storyboard)
    };
  }

  selectDataBasedScenes(characterData, contentAnalysis) {
    const availableScenes = [];

    // Verificar dados disponíveis
    if (characterData.powers && characterData.powers.length > 0) {
      availableScenes.push("powers_showcase");
    }

    if (characterData.origin || characterData.birth) {
      availableScenes.push("origin_story");
    }

    if (characterData.real_name && characterData.real_name !== characterData.name) {
      availableScenes.push("secret_identity");
    }

    if (characterData.enemies && characterData.enemies.length > 5) {
      availableScenes.push("rogues_gallery");
    }

    if (characterData.teams && characterData.teams.length > 0) {
      availableScenes.push("team_affiliations");
    }

    if (characterData.allies && characterData.allies.length > 3) {
      availableScenes.push("allies_network");
    }

    // Ordenar por prioridade e disponibilidade
    return availableScenes.sort((a, b) =>
      this.scenePriorities[b] - this.scenePriorities[a]
    );
  }

  selectFillerScenes(currentDuration, targetDuration, characterData) {
    const fillerScenes = [];
    const remainingTime = (targetDuration * 30) - currentDuration;
    const sceneBuffer = 450; // 15 segundos de buffer

    if (remainingTime > sceneBuffer) {
      // Adicionar cenas baseadas no personagem
      if (characterData.powers && characterData.powers.length > 10) {
        fillerScenes.push(this.generateScene("epic_battles", characterData));
      }

      if (characterData.story_arcs && characterData.story_arcs.length > 0) {
        fillerScenes.push(this.generateScene("story_arcs", characterData));
      }
    }

    return fillerScenes;
  }

  addUniqueElements(storyboard, characterData) {
    // Adicionar toques únicos baseados no personagem
    const uniqueModifiers = this.getUniqueModifiers(characterData);

    return storyboard.map(scene => ({
      ...scene,
      unique_elements: uniqueModifiers[scene.scene_type] || {},
      character_theme: this.getCharacterTheme(characterData)
    }));
  }

  getUniqueModifiers(characterData) {
    const modifiers = {};

    // Exemplo: Personagens com poderes elementais
    if (this.hasElementalPowers(characterData)) {
      modifiers["powers_showcase"] = {
        element_particles: true,
        color_theme: "elemental"
      };
    }

    // Exemplo: Personagens tecnológicos
    if (this.isTechBased(characterData)) {
      modifiers["origin_story"] = {
        tech_animations: true,
        blueprint_style: true
      };
    }

    // Exemplo: Personagens cósmicos
    if (this.isCosmicBeing(characterData)) {
      modifiers["legacy_impact"] = {
        cosmic_effects: true,
        starfield_background: true
      };
    }

    return modifiers;
  }

  getCharacterTheme(characterData) {
    if (characterData.publisher?.name?.includes("Marvel")) {
      return "marvel_style";
    } else if (characterData.publisher?.name?.includes("DC")) {
      return "dc_style";
    } else if (this.isDarkCharacter(characterData)) {
      return "dark_theme";
    } else {
      return "classic_comic";
    }
  }

  // Métodos auxiliares para determinar características
  hasElementalPowers(characterData) {
    const elementalKeywords = ['fire', 'ice', 'water', 'earth', 'air', 'lightning', 'storm'];
    const powers = characterData.powers || [];
    return powers.some(power =>
      elementalKeywords.some(keyword =>
        power.toLowerCase().includes(keyword)
      )
    );
  }

  isTechBased(characterData) {
    const techKeywords = ['technology', 'armor', 'gadgets', 'suit', 'mechanical'];
    const powers = characterData.powers || [];
    const description = characterData.description || '';

    return powers.some(power =>
      techKeywords.some(keyword =>
        power.toLowerCase().includes(keyword)
      )
    ) || techKeywords.some(keyword =>
      description.toLowerCase().includes(keyword)
    );
  }

  isCosmicBeing(characterData) {
    const cosmicKeywords = ['cosmic', 'space', 'galaxy', 'universe', 'alien', 'god'];
    const description = characterData.description || '';
    const powers = characterData.powers || [];

    return cosmicKeywords.some(keyword =>
      description.toLowerCase().includes(keyword) ||
      powers.some(power => power.toLowerCase().includes(keyword))
    );
  }

  isDarkCharacter(characterData) {
    const darkKeywords = ['dark', 'shadow', 'night', 'bat', 'darkness', 'evil'];
    const description = characterData.description || '';
    const name = characterData.name || '';

    return darkKeywords.some(keyword =>
      description.toLowerCase().includes(keyword) ||
      name.toLowerCase().includes(keyword)
    );
  }

  calculateUniquenessScore(storyboard) {
    let uniquenessScore = 0;

    // Calcular baseado na variedade de cenas
    const sceneTypes = [...new Set(storyboard.map(scene => scene.scene_type))];
    uniquenessScore += sceneTypes.length * 5;

    // Calcular baseado em elementos únicos
    const scenesWithUniqueElements = storyboard.filter(scene =>
      scene.unique_elements && Object.keys(scene.unique_elements).length > 0
    );
    uniquenessScore += scenesWithUniqueElements.length * 3;

    // Normalizar para 0-100
    return Math.min(uniquenessScore, 100);
  }
}
```

## 🎯 **Exemplo de Output de Storyboard**

```json
{
  "character": "Spider-Man",
  "storyboard": {
    "scenes": [
      {
        "scene_type": "character_reveal",
        "start_frame": 0,
        "duration_frames": 300,
        "visual_elements": [
          {
            "type": "hero_image",
            "image_url": "spiderman_hero.jpg",
            "position": { "x": 960, "y": 540 },
            "animation": "zoom_in_from_black",
            "uniqueness": "web_swinging_pose"
          }
        ],
        "narration": "Hoje vamos explorar a história completa de Spider-Man...",
        "character_theme": "marvel_style"
      },
      {
        "scene_type": "origin_story",
        "start_frame": 300,
        "duration_frames": 450,
        "visual_elements": [
          {
            "type": "timeline_cinematic",
            "events": [
              { "frame": 300, "event": "bite", "visual": "radioactive_spider" },
              { "frame": 450, "event": "uncle_death", "visual": "uncle_ben" },
              { "frame": 600, "event": "first_costume", "visual": "costume_creation" }
            ]
          }
        ],
        "narration": "Peter Parker foi criado por Stan Lee e Steve Ditko em 1962...",
        "character_theme": "marvel_style"
      }
    ],
    "total_duration_frames": 12000,
    "estimated_duration_seconds": 400,
    "uniqueness_score": 85
  }
}
```

## 📋 **Próximos Passos da Fase 2**
1. Implementar gerador de cenas dinâmicas
2. Criar sistema de transições únicas
3. Desenvolver validador de coerência visual
4. Integrar com sistema de assets da Fase 1
5. Testar com diferentes personagens