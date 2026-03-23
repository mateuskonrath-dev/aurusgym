import React from 'react';

export default function ProgressStats({ donutSegments, colors, volumeHistory }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
            <div className="panel-tech" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                    <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                        <circle cx="18" cy="18" r="16" fill="transparent" stroke="var(--bg-pure)" strokeWidth="4" />
                        {donutSegments.map(segment => (
                            <circle key={segment.label} cx="18" cy="18" r="16" fill="transparent" stroke={colors[segment.label]} strokeWidth="4"
                                strokeDasharray={`${segment.pct} 100`} strokeDashoffset={`-${segment.offset}`} />
                        ))}
                    </svg>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.6rem', fontWeight: 900 }}>LOAD</div>
                </div>
                <div style={{ flex: 1 }}>
                    <p className="data-label" style={{ marginBottom: '8px' }}>Volume Semanal</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                        {donutSegments.map(seg => (
                            <p key={seg.label} style={{ fontSize: '0.65rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                <span style={{ color: colors[seg.label] }}>●</span> {seg.label.toUpperCase()}: {Math.round(seg.pct)}%
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            <div className="panel-tech animate-tech" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '15px', borderLeft: '3px solid var(--brand-primary)' }}>
                <p className="data-label">TOTAL TONNAGE (ULT. SESSÃO)</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '5px' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff' }}>
                        {(() => {
                            const vals = Object.values(volumeHistory || {})
                            if (vals.length === 0) return '0'
                            const last = vals[vals.length - 1]
                            return isNaN(last) ? '0' : last.toLocaleString()
                        })()}
                    </span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.5 }}>KG</span>
                </div>
                <p style={{ fontSize: '0.55rem', opacity: 0.4, marginTop: '8px' }}>ANALÍTICA DE VOLUME DE CARGA ATIVA</p>
            </div>
        </div>
    );
}
