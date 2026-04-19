---
description: command-add
---

# Workflow: command-add

## Recommended skill chain

1. `change-classifier`
2. `planning-standard` when the command is not trivial
3. relevant domain skill
4. `interaction-safety`
5. `preflight-verification`
6. `closeout-report`

## Steps

1. Choose the owning domain in `src/modules/` or create one through `module-create.md`.
2. Create a file under `src/modules/<domain>/commands/`.
3. Export an object with:
   - `data`
   - `execute`
4. If the command needs UI, plan matching `components/`.
5. If the command needs data, synchronize schema and service changes.
6. Run:
   - `npm run validate`
   - `npm run deploy`
7. Update domain documentation and `current_state.md` if this is new functionality.

## Minimal contract

```javascript
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('name')
    .setDescription('description'),
  async execute(interaction, client) {
    await interaction.reply('Working!');
  }
};
```