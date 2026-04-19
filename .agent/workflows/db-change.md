---
description: db-change
---

# Workflow: db-change

## Recommended skill chain

1. `change-classifier`
2. `database-management`
3. `planning-standard` when the change is non-trivial
4. `preflight-verification`
5. `closeout-report`

## Steps

1. Change `prisma/schema.prisma`.
2. Verify model and field names.
3. Run `npm run check:prisma`.
4. If the change is accepted, run `npm run db:push`.
5. Make sure code using the changed fields is updated.
6. Update documentation:
   - `current_state.md`
   - `domain_map.md` if a new model or new domain responsibility appears
   - the relevant skill

## Note

The repository currently follows a `db push` approach rather than versioned migration files.  
Do not document migration files as existing if they are not present.