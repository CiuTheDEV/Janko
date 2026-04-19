---
description: module-create
---

# Workflow: module-create

## Recommended skill chain

1. `change-classifier`
2. `planning-standard`
3. `module-contract-audit`
4. relevant domain skill or a newly created skill
5. `preflight-verification`
6. `closeout-report`

## Steps

1. Choose the domain name.
2. Create `src/modules/<name>/`.
3. Add only the necessary subdirectories:
   - `commands/`
   - `events/`
   - `components/`
   - `services/`
4. If the module has its own recurring rules, add or extend a matching skill.
5. Run `npm run validate`.
6. Add the domain to `domain_map.md`.
7. Update `current_state.md` only when the module actually exists as implemented repository behavior.

## Note

Do not list a domain as “active” if it exists only as an empty folder or as a roadmap idea.