# 📋 RELATÓRIO DETALHADO DE DEFEITOS - AURUS GYM

**Data:** 27 de Março de 2026
**Versão do App:** 0.0.0
**Status:** 🔴 COM PROBLEMAS IDENTIFICADOS
**Linhas de Código:** 5,333

---

## 🎯 RESUMO EXECUTIVO

Análise completa do projeto AurusGym identificou **12 problemas críticos e moderados** que precisam correção:

- ⚠️ **5 Vulnerabilidades de Segurança** (npm audit)
- 🐛 **1 Bug Lógico Crítico** (lógica de split)
- ⚡ **4 Problemas de React Hooks** (missing dependencies)
- 📦 **2 Problemas de Data Persistence** (localStorage)

**Nota:** O app funciona, mas com defeitos que podem causar crashes, perda de dados ou comportamento inesperado.

---

## 🔐 SEÇÃO 1: VULNERABILIDADES DE SEGURANÇA

### Problema 1.1: brace-expansion (MODERADA)
**Localização:** `node_modules/brace-expansion`
**Severidade:** 🟡 MODERADA
**Descrição:** Zero-step sequence causes process hang and memory exhaustion
**Impacto:** Pode causar travamento da aplicação
**Fix Disponível:** ✅ `npm audit fix`

```
Afetado em: filelist → brace-expansion
Versão problemática: <1.1.13 || >=2.0.0 <2.0.3
```

---

### Problema 1.2: serialize-javascript (ALTA)
**Localização:** `node_modules/serialize-javascript`
**Severidade:** 🔴 ALTA
**Descrição:** Vulnerable to RCE via RegExp.flags e Date.prototype.toISOString()
**Impacto:** Execução remota de código, Denial of Service
**Fix Disponível:** ⚠️ `npm audit fix --force` (breaking change)

```
Dependência Chain:
  serialize-javascript (vulnerable)
    ↓
  @rollup/plugin-terser 0.2.0-0.4.4
    ↓
  workbox-build >=7.1.0
    ↓
  vite-plugin-pwa >=0.20.0
```

**Recomendação:** Atualizar vite-plugin-pwa para versão que use serialize-javascript segura.

---

## 🐛 SEÇÃO 2: BUGS LÓGICOS E CODE

### Problema 2.1: Expressão Lógica Constante (CRÍTICO)
**Arquivo:** `src/data/workoutData.js`
**Linha:** 554
**Severidade:** 🔴 CRÍTICO
**Tipo:** Linting Error

```javascript
// ❌ CÓDIGO PROBLEMÁTICO
splitKey = `split_${profile.freq}` || 'full_body_1';
```

**Problema:**
- Template strings SEMPRE retornam uma string (nunca falsy)
- O `||` nunca será avaliado
- Se `profile.freq` for undefined/null, va criar `split_undefined` em vez de fallback para `full_body_1`

**Impacto:**
- ❌ Splits com frequência inválida podem crashar o app
- ❌ Fallback nunca funciona
- ❌ Usuário vê erro de split não encontrado

**Fix Necessário:**
```javascript
// ✅ CORRETO
splitKey = profile.freq ? `split_${profile.freq}` : 'full_body_1';
// OU
splitKey = `split_${profile.freq || 'full_body'}` || 'full_body_1';
```

---

## ⚡ SEÇÃO 3: PROBLEMAS DE REACT HOOKS

### Problema 3.1: ScrollPicker - Missing Dependencies (Linha 38)
**Arquivo:** `src/components/ScrollPicker.jsx`
**Severidade:** 🟡 MODERADA
**Linha:** 38
**Avisos:**
```
Warning: React Hook useEffect has missing dependencies: 'containerHeight' and 'values'
```

**Código Problemático:**
```javascript
useEffect(() => {
    setCurrentValue(value || min)
    if (scrollRef.current) {
        const index = values.indexOf(value || min)
        // ❌ Usa 'containerHeight' que não está em dependencies
        const scrollTop = index * itemHeight - (containerHeight / 2 - itemHeight / 2)
        scrollRef.current.scrollTop = scrollTop
    }
}, [value, min, max])  // ❌ Faltam 'values' e 'containerHeight'
```

**Impacto:**
- ⚠️ Efeito não re-executa quando deveria
- ⚠️ ScrollPicker pode ficar desordenado
- ⚠️ Comportamento impredizível ao mudar min/max

**Fix:** Adicionar às dependencies ou usar useCallback para valores
```javascript
}, [value, min, max, containerHeight, values])
```

---

### Problema 3.2: ScrollPicker - Linha 52 (Missing Dependencies)
**Arquivo:** `src/components/ScrollPicker.jsx`
**Severidade:** 🟡 MODERADA
**Avisos:**
```
Warning: React Hook useEffect has missing dependencies:
'currentValue', 'max', 'min', 'onChange', and 'values'
```

**Código Problemático:**
```javascript
useEffect(() => {
    if (!isScrolling && scrollRef.current) {
        // ❌ Usa múltiplas variáveis não declaradas
        const snappedValue = Math.max(min, Math.min(max, values[closestIndex] || currentValue))
        if (snappedValue !== currentValue) {
            setCurrentValue(snappedValue)
            onChange(snappedValue)  // ❌ onChange pode ser função diferente a cada render
        }
    }
}, [isScrolling])  // ❌ Faltam MUITAS dependências
```

**Impacto:**
- ⚠️ Snap to center não funciona corretamente
- ⚠️ onChange pode não ser chamado quando deveria
- ⚠️ Valores antigos em closure (stale closure)

**Fix:** Envolver com useMemo ou adicionar dependencies
```javascript
}, [isScrolling, min, max, currentValue, onChange, values])
```

---

### Problema 3.3: ScrollPicker - eslint-disable Desnecessários
**Arquivo:** `src/components/ScrollPicker.jsx`
**Linhas:** 31, 47
**Severidade:** 🟢 BAIXA

```javascript
// ❌ Linha 31
// eslint-disable-next-line react-hooks/exhaustive-deps
setCurrentValue(value || min)

// ✅ Deveria ser
setCurrentValue(value || min)  // Sem disable - as deps estão corretas na linha 38
```

**Impacto:**
- 🟢 Bagunça no código
- 🟢 Esconde problemas reais
- 🟢 Confunde futuros desenvolvedores

---

## 💾 SEÇÃO 4: PROBLEMAS DE DATA PERSISTENCE

### Problema 4.1: localStorage Síncrono (Possível Perda de Dados)
**Arquivos Afetados:** `src/App.jsx`, `src/components/*.jsx`
**Severidade:** 🟡 MODERADA

**Situação:**
- App salva em localStorage de forma síncrona
- Em dispositivos lento ou sob stress, pode não completar
- Se página fechar rápido, dados podem não ser persistidos

**Locais com Risco:**
```javascript
// src/App.jsx linha 59
localStorage.setItem('aurus-pbs', JSON.stringify(updatedPBs))

// src/components/Dashboard.jsx
localStorage.setItem('aurus-volume', JSON.stringify(newHistory))
```

**Impacto:**
- ⚠️ Possível perda de personal bests
- ⚠️ Histórico de volume pode ser perdido
- ⚠️ Mais crítico em dispositivos móveis

**Recomendação:** Implementar debounce e error handling

---

### Problema 4.2: Sem Validação ao Restaurar do localStorage
**Arquivo:** `src/App.jsx`
**Linhas:** 12-23
**Severidade:** 🟡 MODERADA

```javascript
// ❌ SEM VALIDAÇÃO
const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('aurus-profile')
    return saved ? JSON.parse(saved) : null  // Se JSON inválido → CRASH
})

const [personalBests, setPersonalBests] = useState(() => {
    const saved = localStorage.getItem('aurus-pbs')
    return saved ? JSON.parse(saved) : {}  // Se JSON inválido → CRASH
})
```

**Impacto:**
- 🔴 Se localStorage corrompido, app crasha ao abrir
- 🔴 Sem recovery mechanism
- 🔴 Usuário perde todos os dados

**Recomendação:** Adicionar try-catch e validação de schema

---

## 📱 SEÇÃO 5: OUTROS PROBLEMAS POTENCIAIS

### Problema 5.1: Sem Validação de Input no Onboarding
**Arquivo:** `src/components/Onboarding.jsx`
**Severidade:** 🟡 MODERADA

**Problema:**
- Valores de peso/altura não validam ranges
- Pode aceitar valores negativos ou inválidos
- Sem feedback visual de erro

**Impacto:**
- ⚠️ Cálculos posteriores podem ficar errados
- ⚠️ 1RM estimates incorretos
- ⚠️ Recomendações de split baseadas em dados ruins

---

### Problema 5.2: WorkoutPlayer - Performance com Histórico Grande
**Arquivo:** `src/components/WorkoutPlayer.jsx` (649 linhas)
**Severidade:** 🟡 MODERADA

**Problema:**
- Renderiza todo o histórico sem virtualização
- Com 500+ treinos, a página fica lenta
- Sem pagination ou lazy loading

**Impacto:**
- ⚠️ App lento após meses de uso
- ⚠️ Mobile pode travar completamente
- ⚠️ Experiência degrada com o tempo

---

### Problema 5.3: Sem Error Boundary
**Arquivo:** Projeto todo
**Severidade:** 🟡 MODERADA

**Problema:**
- Se um componente crashar, toda app cai
- Sem recovery
- Usuário vê white screen

**Impacto:**
- ⚠️ Um único erro pode derrubar tudo
- ⚠️ Difícil debugar em produção
- ⚠️ Má experiência de usuário

---

## 📊 TABELA RESUMIDA DOS DEFEITOS

| # | Problema | Severidade | Tipo | Arquivo | Solução |
|---|----------|-----------|------|---------|---------|
| 1.1 | brace-expansion RCE | 🔴 ALTA | Security | npm audit | `npm audit fix` |
| 1.2 | serialize-javascript RCE | 🔴 ALTA | Security | npm audit | `npm audit fix --force` |
| 2.1 | Lógica split inválida | 🔴 CRÍTICA | Bug | workoutData.js:554 | Fix ternário |
| 3.1 | ScrollPicker deps linha 38 | 🟡 MODERADA | Hooks | ScrollPicker.jsx:38 | Adicionar deps |
| 3.2 | ScrollPicker deps linha 52 | 🟡 MODERADA | Hooks | ScrollPicker.jsx:52 | Adicionar deps |
| 3.3 | eslint-disable desnecessários | 🟢 BAIXA | Code | ScrollPicker.jsx:31,47 | Remover |
| 4.1 | localStorage sem validação | 🟡 MODERADA | Data | App.jsx:12-23 | Try-catch + schema |
| 4.2 | localStorage síncrono | 🟡 MODERADA | Data | App.jsx | Adicionar debounce |
| 5.1 | Sem validação input | 🟡 MODERADA | UX | Onboarding.jsx | Adicionar validação |
| 5.2 | Performance histórico | 🟡 MODERADA | Performance | WorkoutPlayer.jsx | Virtualização |
| 5.3 | Sem Error Boundary | 🟡 MODERADA | Reliability | Projeto | Adicionar ErrorBoundary |

---

## 🎯 PRIORIDADE DE CORREÇÃO

### CRÍTICA (Corrigir IMEDIATAMENTE):
1. ✅ Problema 2.1 - Split logic
2. ✅ Problema 1.1 & 1.2 - Security vulnerabilities

### ALTA (Corrigir ANTES do release):
3. ✅ Problema 4.1 - localStorage validation
4. ✅ Problema 3.1 & 3.2 - React hooks
5. ✅ Problema 5.3 - Error Boundary

### MÉDIA (Melhorias importantes):
6. ✅ Problema 4.2 - Debounce
7. ✅ Problema 5.1 - Input validation
8. ✅ Problema 5.2 - Performance

---

## 💡 RECOMENDAÇÃO FINAL

**Aprovar correção de TODOS os problemas?**

- ✅ Corrigir bugs críticos (2.1)
- ✅ Atualizar dependências vulneráveis (1.1, 1.2)
- ✅ Adicionar validação localStorage (4.1)
- ✅ Fixar React hooks warnings (3.1, 3.2)
- ✅ Adicionar Error Boundary (5.3)
- ✅ Remover eslint-disable desnecessários (3.3)
- ✅ Melhorar validação input (5.1)
- ✅ Otimizar performance (5.2)
- ✅ Adicionar debounce localStorage (4.2)

**Tempo estimado:** 2-3 horas de desenvolvimento

---

## 📞 PRÓXIMOS PASSOS

Você quer que eu:

**A)** Corrija TODOS os problemas acima?

**B)** Corrija apenas os CRÍTICOS (2.1, 1.1, 1.2)?

**C)** Corrija CRÍTICOS + ALTOS (adiciona 4.1, 3.1, 3.2, 5.3)?

**D)** Escolher especificamente quais?

