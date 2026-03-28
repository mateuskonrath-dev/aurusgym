# Training Splits - Exemplos Práticos

## Exemplo 1: Seleção de Split no Onboarding

```jsx
// O usuário seleciona:
// - Nível: 'intermediate'
// - Frequência: 4 dias/semana

// Onboarding automaticamente escolhe:
import { getRecommendedSplit } from '@/data/trainingSplits'

const profile = {
  level: 'intermediate',
  freq: 4
}

const split = getRecommendedSplit(4, 'intermediate')
// Retorna: TRAINING_SPLITS['4d'] - Upper/Lower 2x/Semana
// Razão: frequência 2x/semana é o sweet spot científico
```

---

## Exemplo 2: Gerar Treino de Segunda-Feira

```javascript
import { generateWorkoutForDay } from '@/utils/splitLogic'

// Usuário tem split '4d' (Upper/Lower)
// Segunda é dia 0 do padrão "Upper Lower Rest Upper Lower Rest Rest"
// Logo, segunda = Upper

const mondayWorkout = generateWorkoutForDay(
  '4d',           // Split ID
  0,              // Dia 0 = segunda
  'intermediate', // Nível
  'gym'           // Local (gym/home/calisthenics)
)

// Retorna:
{
  day: 1,
  date: Date,
  splitName: 'Upper/Lower 2x/Semana',
  sessionType: 'upper',
  sessionName: 'Upper Body',
  isRestDay: false,
  totalSets: 18,
  estimatedDuration: 50,
  muscleGroups: ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
  exercises: [
    {
      exercise: 'Barbell Bench Press',
      sets: 4,
      reps: '6-8',
      rest_seconds: 180,
      intensity_percent: 82,
      muscles: {
        primary: ['Peitoral Maior'],
        secondary: ['Tríceps', 'Deltoide Frontal']
      },
      howTo: '...',
      proTip: '...'
    },
    // ... mais exercícios ...
  ],
  tips: 'Priorize compostos (supino, barra) antes de isolados. Rest 3min entre séries pesadas.'
}
```

---

## Exemplo 3: Calcular Volume Semanal

```javascript
import { calculateWeeklyVolume, checkVolumeStatus } from '@/utils/splitLogic'

// Histórico de treinos completados
const workoutHistory = [
  {
    date: '2026-03-22',
    exercises: [
      {
        exercise: 'Supino Reto',
        sets: 4,
        muscles: {
          primary: ['Peitoral Maior'],
          secondary: ['Tríceps']
        }
      },
      {
        exercise: 'Puxada Frente',
        sets: 4,
        muscles: {
          primary: ['Latíssimo do Dorso'],
          secondary: ['Bíceps']
        }
      }
    ]
  },
  {
    date: '2026-03-24',
    exercises: [
      {
        exercise: 'Supino Inclinado',
        sets: 3,
        muscles: {
          primary: ['Peitoral Superior'],
          secondary: ['Deltoide Frontal']
        }
      },
      {
        exercise: 'Remada Curvada',
        sets: 4,
        muscles: {
          primary: ['Costas'],
          secondary: ['Bíceps']
        }
      }
    ]
  }
]

// Calcular volume semanal
const volume = calculateWeeklyVolume(workoutHistory)

// Resultado:
{
  chest: 7,       // 4 (supino) + 3 (inclinado)
  back: 6,        // 4 (puxada) + 2 (remada secundário)
  biceps: 2,      // 2 (remada secundário) + 2 (puxada secundário)
  // ... outros grupos ...
}

// Validar chest (7 sets)
const chestStatus = checkVolumeStatus(7, 'intermediate')

// Resultado:
{
  status: 'suboptimal',
  message: '7 sets - Entre MEV e MAV',
  color: 'var(--warning)',
  recommendation: 'Ganhos mais lentos. Considere adicionar 1-2 séries por sessão.',
  landmarks: { mev: 10, mav: 16, mrv: 20 }
}
```

---

## Exemplo 4: Dashboard com Volume Tracking

```jsx
// Dashboard.jsx
import TrainingSplitDashboard from '@/components/TrainingSplitDashboard'
import { calculateWeeklyVolume } from '@/utils/splitLogic'

function Dashboard({ profile, completedWorkouts = [] }) {
  return (
    <div>
      {/* Seu dashboard existente */}

      {/* Novo componente de split */}
      <TrainingSplitDashboard
        profile={{
          level: 'intermediate',
          selectedSplit: '4d',
          freq: 4
        }}
        workoutHistory={completedWorkouts}
      />
    </div>
  )
}

// O componente mostra:
// - Split atual: "Upper/Lower 2x/Semana"
// - Frequência: 2x por grupo
// - Duração: 50 min
// - Barras de volume por músculo com MEV/MAV/MRV
// - Status geral e recomendações
```

---

## Exemplo 5: Recomendação de Mudança de Split

```javascript
import { recommendNextSplit } from '@/utils/splitLogic'

// Usuário treina há 3 meses com split 2d
// Mas volume está baixo (12 sets/semana avg)

const volume = {
  chest: 12,
  back: 12,
  shoulders: 8,
  // ... mais grupos ...
}

const recommendation = recommendNextSplit(
  2,              // Frequência atual (2 dias)
  'beginner',     // Nível
  volume          // Dados de volume
)

// Resultado:
{
  current: {
    id: '2d',
    name: 'Upper/Lower 2x/Semana',
    // ...
  },
  recommended: {
    id: '3d',
    name: 'Push/Pull/Legs 3x/Semana',
    // ...
  },
  reason: 'Volume insuficiente (12 sets). Aumentar para 3x/semana permitirá mais estímulo.',
  shouldChange: true
}

// App pode então notificar: "Detectamos que seu volume está baixo. Que tal tentar 3 dias/semana?"
```

---

## Exemplo 6: Exercícios Sugeridos por Músculo

```javascript
import { getExerciseSuggestions } from '@/utils/splitLogic'

// Usuário quer exercícios para peito no dia de Upper
const chestExercises = getExerciseSuggestions(
  'chest',        // Grupo muscular
  'gym',          // Local
  1               // Tier 1 (compostos principais)
)

// Retorna top 4 exercícios:
[
  {
    id: 'g_ch_1',
    name: 'Supino Reto (Barra)',
    sets: 4,
    reps: '8-10',
    tier: 1,
    howTo: 'Deite no banco...',
    // ...
  },
  {
    id: 'g_ch_7',
    name: 'Supino Inclinado (Barra)',
    sets: 4,
    reps: '8-10',
    tier: 1,
    // ...
  },
  // ... mais 2 ...
]

// Para isolados:
const chestIsolations = getExerciseSuggestions('chest', 'gym', 3)
// Retorna: Pec Deck, Cruzamento, etc.
```

---

## Exemplo 7: Plano Semanal Completo para PPL 3 dias

```javascript
import { generateWorkoutForDay } from '@/utils/splitLogic'

// Gerar semana completa para split '3d'
const weekPlan = []

for (let day = 0; day < 7; day++) {
  const workout = generateWorkoutForDay(
    '3d',
    day,
    'beginner',
    'gym'
  )
  weekPlan.push(workout)
}

// Resultado:
[
  {
    // Dia 0 = Segunda: Push
    sessionType: 'push',
    totalSets: 16,
    exercises: [Supino, Inclinado, Tríceps Pulley, ...]
  },
  {
    // Dia 1 = Terça: Pull
    sessionType: 'pull',
    totalSets: 15,
    exercises: [Puxada Frente, Remada, Bíceps, ...]
  },
  {
    // Dia 2 = Quarta: Legs
    sessionType: 'legs',
    totalSets: 17,
    exercises: [Agachamento, Leg Press, Leg Curl, ...]
  },
  {
    // Dia 3 = Quinta: Rest
    isRestDay: true,
    exercises: []
  },
  {
    // Dia 4 = Sexta: Push
    sessionType: 'push',
    totalSets: 16,
    exercises: [...]
  },
  {
    // Dia 5 = Sábado: Pull
    sessionType: 'pull',
    totalSets: 15,
    exercises: [...]
  },
  {
    // Dia 6 = Domingo: Rest
    isRestDay: true,
    exercises: []
  }
]
```

---

## Exemplo 8: Validação Completa de Treino

```javascript
// Após semana de treino completa:

import { calculateWeeklyVolume, checkVolumeStatus } from '@/utils/splitLogic'
import { VOLUME_LANDMARKS, MUSCLE_GROUPS } from '@/data/trainingSplits'

const profile = { level: 'intermediate' }
const workoutHistory = [...] // Treinos da semana

// 1. Calcular volume
const volume = calculateWeeklyVolume(workoutHistory)

// 2. Validar cada grupo
const validation = {}
Object.keys(MUSCLE_GROUPS).forEach(muscle => {
  const vol = volume[muscle] || 0
  const status = checkVolumeStatus(vol, profile.level)
  validation[muscle] = status
})

// 3. Gerar relatório
console.log('RELATÓRIO SEMANAL DE VOLUME')
console.log('============================')

Object.entries(validation).forEach(([muscle, status]) => {
  console.log(`${MUSCLE_GROUPS[muscle].name}: ${status.message}`)
  console.log(`  → ${status.recommendation}\n`)
})

// Saída:
// RELATÓRIO SEMANAL DE VOLUME
// ============================
// Peito: 18 sets - Na zona ótima
//   → Volume ideal! Continue progressão linear.
//
// Costas: 14 sets - Entre MEV e MAV
//   → Ganhos mais lentos. Considere adicionar 1-2 séries por sessão.
//
// ...
```

---

## Exemplo 9: Ajuste de Volume por Nível

```javascript
// O sistema ajusta automaticamente based em level

import { generateWorkoutForDay } from '@/utils/splitLogic'

// MESMO dia, MESMO split, níveis DIFERENTES

const beginnerWorkout = generateWorkoutForDay('3d', 0, 'beginner', 'gym')
// Supino: 3 sets (85% dos 4 do template)

const intermediateWorkout = generateWorkoutForDay('3d', 0, 'intermediate', 'gym')
// Supino: 4 sets (100% do template)

const advancedWorkout = generateWorkoutForDay('3d', 0, 'advanced', 'gym')
// Supino: 5 sets (115% dos 4 do template)

// Isso garante progressão automática conforme experiência aumenta
```

---

## Exemplo 10: Seletor de Split Interativo

```jsx
import { useState } from 'react'
import TrainingSplitSelector from '@/components/TrainingSplitSelector'

function TrainingSetup({ profile, onSplitChange }) {
  const [selectedSplit, setSelectedSplit] = useState(profile.selectedSplit || '2d')

  const handleSelectSplit = (splitId) => {
    setSelectedSplit(splitId)
    // Salvar no banco de dados / localStorage / state management
    onSplitChange(splitId)
  }

  return (
    <div>
      <h1>Escolha seu Treino</h1>
      <TrainingSplitSelector
        profile={profile}
        selectedSplit={selectedSplit}
        onSelectSplit={handleSelectSplit}
      />
      <p>Split selecionado: {selectedSplit}</p>
    </div>
  )
}
```

---

## Integração com Sistema Existente

```javascript
// localStorage
const savedProfile = JSON.parse(localStorage.getItem('aurus-profile'))
// { name: 'João', level: 'intermediate', selectedSplit: '4d', freq: 4, ... }

import { generateWorkoutForDay } from '@/utils/splitLogic'

// Gerar treino do dia automaticamente
const todayWorkout = generateWorkoutForDay(
  savedProfile.selectedSplit,
  getTodayIndex(),  // Qual dia da semana é hoje
  savedProfile.level,
  savedProfile.place
)

// Mostrar no componente WorkoutPlayer
<WorkoutPlayer workout={todayWorkout} />
```

---

**Estes exemplos cobrem os 10 principais casos de uso do sistema de divisões de treino.**

Próxima etapa: @qa integra com teste real e validação completa.
