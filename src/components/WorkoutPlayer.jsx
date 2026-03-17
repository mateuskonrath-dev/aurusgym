import { useState, useEffect } from 'react'
import ExerciseDetail from './ExerciseDetail'

export default function WorkoutPlayer({ workout, onComplete, onCancel }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [showInfo, setShowInfo] = useState(false)
    const [logs, setLogs] = useState({}) // { exerciseId_setIndex: { reps, weight } }
    const [completedSets, setCompletedSets] = useState(new Set())
    const [isFinished, setIsFinished] = useState(false)
    const [swappingData, setSwappingData] = useState(null)

    const currentExercise = workout[currentIndex]
    const nextEx = workout[currentIndex + 1]

    useEffect(() => {
        if (!currentExercise) return;
        const newLogs = { ...logs }
        for (let i = 0; i < currentExercise.sets; i++) {
            const key = `${currentExercise.id}_${i}`
            if (!newLogs[key]) {
                newLogs[key] = { reps: currentExercise.reps.split('-')[0], weight: currentExercise.weight }
            }
        }
        setLogs(newLogs)
    }, [currentIndex])

    const updateLog = (setIdx, field, value) => {
        const key = `${currentExercise.id}_${setIdx}`
        setLogs({
            ...logs,
            [key]: { ...logs[key], [field]: value }
        })
    }

    const toggleSet = (setIdx) => {
        const key = `${currentExercise.id}_${setIdx}`
        const newSet = new Set(completedSets)
        if (newSet.has(key)) {
            newSet.delete(key)
        } else {
            newSet.add(key)
        }
        setCompletedSets(newSet)
    }

    const progress = ((currentIndex) / workout.length) * 100

    const nextExercise = () => {
        if (currentIndex < workout.length - 1) {
            setCurrentIndex(currentIndex + 1)
            setShowInfo(false)
        } else {
            setIsFinished(true)
        }
    }

    const handleSwapClick = () => {
        const location = currentExercise.id.startsWith('g') ? 'gym' : (currentExercise.id.startsWith('c') ? 'calisthenics' : 'home')
        // Find all exercises for the same muscle group
        const availableOptions = Object.values(import.meta.glob('../data/workoutData.js', { eager: true })['../data/workoutData.js'].EXERCISES[location])
            .flat()
            .filter(e => e.muscle === currentExercise.muscle && e.id !== currentExercise.id)

        setSwappingData({ options: availableOptions })
    }

    const confirmSwap = (newExercise) => {
        // We modify the workout array in place or pass a setter. 
        // Since WorkoutPlayer receives 'workout' as a prop, we need to handle this carefully.
        // Actually, in Dashboard.jsx, WorkoutPlayer is called with selectedWorkout.workout.
        // If we want to persist it, the parent should handle it. 
        // For simplicity and "perfeição", let's assume the user might want a temporary swap or we can lift the state.
        // But the user's request "o botão de trocar nao esta funcionando" is general.
        // I will implement the UI here and use a local update if possible, but ideally the parent should be notified.
        // WAIT: I can just update the local workout array for the current session.
        workout[currentIndex] = { ...newExercise, sets: currentExercise.sets, reps: currentExercise.reps }
        setSwappingData(null)
    }

    if (isFinished) {
        return (
            <div className="player-container-v3 animate-tech" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--brand-primary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', margin: '0 auto 30px', boxShadow: '0 0 30px var(--brand-primary)' }}>
                        ✓
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>PROTOCOLO<br />CONCLUÍDO</h2>
                    <p className="data-label" style={{ marginBottom: '40px' }}>Você completou {workout.length} exercícios técnicos.</p>

                    <button className="btn-tech" onClick={onComplete}>
                        SALVAR & RETORNAR
                    </button>
                </div>
            </div>
        )
    }

    if (!currentExercise) return null;

    return (
        <div className="player-container-v3 animate-tech" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Elite Progress Bar */}
            <div className="progress-bar-container">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>

            <header style={{ padding: '25px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <p className="data-label" style={{ color: 'var(--brand-primary)' }}>EXECUTANDO {currentIndex + 1} / {workout.length}</p>
                    <h2 style={{ fontSize: '1.6rem', lineHeight: 1.1 }}>{currentExercise.name}</h2>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '10px' }}>
                        <p className="data-label" style={{ margin: 0 }}>ALVO: {currentExercise.muscle.toUpperCase()}</p>
                        <button onClick={handleSwapClick} style={{ background: 'none', border: 'none', color: 'var(--brand-secondary)', fontSize: '0.65rem', fontWeight: 900, cursor: 'pointer' }}>[ SUBSTITUIR ]</button>
                    </div>
                </div>
                <button onClick={() => setShowInfo(true)} className="btn-outline" style={{ border: '1px solid var(--brand-primary)', color: 'var(--brand-primary)', width: '40px', height: '40px', borderRadius: '50%', padding: 0, fontWeight: 900, fontSize: '1.2rem' }}>?</button>
            </header>

            <div style={{ flex: 1, padding: '0 20px', overflowY: 'auto' }}>
                {/* Series Logger Table */}
                <div className="panel-tech" style={{ background: 'var(--bg-elevated)', border: 'none', marginBottom: '30px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '30px 40px 1fr 1fr', gap: '8px', paddingBottom: '10px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '15px' }}>
                        <div></div>
                        <p className="data-label">SET</p>
                        <p className="data-label">CARGA</p>
                        <p className="data-label">REPS</p>
                    </div>

                    {[...Array(currentExercise.sets)].map((_, i) => {
                        const key = `${currentExercise.id}_${i}`
                        const log = logs[key] || { reps: '-', weight: '-' }
                        const isDone = completedSets.has(key)

                        return (
                            <div key={i} style={{ display: 'grid', gridTemplateColumns: '30px 40px 1fr 1fr', gap: '8px', alignItems: 'center', marginBottom: '12px', opacity: isDone ? 0.5 : 1, transition: 'all 0.3s' }}>
                                <button onClick={() => toggleSet(i)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: `2px solid ${isDone ? 'var(--brand-primary)' : 'var(--text-low)'}`, background: isDone ? 'var(--brand-primary)' : 'transparent', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}>
                                    {isDone && <span style={{ fontSize: '14px', fontWeight: 900 }}>✓</span>}
                                </button>
                                <span style={{ fontWeight: 800, color: 'var(--text-low)' }}>{i + 1}</span>
                                <input
                                    type="text"
                                    value={log.weight}
                                    onChange={(e) => updateLog(i, 'weight', e.target.value)}
                                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: '#fff', padding: '8px', borderRadius: '4px', textAlign: 'center', fontWeight: 700 }}
                                />
                                <input
                                    type="text"
                                    value={log.reps}
                                    onChange={(e) => updateLog(i, 'reps', e.target.value)}
                                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--brand-primary)', padding: '8px', borderRadius: '4px', textAlign: 'center', fontWeight: 900 }}
                                />
                            </div>
                        )
                    })}
                </div>

                {nextEx && (
                    <div className="panel-tech" style={{ opacity: 0.5, transform: 'scale(0.95)' }}>
                        <p className="data-label">PRÓXIMO PROTOCOLO</p>
                        <p style={{ fontWeight: 700 }}>{nextEx.name}</p>
                    </div>
                )}
            </div>

            <footer style={{ padding: '20px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)' }}>
                <button className="btn-tech" onClick={nextExercise}>
                    {currentIndex === workout.length - 1 ? 'FINALIZAR PROTOCOLO' : 'PRÓXIMO EXERCÍCIO'}
                </button>
                <button onClick={onCancel} style={{ width: '100%', background: 'none', border: 'none', color: 'var(--text-low)', fontSize: '0.7rem', marginTop: '15px', fontWeight: 700, cursor: 'pointer' }}>
                    ABORTAR SESSÃO
                </button>
            </footer>

            {showInfo && (
                <ExerciseDetail exercise={currentExercise} onClose={() => setShowInfo(false)} />
            )}

            {swappingData && (
                <div className="modal-overlay animate-tech" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(5,5,5,0.95)', zIndex: 1200, padding: '20px',
                    display: 'flex', flexDirection: 'column'
                }}>
                    <header style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <p className="data-label">ALTERNATIVAS ANALISADAS</p>
                            <h2 style={{ fontSize: '1.2rem' }}>ESCOLHA UM SUBSTITUTO</h2>
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
                                <p>Nenhum substituto compatível no momento.</p>
                            </div>
                        )}
                    </div>

                    <button className="btn-tech" style={{ marginTop: '20px', background: 'transparent', border: '1px solid var(--text-low)' }} onClick={() => setSwappingData(null)}>
                        REMANTER ATUAL
                    </button>
                </div>
            )}
        </div>
    )
}
