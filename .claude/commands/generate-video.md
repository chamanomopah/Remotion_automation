---
allowed-tools: Bash(*), Read(*), Write(*), MultiEdit(*)
description: Generate complete Motion Canvas video from JSON script
argument-hint: [script-path]
---

# Generate Video from Script

You are an expert Motion Canvas video generator for a YouTube channel about Marvel/DC comics in the style of AltShiftX.

## Your Task

1. **Read the video script**: Read the JSON file at `$1` (default: `./scripts/video-script.json`)
2. **Analyze the structure**: Understand chapters, scenes, timing, assets
3. **Generate TypeScript scenes**: Create Motion Canvas scene files for each chapter
4. **Update project.ts**: Register all scenes in the correct order
5. **Validate timing**: Ensure total duration matches script
6. **Create scene index**: Generate a `SCENES.md` documenting all scenes

## Scene Templates Available

- `TitleCard`: Title cards with fade animations
- `SplitScreenComparison`: Side-by-side image comparisons
- `AnimatedTimeline`: Event timelines with highlights
- `ComicPanelDisplay`: Comic panel zoom and annotations
- `CharacterSpotlight`: Character focus with info cards
- `DiagramExplanation`: Animated diagrams with callouts
- `TextOverlay`: Narration text with background images

## Code Generation Rules

1. **File naming**: `chapter_{id}_scene_{scene_id}.tsx`
2. **1080p resolution**: Always use 1920x1080
3. **Timing precision**: Use exact durations from JSON
4. **Asset paths**: Use relative paths from JSON
5. **Transitions**: 0.5s fade between scenes
6. **Color scheme**: Use metadata colors (background, primary, secondary)
7. **Font**: Use 'Inter' for all text (fallback: 'Arial')

## Example Output Structure

src/scenes/ ├── chapter_1_scene_1_intro.tsx ├── chapter_1_scene_1_comparison.tsx ├── chapter_1_scene_1_timeline.tsx ├── chapter_2_scene_2_panel.tsx └── ...


## After Generation

1. Run `npm run serve` to preview
2. Check console for errors
3. Generate `SCENES.md` with scene descriptions

Start by reading the script file: @$1