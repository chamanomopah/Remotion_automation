---
allowed-tools: Bash(npm:*), Bash(node:*)
description: Render Motion Canvas project to video file
argument-hint: [output-name]
---

# Render Video

Render the Motion Canvas project to a video file.

## Process

1. Check if project is valid (no errors)
2. Run `npm run build` to compile TypeScript
3. Run `npm run render` to export video
4. Move output to `./output/$1.mp4` (default: video_output.mp4)
5. Display video info (duration, size, codec)

## Output Specs

- Resolution: 1920x1080 (1080p)
- FPS: 30
- Codec: H.264
- Audio: None (add narration separately)

Start rendering to `$1`.
