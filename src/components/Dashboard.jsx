import { useState, useEffect } from 'react'
import { generateDailyWorkout, generateWeeklyPlan, EXERCISES } from '../data/workoutData'
import WorkoutPlayer from './WorkoutPlayer'
import ExerciseDetail from './ExerciseDetail'

export default function Dashboard({ profile }) {
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

        // Find all exercises for the same muscle group
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

    // Logic for Muscle Volume Chart
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
        Peito: 'var(--brand-primary)', // Teal Neon
        Costas: '#ff4b4b', // Red
        Pernas: 'var(--brand-secondary)', // Yellow Neon
        Ombros: '#9b5de5', // Purple
        Braços: '#00bbf9', // Blue
        Core: '#f15bb5' // Pink
    }

    let currentOffset = 0;
    const donutSegments = Object.entries(stats).map(([label, val]) => {
        if (val === 0) return null;
        const pct = (val / total) * 100;
        const offset = currentOffset;
        currentOffset += pct;
        return { label, pct, offset };
    }).filter(Boolean);

    const handleWorkoutComplete = () => {
        if (!completedDays.includes(selectedDayIndex)) {
            setCompletedDays([...completedDays, selectedDayIndex]);
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
                                <p className="data-label" style={{ marginTop: '4px' }}>Status: Ativo • {profile.level.toUpperCase()}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p className="data-label">OBJETIVO</p>
                                <p style={{ color: 'var(--brand-primary)', fontWeight: 800 }}>{profile.goal.toUpperCase()}</p>
                            </div>
                        </div>

                        {/* Muscle Load Chart (Mini SVG) */}
                        <div className="panel-tech" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px' }}>
                            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                                <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                                    <circle cx="18" cy="18" r="16" fill="transparent" stroke="var(--bg-pure)" strokeWidth="4" />
                                    {donutSegments.map(segment => (
                                        <circle key={segment.label} cx="18" cy="18" r="16" fill="transparent" stroke={colors[segment.label]} strokeWidth="4"
                                            strokeDasharray={`${segment.pct} 100`} strokeDashoffset={`-${segment.offset}`} />
                                    ))}
                                </svg>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.6rem', fontWeight: 900 }}>LOAD</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p className="data-label" style={{ marginBottom: '8px' }}>Volume Semanal</p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                                    {donutSegments.map(seg => (
                                        <p key={seg.label} style={{ fontSize: '0.65rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                            <span style={{ color: colors[seg.label] }}>●</span> {seg.label.toUpperCase()}: {Math.round(seg.pct)}%
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="weekly-roadmap-v3" style={{ display: 'flex', gap: '10px' }}>
                            {weeklyPlan.map((day, idx) => {
                                const isCompleted = completedDays.includes(idx);
                                const isSelected = selectedDayIndex === idx;
                                return (
                                    <div key={idx} onClick={() => setSelectedDayIndex(idx)}
                                        style={{ flex: 1, textAlign: 'center', cursor: 'pointer', opacity: isSelected ? 1 : 0.4, transition: 'all 0.2s' }}>
                                        <p className="data-label" style={{ fontSize: '0.55rem' }}>{day.label}</p>
                                        <div style={{
                                            height: '30px',
                                            background: isCompleted ? 'var(--brand-primary)' : (isSelected ? 'transparent' : 'var(--bg-card)'),
                                            border: isCompleted ? '1px solid var(--brand-primary)' : (isSelected ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)'),
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: isCompleted ? '#000' : (isSelected ? 'var(--brand-primary)' : '#fff'),
                                            fontSize: '0.7rem', fontWeight: 900, borderRadius: '4px'
                                        }}>
                                            {isCompleted ? '✓' : (day.isRest ? 'Z' : (idx === currentDayIndex ? '●' : '—'))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </header>

                    <div className="session-card animate-tech" key={selectedDayIndex}>
                        <div className="panel-tech tech-border-l" style={{ marginBottom: '30px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <p className="data-label">SESSÃO DE TREINAMENTO</p>
                                    <h2 style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{selectedWorkout.label}</h2>
                                    <p style={{ color: 'var(--brand-secondary)', fontWeight: 800, fontSize: '0.8rem' }}>{selectedWorkout.focus}</p>
                                </div>
                                {selectedDayIndex === currentDayIndex && <span style={{ background: 'var(--brand-primary)', color: '#000', padding: '4px 8px', fontSize: '0.6rem', fontWeight: 900, borderRadius: '2px' }}>HOJE</span>}
                            </div>
                        </div>

                        {!selectedWorkout.isRest ? (
                            <>
                                <div style={{ display: 'grid', gap: '10px', marginBottom: '40px' }}>
                                    {selectedWorkout.workout.map((ex, i) => (
                                        <div key={i} className="panel-tech" style={{ padding: '15px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div onClick={() => setSelectedExercise(ex)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                                                    <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-low)' }}>{String(i + 1).padStart(2, '0')}</span>
                                                    <div>
                                                        <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{ex.name}</p>
                                                        <p className="data-label" style={{ marginBottom: 0 }}>{ex.muscle} • PRESCRIÇÃO: {ex.sets}x{ex.reps}</p>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleSwapClick(selectedDayIndex, i); }}
                                                        style={{ background: 'transparent', border: 'none', color: 'var(--brand-secondary)', fontSize: '0.65rem', fontWeight: 900, cursor: 'pointer' }}
                                                    >
                                                        [ TROCAR ]
                                                    </button>
                                                    <div onClick={() => setSelectedExercise(ex)} style={{ cursor: 'pointer', fontSize: '0.8rem', color: 'var(--brand-primary)' }}>ⓘ</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {completedDays.includes(selectedDayIndex) ? (
                                    <button className="btn-tech" style={{ background: 'transparent', color: 'var(--brand-primary)', border: '1px solid var(--brand-primary)' }} onClick={() => setActiveWorkout(true)}>
                                        PROTOCOLO CONCLUÍDO ✓
                                    </button>
                                ) : (
                                    <button className="btn-tech" onClick={() => setActiveWorkout(true)}>
                                        EXECUTAR PROTOCOLO
                                    </button>
                                )}
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.3 }}>
                                <div style={{ fontSize: '4rem' }}>⚡</div>
                                <h3 style={{ marginTop: '20px' }}>RECUPERAÇÃO TÉCNICA</h3>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <WorkoutPlayer workout={selectedWorkout.workout} onComplete={handleWorkoutComplete} onCancel={() => setActiveWorkout(false)} />
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
