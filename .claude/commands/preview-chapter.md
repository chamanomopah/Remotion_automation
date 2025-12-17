---
allowed-tools: Bash(npm:*)
description: Preview specific chapter in Motion Canvas editor
argument-hint: [chapter-id]
---

# Preview Chapter

Open Motion Canvas editor focused on a specific chapter.

## Process

1. Identify chapter scenes from `video-script.json`
2. Start development server with `npm run serve`
3. Open browser at `http://localhost:9000/`
4. Display chapter info (duration, scenes, timestamps)

Preview chapter `$1`.
