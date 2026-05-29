---
name: Accessibility Scanner
description: A skill to scan HTML files for missing alt tags, aria-labels, and semantic elements.
---
# Accessibility Scanner

This skill helps ensure your web pages are accessible by checking for standard a11y practices.

## Usage

Run the `scan_accessibility.py` script to scan all HTML files.

```bash
python3 .agent/skills/accessibility_scanner/scan_accessibility.py
```

## Manual Verification

Use grep to find standard a11y issues:

- Find images without alt tags:
  ```bash
  grep -rE "<img" . --include="*.html"
  # (and manual verification that alt="..." is present)
  ```

- Find semantic button issues:
  ```bash
  grep -rnE "<span .*class=.*button" . --include="*.html"
  ```
