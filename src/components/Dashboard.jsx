import { useState, useEffect } from 'react'
import { generateWeeklyPlan, EXERCISES } from '@/data/workoutData'
import WorkoutPlayer from '@/components/WorkoutPlayer'
import ExerciseDetail from '@/components/ExerciseDetail'
import WeeklyRoadmap from '@/components/WeeklyRoadmap'
import ProgressStats from '@/components/ProgressStats'
import WorkoutSession from '@/components/WorkoutSession'

export default function Dashboard({ profile, personalBests = {}, volumeHistory = {}, onUpdatePBs, onUpdateVolume }) {
    const [activeWorkout, setActiveWorkout] = useState(false)
    const [weeklyPlan, setWeeklyPlan] = useState([])
    const [selectedDayIndex, setSelectedDayIndex] = useState(0)
    const [currentDayIndex, setCurrentDayIndex] = useState(0)
    const [selectedExercise, setSelectedExercise] = useState(null)

    const [completedDays, setCompletedDays] = useState([])
    const [swappingData, setSwappingData] = useState(null) // { dayIdx, exerciseIdx, options }

    const catMap = { 'peito': 'Peito', 'costas': 'Costas', 'pernas': 'Pernas', 'ombros': 'Ombros', 'tríceps': 'Braços', 'bíceps': 'Braços', 'antebraços': 'Braços', 'abs': 'Core', 'core': 'Core' }

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
        const day = { ...newPlan[dayIdx] }

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
                if (!ex || !ex.muscle) return;
                const m = ex.muscle.trim().toLowerCase();
                const group = catMap[m] || 'Core'
                if (stats[group] !== undefined) {
                    stats[group]++
                    total++
                }
            })
        })
        return { stats, total: total || 1 }
    }

    const { stats, total } = calculateVolume()

    const colors = {
        Peito: 'var(--brand-primary)',
        Costas: '#ff4b4b',
        Pernas: 'var(--brand-secondary)',
        Ombros: '#9b5de5',
        Braços: '#00bbf9',
        Core: '#f15bb5'
    }

    let currentOffset = 0;
    const donutSegments = Object.entries(stats).map(([label, val]) => {
        if (val === 0) return null;
        const pct = (val / total) * 100;
        const offset = currentOffset;
        currentOffset += pct;
        return { label, pct, offset };
    }).filter(Boolean);

    const handleWorkoutComplete = (sessionLogs) => {
        if (!completedDays.includes(selectedDayIndex)) {
            setCompletedDays([...completedDays, selectedDayIndex]);
        }

        if (sessionLogs) {
            const sessionTonnage = Object.values(sessionLogs).reduce((acc, log) => {
                const w = parseFloat(log.weight) || 0
                const r = parseFloat(log.reps) || 0
                return acc + (w * r)
            }, 0)

            if (onUpdateVolume) {
                const date = new Date().toISOString().split('T')[0]
                onUpdateVolume(date, sessionTonnage)
            }

            if (onUpdatePBs) {
                const sessionPBs = {}
                Object.entries(sessionLogs).forEach(([key, data]) => {
                    const exerciseId = key.substring(0, key.lastIndexOf('_'))
                    const weight = parseFloat(data.weight) || 0
                    if (!sessionPBs[exerciseId] || weight > sessionPBs[exerciseId]) {
                        sessionPBs[exerciseId] = weight
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
                            <p className="data-label">SUBSITUTOS DISPONÍVEIS</p>
                            <h2 style={{ fontSize: '1.2rem' }}>ESCOLHA UM EXERCÍCIO</h2>
                        </div>
                        <button onClick={() => setSwappingData(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem' }}>✕</button>
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
