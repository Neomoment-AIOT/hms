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

### Sep 5, 2026
- **Done**: Windows Terminal pwsh profile briefly switched to Campbell Powershell then reverted to default appearance (Dark+, Cascadia Code) per Suhail; Claude Code theme set to `dark-ansi` in `~/.claude.json` (backup `.claude.json.bak-20260905`). Claimed Teams chat "HMS Phase 1 — Completion Tracker" (`19:9e6a3b1bc6a047b69a1f6ab7b0d2dc6c@thread.v2`) for this session (peers dell-88 + old laptop acked). Verified hms-demo (Coolify app 110, container `l0sg00000os8c4wwg48884go` on Contabo 5.189.160.57, proxy = caddy-docker-proxy) runs `deploy/hms-demo-master1` head `1503053`; DBs on `ec4400k48csoc4wgcgcws44g`: hms_demo, hms_demo_seeded. Coolify API token `5|nqFX…` is DEAD (401 on coolify.neoaiot.com, 173.212.228.93, local); managing Coolify = coolify.neoaiot.com (app 110 not in local Coolify). M365 connector cannot send Teams chat (no ChatMessage.Send) → posting via `C:\dev\FeeBee\.local\hms_chat_post.py` (delegated Graph token).
- **Left off**: In progress — (1) lock hms-demo.neoaiot.com behind basic auth + X-Robots-Tag via Caddy drop-in `/data/coolify/proxy/caddy/dynamic/*.caddy`; (2) restore Sohail's `training_db_21_07_2026_2026-09-01_09-19-31 1.zip` (his OneDrive, Teams chat files) as the served DB; (3) Saman's RPC_ERROR (empty spreadsheet_data on Front Desk/Dashboards).
- **Next**: finish the three items, post proof in the HMS chat tagging Sohail/Saman, start the chat watch loop, get a fresh Coolify token from Suhail for env/redeploy operations.

### Mar 15, 2026
- **Done**: Added CLAUDE.md for session continuity and cross-PC memory.
- **Left off**: CLAUDE.md committed and pushed.
- **Next**: Begin active development.

## Plugin: context-mode
- `mksglu/context-mode` is installed globally for local session continuity
- It handles local memory (SQLite) automatically — no action needed
- Cross-PC memory is handled via CLAUDE.md Session Log + git push/pull
- Install on new PC: `/plugin marketplace add mksglu/context-mode` then `/plugin install context-mode@context-mode`

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
