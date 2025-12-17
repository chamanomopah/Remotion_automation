---
allowed-tools: Write(*), Read(*)
description: Create individual Motion Canvas scene from parameters
argument-hint: [scene-type] [scene-props-json]
---

# Create Single Scene

Generate a single Motion Canvas scene file.

## Arguments

- `$1`: Scene type (title_card, split_screen_comparison, animated_timeline, etc.)
- `$2`: Scene properties as JSON string

## Scene Types

1. **title_card**: Title and subtitle with fade
2. **split_screen_comparison**: Left/right image comparison
3. **animated_timeline**: Timeline with events
4. **comic_panel_display**: Comic panel with zoom/annotations
5. **character_spotlight**: Character focus with info
6. **diagram_explanation**: Diagram with animated callouts
7. **text_overlay**: Text over background image

## Process

1. Parse scene type and properties
2. Load appropriate template from `src/templates/`
3. Generate scene file with properties injected
4. Save to `src/scenes/custom_scene_{timestamp}.tsx`
5. Return file path

Create the scene with type `$1` and properties `$2`.
