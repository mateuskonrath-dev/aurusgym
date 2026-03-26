import { useRef, useEffect, useState } from 'react'

export default function ScrollPicker({ value, min, max, unit, onChange }) {
    const scrollRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)
    const [startY, setStartY] = useState(0)
    const [currentValue, setCurrentValue] = useState(value || min)

    const itemHeight = 45
    const visibleItems = 5
    const containerHeight = itemHeight * visibleItems

    // Gerar lista de valores
    const values = []
    for (let i = min; i <= max; i++) {
        values.push(i)
    }

    useEffect(() => {
        setCurrentValue(value || min)
        // Scroll automático para o valor selecionado
        if (scrollRef.current) {
            const index = values.indexOf(value || min)
            const scrollTop = index * itemHeight - (containerHeight / 2 - itemHeight / 2)
            scrollRef.current.scrollTop = scrollTop
        }
    }, [value, min, max])

    const handleWheel = (e) => {
        e.preventDefault()
        const delta = e.deltaY > 0 ? 1 : -1
        const newValue = Math.max(min, Math.min(max, currentValue + delta))
        setCurrentValue(newValue)
        onChange(newValue)
    }

    const handleTouchStart = (e) => {
        setIsDragging(true)
        setStartY(e.touches[0].clientY)
    }

    const handleTouchMove = (e) => {
        if (!isDragging) return
        const deltaY = e.touches[0].clientY - startY
        const delta = Math.round(-deltaY / itemHeight)
        if (delta !== 0) {
            const newValue = Math.max(min, Math.min(max, currentValue + delta))
            setCurrentValue(newValue)
            onChange(newValue)
            setStartY(e.touches[0].clientY)
        }
    }

    const handleTouchEnd = () => {
        setIsDragging(false)
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

    return (
        <div
            ref={scrollRef}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
                height: `${containerHeight}px`,
                overflow: 'auto',
                position: 'relative',
                scrollBehavior: 'smooth',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-pro)',
                border: '1px solid var(--border-subtle)',
                padding: `${containerHeight / 2 - itemHeight / 2}px 0`,
                boxSizing: 'border-box',
                scrollSnapType: 'y mandatory',
            }}
        >
            {/* Overlay superior (efeito fade) */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '80px',
                    pointerEvents: 'none',
                    background: 'linear-gradient(to bottom, var(--bg-base), transparent)',
                    zIndex: 10
                }}
            />

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
                            fontSize: isSelected ? '1.4rem' : '1rem',
                            fontWeight: isSelected ? 800 : 500,
                            color: isSelected ? 'var(--brand-primary)' : 'var(--text-med)',
                            transition: 'all 0.2s ease',
                            scrollSnapAlign: 'center',
                            userSelect: 'none',
                            opacity: isSelected ? 1 : 0.5,
                            letterSpacing: isSelected ? '1px' : '0px',
                        }}
                    >
                        {val} {unit && <span style={{ fontSize: '0.7em', marginLeft: '4px' }}>{unit}</span>}
                    </div>
                )
            })}

            {/* Overlay inferior (efeito fade) */}
            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '80px',
                    pointerEvents: 'none',
                    background: 'linear-gradient(to top, var(--bg-base), transparent)',
                    zIndex: 10
                }}
            />

            {/* Linha central destacadora */}
            <div
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'var(--brand-primary)',
                    transform: 'translateY(-50%)',
                    zIndex: 5,
                    pointerEvents: 'none'
                }}
            />
        </div>
    )
}
