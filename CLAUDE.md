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
- **Update ~09:00Z**: LOCKDOWN LIVE — Caddy drop-in `/data/coolify/proxy/caddy/dynamic/hms-demo-lock.caddy` (hms-demo-lock.caddy LIVE): basic auth user `hms` on everything except /robots.txt + `X-Robots-Tag: noindex,nofollow,noarchive,nosnippet`; verified 401 without key / 200 with key; odoo.neoaiot.com unaffected; key held by Suhail (not in repo). Google had NOT indexed the site (site: search empty). ROOT CAUSE of Saman's RPC_ERROR: hms_demo was restored WITHOUT its filestore (1953 attachment refs, 20 files on disk) so the 5 spreadsheet dashboards read empty → json.loads(''). Sohail's zip (44.9 MB, Odoo 17.0/pg17 dump, 166 modules, 21 companies) also ships only 62 filestore files vs 3837 refs. Restored it as `training_db_new` (482 MB, exit 0), reloaded all 10 dashboards from module JSON via `odoo shell` script `scratchpad/fix_dashboards.py` (copy on server `/root/hms-restore/`), created QA user `qa.claude` (mirrors admin groups). Only module missing on server: `stock_no_negative`. Teams ack posted (msg 1788598133096) via `C:\dev\FeeBee\.local\hms_chat_post.py` (supports mentions + hostedContents images). Switch = rename hms_demo→hms_demo_old_20260905, training_db_new→hms_demo (+ filestore dirs) — no Coolify needed (dbfilter ^hms_demo$ is baked in the image).
- **Update ~09:15Z**: SWITCH DONE 08:54Z — `hms_demo` (482 MB) is now Sohail's training DB; old demo kept as `hms_demo_old_20260905`; Odoo healthy, login page 200. Lockdown CORRECTED: the `.caddy` drop-in made Caddy reject the app's site ("ambiguous site definition", empty 200 for key-holders) — removed; lock now = `hms-demo-lock` sidecar container (alpine, network coolify) whose labels merge into the app's Caddy site (basicauth user `hms` + X-Robots-Tag); verified 200 with key / 401 without / header present. Chrome MCP not connected → screenshot QA via Playwright (`scratchpad/hms_qa_shots.py`). Infra memory: `~/.claude/projects/C--dev-hms/memory/project_hms_demo_infra.md`.
- **Update ~09:35Z**: QA PASS on 6 screens via Playwright as `qa.claude` (login, home, Dashboards, Front Desk, Front Desk Dashboard, Room Dashboard; no 4xx/5xx in Odoo log). PROOF POSTED in HMS chat: msg `1788599464841` (6 inline screenshots, tags Sohail + Saman; earlier ack msg `1788598133096`). Open with Sohail: A/B on installing `account_multi_payment` (dependency of intercompany_cash_transfer), `stock_no_negative` missing from branch, full filestore wanted. Handled message ids: Sohail 1788437522060 / 1788428051138 / 1788426646132, Saman 1788592898041.
- **Watch state**: last tick 2026-09-06 01:47Z; last handled msg 1788605184231 (key post); seen-no-action: Saman 1788599690222 (thanks, will test); quiet ticks in a row: 31 (cadence 30 min); open: Sohail A/B on account_multi_payment.
- **Next**: watch loop on the HMS chat (read last 10 msgs each tick, ack + action + reply with proof, only hms-7e posts); act on Sohail's A/B answer; remove `qa.claude` when Sohail confirms; get a fresh Coolify API token from Suhail for env/redeploy operations; access key POSTED in the HMS chat on Suhail's instruction (2026-09-05 ~09:40Z, tags Sohail/Saman/Arhum).

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
