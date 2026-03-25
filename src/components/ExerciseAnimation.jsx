import { useState, useEffect } from 'react'

// ─── Paleta de cores realista ────────────────────────────────────────────────
const SKIN_TONE = '#e5c8b6'
const SKIN_DARK = '#a08072'
const SKIN_DARKER = '#7a5d4f'
const MUSCLE_ACTIVE = '#e8744a'  // Laranja/vermelho para músculos ativos
const MUSCLE_BASE = '#b8a099'    // Cinza para corpo
const SHADOW = '#4a4a4a'
const METAL = '#9ca3af'
const METAL_DARK = '#6b7280'

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

// ─── Figura humana anatomicamente detalhada ───────────────────────────────────
function DetailedHumanFigure({ phase }) {
    // Fase 0 = relaxado, fase 1 = contraído

    // Posições dos braços conforme fase
    const lArmX0 = 28, lArmY0 = 85
    const lElbowX0 = 20, lElbowY0 = 115
    const lHandX0 = 18, lHandY0 = 145

    const lArmX1 = 28, lArmY1 = 85
    const lElbowX1 = 28, lElbowY1 = 105
    const lHandX1 = 42, lHandY1 = 115

    const rArmX0 = 72, rArmY0 = 85
    const rElbowX0 = 80, rElbowY0 = 115
    const rHandX0 = 82, rHandY0 = 145

    const rArmX1 = 72, rArmY1 = 85
    const rElbowX1 = 72, rElbowY1 = 105
    const rHandX1 = 58, rHandY1 = 115

    const lArm = phase === 0 ? {x: lArmX0, y: lArmY0, ex: lElbowX0, ey: lElbowY0, hx: lHandX0, hy: lHandY0} : {x: lArmX1, y: lArmY1, ex: lElbowX1, ey: lElbowY1, hx: lHandX1, hy: lHandY1}
    const rArm = phase === 0 ? {x: rArmX0, y: rArmY0, ex: rElbowX0, ey: rElbowY0, hx: rHandX0, hy: rHandY0} : {x: rArmX1, y: rArmY1, ex: rElbowX1, ey: rElbowY1, hx: rHandX1, hy: rHandY1}

    const chestColor = phase === 1 ? MUSCLE_ACTIVE : MUSCLE_BASE

    return (
        <g>
            {/* Cabeça */}
            <ellipse cx="50" cy="30" rx="8.5" ry="9.5" fill={SKIN_TONE} stroke={SKIN_DARKER} strokeWidth="0.8" />

            {/* Rosto detalhado */}
            {/* Olhos */}
            <circle cx="47" cy="28" r="1.3" fill={SHADOW} />
            <circle cx="53" cy="28" r="1.3" fill={SHADOW} />
            {/* Pupila/brilho */}
            <circle cx="47.3" cy="27.8" r="0.6" fill="white" opacity="0.7" />
            <circle cx="53.3" cy="27.8" r="0.6" fill="white" opacity="0.7" />
            {/* Nariz */}
            <path d="M 50 28.5 L 50 31.5 L 49.5 31.8 L 50 31.8 L 50.5 31.8" stroke={SKIN_DARKER} strokeWidth="0.7" fill="none" />
            {/* Boca */}
            <path d="M 47.5 33 Q 50 34 52.5 33" stroke={SKIN_DARKER} strokeWidth="0.8" fill="none" strokeLinecap="round" />
            {/* Sombra do rosto */}
            <ellipse cx="48" cy="30" rx="3" ry="4" fill={SKIN_DARK} opacity="0.2" />

            {/* Pescoço */}
            <rect x="47.5" y="38" width="5" height="6.5" fill={SKIN_TONE} stroke={SKIN_DARKER} strokeWidth="0.6" />

            {/* Ombros/trapézio */}
            <ellipse cx="28" cy="48" rx="8.5" ry="6" fill={MUSCLE_BASE} stroke={SKIN_DARKER} strokeWidth="0.8" />
            <ellipse cx="72" cy="48" rx="8.5" ry="6" fill={MUSCLE_BASE} stroke={SKIN_DARKER} strokeWidth="0.8" />
            <path d="M 28 48 L 50 44 L 72 48" fill={MUSCLE_BASE} stroke={SKIN_DARKER} strokeWidth="0.8" />

            {/* Peito (grande peitoral) - com divisão */}
            <ellipse cx="42" cy="70" rx="8" ry="12" fill={chestColor} stroke={SKIN_DARKER} strokeWidth="0.9" />
            <ellipse cx="58" cy="70" rx="8" ry="12" fill={chestColor} stroke={SKIN_DARKER} strokeWidth="0.9" />
            {/* Linha de separação do peitoral */}
            <line x1="50" y1="60" x2="50" y2="82" stroke={SKIN_DARKER} strokeWidth="0.8" opacity="0.6" />

            {/* Abdominais - 6 retângulos definidos */}
            <g opacity={phase === 1 ? 0.9 : 0.7}>
                {/* Linha central */}
                <line x1="50" y1="82" x2="50" y2="110" stroke={SKIN_DARKER} strokeWidth="0.8" />
                {/* Linha horizontal superior */}
                <line x1="42" y1="88" x2="58" y2="88" stroke={SKIN_DARKER} strokeWidth="0.7" opacity="0.6" />
                {/* Linha horizontal meio */}
                <line x1="42" y1="96" x2="58" y2="96" stroke={SKIN_DARKER} strokeWidth="0.7" opacity="0.6" />
                {/* Linha horizontal inferior */}
                <line x1="42" y1="104" x2="58" y2="104" stroke={SKIN_DARKER} strokeWidth="0.7" opacity="0.6" />

                {/* 6 retângulos de abdominais */}
                <rect x="42" y="82" width="6.5" height="6" fill={MUSCLE_BASE} stroke={SKIN_DARKER} strokeWidth="0.5" />
                <rect x="51.5" y="82" width="6.5" height="6" fill={MUSCLE_BASE} stroke={SKIN_DARKER} strokeWidth="0.5" />
                <rect x="42" y="90" width="6.5" height="6" fill={MUSCLE_BASE} stroke={SKIN_DARKER} strokeWidth="0.5" />
                <rect x="51.5" y="90" width="6.5" height="6" fill={MUSCLE_BASE} stroke={SKIN_DARKER} strokeWidth="0.5" />
                <rect x="42" y="98" width="6.5" height="6" fill={MUSCLE_BASE} stroke={SKIN_DARKER} strokeWidth="0.5" />
                <rect x="51.5" y="98" width="6.5" height="6" fill={MUSCLE_BASE} stroke={SKIN_DARKER} strokeWidth="0.5" />
            </g>

            {/* Costas (visível quando necessário) - latíssimo dorsal */}
            <ellipse cx="50" cy="75" rx="12" ry="10" fill={MUSCLE_BASE} opacity="0.3" />

            {/* Cintura */}
            <ellipse cx="50" cy="112" rx="10" ry="7" fill={MUSCLE_BASE} stroke={SKIN_DARKER} strokeWidth="0.8" />

            {/* BRAÇO ESQUERDO */}
            {/* Ombro */}
            <circle cx={lArm.x} cy={lArm.y} r="4.5" fill={MUSCLE_BASE} stroke={SKIN_DARKER} strokeWidth="0.8" />

            {/* Bíceps - caminho suave */}
            <path
                d={`M ${lArm.x} ${lArm.y} Q ${lArm.x - 4} ${(lArm.y + lArm.ey)/2 - 3} ${lArm.ex} ${lArm.ey}`}
                stroke={phase === 1 ? MUSCLE_ACTIVE : MUSCLE_BASE}
                strokeWidth="4.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Cotovelo */}
            <circle cx={lArm.ex} cy={lArm.ey} r="2.8" fill={SKIN_TONE} stroke={SKIN_DARKER} strokeWidth="0.6" />

            {/* Antebraço */}
            <path
                d={`M ${lArm.ex} ${lArm.ey} L ${lArm.hx} ${lArm.hy}`}
                stroke={SKIN_TONE}
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
            />

            {/* Mão */}
            <ellipse cx={lArm.hx} cy={lArm.hy} rx="2.5" ry="3.5" fill={SKIN_TONE} stroke={SKIN_DARKER} strokeWidth="0.6" />

            {/* Sombra muscular no bíceps quando contraído */}
            {phase === 1 && (
                <ellipse cx={(lArm.x + lArm.ex)/2 - 2} cy={(lArm.y + lArm.ey)/2} rx="2.5" ry="1.8" fill={SKIN_DARKER} opacity="0.4" />
            )}

            {/* BRAÇO DIREITO */}
            {/* Ombro */}
            <circle cx={rArm.x} cy={rArm.y} r="4.5" fill={MUSCLE_BASE} stroke={SKIN_DARKER} strokeWidth="0.8" />

            {/* Bíceps - caminho suave */}
            <path
                d={`M ${rArm.x} ${rArm.y} Q ${rArm.x + 4} ${(rArm.y + rArm.ey)/2 - 3} ${rArm.ex} ${rArm.ey}`}
                stroke={phase === 1 ? MUSCLE_ACTIVE : MUSCLE_BASE}
                strokeWidth="4.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Cotovelo */}
            <circle cx={rArm.ex} cy={rArm.ey} r="2.8" fill={SKIN_TONE} stroke={SKIN_DARKER} strokeWidth="0.6" />

            {/* Antebraço */}
            <path
                d={`M ${rArm.ex} ${rArm.ey} L ${rArm.hx} ${rArm.hy}`}
                stroke={SKIN_TONE}
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
            />

            {/* Mão */}
            <ellipse cx={rArm.hx} cy={rArm.hy} rx="2.5" ry="3.5" fill={SKIN_TONE} stroke={SKIN_DARKER} strokeWidth="0.6" />

            {/* Sombra muscular no bíceps quando contraído */}
            {phase === 1 && (
                <ellipse cx={(rArm.x + rArm.ex)/2 + 2} cy={(rArm.y + rArm.ey)/2} rx="2.5" ry="1.8" fill={SKIN_DARKER} opacity="0.4" />
            )}

            {/* Cintura/quadril */}
            <path d="M 40 112 Q 50 118 60 112" fill={MUSCLE_BASE} stroke={SKIN_DARKER} strokeWidth="0.8" />

            {/* PERNA ESQUERDA */}
            {/* Coxa */}
            <path
                d="M 43 118 Q 40 135 42 155"
                stroke={MUSCLE_BASE}
                strokeWidth="5.5"
                fill="none"
                strokeLinecap="round"
            />
            {/* Sombreado na coxa */}
            <path
                d="M 43.5 118 Q 41.5 135 43.5 155"
                stroke={SKIN_DARKER}
                strokeWidth="2"
                fill="none"
                opacity="0.3"
            />

            {/* Joelho */}
            <circle cx="42" cy="155" r="2.5" fill={SKIN_TONE} stroke={SKIN_DARKER} strokeWidth="0.6" />

            {/* Panturrilha */}
            <path
                d="M 42 155 Q 44 168 42 182"
                stroke={MUSCLE_BASE}
                strokeWidth="4.5"
                fill="none"
                strokeLinecap="round"
            />

            {/* Pé */}
            <ellipse cx="42" cy="185" rx="3" ry="2.5" fill={SHADOW} stroke={SKIN_DARKER} strokeWidth="0.6" />

            {/* PERNA DIREITA */}
            {/* Coxa */}
            <path
                d="M 57 118 Q 60 135 58 155"
                stroke={MUSCLE_BASE}
                strokeWidth="5.5"
                fill="none"
                strokeLinecap="round"
            />
            {/* Sombreado na coxa */}
            <path
                d="M 56.5 118 Q 58.5 135 56.5 155"
                stroke={SKIN_DARKER}
                strokeWidth="2"
                fill="none"
                opacity="0.3"
            />

            {/* Joelho */}
            <circle cx="58" cy="155" r="2.5" fill={SKIN_TONE} stroke={SKIN_DARKER} strokeWidth="0.6" />

            {/* Panturrilha */}
            <path
                d="M 58 155 Q 56 168 58 182"
                stroke={MUSCLE_BASE}
                strokeWidth="4.5"
                fill="none"
                strokeLinecap="round"
            />

            {/* Pé */}
            <ellipse cx="58" cy="185" rx="3" ry="2.5" fill={SHADOW} stroke={SKIN_DARKER} strokeWidth="0.6" />
        </g>
    )
}

// ─── Máquina Pec Deck profissional ────────────────────────────────────────────
function PecDeckMachine({ phase }) {
    return (
        <g opacity="0.7">
            {/* Moldura superior */}
            <rect x="5" y="8" width="90" height="6" rx="2" fill={METAL} stroke={METAL_DARK} strokeWidth="0.8" />

            {/* Coluna esquerda */}
            <rect x="8" y="14" width="4.5" height="175" fill={METAL_DARK} stroke={METAL} strokeWidth="0.8" rx="2" />

            {/* Coluna direita */}
            <rect x="87.5" y="14" width="4.5" height="175" fill={METAL_DARK} stroke={METAL} strokeWidth="0.8" rx="2" />

            {/* Assento */}
            <ellipse cx="50" cy="165" rx="22" ry="6" fill={METAL_DARK} stroke={METAL} strokeWidth="1" />
            <rect x="32" y="169" width="36" height="4" rx="1" fill={METAL} stroke={METAL_DARK} strokeWidth="0.6" />

            {/* Encosto */}
            <path d="M 35 160 L 33 140 L 33 130" stroke={METAL} strokeWidth="3" fill="none" strokeLinecap="round" />

            {/* Braço esquerdo (handle) */}
            {phase === 0 ? (
                <path d="M 18 85 L 15 65 Q 14 55 18 48" stroke={METAL} strokeWidth="3" fill="none" strokeLinecap="round" />
            ) : (
                <path d="M 18 85 Q 30 80 42 72" stroke={METAL} strokeWidth="3" fill="none" strokeLinecap="round" />
            )}
            <circle cx={phase === 0 ? 18 : 42} cy={phase === 0 ? 48 : 72} r="1.8" fill={METAL} />

            {/* Braço direito (handle) */}
            {phase === 0 ? (
                <path d="M 82 85 L 85 65 Q 86 55 82 48" stroke={METAL} strokeWidth="3" fill="none" strokeLinecap="round" />
            ) : (
                <path d="M 82 85 Q 70 80 58 72" stroke={METAL} strokeWidth="3" fill="none" strokeLinecap="round" />
            )}
            <circle cx={phase === 0 ? 82 : 58} cy={phase === 0 ? 48 : 72} r="1.8" fill={METAL} />

            {/* Cabos */}
            <path d="M 18 30 Q 16 60 18 85" stroke={METAL_DARK} strokeWidth="1.2" opacity="0.6" fill="none" />
            <path d="M 82 30 Q 84 60 82 85" stroke={METAL_DARK} strokeWidth="1.2" opacity="0.6" fill="none" />

            {/* Pilha de pesos esquerda */}
            <rect x="10" y="70" width="9" height="35" fill={METAL_DARK} stroke={METAL} strokeWidth="0.8" rx="1" />
            <line x1="10" y1="76" x2="19" y2="76" stroke={METAL} strokeWidth="0.6" opacity="0.5" />
            <line x1="10" y1="82" x2="19" y2="82" stroke={METAL} strokeWidth="0.6" opacity="0.5" />
            <line x1="10" y1="88" x2="19" y2="88" stroke={METAL} strokeWidth="0.6" opacity="0.5" />

            {/* Pilha de pesos direita */}
            <rect x="81" y="70" width="9" height="35" fill={METAL_DARK} stroke={METAL} strokeWidth="0.8" rx="1" />
            <line x1="81" y1="76" x2="90" y2="76" stroke={METAL} strokeWidth="0.6" opacity="0.5" />
            <line x1="81" y1="82" x2="90" y2="82" stroke={METAL} strokeWidth="0.6" opacity="0.5" />
            <line x1="81" y1="88" x2="90" y2="88" stroke={METAL} strokeWidth="0.6" opacity="0.5" />

            {/* Pés da máquina */}
            <rect x="10" y="185" width="4" height="4" fill={METAL_DARK} rx="1" />
            <rect x="86" y="185" width="4" height="4" fill={METAL_DARK} rx="1" />
        </g>
    )
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ExerciseAnimation({ exercise, large = false }) {
    const [phase, setPhase] = useState(0)
    const [fade, setFade] = useState(false)

    const type = getType(exercise)

    // Tamanho responsivo
    const containerSize = large ? { w: '520px', h: '600px' } : { w: '150px', h: '180px' }
    const svgSize = large ? { w: 520, h: 600 } : { w: 150, h: 180 }

    useEffect(() => {
        const id = setInterval(() => {
            setFade(true)
            setTimeout(() => { setPhase(p => 1 - p); setFade(false) }, 300)
        }, 1500)
        return () => clearInterval(id)
    }, [type])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: large ? '18px' : '8px' }}>
            <div style={{
                width: containerSize.w,
                height: containerSize.h,
                background: large ? 'linear-gradient(to bottom, rgba(5,5,10,0.9), rgba(10,10,20,0.95))' : 'rgba(10,10,15,0.85)',
                border: '2px solid rgba(232,116,74,0.3)',
                borderRadius: large ? '24px' : '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', position: 'relative',
                boxShadow: large ? '0 0 50px rgba(232,116,74,0.1), inset 0 0 60px rgba(0,0,0,0.4)' : 'none'
            }}>
                <svg
                    viewBox="0 0 100 200"
                    width={svgSize.w}
                    height={svgSize.h}
                    style={{
                        opacity: fade ? 0.25 : 1,
                        transition: 'opacity 0.3s ease'
                    }}
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Máquina ao fundo */}
                    <PecDeckMachine phase={phase} />

                    {/* Figura humana em primeiro plano */}
                    <DetailedHumanFigure phase={phase} />
                </svg>
            </div>

            <div style={{
                fontSize: large ? '1rem' : '0.55rem',
                fontWeight: 900,
                letterSpacing: large ? '2.5px' : '1.2px',
                color: 'rgba(232,116,74,0.8)',
                textAlign: 'center',
                textTransform: 'uppercase'
            }}>
                {exercise.name.toUpperCase()}
            </div>

            {large && (
                <div style={{
                    fontSize: '0.85rem',
                    color: 'rgba(232,116,74,0.6)',
                    textAlign: 'center',
                    maxWidth: '480px',
                    lineHeight: '1.6',
                    fontStyle: 'italic'
                }}>
                    <strong>Esquerda:</strong> Posição inicial • <strong>Direita:</strong> Contração máxima<br />
                    Mantenha a amplitude completa do movimento
                </div>
            )}
        </div>
    )
}
