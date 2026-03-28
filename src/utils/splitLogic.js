/**
 * Split Logic Utilities
 *
 * Core functions for:
 * - Generating daily workouts from split configuration
 * - Volume tracking and recommendations
 * - MEV/MAV/MRV validation
 * - Intelligent split recommendations
 */

import { EXERCISES } from '@/data/workoutData'
import { TRAINING_SPLITS, VOLUME_LANDMARKS, MUSCLE_GROUPS } from '@/data/trainingSplits'

/**
 * Generates a complete workout for a specific day
 *
 * @param {string} splitId - ID of the selected split (e.g. '3d', '4d')
 * @param {number} dayIndex - Which day of the split (0-6)
 * @param {string} level - Experience level
 * @param {string} location - 'gym', 'home', or 'calisthenics'
 * @returns {object} Workout plan for the day with exercises and sets
 */
export function generateWorkoutForDay(splitId, dayIndex, level, location = 'gym') {
  const split = TRAINING_SPLITS[splitId]
  if (!split) return null

  const sessionTemplate = split.session_template

  if (!sessionTemplate) {
    return {
      day: dayIndex + 1,
      date: new Date(),
      splitName: split.name,
      status: 'rest',
      isRestDay: true,
      exercises: []
    }
  }

  // Determine which session type for this day
  const dayPattern = split.pattern.split(' ')
  const dayType = dayPattern[dayIndex] || 'Rest'

  if (dayType === 'Rest') {
    return {
      day: dayIndex + 1,
      splitName: split.name,
      status: 'rest',
      isRestDay: true,
      exercises: []
    }
  }

  // Get session template (e.g. 'upper', 'lower', 'push', etc)
  const sessionKey = dayType.toLowerCase()
  const session = sessionTemplate[sessionKey] || sessionTemplate[Object.keys(sessionTemplate)[0]]

  if (!session) {
    return {
      day: dayIndex + 1,
      isRestDay: true,
      exercises: []
    }
  }

  // Build exercise list from template
  const exercises = (session.exercises || []).map(templateEx => {
    // Find real exercise from database
    const realExercise = findExerciseByName(templateEx.exercise, location)

    return {
      ...templateEx,
      id: realExercise?.id || `ex_${Math.random()}`,
      realName: realExercise?.name || templateEx.exercise,
      tier: realExercise?.tier || 1,
      howTo: realExercise?.howTo || '',
      proTip: realExercise?.proTip || '',
      muscles: realExercise?.muscles || { primary: [], secondary: [] },
      location
    }
  })

  // Adjust volume based on experience level
  const adjustedExercises = adjustVolumeByLevel(exercises, level)

  return {
    day: dayIndex + 1,
    date: new Date(),
    splitName: split.name,
    sessionType: sessionKey,
    sessionName: session.name,
    isRestDay: false,
    totalSets: adjustedExercises.reduce((sum, ex) => sum + ex.sets, 0),
    estimatedDuration: session.duration_minutes || split.session_duration_minutes || 60,
    muscleGroups: session.muscle_groups || [],
    exercises: adjustedExercises,
    tips: getSessionTips(sessionKey)
  }
}

/**
 * Finds an exercise in the database by name (fuzzy match)
 */
function findExerciseByName(name, location = 'gym') {
  const lowerName = name.toLowerCase()

  // Check each location/muscle combination
  for (const loc of [location, 'gym', 'home', 'calisthenics']) {
    if (!EXERCISES[loc]) continue

    for (const muscleGroup of Object.keys(EXERCISES[loc])) {
      const exercise = EXERCISES[loc][muscleGroup].find(ex =>
        ex.name.toLowerCase().includes(lowerName) || lowerName.includes(ex.name.toLowerCase())
      )
      if (exercise) return exercise
    }
  }

  // Fallback: return first exercise of location
  for (const muscleGroup of Object.keys(EXERCISES[location] || {})) {
    const exercise = EXERCISES[location][muscleGroup][0]
    if (exercise) return exercise
  }

  return null
}

/**
 * Adjusts volume (sets) based on experience level
 * Beginners: Lower volume but more exercises
 * Intermediates: Balanced
 * Advanced: Higher volume per exercise
 */
function adjustVolumeByLevel(exercises, level) {
  const multipliers = {
    beginner: 0.85,
    intermediate: 1.0,
    advanced: 1.15
  }

  const multiplier = multipliers[level] || 1.0

  return exercises.map(ex => ({
    ...ex,
    sets: Math.max(2, Math.round(ex.sets * multiplier))
  }))
}

/**
 * Gets contextual tips for a session type
 */
function getSessionTips(sessionType) {
  const tips = {
    upper: 'Priorize compostos (supino, barra) antes de isolados. Rest 3min entre séries pesadas.',
    lower: 'Agachamento e Leg Press primeiro. Mantenha forma perfeita mesmo com fadiga.',
    push: 'Supino primeiro (força máxima), depois inclinado, depois isolados. 2-3min de rest entre séries.',
    pull: 'Puxada ou Barra Fixa primeiro. Use variedade de pegadas para recrutar diferentes áreas das costas.',
    legs: 'Agachamento ou Leg Press antes de isolados. Leg Curl para balancear quadríceps/isquiotibiais.',
    'a': 'Dia Full Body - foque em compostos e bom desempenho técnico.',
    'b': 'Dia alternado - continuar progressão de força nos principais lifts.',
    'c': 'Dia complementar - melhorar pontos fracos e trabalhar recuperação ativa.'
  }

  return tips[sessionType] || 'Mantenha boa técnica em todos os exercícios. Foque em progressão.'
}

/**
 * Calculates weekly volume per muscle group
 * @param {array} workoutHistory - Array of completed workouts
 * @returns {object} Volume per muscle group
 */
export function calculateWeeklyVolume(workoutHistory = []) {
  const volume = {}

  // Initialize all muscle groups
  Object.keys(MUSCLE_GROUPS).forEach(mg => {
    volume[mg] = 0
  })

  // Sum sets for each muscle
  workoutHistory.forEach(workout => {
    if (!workout.exercises) return

    workout.exercises.forEach(exercise => {
      const sets = exercise.sets || 0
      const muscles = exercise.muscles || { primary: [], secondary: [] }

      // Primary muscles get full credit
      muscles.primary.forEach(muscle => {
        // Normalize muscle names
        const normalized = normalizeMuscleName(muscle)
        if (normalized && Object.prototype.hasOwnProperty.call(volume, normalized)) {
          volume[normalized] += sets
        }
      })

      // Secondary muscles get half credit (they're not the main stimulus)
      muscles.secondary.forEach(muscle => {
        const normalized = normalizeMuscleName(muscle)
        if (normalized && Object.prototype.hasOwnProperty.call(volume, normalized)) {
          volume[normalized] += sets * 0.5
        }
      })
    })
  })

  return volume
}

/**
 * Normalizes muscle names from exercises to database keys
 */
function normalizeMuscleName(muscleName) {
  const normalized = muscleName.toLowerCase().replace(/\s+/g, '_')

  // Map variations to canonical names
  const mapping = {
    'pectoralis_major': 'chest',
    'pectoral': 'chest',
    'chest': 'chest',
    'peito': 'chest',
    'latissimus_dorsi': 'back',
    'lat': 'back',
    'back': 'back',
    'costas': 'back',
    'deltoid': 'shoulders',
    'shoulder': 'shoulders',
    'ombro': 'shoulders',
    'quadriceps': 'quadriceps',
    'quad': 'quadriceps',
    'rectus_femoris': 'quadriceps',
    'gluteus_maximus': 'glutes',
    'glute': 'glutes',
    'glúteo': 'glutes',
    'hamstring': 'hamstrings',
    'biceps_femoris': 'hamstrings',
    'biceps': 'biceps',
    'bíceps': 'biceps',
    'triceps': 'triceps',
    'tríceps': 'triceps',
    'calf': 'calves',
    'gastrocnemius': 'calves',
    'panturrilha': 'calves',
    'core': 'core',
    'abdomen': 'core',
    'abdômen': 'core'
  }

  return mapping[normalized] || normalized
}

/**
 * Checks volume against MEV/MAV/MRV landmarks
 * @param {number} volumePerMuscle - Total sets for the muscle this week
 * @param {string} level - Experience level
 * @returns {object} Status, message, and recommendations
 */
export function checkVolumeStatus(volumePerMuscle, level) {
  const landmarks = VOLUME_LANDMARKS[level] || VOLUME_LANDMARKS.intermediate

  let status = 'optimal'
  let message = ''
  let color = 'var(--success)'
  let recommendation = ''

  if (volumePerMuscle < landmarks.mev) {
    status = 'undertraining'
    message = `${Math.round(volumePerMuscle)} sets - Abaixo de MEV (${landmarks.mev})`
    color = 'var(--error)'
    recommendation = 'Aumentar frequência ou volume por sessão. Abaixo do mínimo efetivo.'
  } else if (volumePerMuscle < landmarks.mav) {
    status = 'suboptimal'
    message = `${Math.round(volumePerMuscle)} sets - Entre MEV e MAV`
    color = 'var(--warning)'
    recommendation = 'Ganhos mais lentos. Considere adicionar 1-2 séries por sessão.'
  } else if (volumePerMuscle <= landmarks.mrv) {
    status = 'optimal'
    message = `${Math.round(volumePerMuscle)} sets - Na zona ótima`
    color = 'var(--success)'
    recommendation = 'Volume ideal! Continue progressão linear.'
  } else {
    status = 'overtraining'
    message = `${Math.round(volumePerMuscle)} sets - Acima de MRV (${landmarks.mrv})`
    color = 'var(--error)'
    recommendation = 'RISCO DE OVERTRAINING! Reduza séries ou frequência. Priorize recuperação.'
  }

  return {
    status,
    message,
    color,
    recommendation,
    landmarks
  }
}

/**
 * Recommends next split based on current frequency and goals
 * @param {number} currentFrequency - Current days per week
 * @param {string} level - Experience level
 * @param {object} volumeData - Current volume tracking
 * @returns {object} Recommended split with reasoning
 */
export function recommendNextSplit(currentFrequency, level, volumeData = {}) {
  const current = TRAINING_SPLITS[`${currentFrequency}d`]
  const landmarks = VOLUME_LANDMARKS[level]

  // Check if current split is working
  const avgVolume = Object.values(volumeData).reduce((a, b) => a + b, 0) / Object.keys(volumeData).length || 0
  const isUndervolume = avgVolume < landmarks.mav
  const isOvervolume = avgVolume > landmarks.mrv

  let recommendation = null
  let reason = ''

  if (isUndervolume && currentFrequency < 7) {
    // Need more frequency/volume
    const nextFreq = Math.min(currentFrequency + 1, 7)
    recommendation = TRAINING_SPLITS[`${nextFreq}d`]
    reason = `Volume insuficiente (${Math.round(avgVolume)} sets). Aumentar para ${nextFreq}x/semana permitirá mais estímulo.`
  } else if (isOvervolume && currentFrequency > 1) {
    // Too much volume, reduce
    const nextFreq = Math.max(currentFrequency - 1, 1)
    recommendation = TRAINING_SPLITS[`${nextFreq}d`]
    reason = `Volume alto demais (${Math.round(avgVolume)} sets). ${nextFreq}x/semana com volume reduzido é mais sustentável.`
  } else {
    // Current split is fine, suggest minor tweaks
    recommendation = current
    reason = `${current.name} está funcionando bem. Continue progressão e monitore recuperação.`
  }

  return {
    current,
    recommended: recommendation,
    reason,
    shouldChange: recommendation && recommendation.id !== current.id
  }
}

/**
 * Calculates expected training time per week
 * @param {string} splitId - Split ID
 * @returns {number} Total minutes per week
 */
export function calculateWeeklyTime(splitId) {
  const split = TRAINING_SPLITS[splitId]
  if (!split) return 0

  const daysPattern = split.pattern.split(' ')
  const workingDays = daysPattern.filter(d => d !== 'Rest').length

  return workingDays * split.session_duration_minutes
}

/**
 * Gets exercise suggestions for a muscle group based on tier and location
 * @param {string} muscleGroupId - Muscle group key
 * @param {string} location - 'gym', 'home', or 'calisthenics'
 * @param {number} tier - Exercise tier (1=primary, 2=secondary, 3=isolation)
 * @returns {array} Suggested exercises
 */
export function getExerciseSuggestions(muscleGroupId, location = 'gym', tier = 1) {
  const exercises = EXERCISES[location]?.[muscleGroupId] || []

  return exercises
    .filter(ex => tier === 0 || ex.tier === tier)
    .sort((a, b) => a.tier - b.tier)
    .slice(0, 4)
}

export default {
  generateWorkoutForDay,
  calculateWeeklyVolume,
  checkVolumeStatus,
  recommendNextSplit,
  calculateWeeklyTime,
  getExerciseSuggestions
}
