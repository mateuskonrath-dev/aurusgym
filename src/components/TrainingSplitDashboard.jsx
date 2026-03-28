import { useMemo } from 'react'
import { TRAINING_SPLITS, VOLUME_LANDMARKS } from '@/data/trainingSplits'
import { calculateWeeklyVolume, checkVolumeStatus } from '@/utils/splitLogic'

/**
 * TrainingSplitDashboard
 *
 * Shows:
 * - Current split selection and details
 * - Weekly volume tracking per muscle group
 * - MEV/MAV/MRV validation with recommendations
 * - Progress towards volume targets
 *
 * Used in Dashboard to display split configuration and volume insights
 */

const VolumeBar = ({ muscleGroup, volumeValue, landmarks, mavTarget }) => {
  const status = checkVolumeStatus(volumeValue, 'intermediate')

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: '6px'
      }}>
        <span style={{
          fontSize: '0.6rem',
          fontWeight: 800,
          color: 'var(--text-med)',
          letterSpacing: '0.05em'
        }}>
          {muscleGroup.name}
        </span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline' }}>
          <span style={{
            fontWeight: 900,
            fontSize: '0.85rem',
            color: status.color
          }}>
            {Math.round(volumeValue)} sets
          </span>
          <span style={{
            fontSize: '0.5rem',
            opacity: 0.5,
            color: 'var(--text-low)'
          }}>
            meta: {mavTarget}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        height: '6px',
        background: 'var(--bg-pure)',
        borderRadius: '3px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* MEV marker */}
        <div style={{
          position: 'absolute',
          height: '100%',
          width: '2px',
          background: 'var(--warning)',
          left: `${(landmarks.mev / mavTarget) * 100}%`,
          opacity: 0.5
        }} />

        {/* MRV marker */}
        <div style={{
          position: 'absolute',
          height: '100%',
          width: '2px',
          background: 'var(--error)',
          left: `${(landmarks.mrv / mavTarget) * 100}%`,
          opacity: 0.5
        }} />

        {/* Actual volume bar */}
        <div style={{
          width: `${Math.min((volumeValue / mavTarget) * 100, 100)}%`,
          height: '100%',
          background: status.color,
          borderRadius: '3px',
          transition: 'width 0.5s ease'
        }} />
      </div>

      {/* Labels */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '4px',
        fontSize: '0.45rem',
        color: 'var(--text-low)'
      }}>
        <span>MEV {landmarks.mev}</span>
        <span>MAV {landmarks.mav}</span>
        <span>MRV {landmarks.mrv}</span>
      </div>
    </div>
  )
}

export default function TrainingSplitDashboard({ profile, workoutHistory = [] }) {
  const selectedSplitId = profile?.selectedSplit || profile?.freq + 'd' || '2d'
  const level = profile?.level || 'intermediate'
  const split = TRAINING_SPLITS[selectedSplitId] || TRAINING_SPLITS['2d']
  const landmarks = VOLUME_LANDMARKS[level]

  // Calculate current weekly volume from workout history
  const weeklyVolume = useMemo(() => {
    return calculateWeeklyVolume(workoutHistory)
  }, [workoutHistory])

  // Get muscle group definitions
  const muscleGroups = [
    { key: 'chest', name: 'Peito' },
    { key: 'back', name: 'Costas' },
    { key: 'shoulders', name: 'Ombros' },
    { key: 'quadriceps', name: 'Quadríceps' },
    { key: 'glutes', name: 'Glúteo' },
    { key: 'hamstrings', name: 'Isquiotibial' },
    { key: 'biceps', name: 'Bíceps' },
    { key: 'triceps', name: 'Tríceps' },
    { key: 'calves', name: 'Panturrilha' },
    { key: 'core', name: 'Núcleo' }
  ]

  // Calculate overall progress
  const totalVolume = Object.values(weeklyVolume).reduce((a, b) => a + b, 0)
  const avgVolume = muscleGroups.length > 0 ? totalVolume / muscleGroups.length : 0

  const volumeStatus = useMemo(() => {
    return checkVolumeStatus(avgVolume, level)
  }, [avgVolume, level])

  return (
    <div className="split-dashboard animate-tech" style={{ padding: '20px' }}>
      {/* Header */}
      <header style={{ marginBottom: '20px' }}>
        <p className="data-label">SPLIT ATUAL</p>
        <h2 style={{ fontSize: '1.1rem', margin: '4px 0' }}>
          {split.name}
        </h2>
        <p style={{
          fontSize: '0.55rem',
          color: 'var(--text-med)',
          margin: '4px 0 0 0'
        }}>
          {split.days}x por semana • {split.total_weekly_sets} sets/semana
        </p>
      </header>

      {/* Key stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '20px',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div className="panel-tech" style={{
          background: 'var(--bg-elevated)',
          padding: '12px'
        }}>
          <p style={{
            fontSize: '0.5rem',
            fontWeight: 800,
            color: 'var(--text-low)',
            margin: '0 0 4px 0',
            letterSpacing: '0.05em'
          }}>
            FREQUÊNCIA/GRUPO
          </p>
          <p style={{
            fontSize: '0.9rem',
            fontWeight: 900,
            margin: 0,
            color: 'var(--brand-primary)'
          }}>
            {split.frequency_per_muscle_group}x/semana
          </p>
        </div>

        <div className="panel-tech" style={{
          background: 'var(--bg-elevated)',
          padding: '12px'
        }}>
          <p style={{
            fontSize: '0.5rem',
            fontWeight: 800,
            color: 'var(--text-low)',
            margin: '0 0 4px 0',
            letterSpacing: '0.05em'
          }}>
            DURAÇÃO/TREINO
          </p>
          <p style={{
            fontSize: '0.9rem',
            fontWeight: 900,
            margin: 0
          }}>
            {split.session_duration_minutes} min
          </p>
        </div>
      </div>

      {/* Volume tracking section */}
      <div style={{ marginBottom: '20px' }}>
        <p className="data-label" style={{ marginBottom: '12px' }}>
          VOLUME SEMANAL (SETS)
        </p>

        {/* Overall status */}
        <div className="panel-tech" style={{
          background: 'var(--bg-elevated)',
          padding: '12px',
          marginBottom: '16px',
          borderLeft: `3px solid ${volumeStatus.color}`
        }}>
          <p style={{
            fontSize: '0.55rem',
            fontWeight: 800,
            color: 'var(--text-med)',
            margin: '0 0 6px 0',
            letterSpacing: '0.05em'
          }}>
            STATUS GERAL
          </p>
          <p style={{
            fontSize: '0.6rem',
            color: 'var(--text-med)',
            margin: 0,
            lineHeight: '1.4'
          }}>
            {volumeStatus.message}
          </p>
          <p style={{
            fontSize: '0.55rem',
            color: volumeStatus.color,
            margin: '6px 0 0 0',
            fontWeight: 700
          }}>
            {volumeStatus.recommendation}
          </p>
        </div>

        {/* Per-muscle breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {muscleGroups.map((mg) => {
            const volume = weeklyVolume[mg.key] || 0
            const mav = 14  // Default MAV for most muscles

            return (
              <div key={mg.key}>
                <VolumeBar
                  muscleGroup={mg}
                  volumeValue={volume}
                  landmarks={landmarks}
                  mavTarget={mav}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* Split recommendation info */}
      <div style={{
        fontSize: '0.55rem',
        color: 'var(--text-low)',
        background: 'var(--bg-elevated)',
        padding: '12px',
        borderRadius: '6px',
        lineHeight: '1.5'
      }}>
        <p style={{
          fontWeight: 800,
          margin: '0 0 6px 0',
          color: 'var(--text-med)'
        }}>
          Sobre este split
        </p>
        <p style={{ margin: 0 }}>
          {split.description}
        </p>
      </div>
    </div>
  )
}
