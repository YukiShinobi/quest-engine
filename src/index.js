export function defineQuest({ id, title, prerequisites = [], objectives = [], rewards = [], branches = [] }) {
  if (!id || !title) throw new Error('Quest id and title are required');
  const objectiveIds = new Set();
  for (const objective of objectives) {
    if (!objective.id) throw new Error('Every objective needs an id');
    if (objectiveIds.has(objective.id)) throw new Error(`Duplicate objective: ${objective.id}`);
    objectiveIds.add(objective.id);
  }
  return { id, title, prerequisites, objectives, rewards, branches };
}

export function createQuestState(quest) {
  return {
    questId: quest.id,
    status: 'locked',
    acceptedAt: null,
    completedAt: null,
    objectives: Object.fromEntries(quest.objectives.map(o => [o.id, { current: 0, target: o.target ?? 1, complete: false }])),
    choices: []
  };
}

export function prerequisitesMet(quest, completedQuestIds) {
  return quest.prerequisites.every(id => completedQuestIds.includes(id));
}

export function unlockQuest(quest, state, completedQuestIds = []) {
  if (!prerequisitesMet(quest, completedQuestIds)) return state;
  if (state.status === 'locked') return { ...state, status: 'available' };
  return state;
}

export function acceptQuest(state, now = new Date().toISOString()) {
  if (state.status !== 'available') throw new Error('Quest is not available');
  return { ...state, status: 'active', acceptedAt: now };
}

export function progressObjective(state, objectiveId, amount = 1) {
  if (state.status !== 'active') throw new Error('Quest is not active');
  const objective = state.objectives[objectiveId];
  if (!objective) throw new Error(`Unknown objective: ${objectiveId}`);
  const current = Math.min(objective.target, objective.current + amount);
  const objectives = {
    ...state.objectives,
    [objectiveId]: { ...objective, current, complete: current >= objective.target }
  };
  const allComplete = Object.values(objectives).every(item => item.complete);
  return { ...state, objectives, status: allComplete ? 'ready_to_turn_in' : state.status };
}

export function chooseBranch(state, branchId) {
  if (state.status !== 'active' && state.status !== 'ready_to_turn_in') throw new Error('Branch choice is not available');
  return { ...state, choices: [...state.choices, branchId] };
}

export function completeQuest(quest, state, now = new Date().toISOString()) {
  if (state.status !== 'ready_to_turn_in') throw new Error('Objectives are not complete');
  return {
    state: { ...state, status: 'complete', completedAt: now },
    rewards: structuredClone(quest.rewards)
  };
}

export function completionPercent(state) {
  const objectives = Object.values(state.objectives);
  if (!objectives.length) return 100;
  const progress = objectives.reduce((sum, item) => sum + item.current / item.target, 0);
  return Math.round((progress / objectives.length) * 100);
}
