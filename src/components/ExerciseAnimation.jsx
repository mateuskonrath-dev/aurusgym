import { useState, useEffect } from 'react'

// ─── Paleta ──────────────────────────────────────────────────────────────────
const SKIN_LIGHT = '#d4956a'
const SKIN_MID = '#b8825a'
const SKIN_DARK = '#8a5f3d'
const MUSCLE_ACTIVE = '#d97e3d'  // Laranja/vermelho para músculos ativos
const MUSCLE_SHADOW = '#9d6f48'
const MUSCLE_LIGHT = '#c0a080'
const BODY_OUTLINE = '#4a4a4a'
const EQ_METAL = '#6a7a8a'
const EQ_DARK = '#3a3a4a'
const HIGHLIGHT = '#b3ff00'

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

// ─── Figura humana realista ───────────────────────────────────────────────────
function RealisticFigure({ phase, type, activeMuscle }) {
    // Poses: phase 0 = relaxado, phase 1 = contraído

    // Braço esquerdo posições
    const leftArmRelax = { shoulder: [35, 85], elbow: [28, 110], hand: [30, 135] }
    const leftArmContracted = { shoulder: [35, 85], elbow: [32, 100], hand: [45, 105] }
    const leftArm = phase === 0 ? leftArmRelax : leftArmContracted

    // Braço direito posições
    const rightArmRelax = { shoulder: [65, 85], elbow: [72, 110], hand: [70, 135] }
    const rightArmContracted = { shoulder: [65, 85], elbow: [68, 100], hand: [55, 105] }
    const rightArm = phase === 0 ? rightArmRelax : rightArmContracted

    const chestColor = activeMuscle === 'chest' && phase === 1 ? MUSCLE_ACTIVE : SKIN_LIGHT
    const armColor = activeMuscle === 'arm' && phase === 1 ? MUSCLE_ACTIVE : SKIN_LIGHT

    return (
        <g>
            {/* Defs para gradientes */}
            <defs>
                <linearGradient id="chestGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={BODY_OUTLINE} />
                    <stop offset="25%" stopColor={chestColor} />
                    <stop offset="75%" stopColor={chestColor} />
                    <stop offset="100%" stopColor={BODY_OUTLINE} />
                </linearGradient>
                <radialGradient id="muscleShine">
                    <stop offset="0%" stopColor={MUSCLE_LIGHT} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={chestColor} stopOpacity="0.3" />
                </radialGradient>
            </defs>

            {/* Cabeça */}
            <ellipse cx="50" cy="50" rx="10" ry="11" fill={SKIN_MID} stroke={BODY_OUTLINE} strokeWidth="0.8" />
            {/* Rosto - olhos */}
            <circle cx="47" cy="48" r="1.5" fill={BODY_OUTLINE} />
            <circle cx="53" cy="48" r="1.5" fill={BODY_OUTLINE} />
            {/* Nariz */}
            <line x1="50" y1="48" x2="50" y2="51" stroke={BODY_OUTLINE} strokeWidth="0.6" />
            {/* Boca */}
            <path d="M 47 53 Q 50 54 53 53" stroke={BODY_OUTLINE} strokeWidth="0.6" fill="none" />

            {/* Pescoço */}
            <rect x="47" y="60" width="6" height="8" fill={SKIN_MID} stroke={BODY_OUTLINE} strokeWidth="0.6" />

            {/* Tronco/Peito com músculos definidos */}
            <ellipse cx="50" cy="85" rx="16" ry="20" fill="url(#chestGradient)" stroke={BODY_OUTLINE} strokeWidth="0.8" />

            {/* Linha do peitoral (divisão peitoral maior e menor) */}
            {activeMuscle === 'chest' && phase === 1 ? (
                <>
                    <path d="M 50 68 Q 48 80 47 95" stroke={MUSCLE_SHADOW} strokeWidth="1.2" fill="none" opacity="0.6" />
                    <path d="M 50 68 Q 52 80 53 95" stroke={MUSCLE_SHADOW} strokeWidth="1.2" fill="none" opacity="0.6" />
                    {/* Sulco abdominal */}
                    <line x1="50" y1="88" x2="50" y2="110" stroke={MUSCLE_SHADOW} strokeWidth="0.8" opacity="0.5" />
                </>
            ) : null}

            {/* Abdominais */}
            <g opacity={activeMuscle === 'chest' ? 0.7 : 0.6}>
                <rect x="42" y="100" width="5" height="5" fill={SKIN_MID} stroke={BODY_OUTLINE} strokeWidth="0.5" rx="1" />
                <rect x="53" y="100" width="5" height="5" fill={SKIN_MID} stroke={BODY_OUTLINE} strokeWidth="0.5" rx="1" />
                <rect x="42" y="108" width="5" height="5" fill={SKIN_MID} stroke={BODY_OUTLINE} strokeWidth="0.5" rx="1" />
                <rect x="53" y="108" width="5" height="5" fill={SKIN_MID} stroke={BODY_OUTLINE} strokeWidth="0.5" rx="1" />
            </g>

            {/* Braço esquerdo */}
            <g>
                {/* Ombro */}
                <circle cx={leftArm.shoulder[0]} cy={leftArm.shoulder[1]} r="5" fill={armColor} stroke={BODY_OUTLINE} strokeWidth="0.8" />
                {/* Bíceps/Tríceps */}
                <path
                    d={`M ${leftArm.shoulder[0]} ${leftArm.shoulder[1]} Q ${leftArm.shoulder[0] - 3} ${(leftArm.shoulder[1] + leftArm.elbow[1])/2} ${leftArm.elbow[0]} ${leftArm.elbow[1]}`}
                    stroke={armColor}
                    strokeWidth="4.5"
                    fill="none"
                    strokeLinecap="round"
                />
                {/* Cotovelo */}
                <circle cx={leftArm.elbow[0]} cy={leftArm.elbow[1]} r="3" fill={armColor} stroke={BODY_OUTLINE} strokeWidth="0.6" />
                {/* Antebraço */}
                <path
                    d={`M ${leftArm.elbow[0]} ${leftArm.elbow[1]} L ${leftArm.hand[0]} ${leftArm.hand[1]}`}
                    stroke={SKIN_LIGHT}
                    strokeWidth="3.5"
                    fill="none"
                    strokeLinecap="round"
                />
                {/* Mão */}
                <ellipse cx={leftArm.hand[0]} cy={leftArm.hand[1]} rx="2.5" ry="3" fill={SKIN_MID} stroke={BODY_OUTLINE} strokeWidth="0.5" />

                {/* Destaque de músculos contraídos */}
                {activeMuscle === 'arm' && phase === 1 && (
                    <ellipse cx={(leftArm.shoulder[0] + leftArm.elbow[0])/2} cy={(leftArm.shoulder[1] + leftArm.elbow[1])/2} rx="3" ry="2" fill={MUSCLE_ACTIVE} opacity="0.6" />
                )}
            </g>

            {/* Braço direito */}
            <g>
                {/* Ombro */}
                <circle cx={rightArm.shoulder[0]} cy={rightArm.shoulder[1]} r="5" fill={armColor} stroke={BODY_OUTLINE} strokeWidth="0.8" />
                {/* Bíceps/Tríceps */}
                <path
                    d={`M ${rightArm.shoulder[0]} ${rightArm.shoulder[1]} Q ${rightArm.shoulder[0] + 3} ${(rightArm.shoulder[1] + rightArm.elbow[1])/2} ${rightArm.elbow[0]} ${rightArm.elbow[1]}`}
                    stroke={armColor}
                    strokeWidth="4.5"
                    fill="none"
                    strokeLinecap="round"
                />
                {/* Cotovelo */}
                <circle cx={rightArm.elbow[0]} cy={rightArm.elbow[1]} r="3" fill={armColor} stroke={BODY_OUTLINE} strokeWidth="0.6" />
                {/* Antebraço */}
                <path
                    d={`M ${rightArm.elbow[0]} ${rightArm.elbow[1]} L ${rightArm.hand[0]} ${rightArm.hand[1]}`}
                    stroke={SKIN_LIGHT}
                    strokeWidth="3.5"
                    fill="none"
                    strokeLinecap="round"
                />
                {/* Mão */}
                <ellipse cx={rightArm.hand[0]} cy={rightArm.hand[1]} rx="2.5" ry="3" fill={SKIN_MID} stroke={BODY_OUTLINE} strokeWidth="0.5" />

                {/* Destaque de músculos contraídos */}
                {activeMuscle === 'arm' && phase === 1 && (
                    <ellipse cx={(rightArm.shoulder[0] + rightArm.elbow[0])/2} cy={(rightArm.shoulder[1] + rightArm.elbow[1])/2} rx="3" ry="2" fill={MUSCLE_ACTIVE} opacity="0.6" />
                )}
            </g>

            {/* Cintura/Quadril */}
            <ellipse cx="50" cy="115" rx="12" ry="8" fill={SKIN_MID} stroke={BODY_OUTLINE} strokeWidth="0.8" />

            {/* Perna esquerda */}
            <g>
                {/* Coxa */}
                <path
                    d="M 44 115 Q 42 135 44 155"
                    stroke={SKIN_MID}
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                />
                {/* Joelho */}
                <circle cx="44" cy="155" r="2.5" fill={BODY_OUTLINE} stroke={BODY_OUTLINE} strokeWidth="0.4" />
                {/* Panturrilha */}
                <path
                    d="M 44 155 Q 45 168 44 180"
                    stroke={SKIN_MID}
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                />
                {/* Pé */}
                <ellipse cx="44" cy="182" rx="3" ry="2" fill={EQ_DARK} stroke={BODY_OUTLINE} strokeWidth="0.5" />
            </g>

            {/* Perna direita */}
            <g>
                {/* Coxa */}
                <path
                    d="M 56 115 Q 58 135 56 155"
                    stroke={SKIN_MID}
                    strokeWidth="5"
                    fill="none"
                    strokeLinecap="round"
                />
                {/* Joelho */}
                <circle cx="56" cy="155" r="2.5" fill={BODY_OUTLINE} stroke={BODY_OUTLINE} strokeWidth="0.4" />
                {/* Panturrilha */}
                <path
                    d="M 56 155 Q 55 168 56 180"
                    stroke={SKIN_MID}
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                />
                {/* Pé */}
                <ellipse cx="56" cy="182" rx="3" ry="2" fill={EQ_DARK} stroke={BODY_OUTLINE} strokeWidth="0.5" />
            </g>
        </g>
    )
}

// ─── Máquina de treino (Pec Deck) ─────────────────────────────────────────────
function PecDeckMachine({ phase }) {
    return (
        <g opacity="0.85">
            {/* Estrutura traseira da máquina */}
            {/* Coluna vertical esquerda */}
            <rect x="8" y="20" width="3" height="170" fill={EQ_DARK} stroke={EQ_METAL} strokeWidth="0.8" />
            {/* Coluna vertical direita */}
            <rect x="90" y="20" width="3" height="170" fill={EQ_DARK} stroke={EQ_METAL} strokeWidth="0.8" />

            {/* Estrutura superior */}
            <rect x="8" y="20" width="85" height="4" rx="2" fill={EQ_METAL} stroke={EQ_DARK} strokeWidth="0.8" />

            {/* Estrutura do assento */}
            <rect x="30" y="150" width="40" height="8" rx="3" fill={EQ_METAL} stroke={EQ_DARK} strokeWidth="0.8" />
            <rect x="32" y="158" width="36" height="4" rx="2" fill={EQ_DARK} stroke={EQ_METAL} strokeWidth="0.6" />

            {/* Braços de alavanca (handles) */}
            {/* Esquerdo - relaxado */}
            {phase === 0 && (
                <>
                    <path d="M 20 85 Q 18 70 22 55" stroke={EQ_METAL} strokeWidth="3" fill="none" strokeLinecap="round" />
                    <circle cx="22" cy="55" r="2.5" fill={EQ_METAL} />
                </>
            )}
            {/* Esquerdo - contraído */}
            {phase === 1 && (
                <>
                    <path d="M 20 85 Q 35 70 45 60" stroke={EQ_METAL} strokeWidth="3" fill="none" strokeLinecap="round" />
                    <circle cx="45" cy="60" r="2.5" fill={EQ_METAL} />
                </>
            )}

            {/* Direito - relaxado */}
            {phase === 0 && (
                <>
                    <path d="M 80 85 Q 82 70 78 55" stroke={EQ_METAL} strokeWidth="3" fill="none" strokeLinecap="round" />
                    <circle cx="78" cy="55" r="2.5" fill={EQ_METAL} />
                </>
            )}
            {/* Direito - contraído */}
            {phase === 1 && (
                <>
                    <path d="M 80 85 Q 65 70 55 60" stroke={EQ_METAL} strokeWidth="3" fill="none" strokeLinecap="round" />
                    <circle cx="55" cy="60" r="2.5" fill={EQ_METAL} />
                </>
            )}

            {/* Cabos */}
            <path d="M 20 30 Q 18 50 20 85" stroke={EQ_DARK} strokeWidth="1.5" fill="none" opacity="0.6" />
            <path d="M 80 30 Q 82 50 80 85" stroke={EQ_DARK} strokeWidth="1.5" fill="none" opacity="0.6" />

            {/* Pesos (stack) */}
            <rect x="13" y="70" width="12" height="50" fill={EQ_DARK} stroke={EQ_METAL} strokeWidth="0.8" rx="1" />
            <rect x="76" y="70" width="12" height="50" fill={EQ_DARK} stroke={EQ_METAL} strokeWidth="0.8" rx="1" />

            {/* Base/pés */}
            <rect x="6" y="188" width="6" height="6" fill={EQ_DARK} rx="1" />
            <rect x="89" y="188" width="6" height="6" fill={EQ_DARK} rx="1" />
        </g>
    )
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ExerciseAnimation({ exercise, large = false }) {
    const [phase, setPhase] = useState(0)
    const [fade, setFade] = useState(false)

    const type = getType(exercise)
    const isMachineFriendly = type === 'push' || type === 'pulldown' || type === 'raise'

    // Tamanho responsivo
    const containerSize = large ? { w: '480px', h: '550px' } : { w: '140px', h: '160px' }
    const svgSize = large ? { w: 480, h: 550 } : { w: 140, h: 160 }

    useEffect(() => {
        const id = setInterval(() => {
            setFade(true)
            setTimeout(() => { setPhase(p => 1 - p); setFade(false) }, 250)
        }, 1400)
        return () => clearInterval(id)
    }, [type])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: large ? '16px' : '6px' }}>
            <div style={{
                width: containerSize.w,
                height: containerSize.h,
                background: large ? 'linear-gradient(135deg, rgba(10,10,15,0.8), rgba(10,10,20,0.9))' : 'rgba(10,10,15,0.8)',
                border: '2px solid rgba(179,255,0,0.2)',
                borderRadius: large ? '20px' : '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', position: 'relative',
                boxShadow: large ? '0 0 40px rgba(179,255,0,0.08), inset 0 0 40px rgba(179,255,0,0.03)' : 'none'
            }}>
                <svg
                    viewBox="0 0 100 200"
                    width={svgSize.w}
                    height={svgSize.h}
                    style={{
                        opacity: fade ? 0.3 : 1,
                        transition: 'opacity 0.25s ease',
                        filter: large ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' : 'none'
                    }}
                >
                    {/* Máquina de treino como fundo */}
                    {isMachineFriendly && <PecDeckMachine phase={phase} />}

                    {/* Figura humanóide realista */}
                    <RealisticFigure
                        phase={phase}
                        type={type}
                        activeMuscle={type === 'push' ? 'chest' : 'arm'}
                    />
                </svg>
            </div>

            <div style={{
                fontSize: large ? '0.9rem' : '0.5rem',
                fontWeight: 900,
                letterSpacing: large ? '2px' : '1px',
                color: 'rgba(179,255,0,0.7)',
                textAlign: 'center',
                textTransform: 'uppercase'
            }}>
                {exercise.name.toUpperCase()}
            </div>

            {large && (
                <div style={{
                    fontSize: '0.8rem',
                    color: 'rgba(179,255,0,0.5)',
                    textAlign: 'center',
                    maxWidth: '440px',
                    lineHeight: '1.5',
                    fontStyle: 'italic'
                }}>
                    Esquerda: posição inicial • Direita: contração máxima
                </div>
            )}
        </div>
    )
}
