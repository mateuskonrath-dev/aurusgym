import { useState, useEffect, useMemo } from 'react'
import { generateWeeklyPlan, EXERCISES } from '@/data/workoutData'

const buildExMap = () => {
    const m = {}
    Object.values(EXERCISES).forEach(loc => Object.values(loc).forEach(list => list.forEach(e => { m[e.id] = e.name })))
    return m
}
const EX_MAP = buildExMap()

const getWeekStart = () => {
    const now = new Date()
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(now.getFullYear(), now.getMonth(), diff).toISOString().split('T')[0]
}

const calc1RM = (w, r) => {
    const weight = parseFloat(w) || 0
    const reps = parseInt(r) || 1
    if (reps === 1 || weight === 0) return weight
    return Math.round(weight * (1 + reps / 30))
}

const calculateStreak = (volumeHistory) => {
    const dates = Object.keys(volumeHistory).sort().reverse()
    if (dates.length === 0) return 0
    let streak = 0
    let check = new Date()
    check.setHours(0, 0, 0, 0)
    for (const date of dates) {
        const d = new Date(date + 'T00:00:00')
        const diff = Math.round((check - d) / 86400000)
        if (diff <= 1) { streak++; check = d } else break
    }
    return streak
}

const MEV = {
    'Peito': 8, 'Costas': 10, 'Ombros': 8, 'Pernas': 8,
    'Bíceps': 8, 'Tríceps': 8, 'Core': 4, 'Abs': 4, 'Antebraços': 4
}

export default function ProgressDashboard({ profile, personalBests = {}, volumeHistory = {} }) {
    const [tick, setTick] = useState(0)
    const [currentTime, setCurrentTime] = useState(new Date())
    const [pulseActive, setPulseActive] = useState(true)

    // Live clock
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date())
            setTick(t => t + 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    // Pulse dot animation
    useEffect(() => {
        const blink = setInterval(() => setPulseActive(p => !p), 900)
        return () => clearInterval(blink)
    }, [])

    // Completed days from localStorage (refreshes on tick)
    const completedDays = useMemo(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('aurus-completed-days') || 'null')
            if (saved?.weekStart === getWeekStart()) return saved.days || []
            return []
        } catch { return [] }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tick])

    const lastSession = useMemo(() => {
        try { return JSON.parse(localStorage.getItem('aurus-last-session') || '{}') } catch { return {} }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tick])

    const workoutHistory = useMemo(() => {
        try { return JSON.parse(localStorage.getItem('aurus-history') || '[]') } catch { return [] }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tick])

    // Weekly plan
    const weeklyPlan = useMemo(() => {
        if (!profile) return []
        return generateWeeklyPlan(profile)
    }, [profile])

    // Training days (non-rest)
    const trainingDays = weeklyPlan.filter(d => !d.isRest)
    const completedPct = trainingDays.length > 0
        ? Math.round((completedDays.length / trainingDays.length) * 100)
        : 0

    // Current week day index (0=Mon, 6=Sun)
    const todayIdx = (() => {
        const d = new Date().getDay()
        return d === 0 ? 6 : d - 1
    })()

    const todayPlan = weeklyPlan[todayIdx]
    const todayDone = completedDays.includes(todayIdx)

    // Volume this week
    const weekStart = getWeekStart()
    const weekTonnage = Object.entries(volumeHistory)
        .filter(([date]) => date >= weekStart)
        .reduce((acc, [, val]) => acc + (parseFloat(val) || 0), 0)

    // Volume history chart data (last 7 entries)
    const chartData = Object.entries(volumeHistory)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-7)
    const chartMax = Math.max(...chartData.map(([, v]) => parseFloat(v) || 0), 1)

    // Muscle volume from completed days
    const muscleVolume = {}
    completedDays.forEach(dayIdx => {
        const day = weeklyPlan[dayIdx]
        if (!day || day.isRest) return
        day.workout.forEach(ex => {
            if (!ex?.muscle) return
            muscleVolume[ex.muscle] = (muscleVolume[ex.muscle] || 0) + (ex.sets || 3)
        })
    })

    // Streak
    const streak = calculateStreak(volumeHistory)

    // PRs count
    const prCount = Object.keys(personalBests).length

    // Recent PRs (last 3)
    const recentPRs = Object.entries(personalBests)
        .filter(([, pb]) => pb.date)
        .slice(0, 3)

    // Best 1RM exercises
    const top3PRs = Object.entries(personalBests)
        .map(([id, pb]) => ({
            id,
            estimated1RM: pb.estimated1RM || calc1RM(pb.weight, pb.reps || 1),
            weight: pb.weight,
            reps: pb.reps
        }))
        .sort((a, b) => b.estimated1RM - a.estimated1RM)
        .slice(0, 3)

    // ORION insights generation
    const insights = useMemo(() => {
        const list = []

        if (completedDays.length === 0 && trainingDays.length > 0) {
            list.push({ type: 'info', icon: '📡', text: 'Nenhum treino completado esta semana. Inicie o protocolo hoje para ativar o monitoramento de progresso.' })
        }

        if (completedPct >= 80) {
            list.push({ type: 'success', icon: '🔥', text: `Semana quase completa: ${completedDays.length}/${trainingDays.length} sessões. Consistência exemplar.` })
        } else if (completedPct >= 40) {
            list.push({ type: 'ok', icon: '⚡', text: `${completedDays.length} de ${trainingDays.length} sessões concluídas. Mantenha o ritmo para atingir a meta semanal.` })
        }

        // Muscle imbalance check
        const pushedMuscles = (muscleVolume['Peito'] || 0) + (muscleVolume['Tríceps'] || 0) + (muscleVolume['Ombros'] || 0)
        const pulledMuscles = (muscleVolume['Costas'] || 0) + (muscleVolume['Bíceps'] || 0)
        if (pushedMuscles > 0 && pulledMuscles > 0) {
            const ratio = pushedMuscles / pulledMuscles
            if (ratio > 1.5) {
                list.push({ type: 'warn', icon: '⚠️', text: `Desequilíbrio push/pull detectado (${ratio.toFixed(1)}:1). Priorize mais sessões de costas e bíceps.` })
            } else if (ratio < 0.7) {
                list.push({ type: 'warn', icon: '⚠️', text: 'Volume de pull supera push. Considere balancear com mais sessões de peito e ombros.' })
            } else {
                list.push({ type: 'success', icon: '✓', text: 'Distribuição push/pull equilibrada esta semana. Excelente para prevenção de lesões.' })
            }
        }

        // Volume vs MEV
        const underMEV = Object.entries(MEV)
            .filter(([muscle, mev]) => muscleVolume[muscle] !== undefined && muscleVolume[muscle] < mev)
        if (underMEV.length > 0) {
            const names = underMEV.slice(0, 2).map(([m]) => m).join(', ')
            list.push({ type: 'info', icon: '📊', text: `${names}: volume abaixo do mínimo efetivo semanal. Adicione 1–2 séries extras nas próximas sessões.` })
        }

        if (streak >= 3) {
            list.push({ type: 'success', icon: '🏅', text: `Sequência ativa: ${streak} sessão${streak > 1 ? 'ões' : ''} consecutiva${streak > 1 ? 's' : ''}. Constância gera resultados.` })
        }

        if (prCount === 0) {
            list.push({ type: 'info', icon: '🎯', text: 'Complete seu primeiro treino para começar a registrar recordes pessoais e visualizar seu progresso.' })
        }

        if (weekTonnage > 0) {
            list.push({ type: 'info', icon: '📈', text: `Volume semanal acumulado: ${weekTonnage.toLocaleString('pt-BR')} kg de tonelagem total.` })
        }

        if (list.length === 0) {
            list.push({ type: 'info', icon: '🤖', text: 'Núcleo Orion monitorando protocolos ativos. Complete treinos para ativar análises avançadas.' })
        }

        return list.slice(0, 4)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [completedDays.length, muscleVolume, streak, prCount, weekTonnage])

    const insightColors = {
        success: 'rgba(0,245,212,0.08)',
        warn: 'rgba(255,75,75,0.08)',
        info: 'rgba(0,187,250,0.08)',
        ok: 'rgba(155,93,229,0.08)'
    }
    const insightBorders = {
        success: 'rgba(0,245,212,0.25)',
        warn: 'rgba(255,75,75,0.25)',
        info: 'rgba(0,187,250,0.25)',
        ok: 'rgba(155,93,229,0.25)'
    }

    return (
        <div className="progress-view animate-tech" style={{ padding: '20px' }}>

            {/* Header */}
            <header style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <p className="data-label">NÚCLEO ORION</p>
                    <h1 style={{ fontSize: '1.4rem' }}>PROGRESSO <span className="title-italic">Live</span></h1>
                </div>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '7px',
                    background: 'rgba(0,245,212,0.06)',
                    border: '1px solid rgba(0,245,212,0.2)',
                    padding: '7px 11px', borderRadius: '3px'
                }}>
                    <div style={{
                        width: 7, height: 7, borderRadius: '50%',
                        background: pulseActive ? 'var(--brand-primary)' : 'rgba(0,245,212,0.3)',
                        transition: 'background 0.3s'
                    }} />
                    <span style={{ fontSize: '0.58rem', fontWeight: 900, color: 'var(--brand-primary)', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.5px' }}>
                        {currentTime.toLocaleTimeString('pt-BR')}
                    </span>
                </div>
            </header>

            {/* Today status */}
            <div className="panel-tech" style={{
                marginBottom: '16px',
                background: todayDone ? 'rgba(0,245,212,0.06)' : 'var(--bg-card)',
                borderLeft: `4px solid ${todayDone ? 'var(--brand-primary)' : todayPlan?.isRest ? 'var(--text-low)' : 'var(--brand-secondary)'}`,
                padding: '16px 18px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <p className="data-label" style={{ marginBottom: '4px' }}>HOJE — {currentTime.toLocaleDateString('pt-BR', { weekday: 'long' }).toUpperCase()}</p>
                        <p style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                            {todayDone ? 'TREINO CONCLUÍDO ✓' : todayPlan?.isRest ? 'DIA DE RECUPERAÇÃO' : `${todayPlan?.focus || 'TREINO PROGRAMADO'}`}
                        </p>
                        {!todayDone && !todayPlan?.isRest && (
                            <p style={{ fontSize: '0.6rem', color: 'var(--text-low)', marginTop: '3px' }}>
                                {todayPlan?.workout?.length || 0} exercícios programados
                            </p>
                        )}
                    </div>
                    <div style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: todayDone ? 'var(--brand-primary)' : todayPlan?.isRest ? 'var(--bg-elevated)' : 'var(--bg-elevated)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.2rem', flexShrink: 0
                    }}>
                        {todayDone ? '✓' : todayPlan?.isRest ? '⚡' : '○'}
                    </div>
                </div>
            </div>

            {/* Week completion */}
            <div className="panel-tech" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                        <p className="data-label">UTILIZAÇÃO DO PLANO SEMANAL</p>
                        <p style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--brand-primary)' }}>
                            {completedDays.length}/{trainingDays.length}
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, opacity: 0.6, marginLeft: '6px' }}>sessões</span>
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{
                            fontSize: '1.8rem', fontWeight: 900,
                            color: completedPct >= 80 ? 'var(--brand-primary)' : completedPct >= 40 ? 'var(--brand-secondary)' : 'var(--text-low)'
                        }}>
                            {completedPct}%
                        </span>
                    </div>
                </div>

                {/* Progress bar */}
                <div style={{ height: '6px', background: 'var(--bg-pure)', borderRadius: '3px', overflow: 'hidden', marginBottom: '12px' }}>
                    <div style={{
                        width: `${completedPct}%`, height: '100%',
                        background: `linear-gradient(90deg, var(--brand-primary), var(--brand-secondary))`,
                        borderRadius: '3px', transition: 'width 0.6s ease'
                    }} />
                </div>

                {/* Day pills */}
                <div style={{ display: 'flex', gap: '6px' }}>
                    {weeklyPlan.map((day, idx) => {
                        const done = completedDays.includes(idx)
                        const isToday = idx === todayIdx
                        return (
                            <div key={idx} style={{
                                flex: 1, textAlign: 'center',
                                opacity: day.isRest ? 0.25 : 1
                            }}>
                                <p style={{ fontSize: '0.45rem', color: isToday ? 'var(--brand-primary)' : 'var(--text-low)', fontWeight: 800, marginBottom: '4px' }}>
                                    {day.label.toUpperCase()}
                                </p>
                                <div style={{
                                    height: '24px',
                                    background: done ? 'var(--brand-primary)' : isToday ? 'transparent' : 'var(--bg-elevated)',
                                    border: `1px solid ${done ? 'var(--brand-primary)' : isToday ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                                    borderRadius: '3px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.55rem', fontWeight: 900,
                                    color: done ? '#000' : isToday ? 'var(--brand-primary)' : 'var(--text-low)'
                                }}>
                                    {done ? '✓' : day.isRest ? '—' : isToday ? '●' : '○'}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                {[
                    { label: 'STREAK', value: streak, unit: 'dias', color: streak >= 3 ? 'var(--brand-primary)' : '#fff' },
                    { label: 'VOLUME SEMANA', value: weekTonnage > 0 ? (weekTonnage / 1000).toFixed(1) : '0', unit: 'ton', color: 'var(--brand-secondary)' },
                    { label: 'RECORDES', value: prCount, unit: 'total', color: '#ffcc00' }
                ].map(item => (
                    <div key={item.label} className="panel-tech" style={{ padding: '12px', textAlign: 'center' }}>
                        <p className="data-label" style={{ fontSize: '0.46rem', marginBottom: '6px' }}>{item.label}</p>
                        <p style={{ fontWeight: 900, fontSize: '1.2rem', color: item.color, lineHeight: 1 }}>{item.value}</p>
                        <p style={{ fontSize: '0.42rem', opacity: 0.35, marginTop: '2px' }}>{item.unit}</p>
                    </div>
                ))}
            </div>

            {/* Volume per muscle */}
            {Object.keys(muscleVolume).length > 0 && (
                <div className="panel-tech" style={{ marginBottom: '16px' }}>
                    <p className="data-label" style={{ marginBottom: '14px' }}>VOLUME POR MÚSCULO — ESTA SEMANA</p>
                    <div style={{ display: 'grid', gap: '10px' }}>
                        {Object.entries(muscleVolume)
                            .sort(([, a], [, b]) => b - a)
                            .map(([muscle, sets]) => {
                                const target = MEV[muscle] || 8
                                const pct = Math.min(100, Math.round((sets / target) * 100))
                                const color = pct >= 100 ? 'var(--brand-primary)'
                                    : pct >= 60 ? 'var(--brand-secondary)'
                                        : '#ffcc00'
                                return (
                                    <div key={muscle}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--text-med)' }}>{muscle.toUpperCase()}</span>
                                            <span style={{ fontSize: '0.62rem', fontWeight: 900, color }}>
                                                {sets}/{target} séries <span style={{ opacity: 0.5 }}>({pct}%)</span>
                                            </span>
                                        </div>
                                        <div style={{ height: '4px', background: 'var(--bg-pure)', borderRadius: '2px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${pct}%`, height: '100%',
                                                background: color, borderRadius: '2px',
                                                transition: 'width 0.5s ease'
                                            }} />
                                        </div>
                                    </div>
                                )
                            })}
                    </div>
                    <p style={{ fontSize: '0.52rem', color: 'var(--text-low)', marginTop: '10px' }}>
                        Meta baseada no MEV (Mínimo Efetivo de Volume) por grupo muscular
                    </p>
                </div>
            )}

            {/* Volume history chart */}
            {chartData.length > 0 && (
                <div className="panel-tech" style={{ marginBottom: '16px' }}>
                    <p className="data-label" style={{ marginBottom: '14px' }}>HISTÓRICO DE VOLUME (ÚLTIMAS SESSÕES)</p>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '70px' }}>
                        {chartData.map(([date, vol], i) => {
                            const pct = Math.max(8, (parseFloat(vol) / chartMax) * 100)
                            const isLast = i === chartData.length - 1
                            return (
                                <div key={date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                                    <div style={{
                                        width: '100%', height: `${pct}%`,
                                        background: isLast
                                            ? 'linear-gradient(180deg, var(--brand-primary), var(--brand-secondary))'
                                            : 'var(--bg-elevated)',
                                        border: `1px solid ${isLast ? 'rgba(0,245,212,0.5)' : 'var(--border-subtle)'}`,
                                        borderRadius: '3px 3px 0 0',
                                        transition: 'height 0.4s ease'
                                    }} />
                                    <span style={{ fontSize: '0.4rem', color: isLast ? 'var(--brand-primary)' : 'var(--text-low)', fontWeight: 700 }}>
                                        {new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Last session data */}
            {Object.keys(lastSession).length > 0 && (
                <div className="panel-tech" style={{ marginBottom: '16px' }}>
                    <p className="data-label" style={{ marginBottom: '12px' }}>ÚLTIMA SESSÃO — CARGAS UTILIZADAS</p>
                    <div style={{ display: 'grid', gap: '8px' }}>
                        {Object.entries(lastSession).slice(0, 5).map(([exId, data]) => (
                            <div key={exId} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '10px 12px',
                                background: 'var(--bg-elevated)',
                                borderRadius: 'var(--radius-pro)'
                            }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-med)' }}>
                                    {(EX_MAP[exId] || exId).toUpperCase()}
                                </span>
                                <span style={{ fontSize: '0.72rem', fontWeight: 900, color: 'var(--brand-primary)' }}>
                                    {data.weight}kg × {data.reps}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Workout History */}
            {workoutHistory.length > 0 && (
                <div className="panel-tech" style={{ marginBottom: '16px' }}>
                    <p className="data-label" style={{ marginBottom: '14px' }}>HISTÓRICO DE TREINOS</p>
                    <div style={{ display: 'grid', gap: '12px' }}>
                        {workoutHistory.slice(0, 10).map((session, i) => (
                            <div key={i} style={{
                                padding: '14px',
                                background: 'var(--bg-elevated)',
                                borderRadius: 'var(--radius-pro)',
                                borderLeft: `3px solid ${i === 0 ? 'var(--brand-primary)' : 'var(--border-subtle)'}`
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <div>
                                        <p style={{ fontSize: '0.72rem', fontWeight: 900, color: i === 0 ? 'var(--brand-primary)' : '#fff' }}>
                                            {session.focus || session.dayLabel}
                                            {session.newPRs?.length > 0 && (
                                                <span style={{ marginLeft: '8px', fontSize: '0.55rem', color: '#ffcc00', fontWeight: 700 }}>
                                                    🏆 {session.newPRs.length} PR{session.newPRs.length > 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </p>
                                        <p style={{ fontSize: '0.52rem', color: 'var(--text-low)', marginTop: '2px' }}>
                                            {session.dateLabel} • {session.duration}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--brand-secondary)' }}>
                                            {session.totalVolume?.toLocaleString('pt-BR')} kg
                                        </p>
                                        <p style={{ fontSize: '0.48rem', color: 'var(--text-low)' }}>
                                            {session.totalSets} séries
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {session.exercises?.slice(0, 4).map((ex, j) => (
                                        <span key={j} style={{
                                            fontSize: '0.48rem', fontWeight: 700,
                                            padding: '2px 7px', borderRadius: '2px',
                                            background: 'rgba(255,255,255,0.06)',
                                            color: 'var(--text-med)'
                                        }}>
                                            {ex.name}
                                        </span>
                                    ))}
                                    {session.exercises?.length > 4 && (
                                        <span style={{ fontSize: '0.48rem', color: 'var(--text-low)', padding: '2px 4px' }}>
                                            +{session.exercises.length - 4}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    )
}
