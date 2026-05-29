---
name: Micro-Interaction Generator
description: A skill to generate modern, sleek CSS animations for UI elements.
---
# Micro-Interaction Generator

This skill helps create fluid, modern CSS transitions and hover states for web views.

## Usage

When designing web UI, consult this skill to see standard curated patterns. Look for opportunities to add micro-animations to improve aesthetic continuity.

### Smooth Scales

```css
.button-hover {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.button-hover:hover {
  transform: scale(1.05);
}
```

### Fade and Shimmer Effects

For loading states or accent highlights:

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

Check the active web documents for standard usage of transitions and add `transition` properties where elements instantly pop if they should smoothly transition.
