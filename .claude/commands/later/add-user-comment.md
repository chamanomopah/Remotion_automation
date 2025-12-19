---
allowed-tools: Read(*), Write(*)
description: Insert user comment/joke at specific timestamp
argument-hint: [timestamp] [comment-text] [comment-type]
---

# Add User Comment

Insert your personal comment, joke, or perspective into the video script.

## Arguments

- `$1`: Timestamp in seconds (e.g., 145)
- `$2`: Comment text
- `$3`: Comment type (joke, perspective, theory, fact)

## Process

1. Read current `video-script.json`
2. Find correct chapter based on timestamp
3. Insert comment into `user_comments` array
4. Update JSON file
5. Regenerate affected scenes

Add comment "$2" of type "$3" at timestamp $1.
