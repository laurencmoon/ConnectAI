---
name: Design Token Auditor
description: A skill to find hardcoded hex colors or sizing values in CSS that should use tokens or variables.
---
# Design Token Auditor

This skill helps the agent verify that the codebase adheres to a standard design system by identifying hardcoded values that should be variables.

## Usage

Run the `audit_tokens.py` script to scan all CSS files for hardcoded hex codes or absolute font sizes that are not parameters.

```bash
python3 .agent/skills/design_token_auditor/audit_tokens.py
```

## Manual Usage with Tools

You can also use grep to find hardcoded colors:

```bash
grep -rnE "#[0-9a-fA-F]{3,6}" . --include="*.css"
```

## Best Practices

Identify elements using absolute hex colors outside of `var(--...)` settings and replace them with standard design tokens system variables.
