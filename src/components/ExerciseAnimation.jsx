import { useState, useEffect } from 'react'

const C = '#b3ff00'
const W = 2.3

function getType(ex) {
    const n = (ex?.name || '').toLowerCase()
    const m = (ex?.muscle || '').toLowerCase()
    if (n.includes('prancha') || (n.includes('isométric') && !n.includes('roda'))) return 'plank'
    if (m.includes('abdômen') || m.includes('abs') || n.includes('abdominal') || n.includes('elevação de pernas') || n.includes('roda') || n.includes('escaladores')) return 'crunch'
    if (n.includes('agachamento') || n.includes('leg press') || n.includes('afundo') || n.includes('pistola') || n.includes('cadeira extensora') || n.includes('panturrilha') || n.includes('abdutora')) return 'squat'
    if (n.includes('elevação pélvica') || n.includes('terra') || n.includes('stiff') || n.includes('mesa flexora')) return 'hinge'
    if (n.includes('barra fixa') || n.includes('puxada') || n.includes('pullover')) return 'pulldown'
    if (n.includes('remada') || n.includes('serrote') || n.includes('dorsal') || n.includes('anjo')) return 'row'
    if (n.includes('rosca') || m === 'bíceps') return 'curl'
    if (m === 'tríceps' || n.includes('tríceps') || n.includes('mergulho')) return 'tricep'
    if (n.includes('lateral') || n.includes('frontal') || n.includes('inverso') || n.includes('remada alta') || n.includes('puxada facial')) return 'raise'
    if (n.includes('desenvolvimento') || n.includes('arnold') || n.includes('em v')) return 'overhead'
    if (m === 'peito' || n.includes('supino') || n.includes('flexão') || n.includes('crucifixo') || n.includes('cruzamento') || n.includes('voador') || n.includes('pec')) return 'push'
    if (m === 'costas') return 'pulldown'
    if (m === 'ombros') return 'raise'
    return 'push'
}

const LABELS = {
    push: 'EMPURRAR', overhead: 'PRESS ALTO', pulldown: 'PUXAR',
    row: 'REMADA', squat: 'AGACHAR', hinge: 'QUADRIL',
    curl: 'FLEXÃO', tricep: 'EXTENSÃO', raise: 'ELEVAR',
    crunch: 'CONTRAÇÃO', plank: 'ISOMÉTRICO'
}

// Poses: lE=left elbow, lH=left hand, rE=right elbow, rH=right hand
// lK=left knee, lF=left foot, rK=right knee, rF=right foot
// bent: torso tilts forward
// Fixed: head(40,9)r7, shoulders L(22,30) R(58,30), torso(40,26)→(40,64), hips L(30,64) R(50,64)
// Default legs: lK(32,84) lF(30,108) rK(48,84) rF(50,108)

const LEG_DEF = { lK: [32, 84], lF: [30, 108], rK: [48, 84], rF: [50, 108] }

const POSES = {
    push: [
        { lE: [20, 44], lH: [26, 56], rE: [60, 44], rH: [54, 56], ...LEG_DEF },
        { lE: [14, 36], lH: [4, 36], rE: [66, 36], rH: [76, 36], ...LEG_DEF }
    ],
    overhead: [
        { lE: [18, 42], lH: [20, 56], rE: [62, 42], rH: [60, 56], ...LEG_DEF },
        { lE: [16, 18], lH: [14, 4], rE: [64, 18], rH: [66, 4], ...LEG_DEF }
    ],
    pulldown: [
        { lE: [16, 18], lH: [12, 4], rE: [64, 18], rH: [68, 4], ...LEG_DEF },
        { lE: [24, 38], lH: [30, 30], rE: [56, 38], rH: [50, 30], ...LEG_DEF }
    ],
    row: [
        { bent: true, lE: [12, 64], lH: [4, 70], rE: [44, 52], rH: [50, 46], lK: [26, 84], lF: [22, 108], rK: [52, 84], rF: [56, 108] },
        { bent: true, lE: [14, 54], lH: [10, 44], rE: [44, 44], rH: [50, 34], lK: [26, 84], lF: [22, 108], rK: [52, 84], rF: [56, 108] }
    ],
    squat: [
        { lE: [22, 44], lH: [22, 58], rE: [58, 44], rH: [58, 58], ...LEG_DEF },
        { lE: [16, 50], lH: [18, 64], rE: [64, 50], rH: [62, 64], lK: [22, 78], lF: [16, 100], rK: [58, 78], rF: [64, 100] }
    ],
    hinge: [
        { lE: [22, 42], lH: [26, 56], rE: [58, 42], rH: [54, 56], ...LEG_DEF },
        { bent: true, lE: [14, 62], lH: [6, 68], rE: [50, 54], rH: [56, 46], lK: [30, 84], lF: [28, 108], rK: [48, 84], rF: [50, 108] }
    ],
    curl: [
        { lE: [20, 48], lH: [22, 64], rE: [60, 48], rH: [58, 64], ...LEG_DEF },
        { lE: [20, 42], lH: [16, 26], rE: [60, 42], rH: [64, 26], ...LEG_DEF }
    ],
    tricep: [
        { lE: [28, 36], lH: [32, 22], rE: [52, 36], rH: [48, 22], ...LEG_DEF },
        { lE: [28, 36], lH: [30, 54], rE: [52, 36], rH: [50, 54], ...LEG_DEF }
    ],
    raise: [
        { lE: [20, 46], lH: [18, 62], rE: [60, 46], rH: [62, 62], ...LEG_DEF },
        { lE: [12, 34], lH: [4, 36], rE: [68, 34], rH: [76, 36], ...LEG_DEF }
    ],
}

function StickFigure({ pose }) {
    const { lE, lH, rE, rH, lK, lF, rK, rF, bent } = pose
    const LS = [22, 30], RS = [58, 30]
    const LH_HIP = [30, 64], RH_HIP = [50, 64]
    const torsoEnd = bent ? [22, 60] : [40, 64]
    const hipL = bent ? [22, 60] : LH_HIP
    const hipR = bent ? [30, 56] : RH_HIP

    return (
        <>
            <circle cx="40" cy="9" r="7" stroke={C} strokeWidth={W} fill="none" />
            <line x1="40" y1="16" x2="40" y2="26" stroke={C} strokeWidth={W} />
            <line x1="22" y1="30" x2="58" y2="30" stroke={C} strokeWidth={W} />
            {bent
                ? <line x1="40" y1="26" x2="22" y2="64" stroke={C} strokeWidth={W} />
                : <line x1="40" y1="26" x2="40" y2="64" stroke={C} strokeWidth={W} />
            }
            {!bent && <line x1="30" y1="64" x2="50" y2="64" stroke={C} strokeWidth={W} />}
            <line x1={LS[0]} y1={LS[1]} x2={lE[0]} y2={lE[1]} stroke={C} strokeWidth={W} />
            <line x1={lE[0]} y1={lE[1]} x2={lH[0]} y2={lH[1]} stroke={C} strokeWidth={W + 0.6} />
            <line x1={RS[0]} y1={RS[1]} x2={rE[0]} y2={rE[1]} stroke={C} strokeWidth={W} />
            <line x1={rE[0]} y1={rE[1]} x2={rH[0]} y2={rH[1]} stroke={C} strokeWidth={W + 0.6} />
            <line x1={hipL[0]} y1={hipL[1]} x2={lK[0]} y2={lK[1]} stroke={C} strokeWidth={W} />
            <line x1={lK[0]} y1={lK[1]} x2={lF[0]} y2={lF[1]} stroke={C} strokeWidth={W} />
            <line x1={hipR[0]} y1={hipR[1]} x2={rK[0]} y2={rK[1]} stroke={C} strokeWidth={W} />
            <line x1={rK[0]} y1={rK[1]} x2={rF[0]} y2={rF[1]} stroke={C} strokeWidth={W} />
        </>
    )
}

function CrunchFigure({ phase }) {
    // Lying down, side view. Body along X axis. Head on right.
    // phase 0: flat / phase 1: crunching up
    const bodyY = 70
    const shoulderX = phase === 1 ? 52 : 65
    const headX = phase === 1 ? 58 : 72
    const headY = phase === 1 ? 60 : bodyY
    const torsoTopY = phase === 1 ? 62 : bodyY

    return (
        <>
            {/* legs */}
            <line x1="5" y1={bodyY} x2="38" y2={bodyY} stroke={C} strokeWidth={W} />
            {/* torso */}
            <line x1="38" y1={bodyY} x2={shoulderX} y2={torsoTopY} stroke={C} strokeWidth={W} />
            {/* head */}
            <circle cx={headX} cy={headY - 8} r="7" stroke={C} strokeWidth={W} fill="none" />
            {/* arms hint */}
            <line x1="50" y1={torsoTopY + 2} x2="42" y2={torsoTopY + 14} stroke={C} strokeWidth={W} />
        </>
    )
}

function PlankFigure({ pulse }) {
    const op = pulse ? 1 : 0.6
    return (
        <g opacity={op}>
            {/* body horizontal, supported on forearms */}
            <circle cx="68" cy="40" r="7" stroke={C} strokeWidth={W} fill="none" />
            <line x1="62" y1="45" x2="20" y2="55" stroke={C} strokeWidth={W} />
            {/* forearms */}
            <line x1="54" y1="52" x2="46" y2="68" stroke={C} strokeWidth={W} />
            <line x1="40" y1="54" x2="32" y2="70" stroke={C} strokeWidth={W} />
            {/* legs */}
            <line x1="20" y1="55" x2="8" y2="50" stroke={C} strokeWidth={W} />
        </g>
    )
}

export default function ExerciseAnimation({ exercise }) {
    const [phase, setPhase] = useState(0)
    const [transitioning, setTransitioning] = useState(false)
    const type = getType(exercise)

    useEffect(() => {
        if (type === 'plank') {
            const id = setInterval(() => setPhase(p => 1 - p), 900)
            return () => clearInterval(id)
        }
        const id = setInterval(() => {
            setTransitioning(true)
            setTimeout(() => {
                setPhase(p => 1 - p)
                setTransitioning(false)
            }, 180)
        }, 1100)
        return () => clearInterval(id)
    }, [type])

    const isSpecial = type === 'crunch' || type === 'plank'
    const poses = POSES[type]

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{
                width: '100px', height: '120px',
                background: 'rgba(179,255,0,0.03)',
                border: '1px solid rgba(179,255,0,0.12)',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden'
            }}>
                <svg
                    viewBox={isSpecial ? "0 0 80 100" : "0 0 80 115"}
                    width="90"
                    height={isSpecial ? "107" : "120"}
                    style={{ opacity: transitioning ? 0.3 : 1, transition: 'opacity 0.18s ease' }}
                >
                    {type === 'crunch' && <CrunchFigure phase={phase} />}
                    {type === 'plank' && <PlankFigure pulse={phase === 1} />}
                    {!isSpecial && poses && <StickFigure pose={poses[phase]} />}
                </svg>
            </div>
            <p style={{
                fontSize: '0.5rem', fontWeight: 900, letterSpacing: '1.5px',
                color: 'rgba(179,255,0,0.5)', margin: 0
            }}>
                {LABELS[type] || 'MOVIMENTO'}
            </p>
        </div>
    )
}
