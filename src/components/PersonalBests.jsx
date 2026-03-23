import { EXERCISES } from '@/data/workoutData'

export default function PersonalBests({ personalBests = {} }) {
    const hasPRs = Object.keys(personalBests).length > 0

    return (
        <div className="prs-view animate-tech" style={{ padding: '30px' }}>
            <header style={{ marginBottom: '40px' }}>
                <p className="data-label">SISTEMA DE PERFORMANCE</p>
                <h1 style={{ fontSize: '1.4rem' }}>RECORDES <span className="title-italic">Pessoais</span></h1>
            </header>

            {hasPRs ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {Object.entries(personalBests).map(([id, data]) => {
                        // Find exercise name from EXERCISES data
                        let exName = 'CARGA REGISTRADA'
                        Object.values(EXERCISES).forEach(loc => {
                            Object.values(loc).forEach(list => {
                                const found = list.find(e => e.id === id)
                                if (found) exName = found.name
                            })
                        })

                        return (
                            <div key={id} className="panel-tech" style={{ padding: '16px', background: 'var(--bg-elevated)', borderLeft: '3px solid var(--brand-primary)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <p style={{ fontSize: '0.65rem', fontWeight: 900, color: 'var(--brand-primary)', letterSpacing: '0.05em', marginBottom: '4px' }}>{exName.toUpperCase()}</p>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                        <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{data.weight}</span>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.5 }}>KG</span>
                                    </div>
                                    <p style={{ fontSize: '0.55rem', opacity: 0.3, marginTop: '8px' }}>MARCA EM: {data.date}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.2 }}>
                    <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚪</div>
                    <p className="data-label">NENHUM RECORDE ENCONTRADO</p>
                    <p style={{ fontSize: '0.7rem' }}>COMPLETE UM TREINO PARA REGISTRAR CARGAS</p>
                </div>
            )}
        </div>
    )
}
