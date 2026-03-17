import React from 'react';
import Model from 'react-body-highlighter';

export default function MuscleMap({ target, specifics = [] }) {
    const getMuscles = () => {
        const parts = new Set();
        const specs = specifics.map(s => s.toLowerCase());

        // Melhoria para Pernas (Mais granular)
        if (target === 'Pernas') {
            if (specs.some(s => s.includes('quadríceps') || s.includes('frente'))) parts.add('quadriceps');
            if (specs.some(s => s.includes('isquiotibiais') || s.includes('posterior') || s.includes('stiff'))) parts.add('hamstring');
            if (specs.some(s => s.includes('glúteo'))) parts.add('gluteal');
            if (specs.some(s => s.includes('panturrilha'))) parts.add('calves');
            if (parts.size > 0) return Array.from(parts);
            return ['quadriceps', 'hamstring', 'calves', 'gluteal']; // Fallback
        }

        if (target === 'Costas') {
            if (specs.some(s => s.includes('larga') || s.includes('superior') || s.includes('dorso'))) parts.add('upper-back');
            if (specs.some(s => s.includes('inferior') || s.includes('lombar') || s.includes('ereto'))) parts.add('lower-back');
            if (specs.some(s => s.includes('miolo') || s.includes('romboides') || s.includes('trapézio'))) {
                parts.add('upper-back');
                parts.add('trapezius');
            }
            if (parts.size > 0) return Array.from(parts);
            return ['upper-back', 'lower-back', 'trapezius'];
        }

        switch (target) {
            case 'Peito': return ['chest'];
            case 'Ombros': return ['front-deltoids', 'back-deltoids'];
            case 'Tríceps': return ['triceps'];
            case 'Bíceps': return ['biceps'];
            case 'Abs':
            case 'Core': return ['abs', 'obliques'];
            default: return [];
        }
    };

    const type = (target === 'Costas' || target === 'Glúteos' || target === 'Tríceps' || target === 'Posterior de Ombro' || target === 'Panturrilha')
        ? 'posterior'
        : 'anterior';

    const data = [
        {
            name: 'Ativação Atual',
            muscles: getMuscles(),
        }
    ];

    return (
        <div style={{ width: '100%', maxWidth: '240px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ pointerEvents: 'none' }}>
                <Model
                    data={data}
                    style={{ width: '100%' }}
                    highlightedColors={['var(--brand-primary)']}
                    type={type}
                />
            </div>
            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '15px', fontSize: '0.65rem', fontWeight: 800 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '10px', height: '10px', background: 'var(--brand-primary)', boxShadow: '0 0 6px var(--brand-primary)', borderRadius: '2px' }}></span> ATIVAÇÃO PRINCIPAL
                </div>
            </div>
        </div>
    );
}
