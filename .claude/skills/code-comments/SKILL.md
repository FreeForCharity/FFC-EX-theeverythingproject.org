---
name: code-comments
description: >-
  Comment policy for this repo. Use whenever writing, editing, or reviewing code, config, or type
  declarations, including code ported from the template or other FFC repos.
---

- Default to no comments.
- Add one only when the code would be very confusing to an external reader.
- If a comment is needed, make it as short as possible, ideally one line.
- When porting code, trim the source's explanatory comments to this standard.
- Put the reasoning in the commit message or PR body instead.

## Example

The template's `types/jest-axe.d.ts` opens with an 8-line header explaining jest-axe's missing types,
Next 16.3 type-checking, and module augmentation. This repo keeps one line, the only non-obvious
part:

```ts
// No top-level import/export: that would turn these into augmentations.
declare module 'jest-axe' {
```
