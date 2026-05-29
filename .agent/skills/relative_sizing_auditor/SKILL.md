---
name: Relative Sizing Auditor
description: Checks CSS for hardcoded px values and ensures rem/em scaling.
---
# Relative Sizing Auditor

This skill helps ensure text and spacing scale properly across different device sizes.

## Usage

Use grep to search for hardcoded `px` values where `rem` or `em` should be used.

```bash
grep -rn "px" . --include="*.css"
```

### Rem Scale Examples

Use standard font sizing scales:

1. Font sizes should use `rem` (relative to root html font size).
2. Padding, margins, and gaps can use `rem` to scale with text.

Look for violations where text uses `font-size: 16px` instead of `font-size: 1rem`.
