import { useMemo } from 'react'

const GOAL_LABELS = {
    muscle: 'Hipertrofia',
    strength: 'Força',
    'fat-loss': 'Emagrecimento'
}

const MacroBar = ({ label, value, unit, pct, color }) => (
    <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--text-med)', letterSpacing: '0.05em' }}>
                {label}
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontWeight: 900, fontSize: '0.9rem', color }}>{value}</span>
                <span style={{ fontSize: '0.52rem', opacity: 0.5 }}>{unit}</span>
                <span style={{ fontSize: '0.52rem', opacity: 0.4, marginLeft: '4px' }}>{pct}%</span>
            </div>
        </div>
        <div style={{ height: '4px', background: 'var(--bg-pure)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
                width: `${pct}%`, height: '100%',
                background: color, borderRadius: '2px',
                transition: 'width 0.6s ease'
            }} />
        </div>
    </div>
)

export default function EliteNutrition({ profile }) {
    const nutrition = useMemo(() => {
        const { sex, age, weight, height, bf, activity, goal } = profile
        const w = parseFloat(weight) || 70
        const h = parseFloat(height) || 170
        const a = parseFloat(age) || 25
        const fatPct = parseFloat(bf) || 0
        const act = parseFloat(activity) || 1.2

        let bmr
        if (fatPct > 0) {
            // Katch-McArdle — mais precisa quando BF% é conhecido
            const lbm = w * (1 - fatPct / 100)
            bmr = 370 + (21.6 * lbm)
        } else {
            // Mifflin-St Jeor
            bmr = sex === 'male'
                ? (10 * w) + (6.25 * h) - (5 * a) + 5
                : (10 * w) + (6.25 * h) - (5 * a) - 161
        }

        const tdee = bmr * act

        let targetCalories
        if (goal === 'muscle') targetCalories = tdee + 300
        else if (goal === 'fat-loss') targetCalories = tdee - 500
        else targetCalories = tdee

        // Macros
        const protein = Math.round(w * 2.1)
        const fat = Math.round(w * 0.9)
        const proteinCals = protein * 4
        const fatCals = fat * 9
        const carbCals = Math.max(0, targetCalories - proteinCals - fatCals)
        const carbs = Math.round(carbCals / 4)

        const totalMacroCals = proteinCals + (carbs * 4) + fatCals
        const proteinPct = Math.round(proteinCals / totalMacroCals * 100)
        const carbsPct = Math.round((carbs * 4) / totalMacroCals * 100)
        const fatPctMacro = 100 - proteinPct - carbsPct

        const waterBase = Math.round(w * 35)
        const waterTotal = waterBase + 500 // +500ml for training day

        return {
            calories: Math.round(targetCalories),
            protein, carbs, fat,
            bmr: Math.round(bmr),
            tdee: Math.round(tdee),
            proteinPct, carbsPct, fatPct: fatPctMacro,
            waterBase, waterTotal
        }
    }, [profile])

    const goalLabel = GOAL_LABELS[profile.goal] || 'Desempenho'
    const surplusOrDeficit = nutrition.calories - nutrition.tdee
    const surplusLabel = surplusOrDeficit > 0
        ? `+${surplusOrDeficit} kcal acima do TDEE (superávit)`
        : surplusOrDeficit < 0
            ? `${surplusOrDeficit} kcal abaixo do TDEE (déficit)`
            : 'Manutenção calórica'

    return (
        <div className="nutrition-view animate-tech" style={{ padding: '30px' }}>
            <header style={{ marginBottom: '32px' }}>
                <p className="data-label">SISTEMA INFUSION ELITE</p>
                <h1 style={{ fontSize: '1.4rem' }}>FUEL <span className="title-italic">Optimization</span></h1>
                <p style={{ fontSize: '0.62rem', color: 'var(--text-med)', marginTop: '6px' }}>
                    Protocolo ajustado para <span style={{ color: 'var(--brand-primary)', fontWeight: 800 }}>{goalLabel}</span>
                </p>
            </header>

            {/* Main calorie card */}
            <div className="panel-tech" style={{ background: 'var(--bg-elevated)', padding: '22px', marginBottom: '20px' }}>
                <p className="data-label" style={{ marginBottom: '8px' }}>META CALÓRICA DIÁRIA</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--brand-primary)', lineHeight: 1 }}>
                        {nutrition.calories.toLocaleString('pt-BR')}
                    </span>
                    <span style={{ fontSize: '1rem', fontWeight: 800, opacity: 0.45 }}>KCAL</span>
                </div>

                <p style={{ fontSize: '0.6rem', color: 'var(--text-low)', marginBottom: '16px' }}>{surplusLabel}</p>

                <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
                    {[
                        { label: 'BMR (BASAL)', value: nutrition.bmr.toLocaleString('pt-BR') },
                        { label: 'TDEE (GASTO)', value: nutrition.tdee.toLocaleString('pt-BR') }
                    ].map(item => (
                        <div key={item.label}>
                            <p className="data-label" style={{ fontSize: '0.48rem' }}>{item.label}</p>
                            <p style={{ fontWeight: 800, fontSize: '0.9rem' }}>{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Macro breakdown */}
            <div className="panel-tech" style={{ padding: '20px', marginBottom: '20px' }}>
                <p className="data-label" style={{ marginBottom: '18px' }}>DISTRIBUIÇÃO DE MACROS</p>

                <MacroBar
                    label="PROTEÍNA"
                    value={nutrition.protein}
                    unit="g"
                    pct={nutrition.proteinPct}
                    color="var(--brand-primary)"
                />
                <MacroBar
                    label="CARBOIDRATO"
                    value={nutrition.carbs}
                    unit="g"
                    pct={nutrition.carbsPct}
                    color="var(--brand-secondary)"
                />
                <MacroBar
                    label="GORDURA"
                    value={nutrition.fat}
                    unit="g"
                    pct={nutrition.fatPct}
                    color="#ffcc00"
                />
            </div>

            {/* Quick macro cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                {[
                    { label: 'PROTEÍNA', value: nutrition.protein, color: 'var(--brand-primary)' },
                    { label: 'CARBO', value: nutrition.carbs, color: 'var(--brand-secondary)' },
                    { label: 'GORDURA', value: nutrition.fat, color: '#ffcc00' }
                ].map(item => (
                    <div key={item.label} className="panel-tech" style={{ padding: '14px', textAlign: 'center' }}>
                        <p className="data-label" style={{ fontSize: '0.5rem', marginBottom: '6px' }}>{item.label}</p>
                        <p style={{ fontSize: '1.3rem', fontWeight: 900, color: item.color, lineHeight: 1 }}>{item.value}</p>
                        <p style={{ fontSize: '0.45rem', opacity: 0.35, marginTop: '2px' }}>GRAMAS</p>
                    </div>
                ))}
            </div>

            {/* Hydration */}
            <div className="panel-tech" style={{ marginBottom: '20px', borderLeft: '4px solid var(--brand-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <p className="data-label">HIDRATAÇÃO DIÁRIA</p>
                    <span style={{ fontSize: '1.3rem' }}>💧</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                        <p className="data-label" style={{ fontSize: '0.48rem', marginBottom: '4px' }}>DIA DE DESCANSO</p>
                        <p style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--brand-secondary)', lineHeight: 1 }}>
                            {(nutrition.waterBase / 1000).toFixed(1)}
                            <span style={{ fontSize: '0.6rem', fontWeight: 700, opacity: 0.5, marginLeft: '4px' }}>L</span>
                        </p>
                    </div>
                    <div>
                        <p className="data-label" style={{ fontSize: '0.48rem', marginBottom: '4px' }}>DIA DE TREINO</p>
                        <p style={{ fontWeight: 900, fontSize: '1.2rem', color: 'var(--brand-primary)', lineHeight: 1 }}>
                            {(nutrition.waterTotal / 1000).toFixed(1)}
                            <span style={{ fontSize: '0.6rem', fontWeight: 700, opacity: 0.5, marginLeft: '4px' }}>L</span>
                        </p>
                    </div>
                </div>
                <p style={{ fontSize: '0.58rem', color: 'var(--text-low)', marginTop: '10px' }}>
                    35ml/kg base + 500ml para sessão de treino. Aumente em dias de calor ou treinos longos.
                </p>
            </div>

            {/* Guideline */}
            <div className="panel-tech" style={{ opacity: 0.65 }}>
                <p className="data-label" style={{ marginBottom: '8px' }}>DIRETRIZ ELITE</p>
                <p style={{ fontSize: '0.75rem', lineHeight: 1.6 }}>
                    Valores calculados com base no seu objetivo de <strong style={{ color: 'var(--brand-primary)' }}>{goalLabel}</strong>.
                    Priorize a ingestão de proteína logo após o treino para maximizar a síntese muscular.
                    Ajuste os carboidratos conforme nível de energia durante as sessões.
                </p>
            </div>
        </div>
    )
}
