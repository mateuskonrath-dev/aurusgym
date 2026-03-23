import { useState } from 'react'
import MuscleMap from '@/components/MuscleMap'

export default function ExerciseDetail({ exercise, onClose }) {
    const [activeTab, setActiveTab] = useState('setup') // setup, anatomy, tips

    const tabs = [
        { id: 'setup', label: 'Setup' },
        { id: 'anatomy', label: 'Anatomia' },
        { id: 'tips', label: 'Dicas' }
    ]

    return (
        <div className="modal-overlay animate-tech" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(5,5,5,0.98)',
            zIndex: 1100,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <header style={{
                padding: '20px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <p className="data-label" style={{ marginBottom: 0 }}>Exercício Técnico</p>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--brand-primary)' }}>{exercise.name}</h2>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-med)', fontSize: '1.5rem', cursor: 'pointer' }}>✕</button>
            </header>

            {/* Navigation Sub-header */}
            <div style={{ display: 'flex', padding: '0 20px', background: 'var(--bg-elevated)' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '15px 0',
                            marginRight: '25px',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === tab.id ? '2px solid var(--brand-primary)' : '2px solid transparent',
                            color: activeTab === tab.id ? 'var(--brand-primary)' : 'var(--text-low)',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            letterSpacing: '1px',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {tab.label.toUpperCase()}
                    </button>
                ))}
            </div>

            <div style={{ flex: 1, padding: '25px', overflowY: 'auto' }}>
                {activeTab === 'setup' && (
                    <div className="animate-tech">
                        <div className="panel-tech tech-border-l" style={{ marginBottom: '20px' }}>
                            <p className="data-label">EXECUTAR</p>
                            <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-high)' }}>
                                {exercise.howTo || 'Instruções técnicas sendo processadas pelo núcleo Orion...'}
                            </p>
                        </div>
                        <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-pro)' }}>
                            <div style={{ fontSize: '3rem', opacity: 0.2 }}>📐</div>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-low)', marginTop: '10px' }}>REFERÊNCIA DE MOVIMENTO ANALISADA</p>
                        </div>
                    </div>
                )}

                {activeTab === 'anatomy' && (
                    <div className="animate-tech">
                        <div className="panel-tech" style={{ marginBottom: '20px' }}>
                            <MuscleMap target={exercise.muscle} specifics={exercise.muscles?.primary || []} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div className="panel-tech" style={{ padding: '15px' }}>
                                <p className="data-label">ALVO PRINCIPAL</p>
                                <p style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>
                                    {exercise.muscles?.primary?.join(', ') || 'Processando...'}
                                </p>
                            </div>
                            <div className="panel-tech" style={{ padding: '15px' }}>
                                <p className="data-label">ESTABILIZADORES</p>
                                <p style={{ fontWeight: 700, color: 'var(--brand-secondary)' }}>
                                    {exercise.muscles?.secondary?.join(', ') || 'Nenhum reportado'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'tips' && (
                    <div className="animate-tech">
                        <div className="panel-tech" style={{ border: '1px solid var(--brand-secondary)', background: 'rgba(0, 187, 250, 0.05)', borderRadius: 'var(--radius-pro)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                                <span style={{ fontSize: '1.5rem' }}>🤖</span>
                                <p className="data-label" style={{ color: 'var(--brand-secondary)', margin: 0 }}>DICA DO COACH ORION</p>
                            </div>
                            <p style={{ fontStyle: 'italic', lineHeight: 1.6, fontSize: '1rem', color: '#fff' }}>
                                {exercise.proTip ? `"${exercise.proTip}"` : '"Mantenha o foco na técnica e no tempo sob tensão para máximos resultados."'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <footer style={{ padding: '20px', borderTop: '1px solid var(--border-subtle)' }}>
                <button className="btn-tech" onClick={onClose}>
                    VOLTAR AO MONITOR
                </button>
            </footer>
        </div>
    )
}
