---
name: Skill Finder
description: A skill to find and read available skills in the workspace using a script.
---
# Skill Finder

This skill helps the agent find other skills available in the workspace.

## Purpose

The Skill Finder skill enables the agent to discover and understand the capabilities of other skills installed in the repository or workspace.

## Usage

Run the `find_skills.py` script to list all available skills in the workspace.

```bash
python3 .agent/skills/skill_finder/find_skills.py
```

The script will search for `SKILL.md` files, extract their name and description, and print them out.

## Manual Discovery

If the script fails or you prefer manual discovery:

1. Search for `SKILL.md` files:
   ```bash
   find . -name "SKILL.md"
   ```
2. Read the `SKILL.md` file using `view_file`.
