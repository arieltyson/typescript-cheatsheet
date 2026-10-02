# 004: One design system for both cheat sheets

## Context

Python CheatSheet and TypeScript CheatSheet are used the same way, by
the same person, often in the same week.

## Decision

The stylesheet, layout, jump list, copy buttons and tests are ported
from Python CheatSheet unchanged. Only the identity colour changes: the
mark is a TypeScript blue tile, and the jump highlight and link colour
are derived from it. Indent classes step by 2ch because Prettier
indents TypeScript by two spaces.

## Consequence

Knowing one site means knowing the other. A design fix found in one
should be ported to the other.
