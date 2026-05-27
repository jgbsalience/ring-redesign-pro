---
name: accessibility-2-1
description: Guides WCAG 2.1 Level A and AA–aligned UI implementation and structured accessibility reviews for React/TypeScript apps (including Radix UI and Tailwind). Use when the user asks for accessibility, a11y, WCAG 2.1 compliance, keyboard or screen reader support, focus management, semantic HTML, ARIA, color contrast, or an accessibility audit of components or routes.
disable-model-invocation: true
---

# Accessibility 2.1 (WCAG)

## When to use this skill

- Implementing or changing UI that must be usable with keyboard, screen readers, and reduced motion.
- Reviewing a PR, route, or component for WCAG 2.1 issues.
- Debugging focus traps, dialogs, forms, images, or custom widgets.

## Choose a path

| Situation                      | Path               |
| ------------------------------ | ------------------ |
| Building or editing UI         | **Implementation** |
| Auditing existing UI or a diff | **Review**         |

For a compact criterion list, see [checklist.md](checklist.md). For sample outputs and prompts, see [examples.md](examples.md).

## Implementation (balanced)

Prioritize native HTML semantics before ARIA. Prefer Radix primitives for complex patterns (they ship roles, keyboard behavior, and focus handling when used as documented).

1. **Structure**: Logical heading order (`h1` → `h2` → …), landmarks (`header`, `nav`, `main`, `footer`), lists for lists.
2. **Keyboard**: All interactive controls reachable via Tab; custom controls operable with Enter/Space/Escape as appropriate; no keyboard traps except intentional modals (with escape hatch).
3. **Focus**: Visible focus ring (do not remove with `outline-none` unless a clearer, WCAG-conformant focus style replaces it); focus moves into dialogs on open and restores on close.
4. **Forms**: Associate labels with controls (`Label` + `htmlFor` / `aria-labelledby`); group related fields; surface errors with text (not color alone), linked to fields (`aria-describedby` / `aria-invalid`).
5. **Images and icons**: Meaningful images need descriptive `alt`; decorative images use `alt=""` or `aria-hidden`; icon-only buttons need accessible names (`aria-label` or visually hidden text).
6. **Color and motion**: Text and UI graphics meet contrast targets where applicable; respect `prefers-reduced-motion` for non-essential animation.
7. **ARIA**: Use only to fill gaps native elements cannot cover; keep `aria-*` in sync with visual state; avoid redundant roles on native elements.

If unsure between patterns, pick the one with simpler semantics and fewer moving parts.

## Review (balanced)

1. Identify scope (files, route, or user flow).
2. Walk keyboard-only and imagine a screen reader announcement order (name, role, state, value).
3. Log issues by **severity** (must-fix vs recommended) and map to WCAG 2.1 success criteria when confident.
4. For each must-fix: location, user impact, reproduction or code pointer, concrete fix.

**Severity**

- **Must-fix**: Blocks task completion or causes serious confusion for keyboard or assistive tech users (e.g., missing name on control, unreachable content, modal without focus or escape).
- **Recommended**: Improves clarity, robustness, or AA polish without blocking core flows.

Do not inflate severity. If evidence is incomplete, label as **needs verification** and state what to test.

## Audit output template

Copy and fill:

```markdown
## Accessibility review (WCAG 2.1)

### Scope

- ...

### Summary

- Must-fix: N
- Recommended: N

### Must-fix

1. **Issue**: ...
   - **WCAG** (if known): ...
   - **Where**: ...
   - **Impact**: ...
   - **Fix**: ...

### Recommended

1. ...

### Verification

- Keyboard: ...
- Screen reader (optional): ...
```

## Project stack notes

This repo uses React, TypeScript, Vite, TanStack Router/Start, Tailwind, and Radix UI. Prefer Radix’s documented props and composition for dialogs, menus, tabs, and form controls; verify custom styling did not remove focus visibility or accessible names.
