import { useState, useEffect } from 'react'
import { generateWeeklyPlan, EXERCISES } from '@/data/workoutData'
import WorkoutPlayer from '@/components/WorkoutPlayer'
import ExerciseDetail from '@/components/ExerciseDetail'
import WeeklyRoadmap from '@/components/WeeklyRoadmap'
import ProgressStats from '@/components/ProgressStats'
import WorkoutSession from '@/components/WorkoutSession'

// Epley 1RM
const calc1RM = (weight, reps) => {
    const w = parseFloat(weight) || 0
    const r = parseInt(reps) || 1
    if (r === 1 || w === 0) return w
    return Math.round(w * (1 + r / 30))
}

const calcStreak = (volumeHistory) => {
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

const getWeekStart = () => {
    const now = new Date()
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(now.getFullYear(), now.getMonth(), diff).toISOString().split('T')[0]
}

export default function Dashboard({ profile, personalBests = {}, volumeHistory = {}, onUpdatePBs, onUpdateVolume }) {
    const [activeWorkout, setActiveWorkout] = useState(false)
    const [weeklyPlan, setWeeklyPlan] = useState([])
    const [selectedDayIndex, setSelectedDayIndex] = useState(0)
    const [currentDayIndex, setCurrentDayIndex] = useState(0)
    const [selectedExercise, setSelectedExercise] = useState(null)
    const [swappingData, setSwappingData] = useState(null)

    const [completedDays, setCompletedDays] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('aurus-completed-days') || 'null')
            if (saved?.weekStart === getWeekStart()) return saved.days
            return []
        } catch { return [] }
    })

    const catMap = {
        'peito': 'Peito', 'costas': 'Costas', 'pernas': 'Pernas', 'ombros': 'Ombros',
        'tríceps': 'Braços', 'bíceps': 'Braços', 'antebraços': 'Braços',
        'abs': 'Core', 'core': 'Core'
    }

    const persistCompletedDays = (days) => {
        setCompletedDays(days)
        localStorage.setItem('aurus-completed-days', JSON.stringify({ weekStart: getWeekStart(), days }))
    }

    const handleSwapClick = (dayIdx, exerciseIdx) => {
        const exToSwap = weeklyPlan[dayIdx].workout[exerciseIdx]
        const location = profile.place === 'gym' ? 'gym' : (profile.place === 'calisthenics' ? 'calisthenics' : 'home')

        const availableOptions = Object.values(EXERCISES[location])
            .flat()
            .filter(e => e.muscle === exToSwap.muscle && e.id !== exToSwap.id)

        setSwappingData({ dayIdx, exerciseIdx, options: availableOptions })
    }

    const confirmSwap = (newExercise) => {
        const { dayIdx, exerciseIdx } = swappingData
        const newPlan = [...weeklyPlan]
        const day = { ...newPlan[dayIdx], workout: [...newPlan[dayIdx].workout] }
        day.workout[exerciseIdx] = { ...newExercise, sets: day.workout[exerciseIdx].sets, reps: day.workout[exerciseIdx].reps }
        newPlan[dayIdx] = day
        setWeeklyPlan(newPlan)
        setSwappingData(null)
    }

    useEffect(() => {
        const plan = generateWeeklyPlan(profile)
        setWeeklyPlan(plan)

        const date = new Date()
        const day = date.getDay()
        const normalizedDay = day === 0 ? 6 : day - 1
        setCurrentDayIndex(normalizedDay)
        setSelectedDayIndex(normalizedDay)
    }, [profile])

    const selectedWorkout = weeklyPlan[selectedDayIndex] || { workout: [], label: '', focus: '' }

    const calculateVolume = () => {
        const stats = { Peito: 0, Costas: 0, Pernas: 0, Ombros: 0, Braços: 0, Core: 0 }
        let total = 0

        weeklyPlan.forEach(day => {
            day.workout.forEach(ex => {
                if (!ex || !ex.muscle) return
                const m = ex.muscle.trim().toLowerCase()
                const group = catMap[m] || 'Core'
                if (stats[group] !== undefined) { stats[group]++; total++ }
            })
        })
        return { stats, total: total || 1 }
    }

    const { stats, total } = calculateVolume()

    const colors = {
        Peito: 'var(--brand-primary)', Costas: '#ff4b4b',
        Pernas: 'var(--brand-secondary)', Ombros: '#9b5de5',
        Braços: '#00bbf9', Core: '#f15bb5'
    }

    let currentOffset = 0
    const donutSegments = Object.entries(stats).map(([label, val]) => {
        if (val === 0) return null
        const pct = (val / total) * 100
        const offset = currentOffset
        currentOffset += pct
        return { label, pct, offset }
    }).filter(Boolean)

    const handleWorkoutComplete = (sessionLogs) => {
        if (!completedDays.includes(selectedDayIndex)) {
            persistCompletedDays([...completedDays, selectedDayIndex])
        }

        if (sessionLogs) {
            // Calculate tonnage
            const sessionTonnage = Object.values(sessionLogs).reduce((acc, log) => {
                return acc + ((parseFloat(log.weight) || 0) * (parseFloat(log.reps) || 0))
            }, 0)

            if (onUpdateVolume) {
                const date = new Date().toISOString().split('T')[0]
                onUpdateVolume(date, sessionTonnage)
            }

            if (onUpdatePBs) {
                // Build best set per exercise using estimated 1RM
                const sessionPBs = {}
                Object.entries(sessionLogs).forEach(([key, data]) => {
                    const exerciseId = key.substring(0, key.lastIndexOf('_'))
                    const weight = parseFloat(data.weight) || 0
                    const reps = parseInt(data.reps) || 1
                    const estimated1RM = calc1RM(weight, reps)

                    if (!sessionPBs[exerciseId] || estimated1RM > sessionPBs[exerciseId].estimated1RM) {
                        sessionPBs[exerciseId] = { weight, reps, estimated1RM }
                    }
                })
                onUpdatePBs(sessionPBs)
            }
        }
        setActiveWorkout(false)
    }

    if (!weeklyPlan.length) return <div className="loading">Sincronizando satélites Aurus...</div>

    return (
        <div className="dashboard-v3 animate-tech" style={{ padding: '20px' }}>
            {!activeWorkout ? (
                <>
                    <header style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                            <div>
                                <h1 style={{ fontSize: '1.4rem' }}>MONITOR <span className="title-italic">Aurus</span></h1>
                                <p className="data-label" style={{ marginTop: '4px' }}>Status: Ativo • {(profile.level || 'RECRUTA').toUpperCase()}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                {calcStreak(volumeHistory) > 0 && (
                                    <div style={{ marginBottom: '6px' }}>
                                        <p className="data-label" style={{ fontSize: '0.46rem' }}>SEQUÊNCIA</p>
                                        <p style={{ color: calcStreak(volumeHistory) >= 3 ? 'var(--brand-primary)' : 'var(--text-med)', fontWeight: 900, fontSize: '1.1rem', lineHeight: 1 }}>
                                            🔥 {calcStreak(volumeHistory)}
                                        </p>
                                    </div>
                                )}
                                <p className="data-label">OBJETIVO</p>
                                <p style={{ color: 'var(--brand-primary)', fontWeight: 800 }}>{(profile.goal || 'DESEMPENHO').toUpperCase()}</p>
                            </div>
                        </div>

                        <ProgressStats
                            donutSegments={donutSegments}
                            colors={colors}
                            volumeHistory={volumeHistory}
                        />

                        <WeeklyRoadmap
                            weeklyPlan={weeklyPlan}
                            completedDays={completedDays}
                            currentDayIndex={currentDayIndex}
                            selectedDayIndex={selectedDayIndex}
                            onSelectDay={setSelectedDayIndex}
                        />
                    </header>

                    <WorkoutSession
                        selectedWorkout={selectedWorkout}
                        selectedDayIndex={selectedDayIndex}
                        currentDayIndex={currentDayIndex}
                        completedDays={completedDays}
                        onExerciseSelect={setSelectedExercise}
                        onSwapClick={handleSwapClick}
                        onStartWorkout={() => setActiveWorkout(true)}
                    />
                </>
            ) : (
                <WorkoutPlayer
                    workout={selectedWorkout.workout}
                    profile={profile}
                    personalBests={personalBests}
                    workoutMeta={{ label: selectedWorkout.label, focus: selectedWorkout.focus }}
                    onComplete={handleWorkoutComplete}
                    onCancel={() => setActiveWorkout(false)}
                />
            )}

            {selectedExercise && (
                <ExerciseDetail exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
            )}

            {swappingData && (
                <div className="modal-overlay animate-tech" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(5,5,5,0.95)', zIndex: 1200, padding: '20px',
                    display: 'flex', flexDirection: 'column'
                }}>
                    <header style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p className="data-label">SUBSTITUTOS DISPONÍVEIS</p>
                            <h2 style={{ fontSize: '1.2rem' }}>ESCOLHA UM EXERCÍCIO</h2>
                        </div>
                        <button onClick={() => setSwappingData(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
                    </header>

                    <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gap: '12px' }}>
                        {swappingData.options.length > 0 ? swappingData.options.map(opt => (
                            <div key={opt.id} className="panel-tech tech-border-l"
                                onClick={() => confirmSwap(opt)}
                                style={{ padding: '15px', cursor: 'pointer', border: '1px solid var(--border-subtle)' }}>
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

                    <button className="btn-tech" style={{ marginTop: '20px', background: 'transparent', border: '1px solid var(--text-low)' }} onClick={() => setSwappingData(null)}>
                        CANCELAR
                    </button>
                </div>
            )}
        </div>
    )
}
