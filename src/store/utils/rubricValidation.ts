export const validateRubricWeights = (criteria: { weight: number }[]): boolean => {
  const total = criteria.reduce((sum, c) => sum + c.weight, 0);
  return Math.abs(total - 100) < 0.01; // Allow for floating point precision
};

export const normalizeRubricWeights = (
  criteria: { weight: number }[]
): { weight: number }[] => {
  const total = criteria.reduce((sum, c) => sum + c.weight, 0);
  
  if (total === 0) {
    // If all weights are 0, distribute evenly
    const evenWeight = 100 / criteria.length;
    return criteria.map((c) => ({ ...c, weight: evenWeight }));
  }

  // Normalize to 100%
  return criteria.map((c) => ({
    ...c,
    weight: (c.weight / total) * 100
  }));
};
