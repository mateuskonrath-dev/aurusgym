import { useMemo } from 'react'

export default function EliteNutrition({ profile }) {
    const nutrition = useMemo(() => {
        const { sex, age, weight, height, bf, activity, goal } = profile
        const w = parseFloat(weight)
        const h = parseFloat(height)
        const a = parseFloat(age)
        const fatal = parseFloat(bf) || 0
        const act = parseFloat(activity) || 1.2

        let bmr;
        if (fatal > 0) {
            // Katch-McArdle
            const lbm = w * (1 - fatal / 100)
            bmr = 370 + (21.6 * lbm)
        } else {
            // Mifflin-St Jeor
            if (sex === 'male') {
                bmr = (10 * w) + (6.25 * h) - (5 * a) + 5
            } else {
                bmr = (10 * w) + (6.25 * h) - (5 * a) - 161
            }
        }

        const tdee = bmr * act

        let targetCalories;
        if (goal === 'muscle') targetCalories = tdee + 300
        else if (goal === 'fat-loss') targetCalories = tdee - 500
        else targetCalories = tdee

        // Macros calculation
        const protein = w * 2.1 // 2.1g per kg
        const fat = w * 0.9 // 0.9g per kg
        const proteinCals = protein * 4
        const fatCals = fat * 9
        const carbCals = targetCalories - proteinCals - fatCals
        const carbs = carbCals / 4

        return {
            calories: Math.round(targetCalories),
            protein: Math.round(protein),
            carbs: Math.round(carbs),
            fat: Math.round(fat),
            bmr: Math.round(bmr),
            tdee: Math.round(tdee)
        }
    }, [profile])

    return (
        <div className="nutrition-view animate-tech" style={{ padding: '30px' }}>
            <header style={{ marginBottom: '40px' }}>
                <p className="data-label">SISTEMA INFUSION ELITE</p>
                <h1 style={{ fontSize: '1.4rem' }}>FUEL <span className="title-italic">Optimization</span></h1>
            </header>

            <div className="panel-tech" style={{ background: 'var(--bg-elevated)', padding: '25px', marginBottom: '25px', border: '1px solid var(--border-subtle)' }}>
                <p className="data-label" style={{ marginBottom: '10px' }}>META CALÓRICA DIÁRIA</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--brand-primary)' }}>{nutrition.calories}</span>
                    <span style={{ fontSize: '1rem', fontWeight: 800, opacity: 0.5 }}>KCAL</span>
                </div>
                <div style={{ marginTop: '15px', display: 'flex', gap: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '15px' }}>
                    <div>
                        <p className="data-label" style={{ fontSize: '0.5rem' }}>BMR (BASAL)</p>
                        <p style={{ fontWeight: 800, fontSize: '0.9rem' }}>{nutrition.bmr}</p>
                    </div>
                    <div>
                        <p className="data-label" style={{ fontSize: '0.5rem' }}>TDEE (GASTO)</p>
                        <p style={{ fontWeight: 800, fontSize: '0.9rem' }}>{nutrition.tdee}</p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '30px' }}>
                <div className="panel-tech" style={{ padding: '15px', textAlign: 'center' }}>
                    <p className="data-label" style={{ fontSize: '0.55rem', marginBottom: '8px' }}>PROTEÍNA</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--brand-primary)' }}>{nutrition.protein}G</p>
                </div>
                <div className="panel-tech" style={{ padding: '15px', textAlign: 'center' }}>
                    <p className="data-label" style={{ fontSize: '0.55rem', marginBottom: '8px' }}>CARBO</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--brand-secondary)' }}>{nutrition.carbs}G</p>
                </div>
                <div className="panel-tech" style={{ padding: '15px', textAlign: 'center' }}>
                    <p className="data-label" style={{ fontSize: '0.55rem', marginBottom: '8px' }}>GORDURA</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffcc00' }}>{nutrition.fat}G</p>
                </div>
            </div>

            <div className="panel-tech" style={{ opacity: 0.6 }}>
                <p className="data-label">DIRETRIZ ELITE</p>
                <p style={{ fontSize: '0.75rem', lineHeight: '1.5' }}>
                    Estes valores sao calculados dinamicamente com base no seu objetivo de **{(profile.goal || 'DESEMPENHO').toUpperCase()}**.
                    A prioridade e a manutencao da massa magra e suporte ao protocolo de treino atual.
                </p>
            </div>
        </div>
    )
}
