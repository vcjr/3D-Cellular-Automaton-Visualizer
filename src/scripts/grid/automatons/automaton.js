export const RULESETS = {
  '3D Life': { survive: new Set([3, 4]), born: new Set([3]) },
  'Conway':  { survive: new Set([2, 3]), born: new Set([3]) },
  'Sparse':  { survive: new Set([4, 5]), born: new Set([4]) },
  'Dense':   { survive: new Set([2, 3, 4, 5]), born: new Set([2, 3]) },
};

export const DEFAULT_RULESET = '3D Life';
