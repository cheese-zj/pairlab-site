# PAIR Lab agent specialization

## Three layers, one quality bar

1. **Global foundation:** reuse verification, browser, process, and handoff capabilities. Do not vendor copies or install another framework for this project.
2. **Project contract:** `../AGENTS.md` maps architecture, sources, invariants, commands, and verification requirements. The three skills under `skills/` load detailed workflows only when relevant.
3. **Execution adaptation:** adjust scope, retrieved context, and checkpoints to the task and observed model performance. Do not change factual standards, acceptance criteria, or deployment authorization.

No `.pi/settings.json` is necessary yet: there are no project-specific packages or justified model defaults to configure. These skills are instructions, not automatic model routing, a sandbox, or mechanically enforced completion gates.

## Frontend design skill

`skills/frontend-design/` vendors Anthropic's official skill at commit `34040c9c568585f6929bedeaad110ad08f079624`, unchanged with its Apache-2.0 license. Source details and checksums are in `skills/frontend-design/UPSTREAM.md`. It adds no runtime, hooks, dependencies, model override, or global installation.

Use `/skill:frontend-design` for visual design work. Read `../AGENTS.md` and any relevant brief first; the project truth/content rules still apply. The homepage design brief is `../docs/homepage-design.md`: the original dark, animated identity leads into News on the same black surface, with a shared pause/reduced-motion treatment and no promotional hero buttons. The user rejected the cream robotics-photo redesign.

Workflow: brief and subject matter → compact visual plan → critique against the brief → implement the chosen direction → browser review and `pairlab-release-check`. Do not load another competing art-direction skill by default. Vercel's review skill and the larger Impeccable/UI UX Pro Max suites were not installed.

## Choosing execution depth

| Situation | Working approach | Completion standard |
|---|---|---|
| Narrow factual correction | Read the source/data and affected output; short impact checklist | Source-backed facts, relevant gate and rendered check |
| New project/media or cross-page change | Enumerate data, assets, metadata, and route impact before editing; verify coherent slices | Same standard, plus all affected layers |
| Worker/SEO/deployment change | State routing/indexing invariants, test changed cases, distinguish mocked and real integration evidence | Same standard, plus targeted regressions and explicit production limits |
| Unfamiliar model, limited context, or repeated missed constraints | Smaller file scopes, explicit next step, checkpoints/handoff; pause if uncertainty remains | Never lower the gate to accommodate the model |

Use a more capable model only by an explicit user-approved choice, not an opaque automatic escalation. Keep simple tasks simple even with a strong model. If the chosen browser/tool is unavailable, report that limit or use an authorized equivalent rather than silently installing replacements.

## Lightweight evaluation protocol

The initial profile is a hypothesis, not a proven improvement. Before tuning it further, compare representative tasks on disposable branches/worktrees, never on a production deployment:

1. **Content:** make a supplied, source-backed biography correction. Success: correct data and rendered output, no invented details, no unrelated changes.
2. **Responsive UI:** make a specified layout adjustment or fix a reproducible overflow. Success: desktop/mobile evidence, existing design tokens, navigation/focus preserved.
3. **Routing:** implement a specified redirect/proxy correction against a failing case. Success: targeted regression, canonical/asset/query behavior preserved, no deployment.

Do not manufacture changes on the main working tree merely to run an evaluation. Prefer real queued tasks; use fixtures or isolated worktrees for controlled comparisons.

For A/B comparisons, keep model/version, thinking setting, starting revision, task input, tool permissions, and acceptance checks fixed. Compare the generic baseline against this profile; repeat before attributing gains to the instructions. When comparing models, keep the profile fixed and record the model difference instead.

Record compact results locally under `artifacts/`:

| Task / starting revision | Model / reasoning | Profile version | Checks and outcome | Time / tokens or cost | Corrections / scope violations |
|---|---|---|---|---|---|

Also record whether the intended skill was actually loaded and whether unrelated tasks avoided it. Prefer observable outcomes over a model grading its own work. Promote useful, non-sensitive findings into reviewed documentation; discard rules that do not improve outcomes.

## Activation and local state

Launch `pi` from the repository. Approve this project's local resources when prompted; do not globally trust unrelated directories. A fresh trust decision may require restarting; edits to already-trusted skills can use `/reload`.

Local paths:
- `artifacts/`: screenshots, bounded logs, verification records and evaluation results (Git-ignored).
- `handoffs/`: concise pause/resume state, revalidated before use (Git-ignored).

Do not store secrets or browser authentication state in these folders. Ignoring a file does not make it secure. Shared long-term decisions belong in normal reviewed documentation.
