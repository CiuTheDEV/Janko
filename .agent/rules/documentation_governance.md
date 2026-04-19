# Documentation Governance — Janko

This rule defines how new documentation must be created, updated, and maintained in the Janko repository.

## 1. Purpose

Documentation must help agents and humans understand the repository **without inventing implementation status**.

The goal is to keep documentation:
- accurate,
- scoped,
- role-specific,
- easy to maintain,
- hard to misread.

## 2. Language rule

All **agent-facing documentation** must be written in **English**.

This includes:
- root execution docs (`AGENTS.md`, `GEMINI.md`)
- `.agent/**`
- `docs/**` used for technical or execution guidance

Do not create new mixed-language technical documents.

## 3. Truth hierarchy

New documentation must respect this order:

1. source code in `src/`
2. `prisma/schema.prisma`
3. `.agent/memory/current_state.md`
4. `.agent/memory/domain_map.md`
5. `docs/CODE_ISSUES_TO_FIX.md`
6. `ROADMAP.md`
7. `artifacts/*.md`

If a new document conflicts with code, the document is wrong until verified otherwise.

## 4. Required document classification

Every new document must clearly belong to one of these categories:

- **current state**
- **rule / protocol**
- **skill**
- **workflow**
- **issue report**
- **decision record**
- **roadmap**
- **historical artifact**

Do not create documents with ambiguous roles.

## 5. Required separation of concerns

Never mix these layers casually:
- implementation status,
- backlog,
- owner preference,
- unresolved technical debt,
- historical narration.

Use the dedicated destinations:
- current implementation facts → `.agent/memory/current_state.md`
- domain ownership / module map → `.agent/memory/domain_map.md`
- unresolved code problems → `docs/CODE_ISSUES_TO_FIX.md`
- future direction → `ROADMAP.md`
- owner preferences → `.agent/memory/preferences.md`
- historical notes → `artifacts/*.md`

## 6. Rules for creating a new documentation file

Before creating a new `.md` file:
1. confirm that an existing file does not already own that responsibility,
2. classify the task with `change-classifier`,
3. enforce scope with `docs-code-boundary`,
4. verify claims with `repo-truth-check`.

New files should be created only when:
- the responsibility is genuinely new,
- the file has a stable long-term purpose,
- updating an existing owner file would make the repo less clear.

## 7. Naming and placement rules

- put agent memory in `.agent/memory/`
- put always-active repository rules in `.agent/rules/`
- put on-demand skills in `.agent/skills/`
- put compact procedures in `.agent/workflows/`
- put reports and technical issue summaries in `docs/`
- put historical materials in `artifacts/`

Avoid generic names such as:
- `notes.md`
- `temp.md`
- `misc.md`

Prefer names that reveal ownership and role.

## 8. Required structure for new technical docs

New technical docs should normally include:
- a clear title,
- purpose or role,
- scope,
- source-of-truth boundaries,
- maintenance rule,
- related files or related docs.

New docs must not open with marketing language or vague promises.

## 9. Docs-only task rule

If the task is docs-only:
- do not edit `.js`, `.prisma`, or runtime config files,
- report code issues in `docs/CODE_ISSUES_TO_FIX.md`,
- explicitly state that code was not modified.

## 10. Verification before finalizing documentation

Before finalizing documentation changes:
- verify that referenced paths exist,
- verify that commands or models actually exist,
- verify that the file does not describe a planned feature as shipped,
- verify that the file is in English,
- verify that the file does not duplicate another owner file,
- run `preflight-verification` for the documentation surface,
- produce a `closeout-report` for non-trivial documentation work.

## 11. Special rules for skills and workflows

When creating a new skill:
- keep `description` trigger-oriented,
- keep instructions concrete,
- include constraints and verification,
- do not make it a generic encyclopedia page.

When creating a new workflow:
- keep it compact,
- point to the relevant skills,
- do not replace `planning-standard` for non-trivial work.

## 12. Historical materials

Historical documents are allowed, but they must be clearly labeled as historical and must not act as live implementation truth.
