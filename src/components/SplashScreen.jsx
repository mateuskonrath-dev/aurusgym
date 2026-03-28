import { useState } from 'react'

export default function SplashScreen({ onStart }) {
    const [fadeOut, setFadeOut] = useState(false)

    const handleStart = () => {
        setFadeOut(true)
        setTimeout(onStart, 500)
    }

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: '#080808',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, overflow: 'hidden',
            opacity: fadeOut ? 0 : 1,
            transition: 'opacity 0.5s ease'
        }}>
            {/* Geometric background */}
            <svg
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                viewBox="0 0 480 900"
                preserveAspectRatio="xMidYMid slice"
            >
                <defs>
                    <radialGradient id="splashGlow" cx="50%" cy="44%" r="45%">
                        <stop offset="0%" stopColor="#00f5d4" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#080808" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="hLine" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00f5d4" stopOpacity="0" />
                        <stop offset="50%" stopColor="#00f5d4" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#00f5d4" stopOpacity="0" />
                    </linearGradient>
                </defs>

                <rect width="480" height="900" fill="url(#splashGlow)" />

                {/* Radial lines from center */}
                {Array.from({ length: 24 }, (_, i) => {
                    const angle = (i * 15 - 90) * Math.PI / 180
                    const cx = 240, cy = 390
                    return (
                        <line key={i}
                            x1={cx + Math.cos(angle) * 95} y1={cy + Math.sin(angle) * 95}
                            x2={cx + Math.cos(angle) * 500} y2={cy + Math.sin(angle) * 500}
                            stroke="#00f5d4" strokeWidth="0.4" opacity="0.12"
                        />
                    )
                })}

                {/* Concentric circles */}
                {[75, 130, 190, 260, 340].map((r, i) => (
                    <circle key={i} cx="240" cy="390" r={r}
                        fill="none" stroke="#00f5d4"
                        strokeWidth={i === 0 ? 0.8 : 0.3}
                        opacity={i === 0 ? 0.35 : 0.08}
                    />
                ))}

                {/* Horizontal scan lines */}
                {Array.from({ length: 9 }, (_, i) => (
                    <line key={i} x1="0" y1={80 + i * 90} x2="480" y2={80 + i * 90}
                        stroke="url(#hLine)" strokeWidth="0.5" />
                ))}

                {/* Corner brackets */}
                <path d="M0,0 L44,0 L44,2 L2,2 L2,44 L0,44 Z" fill="#00f5d4" opacity="0.3" />
                <path d="M480,0 L436,0 L436,2 L478,2 L478,44 L480,44 Z" fill="#00f5d4" opacity="0.3" />
                <path d="M0,900 L44,900 L44,898 L2,898 L2,856 L0,856 Z" fill="#00f5d4" opacity="0.3" />
                <path d="M480,900 L436,900 L436,898 L478,898 L478,856 L480,856 Z" fill="#00f5d4" opacity="0.3" />

                {/* Data points scattered */}
                {[[70, 190], [410, 140], [55, 580], [425, 670], [185, 72], [300, 780], [145, 690], [355, 110], [420, 440], [60, 350]].map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="1.5" fill="#00f5d4" opacity="0.18" />
                ))}

                {/* Diamond shape behind logo */}
                <path d="M240,280 L295,390 L240,500 L185,390 Z"
                    fill="none" stroke="#00f5d4" strokeWidth="0.8" opacity="0.15" />

                {/* Bottom bar */}
                <rect x="0" y="860" width="480" height="40" fill="rgba(0,245,212,0.03)" />
                <line x1="0" y1="860" x2="480" y2="860" stroke="#00f5d4" strokeWidth="0.4" opacity="0.2" />
            </svg>

            {/* Main content */}
            <div style={{ position: 'relative', textAlign: 'center', padding: '0 48px', width: '100%', maxWidth: '480px' }}>

                {/* Logo circle */}
                <div style={{
                    width: 108, height: 108, borderRadius: '50%',
                    border: '1px solid rgba(0,245,212,0.35)',
                    boxShadow: '0 0 50px rgba(0,245,212,0.08), inset 0 0 30px rgba(0,245,212,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 36px',
                    background: 'rgba(0,245,212,0.03)'
                }}>
                    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                        {/* Triangle / A shape */}
                        <polygon points="26,4 49,44 3,44"
                            stroke="#00f5d4" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
                        {/* Crossbar */}
                        <line x1="11.5" y1="32" x2="40.5" y2="32"
                            stroke="#00f5d4" strokeWidth="1.5" />
                        {/* Center dot */}
                        <circle cx="26" cy="18" r="2.5" fill="#00f5d4" />
                        {/* Vertical inner line */}
                        <line x1="26" y1="20.5" x2="26" y2="32"
                            stroke="#00f5d4" strokeWidth="0.8" opacity="0.5" />
                        {/* Small dots at base corners */}
                        <circle cx="11.5" cy="32" r="1.5" fill="#00f5d4" opacity="0.6" />
                        <circle cx="40.5" cy="32" r="1.5" fill="#00f5d4" opacity="0.6" />
                    </svg>
                </div>

                {/* Brand name */}
                <h1 style={{
                    fontSize: '3.8rem', fontWeight: 900,
                    letterSpacing: '0.38em',
                    background: 'linear-gradient(135deg, #00f5d4 0%, #00bbfa 60%, #00f5d4 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '10px', lineHeight: 1,
                    textShadow: 'none'
                }}>AURUS</h1>

                {/* Divider with tagline */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', marginBottom: '68px' }}>
                    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,245,212,0.3))' }} />
                    <p style={{ fontSize: '0.52rem', color: 'rgba(0,245,212,0.65)', letterSpacing: '0.35em', fontWeight: 800, whiteSpace: 'nowrap' }}>
                        PROTOCOLO DE TREINAMENTO ELITE
                    </p>
                    <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(0,245,212,0.3), transparent)' }} />
                </div>

                {/* CTA button */}
                <button
                    onClick={handleStart}
                    className="splash-btn"
                    style={{
                        background: 'transparent',
                        border: '1px solid rgba(0,245,212,0.55)',
                        color: '#00f5d4',
                        padding: '17px 0',
                        fontSize: '0.78rem', fontWeight: 900,
                        letterSpacing: '0.28em', cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        width: '100%', maxWidth: '300px',
                        display: 'block', margin: '0 auto',
                        borderRadius: '2px'
                    }}
                >
                    INICIAR PROTOCOLO
                </button>

            </div>
        </div>
    )
}
