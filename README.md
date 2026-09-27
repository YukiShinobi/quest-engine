# Quest Engine

A reusable quest state machine for games and progression systems.

I wanted the quest logic separated from UI and database code so the rules are easy to test: prerequisites, unlocking, accepting, objective progress, branching choices, turn-in and rewards.

## Supports

- prerequisite quests
- locked → available → active → ready-to-turn-in → complete lifecycle
- multiple objectives with targets
- incremental objective progress
- branching choice records
- reward payloads
- completion percentage
- validation for duplicate objective IDs

```js
import { defineQuest, createQuestState, unlockQuest, acceptQuest, progressObjective } from './src/index.js';

const quest = defineQuest({
  id: 'first-contract',
  title: 'First Contract',
  objectives: [{ id: 'wins', target: 3 }],
  rewards: [{ type: 'xp', amount: 500 }]
});

let state = unlockQuest(quest, createQuestState(quest));
state = acceptQuest(state);
state = progressObjective(state, 'wins', 1);
```

The engine deliberately does not care whether the quest lives in Minecraft, a web app or another game. Storage and UI stay outside the domain layer.
