<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&height=200&text=QUEST%20ENGINE&fontAlignY=38&desc=STATE%20%E2%80%A2%20OBJECTIVES%20%E2%80%A2%20REWARDS&descAlignY=58&color=0:050505,55:202020,100:5a1616&fontColor=f5f5f5&descColor=d4d4d4" width="100%" />

![Model](https://img.shields.io/badge/model-state%20machine-111111?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-20%2B-2b2b2b?style=for-the-badge&logo=nodedotjs)
![Tests](https://img.shields.io/badge/tests-node:test-7a1f1f?style=for-the-badge)

**A reusable quest state machine for games and progression systems.**

</div>

---

## Lifecycle

```txt
locked
  ↓ prerequisites met
available
  ↓ accept
active
  ↓ objectives complete
ready-to-turn-in
  ↓ claim
complete
```

## Supports

- prerequisite quests
- multiple objectives with targets
- incremental progress
- branching choice records
- reward payloads
- completion percentage
- duplicate-objective validation
- automated tests

## Example

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

## Why I built it

I wanted the quest rules separated from UI and persistence. The engine should not care whether the experience lives in Minecraft, a browser or another game.

## Test

```bash
npm test
```

---

<div align="center"><sub>YukiShinobi // progression logic belongs in the domain, not buried in a screen.</sub></div>
