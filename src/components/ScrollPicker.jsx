import { useRef, useEffect, useState, useMemo } from 'react'

export default function ScrollPicker({ value, min, max, unit, onChange }) {
    const scrollRef = useRef(null)
    const containerRef = useRef(null)
    const [currentValue, setCurrentValue] = useState(value || min)
    const scrollTimeoutRef = useRef(null)

    const itemHeight = 40
    const visibleItems = 5
    const containerHeight = itemHeight * visibleItems

    // Gerar lista de valores (memoized)
    const values = useMemo(() => {
        const arr = []
        for (let i = min; i <= max; i++) {
            arr.push(i)
        }
        return arr
    }, [min, max])

    // Sincronizar scroll com valor externo
    useEffect(() => {
        const newValue = value || min
        setCurrentValue(newValue)
        if (scrollRef.current) {
            const index = values.indexOf(newValue)
            const scrollTop = index * itemHeight - (containerHeight / 2 - itemHeight / 2)
            scrollRef.current.scrollTop = scrollTop
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, min])

    // Snap to center quando param de scrollar
    const snapToCenter = () => {
        if (!scrollRef.current) return

        const scrollTop = scrollRef.current.scrollTop
        const closestIndex = Math.round(scrollTop / itemHeight)
        const snappedValue = Math.max(min, Math.min(max, values[closestIndex] || currentValue))

        if (snappedValue !== currentValue) {
            setCurrentValue(snappedValue)
            onChange(snappedValue)

            // Animar scroll para posição exata (sem smooth, muito rápido)
            const targetScrollTop = closestIndex * itemHeight - (containerHeight / 2 - itemHeight / 2)
            if (Math.abs(scrollTop - targetScrollTop) > 1) {
                scrollRef.current.scrollTop = targetScrollTop
            }
        }
    }

    const handleScroll = () => {
        // Limpar timeout anterior
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current)
        }

        // Definir novo timeout para snap quando parar
        scrollTimeoutRef.current = setTimeout(() => {
            snapToCenter()
        }, 200) // Esperar 200ms após parar de scrollar
    }

    const handleWheel = (e) => {
        e.preventDefault()

        if (!scrollRef.current) return

        // Movimento simples: 1 item por evento de wheel
        const delta = e.deltaY > 0 ? 1 : -1
        const newValue = Math.max(min, Math.min(max, currentValue + delta))

        setCurrentValue(newValue)
        onChange(newValue)

        // Atualizar scroll position
        const index = values.indexOf(newValue)
        const scrollTop = index * itemHeight - (containerHeight / 2 - itemHeight / 2)
        scrollRef.current.scrollTop = scrollTop
    }

    const handleItemClick = (val) => {
        setCurrentValue(val)
        onChange(val)

        if (scrollRef.current) {
            const index = values.indexOf(val)
            const scrollTop = index * itemHeight - (containerHeight / 2 - itemHeight / 2)
            scrollRef.current.scrollTop = scrollTop
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault()
            const newValue = Math.max(min, currentValue - 1)
            setCurrentValue(newValue)
            onChange(newValue)
            if (scrollRef.current) {
                const index = values.indexOf(newValue)
                const scrollTop = index * itemHeight - (containerHeight / 2 - itemHeight / 2)
                scrollRef.current.scrollTop = scrollTop
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault()
            const newValue = Math.min(max, currentValue + 1)
            setCurrentValue(newValue)
            onChange(newValue)
            if (scrollRef.current) {
                const index = values.indexOf(newValue)
                const scrollTop = index * itemHeight - (containerHeight / 2 - itemHeight / 2)
                scrollRef.current.scrollTop = scrollTop
            }
        }
    }

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '100%',
                height: `${containerHeight}px`,
            }}
        >
            {/* Scroll container principal */}
            <div
                ref={scrollRef}
                role="spinbutton"
                aria-valuenow={currentValue}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-label={`Seletor de valor entre ${min} e ${max}`}
                onWheel={handleWheel}
                onScroll={handleScroll}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                style={{
                    height: `${containerHeight}px`,
                    overflow: 'auto',
                    position: 'relative',
                    background: 'linear-gradient(to bottom, rgba(var(--brand-primary-rgb, 100, 200, 255), 0.05), transparent, rgba(var(--brand-primary-rgb, 100, 200, 255), 0.05))',
                    borderRadius: 'var(--radius-pro)',
                    border: '1px solid var(--border-subtle)',
                    padding: `${containerHeight / 2 - itemHeight / 2}px 0`,
                    boxSizing: 'border-box',
                    scrollSnapType: 'none',
                    WebkitOverflowScrolling: 'auto', // Removido 'touch' para evitar lag
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'translateZ(0)',
                    willChange: 'scroll-position',
                }}
            >
                {values.map((val) => {
                    const isSelected = val === currentValue
                    return (
                        <div
                            key={val}
                            onClick={() => handleItemClick(val)}
                            style={{
                                height: `${itemHeight}px`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: isSelected ? '1.6rem' : '0.95rem',
                                fontWeight: isSelected ? 900 : 400,
                                color: isSelected ? 'var(--brand-primary)' : 'var(--text-med)',
                                transition: 'all 0.15s cubic-bezier(0.4, 0.0, 0.2, 1)',
                                scrollSnapAlign: 'none',
                                userSelect: 'none',
                                opacity: isSelected ? 1 : 0.4,
                                letterSpacing: isSelected ? '0.5px' : '0px',
                                transform: isSelected ? 'scale(1.05)' : 'scale(0.95)',
                            }}
                        >
                            {val} {unit && <span style={{ fontSize: '0.6em', marginLeft: '6px', opacity: 0.8 }}>{unit}</span>}
                        </div>
                    )
                })}
            </div>

            {/* Overlay superior com fade (posicionamento relativo ao container) */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '80px',
                    pointerEvents: 'none',
                    background: 'linear-gradient(to bottom, var(--bg-base) 0%, var(--bg-base) 50%, transparent 100%)',
                    zIndex: 10,
                    borderRadius: 'var(--radius-pro) var(--radius-pro) 0 0',
                }}
            />

            {/* Overlay inferior com fade (posicionamento relativo ao container) */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '80px',
                    pointerEvents: 'none',
                    background: 'linear-gradient(to top, var(--bg-base) 0%, var(--bg-base) 50%, transparent 100%)',
                    zIndex: 10,
                    borderRadius: '0 0 var(--radius-pro) var(--radius-pro)',
                }}
            />

            {/* Highlight sutil no centro (posicionamento relativo ao container) */}
            <div
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    right: 0,
                    height: `${itemHeight + 8}px`,
                    background: 'radial-gradient(ellipse at center, rgba(var(--brand-primary-rgb, 100, 200, 255), 0.1) 0%, transparent 70%)',
                    transform: 'translateY(-50%)',
                    zIndex: 4,
                    pointerEvents: 'none',
                    borderRadius: 'var(--radius-pro)',
                }}
            />
        </div>
    )
}
