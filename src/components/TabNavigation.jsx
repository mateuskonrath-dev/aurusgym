export default function TabNavigation({ activeTab, onTabChange }) {
    const tabs = [
        { id: 'home', icon: '📊', label: 'Treino' },
        { id: 'progress', icon: '📈', label: 'Análise' },
        { id: 'prs', icon: '🏆', label: 'Recordes' },
        { id: 'fuel', icon: '🥗', label: 'Nutrição' },
        { id: 'library', icon: '📖', label: 'Exercícios' },
        { id: 'profile', icon: '⚙️', label: 'Atleta' }
    ]

    return (
        <nav className="tab-bar-v3">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    style={{
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        color: activeTab === tab.id ? 'var(--brand-primary)' : 'var(--text-low)',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        padding: '8px 12px',
                        borderBottom: activeTab === tab.id ? '2px solid var(--brand-primary)' : '2px solid transparent'
                    }}
                >
                    <span style={{ fontSize: '1.2rem', filter: activeTab === tab.id ? 'none' : 'grayscale(1) opacity(0.5)' }}>{tab.icon}</span>
                    <span style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.05em' }}>{tab.label.toUpperCase()}</span>
                </button>
            ))}
        </nav>
    )
}
