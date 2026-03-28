import { useMemo } from 'react'
import { TRAINING_SPLITS, VOLUME_LANDMARKS, getSplitsForLevel } from '@/data/trainingSplits'

/**
 * TrainingSplitSelector
 *
 * Intelligent training split selection component.
 * Displays 1-7 day splits with scientific recommendations based on:
 * - Frequency (1-7 days/week)
 * - Experience level (beginner/intermediate/advanced)
 * - MEV/MAV/MRV volume landmarks
 *
 * Features:
 * - Radio buttons for frequency selection
 * - Visual indicator of recommended splits
 * - Shows split details: sets, duration, pattern
 * - Muscle group distribution breakdown
 * - Scientific explanation and warnings
 */

const SplitCard = ({ split, isSelected, isRecommended, level, onClick }) => {
  const landmarks = VOLUME_LANDMARKS[level]
  const volumeStatus = split.total_weekly_sets >= landmarks.mav ? 'optimal' : 'warning'

  return (
    <div
      onClick={onClick}
      style={{
        cursor: 'pointer',
        padding: '16px',
        border: isSelected ? '2px solid var(--brand-primary)' : '2px solid var(--border-subtle)',
        borderRadius: '8px',
        background: isSelected ? 'var(--bg-elevated)' : 'var(--bg-pure)',
        transition: 'all 0.3s ease',
        marginBottom: '12px',
        position: 'relative'
      }}
    >
      {/* Recommended badge */}
      {isRecommended && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          right: '12px',
          background: 'var(--success)',
          color: 'white',
          padding: '3px 8px',
          fontSize: '0.5rem',
          borderRadius: '3px',
          fontWeight: 800,
          letterSpacing: '0.05em'
        }}>
          RECOMENDADO
        </div>
      )}

      {/* Header: name + frequency */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <input
          type="radio"
          name="split-frequency"
          value={split.id}
          checked={isSelected}
          onChange={() => {}}
          style={{ cursor: 'pointer' }}
        />
        <div style={{ flex: 1 }}>
          <p style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            color: 'var(--text-med)',
            letterSpacing: '0.05em',
            margin: 0
          }}>
            {split.days}x POR SEMANA
          </p>
          <h3 style={{ fontSize: '1rem', margin: '2px 0 0 0', color: 'var(--text-high)' }}>
            {split.name}
          </h3>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginTop: '10px',
        paddingTop: '10px',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div>
          <p style={{ fontSize: '0.5rem', color: 'var(--text-low)', margin: 0, fontWeight: 600 }}>VOLUME SEMANAL</p>
          <p style={{ fontSize: '0.85rem', fontWeight: 900, margin: 0, color: volumeStatus === 'optimal' ? 'var(--success)' : 'var(--warning)' }}>
            {split.total_weekly_sets} sets
          </p>
        </div>
        <div>
          <p style={{ fontSize: '0.5rem', color: 'var(--text-low)', margin: 0, fontWeight: 600 }}>DURAÇÃO / TREINO</p>
          <p style={{ fontSize: '0.85rem', fontWeight: 900, margin: 0 }}>
            {split.session_duration_minutes} min
          </p>
        </div>
      </div>

      {/* Pattern visualization */}
      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
        <p style={{ fontSize: '0.5rem', color: 'var(--text-low)', margin: '0 0 6px 0', fontWeight: 600 }}>PADRÃO DA SEMANA</p>
        <div style={{
          display: 'flex',
          gap: '4px',
          fontSize: '0.5rem',
          fontWeight: 700
        }}>
          {split.pattern.split(' ').map((day, i) => (
            <span
              key={i}
              style={{
                padding: '4px 6px',
                borderRadius: '3px',
                background: day === 'Rest' ? 'var(--bg-pure)' : 'var(--brand-primary)',
                color: day === 'Rest' ? 'var(--text-med)' : 'white',
                border: day === 'Rest' ? '1px solid var(--border-subtle)' : 'none'
              }}
            >
              {day.substring(0, 1)}
            </span>
          ))}
        </div>
      </div>

      {/* Pros/Cons on expand */}
      {isSelected && (
        <div style={{
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-subtle)',
          animation: 'slideDown 0.3s ease'
        }}>
          <div style={{ marginBottom: '10px' }}>
            <p style={{ fontSize: '0.5rem', color: 'var(--success)', fontWeight: 800, margin: '0 0 4px 0' }}>VANTAGENS</p>
            {split.pros.map((pro, i) => (
              <p key={i} style={{ fontSize: '0.55rem', color: 'var(--text-med)', margin: '2px 0', lineHeight: '1.3' }}>
                • {pro}
              </p>
            ))}
          </div>
          <div>
            <p style={{ fontSize: '0.5rem', color: 'var(--warning)', fontWeight: 800, margin: '0 0 4px 0' }}>LIMITAÇÕES</p>
            {split.cons.map((con, i) => (
              <p key={i} style={{ fontSize: '0.55rem', color: 'var(--text-med)', margin: '2px 0', lineHeight: '1.3' }}>
                • {con}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Muscle group distribution chart
 */
const MuscleDistribution = ({ distribution }) => {
  const total = Object.values(distribution).reduce((a, b) => a + b, 0)
  const groups = [
    { key: 'chest', label: 'Peito', color: '#FF6B6B' },
    { key: 'back', label: 'Costas', color: '#4ECDC4' },
    { key: 'shoulders', label: 'Ombros', color: '#95E1D3' },
    { key: 'arms', label: 'Braços', color: '#F38181' },
    { key: 'legs', label: 'Pernas', color: '#AA96DA' },
    { key: 'core', label: 'Núcleo', color: '#FCBAD3' }
  ]

  return (
    <div>
      <p style={{ fontSize: '0.5rem', color: 'var(--text-low)', margin: '0 0 8px 0', fontWeight: 600 }}>
        DISTRIBUIÇÃO SEMANAL DE VOLUME (SETS)
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {groups.map(group => {
          const value = distribution[group.key] || 0
          const pct = Math.round((value / total) * 100)
          return (
            <div key={group.key} style={{ fontSize: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-med)' }}>{group.label}</span>
                <span style={{ fontWeight: 800, color: group.color }}>{value} sets ({pct}%)</span>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-pure)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                  width: `${pct}%`,
                  height: '100%',
                  background: group.color,
                  borderRadius: '2px',
                  transition: 'width 0.5s ease'
                }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function TrainingSplitSelector({ profile, selectedSplit, onSelectSplit }) {
  const level = profile?.level || 'beginner'

  const allSplits = useMemo(() => {
    return Object.values(TRAINING_SPLITS)
  }, [])

  const recommendedSplits = useMemo(() => {
    const recs = getSplitsForLevel(level)
    return recs.map(s => s.id)
  }, [level])

  const currentSplit = useMemo(() => {
    return selectedSplit ? TRAINING_SPLITS[selectedSplit] : TRAINING_SPLITS['2d']
  }, [selectedSplit])

  const landmarks = useMemo(() => {
    return VOLUME_LANDMARKS[level]
  }, [level])

  return (
    <div className="split-selector animate-tech" style={{ padding: '24px' }}>
      {/* Header */}
      <header style={{ marginBottom: '24px' }}>
        <p className="data-label">SELEÇÃO DE DIVISÃO</p>
        <h1 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>
          Treino <span className="title-italic">por Frequência</span>
        </h1>
        <p style={{ fontSize: '0.6rem', color: 'var(--text-med)', margin: 0 }}>
          Escolha quantos dias por semana você pode treinar
        </p>
      </header>

      {/* Recommendations text */}
      <div className="panel-tech" style={{
        background: 'var(--bg-elevated)',
        padding: '16px',
        marginBottom: '20px',
        borderLeft: '3px solid var(--brand-primary)'
      }}>
        <p style={{ fontSize: '0.55rem', fontWeight: 800, color: 'var(--brand-primary)', margin: '0 0 4px 0' }}>
          RECOMENDADO PARA {level.toUpperCase()}
        </p>
        <p style={{ fontSize: '0.6rem', color: 'var(--text-med)', margin: 0, lineHeight: '1.4' }}>
          Com sua experiência ({level}), as frequências <strong>{recommendedSplits.join(', ')}</strong> oferecem
          o melhor balanço entre volume ({landmarks.mav} sets/grupo) e recuperação.
        </p>
      </div>

      {/* Split selection */}
      <div style={{ marginBottom: '24px' }}>
        {allSplits.map(split => (
          <SplitCard
            key={split.id}
            split={split}
            isSelected={selectedSplit === split.id}
            isRecommended={recommendedSplits.includes(split.id)}
            level={level}
            onClick={() => onSelectSplit(split.id)}
          />
        ))}
      </div>

      {/* Details panel for selected split */}
      {currentSplit && (
        <div className="panel-tech" style={{ padding: '20px', marginBottom: '20px' }}>
          {/* Title */}
          <div style={{ marginBottom: '16px' }}>
            <p className="data-label">{currentSplit.name}</p>
            <h2 style={{ fontSize: '1.1rem', margin: '4px 0 0 0' }}>
              {currentSplit.days} Dias por Semana
            </h2>
          </div>

          {/* Description */}
          <p style={{
            fontSize: '0.6rem',
            color: 'var(--text-med)',
            marginBottom: '16px',
            lineHeight: '1.5',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '16px'
          }}>
            {currentSplit.description}
          </p>

          {/* Stats grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '16px',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--border-subtle)'
          }}>
            <div>
              <p style={{ fontSize: '0.5rem', color: 'var(--text-low)', margin: 0, fontWeight: 600 }}>FREQUÊNCIA POR GRUPO</p>
              <p style={{ fontSize: '0.95rem', fontWeight: 900, margin: '2px 0 0 0' }}>
                {currentSplit.frequency_per_muscle_group}x/semana
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.5rem', color: 'var(--text-low)', margin: 0, fontWeight: 600 }}>VOLUME TOTAL SEMANAL</p>
              <p style={{ fontSize: '0.95rem', fontWeight: 900, margin: '2px 0 0 0' }}>
                {currentSplit.total_weekly_sets} sets
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.5rem', color: 'var(--text-low)', margin: 0, fontWeight: 600 }}>IDEAL PARA</p>
              <p style={{ fontSize: '0.6rem', fontWeight: 700, margin: '2px 0 0 0' }}>
                {currentSplit.ideal_for[0]}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.5rem', color: 'var(--text-low)', margin: 0, fontWeight: 600 }}>NÍVEL</p>
              <p style={{ fontSize: '0.6rem', fontWeight: 700, margin: '2px 0 0 0', color: 'var(--brand-primary)' }}>
                {currentSplit.level.replace(/_/g, ' ').toUpperCase()}
              </p>
            </div>
          </div>

          {/* Muscle distribution */}
          <MuscleDistribution distribution={currentSplit.muscle_group_distribution} />

          {/* Recommendation */}
          <div style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-pure)',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '0.55rem',
            color: 'var(--text-med)',
            lineHeight: '1.5'
          }}>
            <p style={{ fontWeight: 800, color: 'var(--brand-primary)', margin: '0 0 6px 0' }}>
              {recommendedSplits.includes(currentSplit.id) ? '✓ RECOMENDADO' : '⚠ NÃO RECOMENDADO'}
            </p>
            <p style={{ margin: 0 }}>{currentSplit.recommendation}</p>
          </div>
        </div>
      )}

      {/* Scientific note */}
      <div style={{
        fontSize: '0.55rem',
        color: 'var(--text-low)',
        background: 'var(--bg-elevated)',
        padding: '12px',
        borderRadius: '6px',
        lineHeight: '1.5'
      }}>
        <p style={{ fontWeight: 800, margin: '0 0 4px 0', color: 'var(--text-med)' }}>Baseline Científico</p>
        <p style={{ margin: 0 }}>
          Dados baseados em meta-análises 2024-2026 e estudos revisados por pares.
          Frequência 2x/semana produz +32% ganhos vs 1x/semana quando volume é igualado.
          O volume ({landmarks.mav} sets/grupo) é mais importante que a frequência para hipertrofia.
        </p>
      </div>
    </div>
  )
}
