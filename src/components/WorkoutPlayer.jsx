import { useState } from 'react'
import ExerciseDetail from '@/components/ExerciseDetail'
import { EXERCISES } from '@/data/workoutData'

export default function WorkoutPlayer({ workout, personalBests, onComplete, onCancel }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [logs, setLogs] = useState({}) // { 'exId_setNum': { weight, reps } }
    const [isFinished, setIsFinished] = useState(false)
    const [selectedExercise, setSelectedExercise] = useState(null)
    const [swappingData, setSwappingData] = useState(null)
    const [localWorkout, setLocalWorkout] = useState([...workout])

    const currentExercise = localWorkout[currentIndex]

    const handleLogSet = (setNum, weight, reps) => {
        setLogs({
            ...logs,
            [`${currentExercise.id}_${setNum}`]: { weight, reps }
        })
    }

    const nextExercise = () => {
        if (currentIndex < localWorkout.length - 1) {
            setCurrentIndex(currentIndex + 1)
            window.scrollTo(0, 0)
        } else {
            setIsFinished(true)
        }
    }

    const prevExercise = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
            window.scrollTo(0, 0)
        }
    }

    const handleComplete = () => {
        onComplete(logs)
    }

    const getProgressionCoach = () => {
        const pb = personalBests[currentExercise.id]?.weight || 0
        if (!pb) return "PROTOCOLO BASE: Foco em forma e cadência técnica."
        if (pb > 0) return ` COACH: Recorde anterior em ${pb}kg. Sugestão: Manter ou +1kg.`
        return "NÚCLEO ORION: Execute com precisão."
    }

    const handleSwapClick = () => {
        const location = currentExercise.id.startsWith('g') ? 'gym' : (currentExercise.id.startsWith('c') ? 'calisthenics' : 'home')
        const availableOptions = Object.values(EXERCISES[location])
            .flat()
            .filter(e => e.muscle === currentExercise.muscle && e.id !== currentExercise.id)

        setSwappingData({ options: availableOptions })
    }

    const confirmSwap = (newExercise) => {
        const updatedWorkout = [...localWorkout]
        updatedWorkout[currentIndex] = { ...newExercise, sets: currentExercise.sets, reps: currentExercise.reps }
        setLocalWorkout(updatedWorkout)
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
                    <p className="data-label" style={{ marginBottom: '40px' }}>LOGS SINCRONIZADOS COM SUCESSO</p>
                    <button className="btn-tech" onClick={handleComplete}>FINALIZAR E SALVAR</button>
                </div>
            </div>
        )
    }

    return (
        <div className="player-v3 animate-tech" style={{ padding: '20px' }}>
            <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={onCancel} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.7rem', fontWeight: 900 }}>[ CANCELAR ]</button>
                <div style={{ textAlign: 'right' }}>
                    <p className="data-label">EXERCÍCIO {currentIndex + 1}/{workout.length}</p>
                    <div style={{ display: 'flex', gap: '4px', marginTop: '5px' }}>
                        {localWorkout.map((_, i) => (
                            <div key={i} style={{ width: '15px', height: '3px', background: i === currentIndex ? 'var(--brand-primary)' : 'var(--bg-card)' }} />
                        ))}
                    </div>
                </div>
            </header>

            <section className="current-exercise panel-tech tech-border-l" style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h2 style={{ fontSize: '1.4rem', color: 'var(--brand-primary)' }}>{currentExercise.name}</h2>
                        <p style={{ color: 'var(--brand-secondary)', fontWeight: 800, fontSize: '0.8rem' }}>{currentExercise.muscle.toUpperCase()}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button onClick={handleSwapClick} style={{ background: 'none', border: 'none', color: 'var(--brand-secondary)', fontSize: '0.6rem', fontWeight: 900 }}>[ TROCAR ]</button>
                        <button onClick={() => setSelectedExercise(currentExercise)} style={{ background: 'none', border: 'none', color: 'var(--brand-primary)', fontSize: '1rem' }}>ⓘ</button>
                    </div>
                </div>
            </section>

            <div className="progression-coach panel-tech" style={{ background: 'rgba(0,255,198,0.05)', marginBottom: '30px', border: '1px solid rgba(0,255,198,0.2)' }}>
                <p className="data-label" style={{ color: 'var(--brand-primary)' }}>ORION AI PROGRESSION</p>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, fontStyle: 'italic' }}>{getProgressionCoach()}</p>
            </div>

            <div className="sets-grid" style={{ display: 'grid', gap: '12px', marginBottom: '40px' }}>
                {Array.from({ length: currentExercise.sets }).map((_, i) => {
                    const log = logs[`${currentExercise.id}_${i}`]
                    const isLastCompleted = logs[`${currentExercise.id}_${i - 1}`] || i === 0
                    return (
                        <div key={i} className={`panel-tech ${!isLastCompleted ? 'opacity-30' : ''}`} style={{ transition: 'all 0.3s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: 900, fontSize: '1.1rem', color: log ? 'var(--brand-primary)' : '#fff' }}>S{i + 1}</span>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <div style={{ background: 'var(--bg-pure)', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                                        <input
                                            type="number"
                                            placeholder="KG"
                                            value={log?.weight || ''}
                                            disabled={!isLastCompleted}
                                            onChange={(e) => handleLogSet(i, e.target.value, log?.reps)}
                                            style={{ background: 'transparent', border: 'none', color: '#fff', width: '40px', textAlign: 'center', fontWeight: 900 }}
                                        />
                                        <span style={{ fontSize: '0.5rem', opacity: 0.5 }}>KG</span>
                                    </div>
                                    <div style={{ background: 'var(--bg-pure)', padding: '8px 12px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
                                        <input
                                            type="number"
                                            placeholder="REPS"
                                            value={log?.reps || ''}
                                            disabled={!isLastCompleted}
                                            onChange={(e) => handleLogSet(i, log?.weight, e.target.value)}
                                            style={{ background: 'transparent', border: 'none', color: '#fff', width: '40px', textAlign: 'center', fontWeight: 900 }}
                                        />
                                        <span style={{ fontSize: '0.5rem', opacity: 0.5 }}>REPS</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <footer style={{ display: 'flex', gap: '15px' }}>
                <button className="btn-outline" onClick={prevExercise} disabled={currentIndex === 0} style={{ flex: 1 }}>VOLTAR</button>
                <button className="btn-tech" onClick={nextExercise} style={{ flex: 2 }}>{currentIndex === workout.length - 1 ? 'CONCLUIR TREINO' : 'PRÓXIMO'}</button>
            </footer>

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
