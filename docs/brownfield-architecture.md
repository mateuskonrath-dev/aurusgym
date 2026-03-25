# Aurus Gym — Brownfield Architecture Document

## Introduction

Este documento captura o **ESTADO ATUAL** do codebase Aurus Gym, incluindo dívidas técnicas, padrões reais, workarounds e o histórico de evolução do projeto. Serve como referência para agentes de IA e desenvolvedores que trabalharão no projeto.

### Scope

Documentação completa do app — PWA + mobile (Capacitor), sem PRD específico em andamento.

### Change Log

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 2026-03-24 | 1.0 | Análise brownfield inicial | Orion (aiox-master) |

---

## Quick Reference — Arquivos Chave

| Arquivo | Propósito |
|---------|-----------|
| `src/App.jsx` | Root: roteamento de tabs, estado global (perfil, PBs, volume) |
| `src/data/workoutData.js` | Base de dados de exercícios + geração de planos semanais |
| `src/components/WorkoutPlayer.jsx` | Core do treino ativo: sets, reps, timer de descanso, PBs |
| `src/components/Dashboard.jsx` | Tela principal: roadmap semanal, troca de exercício |
| `src/components/Onboarding.jsx` | Onboarding multi-step + modo reconfig |
| `src/components/ProgressDashboard.jsx` | Análise: histórico, volume, MEV, progressão |
| `src/components/EliteNutrition.jsx` | Macro-calculator + hidratação |
| `src/components/PersonalBests.jsx` | Recordes pessoais por músculo |
| `src/index.css` | Design system completo (CSS vars, classes utilitárias) |
| `vite.config.js` | Vite + PWA manifest + alias `@` → `./src` |
| `capacitor.config.ts` | App ID: `com.aurus.app`, webDir: `dist` |

---

## High Level Architecture

### Tech Stack Real

| Categoria | Tecnologia | Versão | Notas |
|-----------|------------|--------|-------|
| Runtime | React | 19.2.0 | Hooks only, sem class components |
| Build | Vite | 7.3.1 | ES modules, alias `@` |
| PWA | vite-plugin-pwa | 1.2.0 | autoUpdate, manifest embutido |
| Mobile | Capacitor | 8.2.0 | iOS + Android configurados |
| UI Kit | Ionic | 8.8.1 | **Instalado mas NÃO usado** — apenas como devDep |
| Estilo | CSS puro | — | Design system via CSS custom properties |
| Persistência | localStorage | — | **ÚNICO mecanismo de persistência** |
| Idioma | JavaScript (JSX) | — | tsconfig presente mas código é .jsx |

### Arquitetura de Persistência

```
localStorage keys:
  aurus-profile       → JSON: { name, sex, age, weight, height, bf, activity,
                                level, goal, freq, exerciseQty, place, includeChest }
  aurus-pbs           → JSON: { [exerciseId]: { weight, reps, estimated1RM, date } }
  aurus-volume        → JSON: { [YYYY-MM-DD]: tonnage_kg }
  aurus-completed-days → JSON: { weekStart: YYYY-MM-DD, days: [0,1,2,...] }
  aurus-last-session  → JSON: { [exerciseId_setIndex]: { weight, reps } }
  aurus-history       → JSON: array de sessions (max 50, FIFO)
```

**CRÍTICO:** Não há backend, banco de dados ou sincronização em nuvem. Todos os dados ficam no dispositivo. Export/Import JSON é o único mecanismo de backup.

### Fluxo da Aplicação

```
main.jsx
  └── App.jsx (estado global + roteamento por tab)
        ├── SplashScreen         (onboarding=true, desaparece em 1s)
        ├── Onboarding           (se !userProfile OU tab=reconfig)
        └── [tabs via TabNavigation]
              ├── home → Dashboard
              │         ├── WorkoutSession (lista de exercícios)
              │         ├── WorkoutPlayer  (treino ativo - substitui Dashboard)
              │         ├── WeeklyRoadmap  (mini-calendário)
              │         └── ProgressStats  (donut chart)
              ├── progress → ProgressDashboard
              ├── prs → PersonalBests
              ├── fuel → EliteNutrition
              ├── library → (inline em App.jsx) ExerciseDetail
              └── profile → (inline em App.jsx) config + export/import
```

---

## Source Tree

```
aurus-gym/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx          # Orquestra a tela Home
│   │   ├── EliteNutrition.jsx     # Macros + hidratação
│   │   ├── ExerciseDetail.jsx     # Modal de detalhes do exercício
│   │   ├── MuscleMap.jsx          # Mapa muscular SVG (react-body-highlighter)
│   │   ├── Onboarding.jsx         # 13 steps multi-etapa
│   │   ├── PersonalBests.jsx      # Records pessoais filtráveis
│   │   ├── ProgressDashboard.jsx  # Análises e histórico
│   │   ├── ProgressStats.jsx      # Donut chart de volume
│   │   ├── SplashScreen.jsx       # Tela de splash animada
│   │   ├── TabNavigation.jsx      # Bottom bar (6 tabs)
│   │   ├── WeeklyRoadmap.jsx      # Mini-calendário semanal
│   │   ├── WorkoutPlayer.jsx      # Treino ativo (componente central)
│   │   └── WorkoutSession.jsx     # Lista pre-treino
│   ├── data/
│   │   └── workoutData.js         # EXERCÍCIOS + SPLITS + generateWeeklyPlan()
│   ├── App.jsx                    # Root component
│   ├── App.css                    # Estilos globais adicionais
│   ├── index.css                  # Design system principal
│   └── main.jsx                   # Entry point React
├── public/                        # Assets estáticos (icon.svg, favicon)
├── dist/                          # Build output (gitignore recomendado)
├── android/                       # Capacitor Android native project
├── ios/                           # Capacitor iOS native project
├── index.html                     # HTML raiz (lang=pt-BR, OG tags, Apple meta)
├── vite.config.js                 # Vite + PWA + alias @
├── capacitor.config.ts            # appId: com.aurus.app
├── ionic.config.json              # type: react (legacy, Ionic não usado no código)
├── package.json                   # Scripts: dev, build, lint, preview
├── tsconfig.json                  # TypeScript config (código é JS/JSX na prática)
└── eslint.config.js               # ESLint 9 flat config
```

---

## Módulos e Responsabilidades

### workoutData.js — Núcleo do Sistema

Este é o arquivo mais crítico do app. Contém:

- **`EXERCISES`**: Objeto estruturado `{ gym: { chest: [...], back: [...], ... }, home: {...}, calisthenics: {...} }`
- **`SPLITS`**: Define os splits (`full_body`, `upper_lower`, `ppl`, `bro_split`) com `days[]` onde cada day tem `muscles[]`
- **`generateDailyWorkout(profile, dayIndex)`**: Gera workout de um dia específico
- **`generateWeeklyPlan(profile)`**: Retorna array de 7 dias `[{ label, focus, workout: [...exercises] }]`

**Formato de exercício:**
```javascript
{
  id: 'g_ch_1',           // prefixo: g=gym, h=home, c=calisthenics
  name: 'Supino Reto (Barra)',
  sets: 4,
  reps: '8-12',
  muscle: 'peito',        // lowercase PT-BR (peito, costas, pernas, ombros, tríceps, bíceps, etc.)
  tier: 1,                // 1=compound/priority, 2=secondary, 3=isolation
  instructions: '...',
  tips: '...',
  primaryMuscles: [...],  // para react-body-highlighter
  secondaryMuscles: [...]
}
```

### WorkoutPlayer.jsx — Componente Central

O componente mais complexo do app. Responsabilidades:
- Controle de sets atual / exercício atual
- Log de pesos e reps por set
- Timer de descanso com beep de áudio (Web Audio API)
- Detecção de novos PRs via Epley 1RM: `w × (1 + r/30)`
- Vibração haptica (`navigator.vibrate`)
- Pre-fill do último treino via `aurus-last-session`
- Progressive overload: sugere +2.5kg sobre a sessão anterior
- Salva histórico em `aurus-history` ao completar
- Props: `workout`, `profile`, `personalBests`, `workoutMeta`, `onComplete`, `onCancel`

### App.jsx — Estado Global

Gerencia todo o estado persistido:
- `userProfile` — perfil do atleta
- `personalBests` — PBs por exercício
- `volumeHistory` — tonnage por data
- `handleUpdatePBs` — compara estimated1RM com atual antes de atualizar
- `handleExportData` / `handleImportData` — backup JSON

**ATENÇÃO:** As abas `library` e `profile` são renderizadas diretamente em App.jsx (não em componentes separados). Isso cria um arquivo de 336 linhas que poderia ser refatorado.

---

## Design System

Todo o visual é baseado em CSS custom properties em `src/index.css`.

### CSS Variables Chave

```css
--brand-primary: #b3ff00      /* Verde neon — cor principal */
--brand-secondary: #ff6b00    /* Laranja — cor secundária */
--brand-danger: #ff4b4b       /* Vermelho — erros/delete */
--bg-base: #050505            /* Fundo principal (quase preto) */
--bg-card: #0f0f0f            /* Cards */
--bg-elevated: #1a1a1a        /* Elementos elevados */
--text-high: #ffffff
--text-med: #999999
--text-low: #555555
--border-subtle: #222222
```

### Classes CSS Principais

| Classe | Uso |
|--------|-----|
| `.mobile-container` | Container raiz, max-width 480px, centrado |
| `.panel-tech` | Card padrão com borda e fundo elevado |
| `.btn-tech` | Botão primário verde neon |
| `.btn-outline` | Botão outline sem fundo |
| `.tab-bar-v3` | Bottom navigation bar |
| `.animate-tech` | Fade-in de entrada |
| `.data-label` | Label uppercase pequeno (0.6rem) |
| `.title-italic` | Texto em itálico para destaque de marca |
| `.tech-border-l` | Border-left colorida para indicadores |

---

## Dívida Técnica e Problemas Conhecidos

### 1. TypeScript Parcial
- `tsconfig.json` presente mas todo o código é `.jsx` (JavaScript)
- `@types/react` instalado mas sem uso efetivo
- **Risco:** Baixo, mas limita tooling e refactoring seguro

### 2. Ionic Instalado mas Não Usado
- `@ionic/react`, `@ionic/react-router`, `ionicons` nos devDeps
- Zero uso no código atual
- **Ação recomendada:** Remover das deps para reduzir bundle/complexidade

### 3. Library e Profile Inline em App.jsx
- As views `library` e `profile` são renderizadas diretamente em App.jsx (linhas ~168-311)
- Deveria ser extraído para `LibraryView.jsx` e `ProfileView.jsx`
- **Risco:** Médio — App.jsx tem 336 linhas

### 4. Sem Validação de Schema no Import
- `handleImportData` verifica apenas `data.version` existe
- Dados corrompidos/malformados passariam
- **Risco:** Baixo (uso pessoal), mas poderia quebrar o app

### 5. Semana Começa na Segunda (getWeekStart)
- `completedDays` reseta toda segunda-feira
- Se o usuário treinar Domingo, o dia não contará para a semana "atual" na próxima segunda
- Comportamento documentado, não é bug

### 6. workoutData.js com 233 linhas (mas pouco — pode crescer)
- À medida que mais exercícios forem adicionados, considerar split por arquivo de dados

### 7. Lint Histórico — Arquivos de Debug no Root
- `lint_debug.json`, `lint_final.txt`, `lint_output.txt` etc. no root
- Devem ser removidos e adicionados ao `.gitignore`

---

## Integrações e Dependências Externas

### `react-body-highlighter` (v2.0.5)
- Usado em `MuscleMap.jsx` para visualização do mapa muscular SVG
- **Input:** arrays `primaryMuscles[]`, `secondaryMuscles[]` nos exercícios
- **CRÍTICO:** Nomes dos músculos devem seguir o formato específico desta lib (inglês)

### Web APIs Nativas
| API | Uso | Fallback |
|-----|-----|---------|
| `localStorage` | Persistência de todos os dados | Sem fallback — app quebra sem |
| `Web Audio API` | Beep do timer de descanso | `try/catch` silencioso |
| `Navigator.vibrate` | Haptic feedback | `if (navigator.vibrate)` check |
| `URL.createObjectURL` | Export de backup JSON | — |
| `FileReader` | Import de backup JSON | — |

---

## Build e Deploy

### Desenvolvimento Local

```bash
npm run dev          # Vite dev server (http://localhost:5173)
npm run build        # Build produção em dist/
npm run preview      # Preview do build em dist/
npm run lint         # ESLint 9 flat config
```

### Deploy PWA (Vercel)
- URL: `https://aurusgym.vercel.app`
- Conectado ao repositório (deploy automático no push)
- PWA configurado com `registerType: 'autoUpdate'`

### Build Mobile (Capacitor)

```bash
npm run build                    # 1. Build web
npx cap sync                     # 2. Sincronizar com native projects
npx cap open android             # 3a. Abrir Android Studio
npx cap open ios                 # 3b. Abrir Xcode
```

**App ID:** `com.aurus.app`
**Projetos nativos:** `android/` e `ios/` (gerados pelo Capacitor)

---

## Fórmulas e Lógica de Negócio

### Epley 1RM
```javascript
const calc1RM = (weight, reps) => {
  if (reps === 1 || weight === 0) return weight
  return Math.round(weight * (1 + reps / 30))
}
```

### Streak Counter
```javascript
// Conta dias consecutivos com volume registrado em volumeHistory
// Aceita gap de 1 dia (ontem = streak ainda ativa)
```

### MEV (Minimum Effective Volume) por músculo
```javascript
// Em ProgressDashboard.jsx
const MEV = { Peito: 10, Costas: 10, Pernas: 12, Ombros: 8, Braços: 6, Core: 6 }
// Compara sets semanais com MEV para mostrar barra de progresso
```

### Cálculo de Macros (EliteNutrition)
- **BMR:** Mifflin-St Jeor com fator de atividade
- **Proteína:** 2.2g/kg lean mass (baseado em BF%)
- **Gordura:** 25% das calorias totais
- **Carbo:** calorias restantes

### Hidratação
```javascript
waterBase = weight * 35      // ml em dia de descanso
waterTotal = waterBase + 500 // ml em dia de treino
```

---

## Padrões de Código

### Estado e Props
- Todo estado persistido vive em `App.jsx` (prop drilling para baixo)
- Não usa Context API ou Zustand/Redux
- Callbacks `onComplete`, `onUpdatePBs`, `onUpdateVolume` passados como props

### Renderização Condicional
```jsx
// Padrão: ternário para componentes grandes
{!activeWorkout ? (
  <Dashboard ... />
) : (
  <WorkoutPlayer ... />
)}

// Padrão: && para modais/overlays
{selectedExercise && (
  <ExerciseDetail ... />
)}
```

### IDs de Exercícios
- Formato: `{prefixo}_{músculo}_{número}`
- Exemplos: `g_ch_1` (gym chest 1), `h_bk_3` (home back 3), `c_lg_2` (calisthenics legs 2)
- Prefixos: `g_` = gym, `h_` = home, `c_` = calisthenics

### Keys de localStorage
- Todas prefixadas com `aurus-`
- Nomes: `aurus-profile`, `aurus-pbs`, `aurus-volume`, `aurus-completed-days`, `aurus-last-session`, `aurus-history`

---

## Testes

**Estado atual:** Sem testes automatizados.

- Zero arquivos de teste (`.test.js`, `.spec.js`)
- Sem Jest, Vitest ou Playwright configurado
- QA é manual

---

## Apêndice — Comandos Úteis

```bash
# Desenvolvimento
npm run dev               # Dev server

# Build e deploy
npm run build             # Build PWA
npx cap sync              # Sync Capacitor

# Qualidade
npm run lint              # ESLint

# Remover arquivos de debug do root
rm lint_*.txt lint_*.json  # Arquivos de debug históricos
```

---

*Documento gerado por Orion (aiox-master) em 2026-03-24 | Aurus Gym v0.0.0*
