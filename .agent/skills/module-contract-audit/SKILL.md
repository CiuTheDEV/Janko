---
name: module-contract-audit
description: Use this skill when creating a new domain module or significantly reshaping an existing one in the Janko repository. It checks whether the module has a coherent structure, ownership, registration path, documentation, and validation coverage.
---

# Skill: Module Contract Audit

## Goal

Prevent half-formed modules by checking the structural contract of a domain surface.

## When to use

Use this skill when:
- creating a new module,
- moving responsibilities between modules,
- splitting a module,
- adding multiple commands/events/components to one domain,
- formalizing a previously ad-hoc area into a real module.

## Preconditions

Inspect:
- `src/modules/`
- `src/core/discovery.js`
- `src/core/loader.js`
- `.agent/memory/domain_map.md`
- relevant workflows and skills.

## Instructions

Check whether the module has:

- a clear domain name,
- correct placement under `src/modules/<domain>/`,
- only necessary subdirectories,
- discovery-compatible files,
- a clear service boundary,
- documentation ownership in `domain_map.md` and `current_state.md`,
- a matching skill if the module has non-trivial recurring rules.

Also check:
- whether the module really deserves to exist as a separate domain,
- whether logic belongs in `src/core/` instead,
- whether the domain is implemented or still only planned.

## Constraints

- do not list a module as active if it is only an empty folder or a roadmap idea,
- do not create modules for tiny one-off helpers,
- do not move cross-cutting technical logic into a business domain without reason.

## Verification

Before finalizing, confirm:
- the file structure is valid,
- discovery and loader assumptions still hold,
- domain ownership is reflected in documentation,
- the module has a realistic validation path.

## Related docs

- `.agent/memory/domain_map.md`
- `.agent/memory/current_state.md`
- `.agent/workflows/module-create.md`
