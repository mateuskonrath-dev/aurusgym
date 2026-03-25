import { useState, useEffect, useRef, useMemo } from 'react'
import ExerciseDetail from '@/components/ExerciseDetail'
import { EXERCISES } from '@/data/workoutData'

// Epley formula for estimated 1RM
const calc1RM = (weight, reps) => {
    const w = parseFloat(weight) || 0
    const r = parseInt(reps) || 1
    if (r <= 0 || w <= 0) return 0
    if (r === 1) return w
    return Math.round(w * (1 + r / 30))
}

// Haptic feedback
const vibrate = (pattern) => {
    try { navigator.vibrate?.(pattern) } catch (e) {}
}

// Beep on rest timer end
const playBeep = (count = 3) => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        for (let i = 0; i < count; i++) {
            const osc = ctx.createOscillator()
            const gain = ctx.createGain()
            osc.connect(gain)
            gain.connect(ctx.destination)
            osc.frequency.value = i < count - 1 ? 660 : 880
            osc.type = 'sine'
            const t = ctx.currentTime + i * 0.25
            gain.gain.setValueAtTime(0.35, t)
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18)
            osc.start(t)
            osc.stop(t + 0.18)
        }
    } catch (e) {}
}

// Rest duration based on goal/reps
const getRestDuration = (goal, reps) => {
    const r = parseInt(reps) || 10
    if (goal === 'strength' || r <= 5) return 180
    if (goal === 'fat-loss' || r >= 15) return 60
    return 90
}

export default function WorkoutPlayer({ workout, personalBests = {}, profile = {}, workoutMeta = {}, onComplete, onCancel }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [logs, setLogs] = useState({})           // { 'exId_setN': { weight, reps, confirmed } }
    const [setInputs, setSetInputs] = useState({}) // draft values per set
    const [isFinished, setIsFinished] = useState(false)
    const [selectedExercise, setSelectedExercise] = useState(null)
    const [swappingData, setSwappingData] = useState(null)
    const [localWorkout, setLocalWorkout] = useState([...workout])
    const [newPRs, setNewPRs] = useState({})

    // Rest timer
    const [restActive, setRestActive] = useState(false)
    const [restSecondsLeft, setRestSecondsLeft] = useState(0)
    const [restDuration, setRestDuration] = useState(90)
    const restRef = useRef(null)

    // Duration timer
    const startTimeRef = useRef(Date.now())
    const [elapsed, setElapsed] = useState(0)
    const durationRef = useRef(null)

    // Last session pre-fill data
    const lastSession = useMemo(() => {
        try { return JSON.parse(localStorage.getItem('aurus-last-session') || '{}') }
        catch { return {} }
    }, [])

    const currentExercise = localWorkout[currentIndex]

    // Duration timer effect
    useEffect(() => {
        durationRef.current = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000))
        }, 1000)
        return () => clearInterval(durationRef.current)
    }, [])

    // Rest timer effect
    useEffect(() => {
        if (restActive) {
            restRef.current = setInterval(() => {
                setRestSecondsLeft(s => {
                    if (s <= 1) {
                        clearInterval(restRef.current)
                        setRestActive(false)
                        playBeep(3)
                        vibrate([100, 50, 100, 50, 200])
                        return 0
                    }
                    return s - 1
                })
            }, 1000)
        }
        return () => clearInterval(restRef.current)
    }, [restActive])

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0')
        const s = (secs % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    const startRest = (duration) => {
        clearInterval(restRef.current)
        setRestDuration(duration)
        setRestSecondsLeft(duration)
        setRestActive(true)
    }

    const skipRest = () => {
        clearInterval(restRef.current)
        setRestActive(false)
        setRestSecondsLeft(0)
    }

    // Get prefill value: last session → personalBests → empty
    const getInput = (exId, setNum, field) => {
        const key = `${exId}_${setNum}`
        if (setInputs[key]?.[field] !== undefined && setInputs[key][field] !== '') return setInputs[key][field]
        const last = lastSession[exId]
        if (last?.[field]) return String(last[field])
        if (field === 'weight') {
            const pb = personalBests[exId]?.weight
            return pb ? String(pb) : ''
        }
        return ''
    }

    const handleSetInput = (exId, setNum, field, value) => {
        const key = `${exId}_${setNum}`
        setSetInputs(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }))
    }

    const isConfirmed = (exId, setNum) => !!logs[`${exId}_${setNum}`]?.confirmed
    const canConfirm = (exId, setNum) => setNum === 0 || isConfirmed(exId, setNum - 1)

    const handleConfirmSet = (setNum) => {
        const ex = currentExercise
        const w = getInput(ex.id, setNum, 'weight')
        const r = getInput(ex.id, setNum, 'reps')
        if (!w && !r) return

        const key = `${ex.id}_${setNum}`
        setLogs(prev => ({ ...prev, [key]: { weight: w, reps: r, confirmed: true } }))

        // PR detection
        const new1RM = calc1RM(w, r)
        const pb = personalBests[ex.id]
        const old1RM = pb?.estimated1RM || calc1RM(pb?.weight, pb?.reps || 1) || 0
        const sessionBest = newPRs[ex.id]?.estimated1RM || 0
        const bestSoFar = Math.max(old1RM, sessionBest)

        if (new1RM > bestSoFar && parseFloat(w) > 0) {
            setNewPRs(prev => ({
                ...prev,
                [ex.id]: { weight: parseFloat(w), reps: parseInt(r) || 1, estimated1RM: new1RM, name: ex.name }
            }))
            vibrate([100, 50, 200])   // PR: padrão distinto
        } else {
            vibrate([40])             // set confirmado: pulso curto
        }

        // Start rest timer
        const dur = getRestDuration(profile.goal, r)
        startRest(dur)
    }

    const nextExercise = () => {
        const ex = currentExercise
        const confirmedCount = Array.from({ length: ex.sets }, (_, i) => isConfirmed(ex.id, i)).filter(Boolean).length
        if (confirmedCount > 0 && confirmedCount < ex.sets) {
            const missing = ex.sets - confirmedCount
            if (!window.confirm(`${missing} série${missing > 1 ? 's' : ''} não confirmada${missing > 1 ? 's' : ''}. Continuar mesmo assim?`)) return
        }

        if (currentIndex < localWorkout.length - 1) {
            setCurrentIndex(i => i + 1)
            skipRest()
            window.scrollTo(0, 0)
        } else {
            setIsFinished(true)
            clearInterval(durationRef.current)
        }
    }

    const prevExercise = () => {
        if (currentIndex > 0) {
            setCurrentIndex(i => i - 1)
            skipRest()
            window.scrollTo(0, 0)
        }
    }

    const handleComplete = () => {
        // Build clean logs for parent
        const cleanLogs = {}
        Object.entries(logs).forEach(([key, val]) => {
            cleanLogs[key] = { weight: val.weight, reps: val.reps }
        })

        // Save last session data for next pre-fill
        const sessionData = {}
        localWorkout.forEach(ex => {
            for (let i = ex.sets - 1; i >= 0; i--) {
                const log = logs[`${ex.id}_${i}`]
                if (log?.confirmed) {
                    sessionData[ex.id] = { weight: log.weight, reps: log.reps }
                    break
                }
            }
        })
        localStorage.setItem('aurus-last-session', JSON.stringify(sessionData))

        // Save to workout history
        const historyEntry = {
            date: new Date().toISOString().split('T')[0],
            dateLabel: new Date().toLocaleDateString('pt-BR'),
            dayLabel: workoutMeta.label || 'Treino',
            focus: workoutMeta.focus || '',
            duration: formatTime(elapsed),
            totalVolume,
            totalSets,
            exercises: localWorkout.map(ex => ({
                id: ex.id,
                name: ex.name,
                muscle: ex.muscle,
                sets: Array.from({ length: ex.sets }, (_, i) => {
                    const log = logs[`${ex.id}_${i}`]
                    return log?.confirmed ? { weight: parseFloat(log.weight) || 0, reps: parseInt(log.reps) || 0 } : null
                }).filter(Boolean)
            })).filter(ex => ex.sets.length > 0),
            newPRs: Object.keys(newPRs)
        }
        try {
            const prev = JSON.parse(localStorage.getItem('aurus-history') || '[]')
            prev.unshift(historyEntry)
            localStorage.setItem('aurus-history', JSON.stringify(prev.slice(0, 50)))
        } catch (e) {}

        onComplete(cleanLogs)
    }

    const handleSwapClick = () => {
        const loc = currentExercise.id.startsWith('g') ? 'gym'
            : currentExercise.id.startsWith('c') ? 'calisthenics' : 'home'
        const options = Object.values(EXERCISES[loc]).flat()
            .filter(e => e.muscle === currentExercise.muscle && e.id !== currentExercise.id)
        setSwappingData({ options })
    }

    const confirmSwap = (newEx) => {
        const updated = [...localWorkout]
        updated[currentIndex] = { ...newEx, sets: currentExercise.sets, reps: currentExercise.reps }
        setLocalWorkout(updated)
        setSwappingData(null)
    }

    // Totals for summary screen
    const totalVolume = Object.values(logs)
        .filter(l => l.confirmed)
        .reduce((acc, l) => acc + (parseFloat(l.weight) || 0) * (parseInt(l.reps) || 0), 0)
    const totalSets = Object.values(logs).filter(l => l.confirmed).length

    // ─── FINISHED SCREEN ────────────────────────────────────────────────────────
    if (isFinished) {
        const prList = Object.values(newPRs)
        return (
            <div className="animate-tech" style={{ padding: '30px', minHeight: '100%' }}>
                <div style={{ textAlign: 'center', paddingTop: '30px' }}>
                    <div style={{
                        width: 96, height: 96, borderRadius: '50%',
                        background: 'var(--brand-primary)', color: '#000',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2.4rem', margin: '0 auto 24px',
                        boxShadow: '0 0 50px rgba(0,245,212,0.35)'
                    }}>✓</div>

                    <h2 style={{ fontSize: '1.8rem', marginBottom: '6px' }}>PROTOCOLO<br />CONCLUÍDO</h2>
                    <p className="data-label" style={{ marginBottom: '28px' }}>LOGS SINCRONIZADOS COM SUCESSO</p>

                    {/* Session stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '24px' }}>
                        {[
                            { label: 'DURAÇÃO', value: formatTime(elapsed), unit: '' },
                            { label: 'VOLUME', value: totalVolume.toLocaleString('pt-BR'), unit: 'KG' },
                            { label: 'SÉRIES', value: totalSets, unit: '' }
                        ].map(item => (
                            <div key={item.label} className="panel-tech" style={{ padding: '12px', textAlign: 'center' }}>
                                <p className="data-label" style={{ fontSize: '0.6rem', marginBottom: '6px' }}>{item.label}</p>
                                <p style={{ fontWeight: 900, fontSize: '1.05rem', color: 'var(--brand-primary)', lineHeight: 1 }}>{item.value}</p>
                                {item.unit && <p style={{ fontSize: '0.55rem', opacity: 0.4, marginTop: '2px' }}>{item.unit}</p>}
                            </div>
                        ))}
                    </div>

                    {/* PR celebration */}
                    {prList.length > 0 && (
                        <div className="panel-tech" style={{
                            marginBottom: '24px',
                            border: '1px solid rgba(0,245,212,0.4)',
                            background: 'rgba(0,245,212,0.04)'
                        }}>
                            <p className="data-label" style={{ color: 'var(--brand-primary)', marginBottom: '14px' }}>
                                🏆 {prList.length} NOVO{prList.length > 1 ? 'S' : ''} RECORDE{prList.length > 1 ? 'S' : ''} PESSOAL{prList.length > 1 ? 'IS' : ''}
                            </p>
                            {prList.map((pr, i) => (
                                <div key={i} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '10px 0',
                                    borderTop: i > 0 ? '1px solid var(--border-subtle)' : 'none'
                                }}>
                                    <span style={{ fontSize: '0.72rem', fontWeight: 800 }}>{pr.name.toUpperCase()}</span>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontWeight: 900, color: 'var(--brand-primary)', fontSize: '0.85rem' }}>
                                            {pr.weight}kg × {pr.reps}
                                        </span>
                                        <p style={{ fontSize: '0.52rem', opacity: 0.5, marginTop: '1px' }}>1RM ≈ {pr.estimated1RM} KG</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <button className="btn-tech" onClick={handleComplete}>FINALIZAR E SALVAR</button>
                </div>
            </div>
        )
    }

    // ─── REST TIMER ARC ──────────────────────────────────────────────────────────
    const circumference = 2 * Math.PI * 40
    const dashOffset = circumference * (1 - (restActive ? restSecondsLeft / restDuration : 0))

    // ─── MAIN WORKOUT VIEW ───────────────────────────────────────────────────────
    return (
        <div className="animate-tech" style={{ padding: '20px', paddingBottom: '30px' }}>

            {/* Header */}
            <header style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                    onClick={() => {
                        const hasProgress = Object.values(logs).some(l => l.confirmed)
                        if (!hasProgress || window.confirm('Cancelar o treino? O progresso desta sessão será perdido.')) {
                            onCancel()
                        }
                    }}
                    style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.7rem', fontWeight: 900, cursor: 'pointer', padding: '8px' }}
                >
                    [ CANCELAR ]
                </button>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.7rem', color: 'var(--brand-primary)', fontWeight: 900, letterSpacing: '2px' }}>
                        ⏱ {formatTime(elapsed)}
                    </p>
                    {totalVolume > 0 && (
                        <p style={{ fontSize: '0.52rem', color: 'var(--text-low)', marginTop: '2px' }}>
                            {totalVolume.toLocaleString('pt-BR')} kg
                        </p>
                    )}
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p className="data-label" style={{ fontSize: '0.52rem' }}>EX. {currentIndex + 1}/{localWorkout.length}</p>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '6px', justifyContent: 'flex-end' }}>
                        {localWorkout.map((_, i) => (
                            <div key={i} style={{
                                width: '14px', height: '3px', borderRadius: '2px',
                                background: i < currentIndex ? 'rgba(0,245,212,0.4)' : i === currentIndex ? 'var(--brand-primary)' : 'var(--bg-card)'
                            }} />
                        ))}
                    </div>
                </div>
            </header>

            {/* Rest Timer Banner */}
            {restActive && (
                <div className="animate-tech" style={{
                    marginBottom: '16px', padding: '14px 16px',
                    background: 'rgba(0,245,212,0.04)',
                    border: '1px solid rgba(0,245,212,0.2)',
                    borderRadius: 'var(--radius-pro)',
                    display: 'flex', alignItems: 'center', gap: '16px'
                }}>
                    <div style={{ position: 'relative', width: 68, height: 68, flexShrink: 0 }}>
                        <svg width="68" height="68" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--bg-card)" strokeWidth="7" />
                            <circle cx="50" cy="50" r="40" fill="none"
                                stroke="var(--brand-primary)" strokeWidth="7"
                                strokeDasharray={circumference}
                                strokeDashoffset={dashOffset}
                                strokeLinecap="round"
                                style={{
                                    transform: 'rotate(-90deg)', transformOrigin: '50% 50%',
                                    transition: 'stroke-dashoffset 1s linear'
                                }}
                            />
                        </svg>
                        <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1rem', fontWeight: 900, color: 'var(--brand-primary)'
                        }}>
                            {restSecondsLeft}
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <p className="data-label" style={{ color: 'var(--brand-primary)', marginBottom: '3px' }}>TEMPO DE DESCANSO</p>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, opacity: 0.6 }}>
                            {restDuration === 180 ? 'Força — 3 min' : restDuration === 60 ? 'Resistência — 1 min' : 'Hipertrofia — 90s'}
                        </p>
                    </div>
                    <button onClick={skipRest} style={{
                        background: 'none', border: '1px solid var(--border-subtle)',
                        color: 'var(--text-med)', padding: '8px 10px',
                        fontSize: '0.58rem', fontWeight: 900, cursor: 'pointer',
                        borderRadius: '3px', letterSpacing: '0.5px'
                    }}>PULAR</button>
                </div>
            )}

            {/* Exercise Card */}
            <section className="panel-tech tech-border-l" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '1.25rem', color: 'var(--brand-primary)', lineHeight: 1.2 }}>
                            {currentExercise.name}
                        </h2>
                        <p style={{ color: 'var(--brand-secondary)', fontWeight: 800, fontSize: '0.72rem', marginTop: '4px' }}>
                            {currentExercise.muscle.toUpperCase()} • {currentExercise.sets} SÉRIES × {currentExercise.reps}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <button onClick={handleSwapClick} style={{ background: 'none', border: 'none', color: 'var(--brand-secondary)', fontSize: '0.58rem', fontWeight: 900, cursor: 'pointer' }}>
                            [ TROCAR ]
                        </button>
                        <button onClick={() => setSelectedExercise(currentExercise)} style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontSize: '1rem', cursor: 'pointer' }}>
                            ⓘ
                        </button>
                    </div>
                </div>

                {/* Last session / PB hint + progressive overload suggestion */}
                {(() => {
                    const last = lastSession[currentExercise.id]
                    const pb = personalBests[currentExercise.id]
                    if (last) {
                        const suggestedWeight = (parseFloat(last.weight) + 2.5).toFixed(1).replace('.0', '')
                        return (
                            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                                <p style={{ fontSize: '0.62rem', color: 'var(--text-med)', marginBottom: '5px' }}>
                                    <span style={{ color: 'var(--brand-primary)' }}>↺</span> Último: <strong style={{ color: '#fff' }}>{last.weight}kg × {last.reps} reps</strong>
                                    {pb && parseFloat(pb.weight) > parseFloat(last.weight) && (
                                        <span style={{ opacity: 0.5 }}> • PR: {pb.weight}kg</span>
                                    )}
                                </p>
                                <p style={{ fontSize: '0.58rem', color: 'var(--brand-primary)', fontWeight: 800 }}>
                                    ↑ Meta de hoje: {suggestedWeight}kg × {last.reps} reps
                                    <span style={{ opacity: 0.5, fontWeight: 400 }}> (sobrecarga progressiva)</span>
                                </p>
                            </div>
                        )
                    }
                    if (pb) return (
                        <p style={{ fontSize: '0.62rem', color: 'var(--text-med)', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                            <span style={{ color: 'var(--brand-primary)' }}>🏆</span> PR Atual: <strong style={{ color: '#fff' }}>{pb.weight}kg</strong>
                            {pb.reps && <span style={{ opacity: 0.5 }}> × {pb.reps} reps</span>}
                        </p>
                    )
                    return (
                        <p style={{ fontSize: '0.62rem', color: 'var(--text-low)', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                            Primeiro registro — foco em forma e cadência técnica.
                        </p>
                    )
                })()}
            </section>

            {/* Sets table */}
            <div style={{ marginBottom: '28px' }}>
                {/* Column headers */}
                <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 72px', gap: '8px', padding: '0 4px 8px' }}>
                    <span className="data-label" style={{ fontSize: '0.62rem', textAlign: 'center' }}>SÉR.</span>
                    <span className="data-label" style={{ fontSize: '0.62rem', textAlign: 'center' }}>PESO (KG)</span>
                    <span className="data-label" style={{ fontSize: '0.62rem', textAlign: 'center' }}>REPS</span>
                    <span />
                </div>

                <div style={{ display: 'grid', gap: '9px' }}>
                    {Array.from({ length: currentExercise.sets }).map((_, i) => {
                        const confirmed = isConfirmed(currentExercise.id, i)
                        const available = canConfirm(currentExercise.id, i)
                        const wVal = getInput(currentExercise.id, i, 'weight')
                        const rVal = getInput(currentExercise.id, i, 'reps')

                        return (
                            <div key={i} style={{
                                display: 'grid', gridTemplateColumns: '32px 1fr 1fr 72px',
                                gap: '8px', alignItems: 'center',
                                opacity: !available ? 0.3 : 1,
                                transition: 'opacity 0.25s'
                            }}>
                                {/* Set number / checkmark */}
                                <span style={{
                                    fontWeight: 900, fontSize: '0.85rem', textAlign: 'center',
                                    color: confirmed ? 'var(--brand-primary)' : 'var(--text-low)',
                                    transition: 'color 0.2s'
                                }}>
                                    {confirmed ? '✓' : `S${i + 1}`}
                                </span>

                                {/* Weight input */}
                                <div style={{
                                    background: confirmed ? 'rgba(0,245,212,0.07)' : 'var(--bg-pure)',
                                    border: `1px solid ${confirmed ? 'rgba(0,245,212,0.3)' : 'var(--border-subtle)'}`,
                                    borderRadius: '4px', padding: '11px 8px',
                                    transition: 'all 0.2s'
                                }}>
                                    <input
                                        type="number" inputMode="decimal"
                                        placeholder="—"
                                        value={wVal}
                                        disabled={!available || confirmed}
                                        onChange={e => handleSetInput(currentExercise.id, i, 'weight', e.target.value)}
                                        style={{
                                            background: 'transparent', border: 'none', outline: 'none',
                                            color: confirmed ? 'var(--brand-primary)' : '#fff',
                                            width: '100%', textAlign: 'center',
                                            fontWeight: 900, fontSize: '1rem'
                                        }}
                                    />
                                </div>

                                {/* Reps input */}
                                <div style={{
                                    background: confirmed ? 'rgba(0,245,212,0.07)' : 'var(--bg-pure)',
                                    border: `1px solid ${confirmed ? 'rgba(0,245,212,0.3)' : 'var(--border-subtle)'}`,
                                    borderRadius: '4px', padding: '11px 8px',
                                    transition: 'all 0.2s'
                                }}>
                                    <input
                                        type="number" inputMode="numeric"
                                        placeholder="—"
                                        value={rVal}
                                        disabled={!available || confirmed}
                                        onChange={e => handleSetInput(currentExercise.id, i, 'reps', e.target.value)}
                                        style={{
                                            background: 'transparent', border: 'none', outline: 'none',
                                            color: confirmed ? 'var(--brand-primary)' : '#fff',
                                            width: '100%', textAlign: 'center',
                                            fontWeight: 900, fontSize: '1rem'
                                        }}
                                    />
                                </div>

                                {/* Confirm button */}
                                <button
                                    onClick={() => available && !confirmed && handleConfirmSet(i)}
                                    disabled={confirmed || !available}
                                    style={{
                                        padding: '11px 0', width: '72px',
                                        background: confirmed ? 'rgba(0,245,212,0.12)' : 'var(--brand-primary)',
                                        border: 'none', borderRadius: '4px',
                                        color: confirmed ? 'var(--brand-primary)' : '#000',
                                        fontWeight: 900, fontSize: '0.62rem',
                                        cursor: confirmed || !available ? 'default' : 'pointer',
                                        transition: 'all 0.2s', letterSpacing: '0.5px'
                                    }}
                                >
                                    {confirmed ? 'FEITO' : 'OK'}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Navigation */}
            <footer style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-outline" onClick={prevExercise} disabled={currentIndex === 0} style={{ flex: 1 }}>
                    VOLTAR
                </button>
                <button className="btn-tech" onClick={nextExercise} style={{ flex: 2 }}>
                    {currentIndex === localWorkout.length - 1 ? 'CONCLUIR TREINO' : 'PRÓXIMO →'}
                </button>
            </footer>

            {/* Exercise detail modal */}
            {selectedExercise && (
                <ExerciseDetail exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
            )}

            {/* Swap modal */}
            {swappingData && (
                <div style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(5,5,5,0.97)', zIndex: 1200, padding: '20px',
                    display: 'flex', flexDirection: 'column'
                }}>
                    <header style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p className="data-label">SUBSTITUTOS DISPONÍVEIS</p>
                            <h2 style={{ fontSize: '1.2rem' }}>ESCOLHA UM EXERCÍCIO</h2>
                        </div>
                        <button onClick={() => setSwappingData(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
                    </header>
                    <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gap: '10px' }}>
                        {swappingData.options.length > 0 ? swappingData.options.map(opt => (
                            <div key={opt.id} className="panel-tech tech-border-l"
                                onClick={() => confirmSwap(opt)}
                                style={{ padding: '15px', cursor: 'pointer' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontWeight: 800, margin: 0 }}>{opt.name}</p>
                                        <p className="data-label" style={{ margin: 0 }}>TIER {opt.tier} • {opt.muscle}</p>
                                    </div>
                                    <span style={{ color: 'var(--brand-primary)', fontWeight: 900, fontSize: '0.7rem' }}>[ SELECIONAR ]</span>
                                </div>
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>
                                <p>Nenhum substituto encontrado para este grupo muscular.</p>
                            </div>
                        )}
                    </div>
                    <button className="btn-outline" style={{ marginTop: '20px' }} onClick={() => setSwappingData(null)}>
                        CANCELAR
                    </button>
                </div>
            )}
        </div>
    )
}
