import test from 'node:test';
import assert from 'node:assert/strict';
import { acceptQuest, completeQuest, createQuestState, defineQuest, progressObjective, unlockQuest } from '../src/index.js';

test('quest moves through unlock, accept, objective and turn-in states', () => {
  const quest = defineQuest({ id: 'q1', title: 'Trial', objectives: [{ id: 'wins', target: 2 }], rewards: [{ type: 'xp', amount: 100 }] });
  let state = unlockQuest(quest, createQuestState(quest));
  assert.equal(state.status, 'available');
  state = acceptQuest(state);
  state = progressObjective(state, 'wins');
  assert.equal(state.status, 'active');
  state = progressObjective(state, 'wins');
  assert.equal(state.status, 'ready_to_turn_in');
  const result = completeQuest(quest, state);
  assert.equal(result.state.status, 'complete');
  assert.equal(result.rewards[0].amount, 100);
});

test('locked prerequisites stay locked', () => {
  const quest = defineQuest({ id: 'q2', title: 'Locked', prerequisites: ['q1'] });
  assert.equal(unlockQuest(quest, createQuestState(quest), []).status, 'locked');
});
