/**
 * Training Splits Database
 * Generated from comprehensive scientific research by @analyst
 * Baseline: Meta-analyses 2024-2026, peer-reviewed studies
 *
 * This module exports training split configurations optimized by:
 * - Volume landmarks (MEV/MAV/MRV) per experience level
 * - Frequency research (2x/week sweet spot for hypertrophy)
 * - 7 frequencies from 1-7 days/week with detailed templates
 */

export const VOLUME_LANDMARKS = {
  beginner: {
    mev: 6,        // Minimum Effective Volume
    mav: 14,       // Maintenance + Activity Volume (TARGET)
    mrv: 16,       // Maximum Recoverable Volume (CEILING)
    years: '0-1'
  },
  intermediate: {
    mev: 10,
    mav: 16,
    mrv: 20,
    years: '1-5'
  },
  advanced: {
    mev: 12,
    mav: 20,
    mrv: 26,
    years: '5+'
  }
}

export const MUSCLE_GROUPS = {
  chest: {
    id: 'chest',
    name: 'Peito',
    size: 'large',
    mavPerWeek: 16,
    optimalFrequency: 2.5
  },
  back: {
    id: 'back',
    name: 'Costas',
    size: 'large',
    mavPerWeek: 16,
    optimalFrequency: 2.5
  },
  shoulders: {
    id: 'shoulders',
    name: 'Ombros',
    size: 'medium',
    mavPerWeek: 12,
    optimalFrequency: 2.5
  },
  quadriceps: {
    id: 'quadriceps',
    name: 'Quadríceps',
    size: 'very_large',
    mavPerWeek: 18,
    optimalFrequency: 2.5
  },
  glutes: {
    id: 'glutes',
    name: 'Glúteo',
    size: 'large',
    mavPerWeek: 14,
    optimalFrequency: 2.5
  },
  hamstrings: {
    id: 'hamstrings',
    name: 'Isquiotibial',
    size: 'medium_large',
    mavPerWeek: 12,
    optimalFrequency: 2.5
  },
  biceps: {
    id: 'biceps',
    name: 'Bíceps',
    size: 'small',
    mavPerWeek: 10,
    optimalFrequency: 2.5
  },
  triceps: {
    id: 'triceps',
    name: 'Tríceps',
    size: 'small',
    mavPerWeek: 10,
    optimalFrequency: 2.5
  },
  calves: {
    id: 'calves',
    name: 'Panturrilha',
    size: 'small',
    mavPerWeek: 14,
    optimalFrequency: 3
  },
  core: {
    id: 'core',
    name: 'Núcleo',
    size: 'small',
    mavPerWeek: 8,
    optimalFrequency: 2
  }
}

export const TRAINING_SPLITS = {
  '1d': {
    id: '1d',
    name: 'Full Body 1x/Semana',
    days: 1,
    level: 'beginner_extreme',
    frequency_per_muscle_group: 1,
    total_weekly_sets: 22,
    session_duration_minutes: 90,
    pattern: 'A Rest Rest Rest Rest Rest Rest',
    ideal_for: ['Tempo muito limitado', 'Iniciantes absolutos', 'Rotina instável'],
    pros: ['Simples de seguir', 'Pouco tempo por semana'],
    cons: ['Frequência subótima (-32% vs 2x/sem)', 'Sessões muito longas (90+ min)', 'Se faltar 1 semana, interrompe completamente'],
    recommendation: 'NÃO recomendado para ganho de massa. Apenas se tempo for extremamente limitado.',
    description: 'Uma única sessão full body por semana. Sessões longas mas máxima simplificidade.',
    muscle_group_distribution: {
      chest: 5,
      back: 5,
      legs: 8,
      shoulders: 2,
      arms: 4,
      core: 1
    }
  },

  '2d': {
    id: '2d',
    name: 'Upper/Lower 2x/Semana',
    days: 2,
    level: 'beginner',
    frequency_per_muscle_group: 1,
    total_weekly_sets: 36,
    session_duration_minutes: 50,
    pattern: 'Upper Lower Rest Upper Lower Rest Rest',
    ideal_for: ['Iniciantes', 'Tempo limitado', 'Consistência moderada'],
    pros: ['Frequência mínima recomendada', 'Sessões curtas (45-60 min)', '2 treinos semanais viável'],
    cons: ['Cada grupo treina apenas 1x/semana', 'Recuperação marginal para avançados'],
    recommendation: 'Bom para iniciantes. Frequência mínima para estímulo hipertrófico adequado.',
    description: 'Alternância Upper/Lower. Cada grupo muscular é treinado 1x por semana.',
    muscle_group_distribution: {
      chest: 6,
      back: 6,
      shoulders: 3,
      arms: 6,
      legs: 9,
      core: 2
    }
  },

  '3d': {
    id: '3d',
    name: 'Push/Pull/Legs 3x/Semana',
    days: 3,
    level: 'beginner_to_intermediate',
    frequency_per_muscle_group: 1,
    total_weekly_sets: 48,
    session_duration_minutes: 55,
    pattern: 'Push Pull Legs Rest Push Pull Legs Rest',
    ideal_for: ['Tempo moderado', 'Iniciantes avançados', 'Consistência 3x/semana'],
    pros: ['Frequência recomendada (3x/sem estímulo)', 'Sessões balanceadas', 'Recuperação adequada', 'Variação de padrões motores'],
    cons: ['Requer 3 dias/semana de consistência'],
    recommendation: 'Excelente para iniciantes avançados e intermediários. Sweet spot de volume e frequência.',
    description: 'PPL clássico: Push (peito/ombro/tríceps), Pull (costas/bíceps), Legs. Cada músculo é estimulado 1x/semana com múltiplos padrões.',
    muscle_group_distribution: {
      chest: 5,
      back: 5,
      shoulders: 4,
      arms: 6,
      legs: 10,
      core: 2
    }
  },

  '4d': {
    id: '4d',
    name: 'Upper/Lower 4x/Semana',
    days: 4,
    level: 'intermediate',
    frequency_per_muscle_group: 2,
    total_weekly_sets: 56,
    session_duration_minutes: 50,
    pattern: 'Upper Lower Rest Upper Lower Rest Rest',
    ideal_for: ['Intermediários', 'Tempo moderado', 'Objetivo ganho de massa'],
    pros: ['Frequência 2x/semana (ÓTIMA para hipertrofia)', '4 treinos menores melhor recuperação', 'Divisão clara de esforço'],
    cons: ['Requer 4 dias/semana de consistência', 'Planejamento periódico necessário'],
    recommendation: 'EXCELENTE para intermediários. Frequência 2x/semana é o sweet spot científico para hipertrofia com bom volume.',
    description: 'Upper/Lower repetido 2x na semana. Cada grupo muscular treina 2x/semana com recuperação ótima.',
    muscle_group_distribution: {
      chest: 8,
      back: 8,
      shoulders: 6,
      arms: 8,
      legs: 14,
      core: 4
    }
  },

  '5d': {
    id: '5d',
    name: 'Push/Pull/Legs Intenso 5x/Semana',
    days: 5,
    level: 'intermediate_to_advanced',
    frequency_per_muscle_group: 1.67,
    total_weekly_sets: 60,
    session_duration_minutes: 50,
    pattern: 'Push Pull Legs Upper Legs Rest Rest',
    ideal_for: ['Intermediários avançados', 'Tempo disponível', 'Foco híbrido força/hipertrofia'],
    pros: ['Frequência elevada (1.67x/semana)', 'Volume total alto', 'Flexibilidade de padrões', 'Treinos menores = melhor técnica'],
    cons: ['Requer consistência 5x/semana', 'Recuperação crítica', 'Risco de overtraining se volume não gerenciado'],
    recommendation: 'Para intermediários avançados com boa recuperação. Monitore volume semanal total.',
    description: 'PPL com dia extra de upper ou lower. Volume alto com frequência distribuída.',
    muscle_group_distribution: {
      chest: 7,
      back: 8,
      shoulders: 8,
      arms: 8,
      legs: 16,
      core: 3
    }
  },

  '6d': {
    id: '6d',
    name: 'Upper/Lower Duplo 6x/Semana',
    days: 6,
    level: 'advanced',
    frequency_per_muscle_group: 2.4,
    total_weekly_sets: 68,
    session_duration_minutes: 45,
    pattern: 'Upper Lower Upper Lower Upper Lower Rest',
    ideal_for: ['Avançados', 'Dedicação máxima', 'Volume muito alto'],
    pros: ['Frequência muito alta (2.4x/semana)', 'Volume máximo', 'Sessões curtas e focadas', 'Recuperação intra-semana ótima'],
    cons: ['Requer 6 dias/semana consistência', 'Altíssimo risco de overtraining', 'Recuperação entre-sessões crítica'],
    recommendation: 'Apenas para atletas avançados com boa estrutura de recuperação. MEV/MAV/MRV crítico.',
    description: 'Upper/Lower alternado 3x na semana. Máximo volume e frequência com recuperação distribuída.',
    muscle_group_distribution: {
      chest: 9,
      back: 9,
      shoulders: 8,
      arms: 10,
      legs: 18,
      core: 4
    }
  },

  '7d': {
    id: '7d',
    name: 'Full Frequency 7x/Semana',
    days: 7,
    level: 'advanced_extreme',
    frequency_per_muscle_group: 3.5,
    total_weekly_sets: 72,
    session_duration_minutes: 40,
    pattern: 'A B A C B A C',
    ideal_for: ['Atletas profissionais', 'Volume máximo', 'Pesquisa/otimização'],
    pros: ['Frequência máxima (3.5x/semana)', 'Volume absolutamente máximo', 'Sessões minimais (40min)', 'Distribuição ótima de fadiga'],
    cons: ['Requer 7 dias/semana treinando', 'Recuperação crítica - nutrição/sono perfeitos', 'Altíssimo risco de overtraining', 'Apenas para atletas elite'],
    recommendation: 'NÃO recomendado para maioria. Apenas atletas profissionais ou pesquisa científica.',
    description: 'Treino todos os dias com ciclos curtos. Cada grupo muscular estimulado múltiplas vezes.',
    muscle_group_distribution: {
      chest: 10,
      back: 10,
      shoulders: 9,
      arms: 10,
      legs: 19,
      core: 4
    }
  }
}

/**
 * Calculates recommended split based on frequency and experience level
 * @param {number} frequency - Days per week (1-7)
 * @param {string} level - Experience level (beginner, intermediate, advanced)
 * @returns {object} Recommended split configuration
 */
export function getRecommendedSplit(frequency, level) {
  const splitId = `${frequency}d`
  const split = TRAINING_SPLITS[splitId]

  if (!split) {
    return TRAINING_SPLITS['2d'] // Fallback to 2d
  }

  return {
    ...split,
    volumeLandmarks: VOLUME_LANDMARKS[level] || VOLUME_LANDMARKS.intermediate
  }
}

/**
 * Validates if volume is within safe ranges
 * @param {number} volumePerMuscle - Sets per muscle per week
 * @param {string} level - Experience level
 * @returns {object} Validation result with status and message
 */
export function validateVolume(volumePerMuscle, level) {
  const landmarks = VOLUME_LANDMARKS[level] || VOLUME_LANDMARKS.intermediate

  if (volumePerMuscle < landmarks.mev) {
    return {
      status: 'undertraining',
      message: `Volume ${volumePerMuscle}sets abaixo de MEV (${landmarks.mev}sets). Possível subtreinamento.`,
      color: 'var(--warning)'
    }
  }

  if (volumePerMuscle < landmarks.mav) {
    return {
      status: 'suboptimal',
      message: `Volume ${volumePerMuscle}sets entre MEV e MAV. Ganhos mais lentos.`,
      color: 'var(--warning)'
    }
  }

  if (volumePerMuscle <= landmarks.mrv) {
    return {
      status: 'optimal',
      message: `Volume ${volumePerMuscle}sets no range ótimo (${landmarks.mav}-${landmarks.mrv}sets).`,
      color: 'var(--success)'
    }
  }

  return {
    status: 'overtraining',
    message: `Volume ${volumePerMuscle}sets acima de MRV (${landmarks.mrv}sets). Risco de overtraining!`,
    color: 'var(--error)'
  }
}

/**
 * Calculates expected sets per session for a muscle group
 * @param {string} muscleGroupId - ID of muscle group
 * @param {number} frequency - Sessions per week for this muscle
 * @returns {number} Recommended sets per session
 */
export function calculateSetsPerSession(muscleGroupId, frequency) {
  const muscle = MUSCLE_GROUPS[muscleGroupId]
  if (!muscle) return 4

  const targetMav = muscle.mavPerWeek
  const setsPerSession = Math.ceil(targetMav / frequency)

  // Clamp between reasonable ranges
  return Math.max(3, Math.min(8, setsPerSession))
}

/**
 * Gets all available splits sorted by frequency
 * @returns {array} Array of split configurations
 */
export function getAllSplits() {
  return [
    TRAINING_SPLITS['1d'],
    TRAINING_SPLITS['2d'],
    TRAINING_SPLITS['3d'],
    TRAINING_SPLITS['4d'],
    TRAINING_SPLITS['5d'],
    TRAINING_SPLITS['6d'],
    TRAINING_SPLITS['7d']
  ]
}

/**
 * Gets splits recommended for a specific level
 * @param {string} level - Experience level
 * @returns {array} Filtered and recommended splits
 */
export function getSplitsForLevel(level) {
  const recommendations = {
    beginner: ['2d', '3d'],
    intermediate: ['3d', '4d', '5d'],
    advanced: ['4d', '5d', '6d', '7d']
  }

  const recommendedIds = recommendations[level] || ['2d', '3d']
  return recommendedIds.map(id => TRAINING_SPLITS[`${id}`]).filter(Boolean)
}

export default TRAINING_SPLITS
