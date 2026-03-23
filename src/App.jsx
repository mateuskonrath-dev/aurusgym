import { useState } from 'react'
import Onboarding from '@/components/Onboarding'
import Dashboard from '@/components/Dashboard'
import PersonalBests from '@/components/PersonalBests'
import EliteNutrition from '@/components/EliteNutrition'
import TabNavigation from '@/components/TabNavigation'
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

  const handleOnboardingComplete = (profile) => {
    localStorage.setItem('aurus-profile', JSON.stringify(profile))
    setUserProfile(profile)
  }

  const handleUpdatePBs = (newLogs) => {
    // newLogs is { exerciseId: weight }
    const updatedPBs = { ...personalBests }
    let changed = false

    Object.entries(newLogs).forEach(([id, weight]) => {
      const numericWeight = parseFloat(weight) || 0
      const currentPB = parseFloat(updatedPBs[id]?.weight) || 0

      if (numericWeight > currentPB) {
        updatedPBs[id] = {
          weight: numericWeight,
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

  const handleReset = () => {
    if (window.confirm('EXCLUIR DADOS DE TREINAMENTO? Esta ação é irreversível.')) {
      localStorage.removeItem('aurus-profile')
      localStorage.removeItem('aurus-pbs')
      localStorage.removeItem('aurus-volume')
      setUserProfile(null)
      setPersonalBests({})
      setVolumeHistory({})
      setActiveTab('home')
    }
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

          {activeTab === 'prs' && (
            <PersonalBests personalBests={personalBests} />
          )}

          {activeTab === 'fuel' && (
            <EliteNutrition profile={userProfile} />
          )}

          {activeTab === 'library' && (
            <div className="library-view animate-tech" style={{ padding: '30px' }}>
              <header style={{ marginBottom: '40px' }}>
                <p className="data-label">REGISTRO TÉCNICO</p>
                <h1 style={{ fontSize: '1.4rem' }}>ENCICLOPÉDIA <span className="title-italic">Aurus</span></h1>
              </header>

              <div style={{ display: 'grid', gap: '20px' }}>
                {Object.keys(EXERCISES.gym).map(cat => (
                  <div key={cat} className="panel-tech tech-border-l">
                    <h2 style={{ fontSize: '0.8rem', color: 'var(--brand-primary)', marginBottom: '15px' }}>{cat.toUpperCase()}</h2>
                    <div style={{ display: 'grid', gap: '10px' }}>
                      {EXERCISES.gym[cat].map(ex => (
                        <div key={ex.id} style={{
                          padding: '12px',
                          background: 'var(--bg-elevated)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          letterSpacing: '0.5px'
                        }}>
                          {ex.name.toUpperCase()}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-view animate-tech" style={{ padding: '30px' }}>
              <header style={{ marginBottom: '40px' }}>
                <p className="data-label">SISTEMA ATLETA</p>
                <h1 style={{ fontSize: '1.4rem' }}>CONFIG <span className="title-italic">Elite</span></h1>
              </header>

              <div className="panel-tech" style={{ textAlign: 'center', marginBottom: '30px', background: 'var(--bg-elevated)' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '4px', background: 'var(--brand-primary)', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#000' }}>👤</div>
                <h2 style={{ fontSize: '1rem', marginBottom: '5px' }}>{userProfile.name?.toUpperCase() || 'OPERADOR_01'}</h2>
                <p style={{ color: 'var(--brand-secondary)', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px' }}>{(userProfile.level || 'INICIANTE').toUpperCase()}</p>
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                <div className="panel-tech" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', padding: '15px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p className="data-label" style={{ fontSize: '0.5rem' }}>PESO</p>
                    <p style={{ fontWeight: 800 }}>{userProfile.weight} KG</p>
                  </div>
                  <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
                    <p className="data-label" style={{ fontSize: '0.5rem' }}>ALTURA</p>
                    <p style={{ fontWeight: 800 }}>{userProfile.height} CM</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p className="data-label" style={{ fontSize: '0.5rem' }}>BF%</p>
                    <p style={{ fontWeight: 800 }}>{userProfile.bf || '--'}%</p>
                  </div>
                </div>
                <div className="panel-tech" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px' }}>
                  <span className="data-label">PROTOCOLO</span>
                  <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>{(userProfile.goal || 'HIERTRTROFIA').toUpperCase() || 'MODO TÉCNICO'}</span>
                </div>
                <div className="panel-tech" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px' }}>
                  <span className="data-label">CADÊNCIA</span>
                  <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>{(userProfile.freq || 'PADRÃO').toUpperCase()}</span>
                </div>
                <div className="panel-tech" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px' }}>
                  <span className="data-label">AMBIENTE</span>
                  <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>{userProfile.place === 'gym' ? 'CENTRO TÉCNICO' : 'HOME BASE'}</span>
                </div>
              </div>

              <div style={{ marginTop: '40px', display: 'grid', gap: '12px' }}>
                <button
                  onClick={() => setActiveTab('reconfig')}
                  className="btn-tech"
                  style={{ width: '100%' }}
                >
                  TROCAR OBJETIVO DO TREINO
                </button>

                <button
                  onClick={handleReset}
                  className="btn-outline"
                  style={{ width: '100%', marginTop: '20px', color: 'var(--brand-danger)', borderColor: 'var(--brand-danger)' }}
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
                handleOnboardingComplete(newProfile);
                setActiveTab('profile');
              }}
            />
          )}

          <TabNavigation activeTab={activeTab === 'reconfig' ? 'profile' : activeTab} onTabChange={setActiveTab} />
        </>
      )}
    </div>
  )
}

export default App
