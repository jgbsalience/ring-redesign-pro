# Examples

## Example: review output (abbreviated)

```markdown
## Accessibility review (WCAG 2.1)

### Scope
- `src/routes/contact.tsx`, contact form

### Summary
- Must-fix: 1
- Recommended: 1

### Must-fix
1. **Issue**: Submit button is icon-only with no accessible name.
   - **WCAG**: 4.1.2 Name, Role, Value
   - **Where**: `<button type="submit">` wrapping SVG only
   - **Impact**: Screen reader users hear “button” with no purpose.
   - **Fix**: Add `aria-label="Send message"` or include visually hidden text “Send”.

### Recommended
1. **Issue**: Inline error for `email` is red text only.
   - **WCAG**: 1.4.1 Use of Color; 3.3.1 Error Identification
   - **Fix**: Add error text with an icon or prefix “Error:” and associate via `aria-describedby` on the input.

### Verification
- Keyboard: Tab through fields, submit with Enter, dismiss errors with focus intact.
- Screen reader: Confirm button name and error announcement on invalid submit.
```

## Example: implementation notes (React + Radix)

**Dialog**

- Use `@radix-ui/react-dialog` `Title` and `Description` (or `aria-labelledby` / `aria-describedby`) so the dialog has an accessible name.
- On open, focus moves to the first focusable element or a designated close button per UX; on close, restore focus to the trigger.

**Icon button**

```tsx
<button type="button" aria-label="Open menu">
  <MenuIcon aria-hidden className="size-5" />
</button>
```

**Decorative hero image**

```tsx
<img src={hero} alt="" />
```

**Reduced motion (Tailwind)**

Prefer CSS `motion-reduce:` variants for decorative motion; keep essential feedback visible without animation.

## Example: user prompts that should load this skill

- “Run an a11y pass on the header and nav.”
- “Does this form meet WCAG 2.1 AA?”
- “Fix keyboard trap in the gallery lightbox.”
- “Add accessible labels to the listing filters.”
