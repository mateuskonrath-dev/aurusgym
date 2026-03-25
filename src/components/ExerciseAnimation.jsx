import { useState, useEffect } from 'react'

// ─── Paleta ──────────────────────────────────────────────────────────────────
const SKIN   = '#d4956a'
const CLOTH  = '#2a2a3e'
const EQ     = '#4a4a5a'
const EQL    = '#6a6a7a'
const HL     = '#b3ff00'   // músculo em destaque
const HL2    = 'rgba(179,255,0,0.18)'

// ─── Classificação do movimento ──────────────────────────────────────────────
function getType(ex) {
    const n = (ex?.name || '').toLowerCase()
    const m = (ex?.muscle || '').toLowerCase()
    if (n.includes('prancha') || (n.includes('isométric') && !n.includes('roda'))) return 'plank'
    if (m.includes('abdômen') || n.includes('abdominal') || n.includes('elevação de pernas') || n.includes('roda') || n.includes('escaladores') || n.includes('declinado')) return 'crunch'
    if (n.includes('agachamento') || n.includes('leg press') || n.includes('afundo') || n.includes('pistola') || n.includes('cadeira extensora') || n.includes('panturrilha') || n.includes('sumô')) return 'squat'
    if (n.includes('terra') || n.includes('stiff') || n.includes('mesa flexora') || n.includes('elevação pélvica') || n.includes('bulgaro') || n.includes('hack')) return 'hinge'
    if (n.includes('barra fixa') || n.includes('puxada') || n.includes('pullover')) return 'pulldown'
    if (n.includes('remada') || n.includes('serrote') || n.includes('dorsal') || n.includes('anjo')) return 'row'
    if (n.includes('rosca') || m === 'bíceps') return 'curl'
    if (m === 'tríceps' || n.includes('tríceps') || n.includes('mergulho') || n.includes('francês') || n.includes('extensão')) return 'tricep'
    if (n.includes('elevação lateral') || n.includes('elevação frontal') || n.includes('inverso') || n.includes('remada alta') || n.includes('puxada facial')) return 'raise'
    if (n.includes('desenvolvimento') || n.includes('arnold') || n.includes('em v')) return 'overhead'
    if (m === 'peito' || n.includes('supino') || n.includes('flexão') || n.includes('crucifixo') || n.includes('cruzamento') || n.includes('voador') || n.includes('pec')) return 'push'
    if (m === 'costas') return 'pulldown'
    if (m === 'ombros') return 'raise'
    return 'push'
}

// Equipamento baseado no nome do exercício
function getEquip(ex) {
    const n = (ex?.name || '').toLowerCase()
    if (n.includes('barra') || n.includes('agachamento') || n.includes('terra') || n.includes('supino') || n.includes('remada baixa') || n.includes('desenvolvimento com barra')) return 'barbell'
    if (n.includes('halter') || n.includes('rosca direta') || n.includes('elevação') || n.includes('arnold') || n.includes('serrote')) return 'dumbbell'
    if (n.includes('polia') || n.includes('cabo') || n.includes('puxada') || n.includes('cruzamento') || n.includes('corda') || n.includes('remada baixa')) return 'cable'
    if (n.includes('leg press') || n.includes('cadeira') || n.includes('mesa flexora') || n.includes('voador') || n.includes('pec deck') || n.includes('abdutora')) return 'machine'
    if (n.includes('barra fixa')) return 'pullbar'
    return 'none'
}

// ─── Componentes de equipamento ──────────────────────────────────────────────
function Barbell({ y = 95, x1 = 8, x2 = 92 }) {
    return (
        <g>
            <rect x={x1} y={y - 3} width={x2 - x1} height={6} rx={3} fill={EQ} />
            <rect x={x1} y={y - 8} width={7} height={16} rx={2} fill={EQL} />
            <rect x={x2 - 7} y={y - 8} width={7} height={16} rx={2} fill={EQL} />
        </g>
    )
}

function Dumbbell({ x, y, angle = 0 }) {
    return (
        <g transform={`translate(${x},${y}) rotate(${angle})`}>
            <rect x={-16} y={-3} width={32} height={6} rx={3} fill={EQ} />
            <rect x={-18} y={-6} width={6} height={12} rx={2} fill={EQL} />
            <rect x={12} y={-6} width={6} height={12} rx={2} fill={EQL} />
        </g>
    )
}

function CablePulley({ side = 'left' }) {
    const x = side === 'left' ? 8 : 92
    return (
        <g>
            <line x1={x} y1={0} x2={x} y2={30} stroke={EQ} strokeWidth={3} />
            <circle cx={x} cy={5} r={5} fill="none" stroke={EQL} strokeWidth={2} />
        </g>
    )
}

function PullBar() {
    return (
        <g>
            <rect x={5} y={0} width={90} height={5} rx={2} fill={EQ} />
            <rect x={42} y={5} width={16} height={10} rx={3} fill={EQL} />
        </g>
    )
}

function Bench({ y = 108 }) {
    return (
        <g>
            <rect x={20} y={y} width={60} height={8} rx={3} fill={EQ} />
            <rect x={25} y={y + 8} width={8} height={14} rx={2} fill={EQL} />
            <rect x={67} y={y + 8} width={8} height={14} rx={2} fill={EQL} />
        </g>
    )
}

// ─── Figura humana com formas preenchidas ─────────────────────────────────────
// Cada membro = linha grossa com stroke-linecap round
// Pose = posições dos joints: lE(elbow), lH(hand), rE, rH, lK(knee), lF(foot), rK, rF
// Opcional: bent=true (tronco inclinado), seated=true

function Figure({ pose, hlMuscle }) {
    const {
        lE, lH, rE, rH,
        lK = [34, 86], lF = [32, 116],
        rK = [48, 86], rF = [50, 116],
        bent = false, seated = false
    } = pose

    const LS = [24, 30], RS = [56, 30]
    const LH = [30, 66], RH = [50, 66]

    // tronco: ponto topo e base dependem de bent
    const trunkBot = bent ? [20, 66] : [40, 66]
    const hipL = bent ? [18, 64] : LH
    const hipR = bent ? [28, 60] : RH

    // Cor de destaque no músculo ativo
    const armColor   = (hlMuscle === 'arm')   ? HL : SKIN
    const chestColor = (hlMuscle === 'chest') ? HL : CLOTH
    const backColor  = (hlMuscle === 'back')  ? HL : CLOTH
    const legColor   = (hlMuscle === 'leg')   ? HL : SKIN

    const S = { strokeLinecap: 'round', fill: 'none' }

    return (
        <g>
            {/* Tronco */}
            <line x1="40" y1="22" x2={trunkBot[0]} y2={trunkBot[1]}
                stroke={CLOTH} strokeWidth={22} {...S} />

            {/* Pescoço */}
            <line x1="40" y1="18" x2="40" y2="22" stroke={SKIN} strokeWidth={9} {...S} />

            {/* Cabeça */}
            <circle cx="40" cy="11" r="9" fill={SKIN} />
            {/* Cabelo hint */}
            <ellipse cx="40" cy="5" rx="8" ry="4" fill={CLOTH} opacity={0.7} />

            {/* Braços - parte superior */}
            <line x1={LS[0]} y1={LS[1]} x2={lE[0]} y2={lE[1]}
                stroke={SKIN} strokeWidth={11} {...S} />
            <line x1={RS[0]} y1={RS[1]} x2={rE[0]} y2={rE[1]}
                stroke={SKIN} strokeWidth={11} {...S} />

            {/* Antebraços */}
            <line x1={lE[0]} y1={lE[1]} x2={lH[0]} y2={lH[1]}
                stroke={SKIN} strokeWidth={9} {...S} />
            <line x1={rE[0]} y1={rE[1]} x2={rH[0]} y2={rH[1]}
                stroke={SKIN} strokeWidth={9} {...S} />

            {/* Cotovelos (articulação) */}
            <circle cx={lE[0]} cy={lE[1]} r={4} fill={SKIN} />
            <circle cx={rE[0]} cy={rE[1]} r={4} fill={SKIN} />

            {/* Mãos */}
            <circle cx={lH[0]} cy={lH[1]} r={4} fill={SKIN} />
            <circle cx={rH[0]} cy={rH[1]} r={4} fill={SKIN} />

            {/* Shorts */}
            {!seated && (
                <line x1={hipL[0]} y1={hipL[1]} x2={hipR[0]} y2={hipR[1]}
                    stroke={CLOTH} strokeWidth={18} {...S} />
            )}

            {/* Pernas */}
            {!seated && (
                <>
                    <line x1={hipL[0]} y1={hipL[1]} x2={lK[0]} y2={lK[1]}
                        stroke={SKIN} strokeWidth={13} {...S} />
                    <line x1={hipR[0]} y1={hipR[1]} x2={rK[0]} y2={rK[1]}
                        stroke={SKIN} strokeWidth={13} {...S} />
                    <circle cx={lK[0]} cy={lK[1]} r={5} fill={SKIN} />
                    <circle cx={rK[0]} cy={rK[1]} r={5} fill={SKIN} />
                    <line x1={lK[0]} y1={lK[1]} x2={lF[0]} y2={lF[1]}
                        stroke={SKIN} strokeWidth={11} {...S} />
                    <line x1={rK[0]} y1={rK[1]} x2={rF[0]} y2={rF[1]}
                        stroke={SKIN} strokeWidth={11} {...S} />
                    {/* Pés */}
                    <ellipse cx={lF[0]} cy={lF[1]} rx={7} ry={4} fill={CLOTH} />
                    <ellipse cx={rF[0]} cy={rF[1]} rx={7} ry={4} fill={CLOTH} />
                </>
            )}

            {/* Pernas sentado */}
            {seated && (
                <>
                    <line x1={LH[0]} y1={LH[1]} x2={lK[0]} y2={lK[1]}
                        stroke={SKIN} strokeWidth={13} {...S} />
                    <line x1={RH[0]} y1={RH[1]} x2={rK[0]} y2={rK[1]}
                        stroke={SKIN} strokeWidth={13} {...S} />
                    <circle cx={lK[0]} cy={lK[1]} r={5} fill={SKIN} />
                    <circle cx={rK[0]} cy={rK[1]} r={5} fill={SKIN} />
                    <line x1={lK[0]} y1={lK[1]} x2={lF[0]} y2={lF[1]}
                        stroke={SKIN} strokeWidth={11} {...S} />
                    <line x1={rK[0]} y1={rK[1]} x2={rF[0]} y2={rF[1]}
                        stroke={SKIN} strokeWidth={11} {...S} />
                    <ellipse cx={lF[0]} cy={lF[1]} rx={7} ry={4} fill={CLOTH} />
                    <ellipse cx={rF[0]} cy={rF[1]} rx={7} ry={4} fill={CLOTH} />
                </>
            )}

            {/* Destaque de músculo ativo */}
            {hlMuscle && (
                <circle cx="40" cy="40" r="34"
                    fill={HL2} stroke="none"
                    style={{ mixBlendMode: 'screen' }} />
            )}
        </g>
    )
}

// ─── Poses por tipo de movimento ─────────────────────────────────────────────
const LEG_STAND = { lK: [34, 88], lF: [32, 116], rK: [46, 88], rF: [48, 116] }

const POSES = {
    push: [
        { lE: [18, 44], lH: [24, 56], rE: [62, 44], rH: [56, 56], ...LEG_STAND },
        { lE: [10, 34], lH: [2,  34], rE: [70, 34], rH: [78, 34], ...LEG_STAND }
    ],
    overhead: [
        { lE: [18, 42], lH: [18, 56], rE: [62, 42], rH: [62, 56], ...LEG_STAND },
        { lE: [16, 16], lH: [14, 2],  rE: [64, 16], rH: [66, 2],  ...LEG_STAND }
    ],
    pulldown: [
        { seated: true, lE: [14, 16], lH: [10, 2],  rE: [66, 16], rH: [70, 2],  lK: [22, 90], lF: [22, 116], rK: [58, 90], rF: [58, 116] },
        { seated: true, lE: [22, 38], lH: [28, 28],  rE: [58, 38], rH: [52, 28], lK: [22, 90], lF: [22, 116], rK: [58, 90], rF: [58, 116] }
    ],
    row: [
        { bent: true, lE: [10, 66], lH: [4,  74], rE: [42, 54], rH: [48, 46], lK: [28, 86], lF: [24, 114], rK: [52, 86], rF: [54, 114] },
        { bent: true, lE: [16, 54], lH: [12, 44], rE: [42, 46], rH: [48, 36], lK: [28, 86], lF: [24, 114], rK: [52, 86], rF: [54, 114] }
    ],
    squat: [
        { lE: [20, 44], lH: [20, 58], rE: [60, 44], rH: [60, 58], ...LEG_STAND },
        { lE: [14, 50], lH: [16, 64], rE: [66, 50], rH: [64, 64], lK: [22, 80], lF: [16, 104], rK: [58, 80], rF: [64, 104] }
    ],
    hinge: [
        { lE: [20, 44], lH: [24, 58], rE: [60, 44], rH: [56, 58], ...LEG_STAND },
        { bent: true, lE: [10, 64], lH: [4, 72], rE: [46, 56], rH: [52, 46], lK: [32, 86], lF: [30, 114], rK: [50, 86], rF: [52, 114] }
    ],
    curl: [
        { lE: [20, 50], lH: [22, 66], rE: [60, 50], rH: [58, 66], ...LEG_STAND },
        { lE: [20, 44], lH: [16, 26], rE: [60, 44], rH: [64, 26], ...LEG_STAND }
    ],
    tricep: [
        { lE: [26, 36], lH: [30, 20], rE: [54, 36], rH: [50, 20], ...LEG_STAND },
        { lE: [26, 36], lH: [28, 56], rE: [54, 36], rH: [52, 56], ...LEG_STAND }
    ],
    raise: [
        { lE: [20, 46], lH: [18, 62], rE: [60, 46], rH: [62, 62], ...LEG_STAND },
        { lE: [10, 32], lH: [2,  34], rE: [70, 32], rH: [78, 34], ...LEG_STAND }
    ],
}

// ─── Figuras especiais ────────────────────────────────────────────────────────
function CrunchFigure({ phase }) {
    const S = { strokeLinecap: 'round', fill: 'none' }
    const torsoAngle = phase === 1 ? -35 : 0
    const headX = phase === 1 ? 60 : 72
    const headY = phase === 1 ? 52 : 66
    const torsoEndX = phase === 1 ? 50 : 62
    const torsoEndY = phase === 1 ? 62 : 66

    return (
        <g>
            {/* Pernas */}
            <line x1="8" y1="66" x2="38" y2="66" stroke={SKIN} strokeWidth={13} {...S} />
            <line x1="38" y1="66" x2="48" y2="56" stroke={SKIN} strokeWidth={13} {...S} />
            <ellipse cx="8" cy="66" rx="6" ry="4" fill={CLOTH} />
            {/* Tronco */}
            <line x1="38" y1="66" x2={torsoEndX} y2={torsoEndY} stroke={CLOTH} strokeWidth={22} {...S} />
            {/* Cabeça */}
            <circle cx={headX} cy={headY - 8} r={9} fill={SKIN} />
            {/* Braços cruzados */}
            <line x1={torsoEndX - 4} y1={torsoEndY + 2} x2={torsoEndX - 14} y2={torsoEndY + 12} stroke={SKIN} strokeWidth={9} {...S} />
        </g>
    )
}

function PlankFigure({ phase }) {
    const S = { strokeLinecap: 'round', fill: 'none' }
    const glow = phase === 1
    return (
        <g>
            {/* Corpo horizontal */}
            <line x1="68" y1="58" x2="14" y2="66" stroke={CLOTH} strokeWidth={22} {...S} />
            {/* Pescoço + cabeça */}
            <line x1="66" y1="56" x2="72" y2="50" stroke={SKIN} strokeWidth={9} {...S} />
            <circle cx="76" cy="46" r={9} fill={SKIN} />
            {/* Antebraços no chão */}
            <line x1="52" y1="62" x2="46" y2="78" stroke={SKIN} strokeWidth={9} {...S} />
            <line x1="38" y1="64" x2="32" y2="80" stroke={SKIN} strokeWidth={9} {...S} />
            {/* Pés */}
            <ellipse cx="14" cy="66" rx="6" ry="4" fill={CLOTH} />
            {/* Pulso muscular */}
            {glow && <ellipse cx="40" cy="62" rx="30" ry="8" fill={HL2} />}
        </g>
    )
}

// ─── Rótulos ──────────────────────────────────────────────────────────────────
const LABELS = {
    push: 'EMPURRAR', overhead: 'PRESS', pulldown: 'PUXAR',
    row: 'REMADA', squat: 'AGACHAR', hinge: 'QUADRIL',
    curl: 'FLEXÃO', tricep: 'EXTENSÃO', raise: 'ELEVAR',
    crunch: 'CONTRAÇÃO', plank: 'ISOMÉTRICO'
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ExerciseAnimation({ exercise }) {
    const [phase, setPhase] = useState(0)
    const [fade, setFade] = useState(false)
    const type  = getType(exercise)
    const equip = getEquip(exercise)
    const isSpecial = type === 'crunch' || type === 'plank'
    const poses = POSES[type]
    const vb = isSpecial ? '0 0 90 85' : '0 0 90 125'

    useEffect(() => {
        const id = setInterval(() => {
            setFade(true)
            setTimeout(() => { setPhase(p => 1 - p); setFade(false) }, 200)
        }, type === 'plank' ? 800 : 1200)
        return () => clearInterval(id)
    }, [type])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{
                width: '112px', height: isSpecial ? '96px' : '136px',
                background: 'rgba(10,10,15,0.8)',
                border: '1px solid rgba(179,255,0,0.15)',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', position: 'relative'
            }}>
                {/* Linha de chão */}
                {!isSpecial && (
                    <div style={{
                        position: 'absolute', bottom: 8, left: 12, right: 12,
                        height: '1px', background: 'rgba(255,255,255,0.08)'
                    }} />
                )}
                <svg
                    viewBox={vb}
                    width={isSpecial ? 102 : 98}
                    height={isSpecial ? 88 : 128}
                    style={{ opacity: fade ? 0.2 : 1, transition: 'opacity 0.2s ease' }}
                >
                    {/* Equipamento (atrás da figura) */}
                    {!isSpecial && equip === 'pullbar' && <PullBar />}
                    {!isSpecial && equip === 'cable'   && <><CablePulley side="left" /><CablePulley side="right" /></>}
                    {!isSpecial && equip === 'machine' && <Bench y={102} />}
                    {!isSpecial && (type === 'pulldown') && <PullBar />}

                    {/* Figura */}
                    {type === 'crunch' && <CrunchFigure phase={phase} />}
                    {type === 'plank'  && <PlankFigure  phase={phase} />}
                    {!isSpecial && poses && <Figure pose={poses[phase]} />}

                    {/* Equipamento (na frente) */}
                    {!isSpecial && equip === 'barbell'  && <Barbell y={type === 'hinge' || type === 'row' ? 66 : type === 'squat' ? 30 : 96} />}
                    {!isSpecial && equip === 'dumbbell' && (
                        <>
                            <Dumbbell x={poses[phase].lH[0]} y={poses[phase].lH[1]} />
                            <Dumbbell x={poses[phase].rH[0]} y={poses[phase].rH[1]} />
                        </>
                    )}
                </svg>
            </div>

            <p style={{
                fontSize: '0.46rem', fontWeight: 900, letterSpacing: '1.5px',
                color: 'rgba(179,255,0,0.45)', margin: 0, textTransform: 'uppercase'
            }}>
                {LABELS[type] || 'MOVIMENTO'}
            </p>
        </div>
    )
}
