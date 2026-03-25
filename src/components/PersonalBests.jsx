import { useState } from 'react'
import { EXERCISES } from '@/data/workoutData'

const calc1RM = (weight, reps) => {
    const w = parseFloat(weight) || 0
    const r = parseInt(reps) || 1
    if (r === 1 || w === 0) return w
    return Math.round(w * (1 + r / 30))
}

// Build exercise lookup map once
const buildExerciseMap = () => {
    const map = {}
    Object.values(EXERCISES).forEach(loc => {
        Object.values(loc).forEach(list => {
            list.forEach(e => { map[e.id] = e })
        })
    })
    return map
}
const exerciseMap = buildExerciseMap()

const MUSCLE_ORDER = ['Peito', 'Costas', 'Pernas', 'Ombros', 'Tríceps', 'Bíceps', 'Abdômen', 'Antebraços']
const muscleColor = {
    'peito': 'var(--brand-primary)', 'costas': '#ff4b4b',
    'pernas': 'var(--brand-secondary)', 'ombros': '#9b5de5',
    'tríceps': '#00bbf9', 'bíceps': '#f15bb5',
    'abdômen': '#ffcc00', 'core': '#ffcc00', 'abs': '#ffcc00', 'antebraços': '#aaa'
}

export default function PersonalBests({ personalBests = {} }) {
    const [filter, setFilter] = useState('all')

    const hasPRs = Object.keys(personalBests).length > 0

    // Enrich with exercise data
    const enriched = Object.entries(personalBests).map(([id, data]) => {
        const ex = exerciseMap[id]
        const weight = parseFloat(data.weight) || 0
        const reps = parseInt(data.reps) || 1
        const estimated1RM = data.estimated1RM || calc1RM(weight, reps)
        return {
            id, weight, reps, estimated1RM,
            date: data.date || null,
            name: ex?.name || 'Exercício',
            muscle: ex?.muscle || '',
        }
    }).sort((a, b) => b.estimated1RM - a.estimated1RM)

    // Unique muscles for filter tabs
    const muscles = [...new Set(enriched.map(e => e.muscle).filter(Boolean))]
        .sort((a, b) => MUSCLE_ORDER.indexOf(a) - MUSCLE_ORDER.indexOf(b))

    const filtered = filter === 'all' ? enriched : enriched.filter(e => e.muscle === filter)

    // Top lifts stats
    const top1RM = enriched[0]?.estimated1RM || 0
    const totalPRs = enriched.length

    return (
        <div className="prs-view animate-tech" style={{ padding: '24px' }}>
            <header style={{ marginBottom: '24px' }}>
                <p className="data-label">SISTEMA DE PERFORMANCE</p>
                <h1 style={{ fontSize: '1.4rem' }}>RECORDES <span className="title-italic">Pessoais</span></h1>
            </header>

            {hasPRs ? (
                <>
                    {/* Summary stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                        {[
                            { label: 'EXERCÍCIOS', value: totalPRs, color: 'var(--brand-primary)' },
                            { label: 'MELHOR 1RM', value: `${top1RM}kg`, color: '#ffcc00' },
                            { label: 'GRUPOS', value: muscles.length, color: 'var(--brand-secondary)' }
                        ].map(item => (
                            <div key={item.label} className="panel-tech" style={{ padding: '12px', textAlign: 'center' }}>
                                <p className="data-label" style={{ fontSize: '0.46rem', marginBottom: '5px' }}>{item.label}</p>
                                <p style={{ fontWeight: 900, fontSize: '1.1rem', color: item.color, lineHeight: 1 }}>{item.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Muscle filter */}
                    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '16px', paddingBottom: '4px' }}>
                        <button
                            onClick={() => setFilter('all')}
                            style={{
                                padding: '6px 12px', borderRadius: '3px', border: 'none', flexShrink: 0,
                                background: filter === 'all' ? 'var(--brand-primary)' : 'var(--bg-card)',
                                color: filter === 'all' ? '#000' : 'var(--text-med)',
                                fontSize: '0.58rem', fontWeight: 900, cursor: 'pointer', letterSpacing: '0.5px'
                            }}>
                            TODOS
                        </button>
                        {muscles.map(m => (
                            <button
                                key={m}
                                onClick={() => setFilter(m)}
                                style={{
                                    padding: '6px 12px', borderRadius: '3px', border: 'none', flexShrink: 0,
                                    background: filter === m ? (muscleColor[m.toLowerCase()] || 'var(--brand-primary)') : 'var(--bg-card)',
                                    color: filter === m ? '#000' : 'var(--text-med)',
                                    fontSize: '0.58rem', fontWeight: 900, cursor: 'pointer', letterSpacing: '0.5px'
                                }}>
                                {m.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* PR List */}
                    <div style={{ display: 'grid', gap: '10px' }}>
                        {filtered.map((item, rank) => {
                            const color = muscleColor[item.muscle.toLowerCase()] || 'var(--brand-primary)'
                            const has1RM = item.reps > 1
                            return (
                                <div key={item.id} className="panel-tech" style={{
                                    padding: '14px 16px',
                                    background: 'var(--bg-elevated)',
                                    borderLeft: `3px solid ${color}`,
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            {rank < 3 && filter === 'all' && (
                                                <span style={{ fontSize: '0.7rem' }}>
                                                    {rank === 0 ? '🥇' : rank === 1 ? '🥈' : '🥉'}
                                                </span>
                                            )}
                                            <p style={{
                                                fontSize: '0.68rem', fontWeight: 900,
                                                color: '#fff', letterSpacing: '0.03em',
                                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                            }}>
                                                {item.name.toUpperCase()}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.52rem', color, fontWeight: 700, opacity: 0.9 }}>
                                                {item.muscle.toUpperCase()}
                                            </span>
                                            {item.date && (
                                                <span style={{ fontSize: '0.48rem', opacity: 0.35 }}>
                                                    {item.date}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px', justifyContent: 'flex-end' }}>
                                            <span style={{ fontSize: '1.7rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{item.weight}</span>
                                            <span style={{ fontSize: '0.6rem', fontWeight: 800, opacity: 0.4 }}>KG</span>
                                            {item.reps > 1 && (
                                                <span style={{ fontSize: '0.62rem', fontWeight: 800, opacity: 0.5, marginLeft: '3px' }}>× {item.reps}</span>
                                            )}
                                        </div>
                                        {has1RM && (
                                            <p style={{ fontSize: '0.5rem', color, fontWeight: 700, opacity: 0.8, marginTop: '3px' }}>
                                                1RM ≈ {item.estimated1RM} KG
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.2 }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏆</div>
                    <p className="data-label">NENHUM RECORDE AINDA</p>
                    <p style={{ fontSize: '0.7rem', marginTop: '8px' }}>COMPLETE UM TREINO PARA REGISTRAR SUAS CARGAS</p>
                </div>
            )}
        </div>
    )
}
