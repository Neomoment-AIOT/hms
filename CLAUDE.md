# HMS

## Rules
- Session Log is updated AUTOMATICALLY after every significant action — no manual trigger needed. See global CLAUDE.md for protocol.
- All code merges to `dev` only, never `master`/`main` — unless this is a docs-only repo.
- NEVER force push to `main` or `master`.

## Project Context
- **Org**: Neomoment-AIOT
- **Repo**: hms
- **Owner**: Suhail, CTO (suhail.c@FeeBee.com)

# Session Log

> Cross-PC memory. Updated automatically after significant actions.

### Mar 15, 2026
- **Done**: Added CLAUDE.md for session continuity and cross-PC memory.
- **Left off**: CLAUDE.md committed and pushed.
- **Next**: Begin active development.

## Plugin: context-mode
- `mksglu/context-mode` is installed globally for local session continuity
- It handles local memory (SQLite) automatically — no action needed
- Cross-PC memory is handled via CLAUDE.md Session Log + git push/pull
- Install on new PC: `/plugin marketplace add mksglu/context-mode` then `/plugin install context-mode@context-mode`

