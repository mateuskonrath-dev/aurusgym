import { useState } from 'react'
import SplashScreen from '@/components/SplashScreen'
import ScrollPicker from '@/components/ScrollPicker'

const steps = [
    {
        id: 'name',
        title: 'Como devemos te chamar?',
        type: 'text',
        placeholder: 'Seu Nome ou Codinome',
        unit: ''
    },
    {
        id: 'sex',
        title: 'Qual seu sexo biológico?',
        options: [
            { label: 'Masculino', value: 'male' },
            { label: 'Feminino', value: 'female' }
        ]
    },
    {
        id: 'age',
        title: 'Qual sua idade?',
        type: 'number',
        placeholder: 'Ex: 25',
        unit: 'anos'
    },
    {
        id: 'weight',
        title: 'Qual seu peso atual?',
        type: 'number',
        placeholder: 'Ex: 75',
        unit: 'kg'
    },
    {
        id: 'height',
        title: 'Qual sua altura?',
        type: 'number',
        placeholder: 'Ex: 175',
        unit: 'cm'
    },
    {
        id: 'activity',
        title: 'Qual seu nível de atividade?',
        options: [
            { label: 'Nível Base', value: '1.2', desc: 'Não realizo exercícios atualmente' },
            { label: 'Leve', value: '1.375', desc: 'Exercício 1–3x por semana' },
            { label: 'Moderado', value: '1.55', desc: 'Exercício 3–5x por semana' },
            { label: 'Intenso', value: '1.725', desc: 'Exercício 6–7x por semana' },
            { label: 'Atleta', value: '1.9', desc: 'Treino pesado diário ou trabalho físico' }
        ]
    },
    {
        id: 'level',
        title: 'Qual sua experiência?',
        options: [
            { label: 'Iniciante', value: 'beginner', desc: 'Nunca treinei ou estou voltando' },
            { label: 'Praticante', value: 'intermediate', desc: 'Treino há alguns meses' },
            { label: 'Veterano', value: 'advanced', desc: 'Anos de consistência' }
        ]
    },
    {
        id: 'goal',
        title: 'Qual seu objetivo?',
        options: [
            { label: 'Hipertrofia', value: 'muscle', desc: 'Ganhar massa muscular' },
            { label: 'Força', value: 'strength', desc: 'Levantar cargas pesadas' },
            { label: 'Emagrecimento', value: 'fat-loss', desc: 'Definição e queima calórica' }
        ]
    },
    {
        id: 'includeChest',
        title: 'Incluir treinos de peito?',
        condition: (ans) => ans.sex === 'female',
        options: [
            { label: 'Sim, quero treinar tudo', value: 'yes' },
            { label: 'Não, prefiro focar em outros', value: 'no' }
        ]
    },
    {
        id: 'freq',
        title: 'Quantos dias você pode treinar por semana?',
        options: [
            { label: '1 dia', value: '1' },
            { label: '2 dias', value: '2' },
            { label: '3 dias', value: '3' },
            { label: '4 dias', value: '4' },
            { label: '5 dias', value: '5' },
            { label: '6 dias', value: '6' },
            { label: '7 dias', value: '7' }
        ]
    },
    {
        id: 'exerciseQty',
        title: 'Quantos exercícios por treino?',
        options: [
            { label: '4 Exercícios', value: '4' },
            { label: '5 Exercícios', value: '5' },
            { label: '6 Exercícios', value: '6' },
            { label: 'Sem preferência', value: 'none' }
        ]
    },
    {
        id: 'place',
        title: 'Onde você treina?',
        options: [
            { label: 'Academia', value: 'gym', desc: 'Máquinas e pesos livres' },
            { label: 'Home Gym', value: 'home', desc: 'Apenas halteres / elásticos' },
            { label: 'Ao Ar Livre', value: 'calisthenics', desc: 'Apenas peso do corpo' }
        ]
    }
]

export default function Onboarding({ onComplete, mode = 'onboarding', initialAnswers = {} }) {
    const isReconfig = mode === 'reconfig'
    const [showSplash, setShowSplash] = useState(!isReconfig)

    const activeSteps = isReconfig
        ? steps.filter(s => ['level', 'goal', 'includeChest', 'freq', 'exerciseQty', 'place'].includes(s.id))
        : steps

    const [currentStep, setCurrentStep] = useState(0)
    const [answers, setAnswers] = useState(initialAnswers)
    const [inputValue, setInputValue] = useState('')
    const [showError, setShowError] = useState(false)

    if (showSplash) {
        return <SplashScreen onStart={() => setShowSplash(false)} />
    }

    const step = activeSteps[currentStep]

    const nextStepIndex = (fromIndex) => {
        let next = fromIndex + 1
        while (next < activeSteps.length && activeSteps[next].condition && !activeSteps[next].condition(answers)) {
            next++
        }
        return next
    }

    const prevStepIndex = (fromIndex) => {
        let prev = fromIndex - 1
        while (prev >= 0 && activeSteps[prev].condition && !activeSteps[prev].condition(answers)) {
            prev--
        }
        return prev
    }

    // Função inteligente que escolhe o melhor split
    const selectBestSplit = (profile) => {
        const days = parseInt(profile.freq)
        const level = profile.level // 'beginner', 'intermediate', 'advanced'
        const goal = profile.goal // 'muscle', 'strength', 'fat-loss'

        // LÓGICA DE SELEÇÃO INTELIGENTE
        if (days === 1) {
            // 1 dia: Full Body intenso (todos os grupos em 1 dia)
            // ⚠️ Menos ideal, mas é melhor que não treinar
            return 'full_body_1'
        }

        if (days === 2) return 'ab_2'

        if (days === 3) {
            if (level === 'beginner') return 'full_body'
            if (level === 'intermediate') return 'abc_3'
            return 'abc_3'
        }

        if (days === 4) {
            if (level === 'beginner') return 'ab_4'
            if (level === 'intermediate') return 'traditional_4' // Seu pedido específico!
            if (level === 'advanced') return 'abcd_4'
            return 'traditional_4'
        }

        if (days === 5) {
            if (level === 'beginner') return 'abc_3' // Reduzir para 3 dias
            if (level === 'intermediate') return 'abc_6' // Usar 6 dias é melhor
            return 'bro_split' // Avançados podem usar bro split
        }

        if (days === 6 || days === 7) {
            if (level === 'advanced') return 'ppl' // Frequência máxima
            if (level === 'intermediate') return 'abc_6'
            return 'abc_6'
        }

        return 'full_body' // Default
    }

    const isInputValid = (valToTest) => {
        if (!step.type) return true
        const rawVal = valToTest !== undefined ? valToTest : inputValue

        if (step.type === 'text') return String(rawVal).trim().length >= 2

        const val = parseFloat(rawVal)
        if (isNaN(val)) return false

        if (step.id === 'age') return val >= 10 && val <= 100
        if (step.id === 'weight') return val >= 30 && val <= 250
        if (step.id === 'height') return val >= 140 && val <= 220

        return true
    }

    const handleNext = (value) => {
        const val = value !== undefined ? value : inputValue
        if (val === '') return

        if (step.type && value === undefined && !isInputValid(val)) {
            setShowError(true)
            return
        }

        const newAnswers = { ...answers, [step.id]: val }
        setAnswers(newAnswers)
        setInputValue('')
        setShowError(false)

        const next = nextStepIndex(currentStep)
        if (next < activeSteps.length) {
            setCurrentStep(next)
        } else {
            // Escolher automaticamente o melhor split
            const selectedSplit = selectBestSplit(newAnswers)
            const finalProfile = { ...newAnswers, freq: selectedSplit }
            onComplete(finalProfile)
        }
    }

    const handleBack = () => {
        const prev = prevStepIndex(currentStep)
        if (prev >= 0) setCurrentStep(prev)
    }

    const totalSteps = activeSteps.length
    const progressPct = ((currentStep + 1) / totalSteps) * 100

    return (
        <div className="onboarding-v3 animate-tech" style={{ padding: '30px' }}>
            <header style={{ marginBottom: '60px' }}>
                <h1 style={{ fontSize: '1rem', letterSpacing: '0.3em', color: 'var(--brand-primary)' }}>
                    AURUS PRO <span className="title-italic">v3</span>
                </h1>
                <div className="progress-bar-container" style={{ marginTop: '15px' }}>
                    <div className="progress-fill" style={{ width: `${progressPct}%` }} />
                </div>
            </header>

            <section>
                <p className="data-label">PARÂMETRO {String(currentStep + 1).padStart(2, '0')}</p>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '40px' }}>{step.title}</h2>

                <div style={{ display: 'grid', gap: '12px' }}>
                    {step.options ? (
                        step.options.map(opt => (
                            <button
                                key={opt.value}
                                className="panel-tech"
                                style={{
                                    textAlign: 'left', color: 'white', cursor: 'pointer',
                                    transition: 'all 0.2s ease', display: 'flex',
                                    flexDirection: 'column', gap: '4px'
                                }}
                                onClick={() => handleNext(opt.value)}
                            >
                                <span style={{ fontWeight: 900, fontSize: '0.9rem', letterSpacing: '1px' }}>{opt.label}</span>
                                {opt.desc && <span style={{ fontSize: '0.7rem', color: 'var(--text-med)', textTransform: 'uppercase' }}>{opt.desc}</span>}
                            </button>
                        ))
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {['age', 'weight', 'height'].includes(step.id) ? (
                                <>
                                    <ScrollPicker
                                        value={inputValue ? parseInt(inputValue) : (step.id === 'age' ? 25 : step.id === 'weight' ? 75 : 175)}
                                        min={step.id === 'age' ? 13 : step.id === 'weight' ? 30 : step.id === 'height' ? 140 : 3}
                                        max={step.id === 'age' ? 80 : step.id === 'weight' ? 250 : step.id === 'height' ? 220 : 60}
                                        unit={step.unit}
                                        onChange={(val) => {
                                            setInputValue(String(val))
                                            setShowError(false)
                                        }}
                                    />
                                    {showError && (
                                        <p className="animate-tech" style={{
                                            color: 'var(--brand-danger)', fontSize: '0.7rem',
                                            fontWeight: 800, marginTop: '-10px', letterSpacing: '1px'
                                        }}>
                                            ⚠️ VALOR FORA DOS PARÂMETROS OPERACIONAIS. AJUSTE PARA PROSSEGUIR.
                                        </p>
                                    )}
                                    <button className="btn-tech" onClick={() => handleNext()}>CONTINUAR</button>
                                </>
                            ) : (
                                <>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        background: 'var(--bg-card)', padding: '20px',
                                        borderRadius: '8px', border: '1px solid var(--border-subtle)'
                                    }}>
                                        <input
                                            type={step.type === 'number' ? 'number' : 'text'}
                                            inputMode={step.type === 'number' ? 'decimal' : 'text'}
                                            value={inputValue}
                                            onChange={(e) => { setInputValue(e.target.value); setShowError(false) }}
                                            placeholder={step.placeholder}
                                            autoFocus
                                            style={{
                                                background: 'transparent', border: 'none',
                                                color: showError ? 'var(--brand-danger)' : 'var(--brand-primary)',
                                                fontSize: step.type === 'text' ? '1.2rem' : '2rem',
                                                fontWeight: 900, width: '100%', outline: 'none',
                                                transition: 'color 0.3s ease'
                                            }}
                                        />
                                        {step.unit && (
                                            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-low)' }}>
                                                {step.unit}
                                            </span>
                                        )}
                                    </div>

                                    {showError && (
                                        <p className="animate-tech" style={{
                                            color: 'var(--brand-danger)', fontSize: '0.7rem',
                                            fontWeight: 800, marginTop: '-10px', letterSpacing: '1px'
                                        }}>
                                            ⚠️ VALOR FORA DOS PARÂMETROS OPERACIONAIS. AJUSTE PARA PROSSEGUIR.
                                        </p>
                                    )}

                                    <button className="btn-tech" onClick={() => handleNext()}>CONTINUAR</button>
                                </>
                            )}

                        </div>
                    )}
                </div>
            </section>

            {currentStep > 0 && (
                <button
                    className="btn-outline"
                    style={{ marginTop: '40px', width: 'auto', padding: '10px 20px' }}
                    onClick={handleBack}
                >
                    RETROCEDER
                </button>
            )}
        </div>
    )
}
