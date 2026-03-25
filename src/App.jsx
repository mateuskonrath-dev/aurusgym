import { useState } from 'react'
import Onboarding from '@/components/Onboarding'
import Dashboard from '@/components/Dashboard'
import PersonalBests from '@/components/PersonalBests'
import EliteNutrition from '@/components/EliteNutrition'
import TabNavigation from '@/components/TabNavigation'
import ExerciseDetail from '@/components/ExerciseDetail'
import ProgressDashboard from '@/components/ProgressDashboard'
import { EXERCISES } from '@/data/workoutData'

function App() {
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('aurus-profile')
    return saved ? JSON.parse(saved) : null
  })
  const [personalBests, setPersonalBests] = useState(() => {
    const saved = localStorage.getItem('aurus-pbs')
    return saved ? JSON.parse(saved) : {}
  })
  const [volumeHistory, setVolumeHistory] = useState(() => {
    const saved = localStorage.getItem('aurus-volume')
    return saved ? JSON.parse(saved) : {}
  })
  const [activeTab, setActiveTab] = useState('home')
  const [libraryExercise, setLibraryExercise] = useState(null)

  const handleOnboardingComplete = (profile) => {
    localStorage.setItem('aurus-profile', JSON.stringify(profile))
    setUserProfile(profile)
  }

  const handleUpdatePBs = (newLogs) => {
    // newLogs: { exerciseId: { weight, reps, estimated1RM } } (new) or { exerciseId: number } (legacy)
    const updatedPBs = { ...personalBests }
    let changed = false

    Object.entries(newLogs).forEach(([id, data]) => {
      const isObject = typeof data === 'object' && data !== null
      const newWeight = isObject ? (parseFloat(data.weight) || 0) : (parseFloat(data) || 0)
      const newReps = isObject ? (parseInt(data.reps) || 1) : 1
      const new1RM = isObject ? (data.estimated1RM || newWeight) : newWeight

      const current = updatedPBs[id]
      const current1RM = current?.estimated1RM || (current ? parseFloat(current.weight) || 0 : 0)

      if (new1RM > current1RM) {
        updatedPBs[id] = {
          weight: newWeight,
          reps: newReps,
          estimated1RM: new1RM,
          date: new Date().toLocaleDateString('pt-BR')
        }
        changed = true
      }
    })

    if (changed) {
      setPersonalBests(updatedPBs)
      localStorage.setItem('aurus-pbs', JSON.stringify(updatedPBs))
    }
  }

  const handleExportData = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile: JSON.parse(localStorage.getItem('aurus-profile') || 'null'),
      pbs: JSON.parse(localStorage.getItem('aurus-pbs') || '{}'),
      volume: JSON.parse(localStorage.getItem('aurus-volume') || '{}'),
      completedDays: JSON.parse(localStorage.getItem('aurus-completed-days') || 'null'),
      lastSession: JSON.parse(localStorage.getItem('aurus-last-session') || '{}'),
      history: JSON.parse(localStorage.getItem('aurus-history') || '[]'),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `aurus-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (!data.version) throw new Error('invalid')
        if (data.profile) { localStorage.setItem('aurus-profile', JSON.stringify(data.profile)); setUserProfile(data.profile) }
        if (data.pbs) { localStorage.setItem('aurus-pbs', JSON.stringify(data.pbs)); setPersonalBests(data.pbs) }
        if (data.volume) { localStorage.setItem('aurus-volume', JSON.stringify(data.volume)); setVolumeHistory(data.volume) }
        if (data.completedDays) localStorage.setItem('aurus-completed-days', JSON.stringify(data.completedDays))
        if (data.lastSession) localStorage.setItem('aurus-last-session', JSON.stringify(data.lastSession))
        if (data.history) localStorage.setItem('aurus-history', JSON.stringify(data.history))
        alert('✓ Dados restaurados com sucesso!')
      } catch (e) {
        alert('Arquivo inválido. Use apenas backups gerados pelo Aurus Gym.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleReset = () => {
    if (window.confirm('EXCLUIR TODOS OS DADOS DE TREINAMENTO? Esta ação é irreversível.')) {
      localStorage.removeItem('aurus-profile')
      localStorage.removeItem('aurus-pbs')
      localStorage.removeItem('aurus-volume')
      localStorage.removeItem('aurus-completed-days')
      localStorage.removeItem('aurus-last-session')
      localStorage.removeItem('aurus-history')
      setUserProfile(null)
      setPersonalBests({})
      setVolumeHistory({})
      setActiveTab('home')
    }
  }

  // Group exercises for library
  const librarySections = userProfile
    ? Object.entries(EXERCISES[userProfile.place === 'calisthenics' ? 'calisthenics' : userProfile.place === 'home' ? 'home' : 'gym'])
    : Object.entries(EXERCISES.gym)

  const categoryLabels = {
    chest: 'Peito', back: 'Costas', shoulders: 'Ombros',
    legs: 'Pernas', triceps: 'Tríceps', biceps: 'Bíceps',
    core: 'Abdômen', forearms: 'Antebraços'
  }

  return (
    <div className="mobile-container" style={{ paddingBottom: userProfile ? '100px' : '0' }}>
      {!userProfile ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <>
          {activeTab === 'home' && (
            <Dashboard
              profile={userProfile}
              personalBests={personalBests}
              volumeHistory={volumeHistory}
              onUpdatePBs={handleUpdatePBs}
              onUpdateVolume={(date, tonnage) => {
                const newHistory = { ...volumeHistory, [date]: tonnage }
                setVolumeHistory(newHistory)
                localStorage.setItem('aurus-volume', JSON.stringify(newHistory))
              }}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressDashboard
              profile={userProfile}
              personalBests={personalBests}
              volumeHistory={volumeHistory}
            />
          )}

          {activeTab === 'prs' && (
            <PersonalBests personalBests={personalBests} />
          )}

          {activeTab === 'fuel' && (
            <EliteNutrition profile={userProfile} />
          )}

          {activeTab === 'library' && (
            <div className="library-view animate-tech" style={{ padding: '30px' }}>
              <header style={{ marginBottom: '32px' }}>
                <p className="data-label">REGISTRO TÉCNICO</p>
                <h1 style={{ fontSize: '1.4rem' }}>ENCICLOPÉDIA <span className="title-italic">Aurus</span></h1>
                <p style={{ fontSize: '0.62rem', color: 'var(--text-med)', marginTop: '6px' }}>
                  Toque em qualquer exercício para ver detalhes
                </p>
              </header>

              <div style={{ display: 'grid', gap: '20px' }}>
                {librarySections.map(([cat, exercises]) => (
                  <div key={cat} className="panel-tech tech-border-l">
                    <h2 style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', marginBottom: '14px', letterSpacing: '1px' }}>
                      {(categoryLabels[cat] || cat).toUpperCase()}
                    </h2>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {exercises.map(ex => (
                        <div
                          key={ex.id}
                          onClick={() => setLibraryExercise(ex)}
                          style={{
                            padding: '12px 14px',
                            background: 'var(--bg-elevated)',
                            borderRadius: 'var(--radius-pro)',
                            cursor: 'pointer',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            transition: 'background 0.2s',
                            border: '1px solid transparent'
                          }}
                        >
                          <div>
                            <p style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.5px' }}>
                              {ex.name.toUpperCase()}
                            </p>
                            <p style={{ fontSize: '0.55rem', color: 'var(--text-low)', marginTop: '2px' }}>
                              {ex.sets}×{ex.reps} • TIER {ex.tier}
                            </p>
                          </div>
                          <span style={{ color: 'var(--brand-primary)', fontSize: '0.9rem', opacity: 0.6 }}>ⓘ</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {libraryExercise && (
                <ExerciseDetail exercise={libraryExercise} onClose={() => setLibraryExercise(null)} />
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-view animate-tech" style={{ padding: '30px' }}>
              <header style={{ marginBottom: '40px' }}>
                <p className="data-label">SISTEMA ATLETA</p>
                <h1 style={{ fontSize: '1.4rem' }}>CONFIG <span className="title-italic">Elite</span></h1>
              </header>

              <div className="panel-tech" style={{ textAlign: 'center', marginBottom: '30px', background: 'var(--bg-elevated)' }}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '4px',
                  background: 'var(--brand-primary)', margin: '0 auto 15px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', color: '#000'
                }}>
                  👤
                </div>
                <h2 style={{ fontSize: '1rem', marginBottom: '5px' }}>{userProfile.name?.toUpperCase() || 'OPERADOR_01'}</h2>
                <p style={{ color: 'var(--brand-secondary)', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px' }}>
                  {(userProfile.level || 'INICIANTE').toUpperCase()}
                </p>
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                <div className="panel-tech" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', padding: '15px' }}>
                  {[
                    { label: 'PESO', value: `${userProfile.weight} KG` },
                    { label: 'ALTURA', value: `${userProfile.height} CM` },
                    { label: 'BF%', value: `${userProfile.bf || '--'}%` }
                  ].map((item, i) => (
                    <div key={item.label} style={{
                      textAlign: 'center',
                      borderLeft: i > 0 ? '1px solid var(--border-subtle)' : 'none'
                    }}>
                      <p className="data-label" style={{ fontSize: '0.5rem' }}>{item.label}</p>
                      <p style={{ fontWeight: 800 }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {[
                  { label: 'PROTOCOLO', value: (userProfile.goal || 'HIPERTROFIA').toUpperCase() },
                  { label: 'CADÊNCIA', value: (userProfile.freq || 'PADRÃO').toUpperCase() },
                  { label: 'AMBIENTE', value: userProfile.place === 'gym' ? 'CENTRO TÉCNICO' : userProfile.place === 'calisthenics' ? 'AO AR LIVRE' : 'HOME BASE' }
                ].map(item => (
                  <div key={item.label} className="panel-tech" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px' }}>
                    <span className="data-label">{item.label}</span>
                    <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '40px', display: 'grid', gap: '12px' }}>
                <button
                  onClick={() => setActiveTab('reconfig')}
                  className="btn-tech"
                  style={{ width: '100%' }}
                >
                  TROCAR OBJETIVO DO TREINO
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    onClick={handleExportData}
                    className="btn-outline"
                    style={{ padding: '14px', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.5px', color: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' }}
                  >
                    ↓ EXPORTAR
                  </button>
                  <label style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '14px', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '0.5px',
                    color: 'var(--brand-secondary)', border: '1px solid var(--brand-secondary)',
                    cursor: 'pointer', background: 'transparent'
                  }}>
                    ↑ IMPORTAR
                    <input type="file" accept=".json" onChange={handleImportData} style={{ display: 'none' }} />
                  </label>
                </div>
                <p style={{ fontSize: '0.52rem', color: 'var(--text-low)', textAlign: 'center' }}>
                  Exporte para fazer backup dos seus dados de treino
                </p>

                <button
                  onClick={handleReset}
                  className="btn-outline"
                  style={{ width: '100%', marginTop: '8px', color: 'var(--brand-danger)', borderColor: 'var(--brand-danger)' }}
                >
                  FORMATAR TODOS OS DADOS
                </button>
              </div>
            </div>
          )}

          {activeTab === 'reconfig' && (
            <Onboarding
              mode="reconfig"
              initialAnswers={userProfile}
              onComplete={(newProfile) => {
                handleOnboardingComplete(newProfile)
                setActiveTab('profile')
              }}
            />
          )}

          <TabNavigation
            activeTab={activeTab === 'reconfig' ? 'profile' : activeTab}
            onTabChange={setActiveTab}
          />
        </>
      )}
    </div>
  )
}

export default App
