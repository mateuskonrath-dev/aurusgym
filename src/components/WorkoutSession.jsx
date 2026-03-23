import React from 'react';

export default function WorkoutSession({ 
    selectedWorkout, 
    selectedDayIndex, 
    currentDayIndex, 
    completedDays, 
    onExerciseSelect, 
    onSwapClick, 
    onStartWorkout 
}) {
    return (
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
                                    <div onClick={() => onExerciseSelect(ex)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
                                        <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-low)' }}>{String(i + 1).padStart(2, '0')}</span>
                                        <div>
                                            <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{ex.name}</p>
                                            <p className="data-label" style={{ marginBottom: 0 }}>{ex.muscle} • PRESCRIÇÃO: {ex.sets}x{ex.reps}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onSwapClick(selectedDayIndex, i); }}
                                            style={{ background: 'transparent', border: 'none', color: 'var(--brand-secondary)', fontSize: '0.65rem', fontWeight: 900, cursor: 'pointer' }}
                                        >
                                            [ TROCAR ]
                                        </button>
                                        <div onClick={() => onExerciseSelect(ex)} style={{ cursor: 'pointer', fontSize: '0.8rem', color: 'var(--brand-primary)' }}>ⓘ</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {completedDays.includes(selectedDayIndex) ? (
                        <button className="btn-tech" style={{ background: 'transparent', color: 'var(--brand-primary)', border: '1px solid var(--brand-primary)' }} onClick={onStartWorkout}>
                            PROTOCOLO CONCLUÍDO ✓
                        </button>
                    ) : (
                        <button className="btn-tech" onClick={onStartWorkout}>
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
    );
}
