import { useState, useEffect } from 'react'
import Onboarding from './components/Onboarding'
import Dashboard from './components/Dashboard'
import TabNavigation from './components/TabNavigation'
import { EXERCISES } from './data/workoutData'

function App() {
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('home')

  useEffect(() => {
    const savedProfile = localStorage.getItem('aurus-profile')
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile))
    }
    setLoading(false)
  }, [])

  const handleOnboardingComplete = (profile) => {
    localStorage.setItem('aurus-profile', JSON.stringify(profile))
    setUserProfile(profile)
  }

  const handleReset = () => {
    if (window.confirm('EXCLUIR DADOS DE TREINAMENTO? Esta ação é irreversível.')) {
      localStorage.removeItem('aurus-profile')
      setUserProfile(null)
      setActiveTab('home')
    }
  }

  if (loading) return null

  return (
    <div className="mobile-container" style={{ paddingBottom: userProfile ? '100px' : '0' }}>
      {!userProfile ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <>
          {activeTab === 'home' && (
            <Dashboard profile={userProfile} />
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
                <h2 style={{ fontSize: '1rem', marginBottom: '5px' }}>OPERADOR_01</h2>
                <p style={{ color: 'var(--brand-secondary)', fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px' }}>{userProfile.level.toUpperCase()}</p>
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                <div className="panel-tech" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px' }}>
                  <span className="data-label">PROTOCOLO</span>
                  <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>{userProfile.goal.toUpperCase()}</span>
                </div>
                <div className="panel-tech" style={{ display: 'flex', justifyContent: 'space-between', padding: '15px' }}>
                  <span className="data-label">CADÊNCIA</span>
                  <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>{userProfile.freq.toUpperCase()}</span>
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
