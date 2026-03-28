# Training Splits - Quick Start Guide

## Arquivos Criados

| Arquivo | Tamanho | Descrição |
|---------|---------|-----------|
| `src/data/trainingSplits.js` | 12K | Database com 7 divisões científicas |
| `src/components/TrainingSplitSelector.jsx` | 14K | UI para seleção de split |
| `src/components/TrainingSplitDashboard.jsx` | 8.3K | Dashboard de volume tracking |
| `src/utils/splitLogic.js` | 12K | Lógica de cálculos e validações |
| `src/components/Onboarding.jsx` | (atualizado) | Integração com seleção automática |

---

## Uso Rápido

### 1. Seletor de Split (Onboarding)

```jsx
import TrainingSplitSelector from '@/components/TrainingSplitSelector'

function MyComponent({ profile }) {
  const [selectedSplit, setSelectedSplit] = useState(profile?.selectedSplit || '2d')

  return (
    <TrainingSplitSelector
      profile={profile}
      selectedSplit={selectedSplit}
      onSelectSplit={setSelectedSplit}
    />
  )
}
```

### 2. Dashboard de Volume

```jsx
import TrainingSplitDashboard from '@/components/TrainingSplitDashboard'

function Dashboard({ profile, workoutHistory }) {
  return (
    <TrainingSplitDashboard
      profile={profile}
      workoutHistory={workoutHistory}
    />
  )
}
```

### 3. Gerar Workout do Dia

```javascript
import { generateWorkoutForDay } from '@/utils/splitLogic'

const workout = generateWorkoutForDay(
  profile.selectedSplit,  // ex: '3d'
  dayIndex,               // 0-6
  profile.level,          // 'beginner', 'intermediate', 'advanced'
  profile.place           // 'gym', 'home', 'calisthenics'
)

// workout contém:
// - exercises: [{ exercise, sets, reps, muscles, ... }]
// - totalSets: número total de séries
// - estimatedDuration: tempo em minutos
// - muscles: grupos musculares do dia
```

### 4. Validar Volume Semanal

```javascript
import { calculateWeeklyVolume, checkVolumeStatus } from '@/utils/splitLogic'

const volume = calculateWeeklyVolume(workoutHistory)
// volume = { chest: 18, back: 16, shoulders: 12, ... }

const status = checkVolumeStatus(volume.chest, profile.level)
// status = {
//   status: 'optimal',
//   message: '18 sets - Na zona ótima',
//   color: 'var(--success)',
//   recommendation: 'Volume ideal! Continue progressão linear.'
// }
```

### 5. Dados do Split

```javascript
import { TRAINING_SPLITS, VOLUME_LANDMARKS } from '@/data/trainingSplits'

// Obter split específico
const split = TRAINING_SPLITS['3d']
// split contém: name, days, total_weekly_sets, frequency_per_muscle_group, description, ...

// Volume landmarks
const landmarks = VOLUME_LANDMARKS['intermediate']
// landmarks = { mev: 10, mav: 16, mrv: 20, years: '1-5' }
```

---

## Integração no Dashboard

Para adicionar o split dashboard ao Dashboard.jsx existente:

```jsx
import TrainingSplitDashboard from '@/components/TrainingSplitDashboard'

export default function Dashboard({ profile, volumeHistory = {}, ... }) {
  // ... existing code ...

  return (
    <div>
      {/* Seu conteúdo existente */}

      {/* Adicionar este componente em algum lugar visível */}
      <TrainingSplitDashboard
        profile={profile}
        workoutHistory={completedWorkouts}  // ou equivalent
      />

      {/* Resto do conteúdo */}
    </div>
  )
}
```

---

## 7 Divisões Disponíveis

| ID | Nome | Frequência | Volume | Ideal Para |
|----|------|-----------|--------|-----------|
| `1d` | Full Body 1x | 1x/sem | 22 sets | Tempo muito limitado |
| `2d` | Upper/Lower | 1x/sem | 36 sets | Iniciantes |
| `3d` | Push/Pull/Legs | 1x/sem | 48 sets | Iniciantes avançados |
| `4d` | Upper/Lower 2x | **2x/sem** | 56 sets | **INTERMEDIÁRIOS** ⭐ |
| `5d` | PPL Intenso | 1.67x/sem | 60 sets | Intermediários avançados |
| `6d` | Upper/Lower 3x | 2.4x/sem | 68 sets | Avançados |
| `7d` | Full Frequency | 3.5x/sem | 72 sets | Elite/Pesquisa |

---

## MEV/MAV/MRV Landmarks

Validação automática de volume:

```
INICIANTE (0-1 ano):
MEV = 6    (mínimo para estímulo)
MAV = 14   (alvo ótimo) ← FOCO AQUI
MRV = 16   (teto seguro)

INTERMEDIÁRIO (1-5 anos):
MEV = 10
MAV = 16   ← FOCO AQUI
MRV = 20

AVANÇADO (5+ anos):
MEV = 12
MAV = 20   ← FOCO AQUI
MRV = 26
```

---

## Fluxo Completo

1. **Onboarding** seleciona `freq` (1-7 dias) e `level`
2. Sistema escolhe melhor `selectedSplit` automaticamente
3. **Dashboard** mostra split atual + volume tracking
4. **Workout Generation** usa split para criar treino do dia
5. **Volume Validation** alerta se fora de MEV/MAV/MRV

---

## Testes Sugeridos

```bash
# Rodar linter
npm run lint

# Rodar testes (se houver)
npm run test

# Build
npm run build
```

---

## Próximas Etapas (@qa)

- [ ] Code review de estrutura e padrões
- [ ] Testes de volume calculations
- [ ] Validação de data types
- [ ] UX/Design review
- [ ] Integração com Dashboard existente
- [ ] Testes de performance (large workout history)

---

## Notas Técnicas

- **sem dependências externas**: usa apenas React + dados do projeto
- **type-safe naming**: variáveis e funções claramente nomeadas
- **memoized calculations**: useMemo para operações pesadas
- **modular**: cada função tem responsabilidade clara
- **documentado**: comentários em funções complexas

---

**Status:** ✅ Pronto para QA

Próximo: `@qa` faz revisão e testes
