import { useRef, useEffect, useState, useMemo } from 'react'

export default function ScrollPicker({ value, min, max, unit, onChange }) {
    const scrollRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)
    const [currentValue, setCurrentValue] = useState(value || min)
    const [velocity, setVelocity] = useState(0)
    const [isScrolling, setIsScrolling] = useState(false)
    const lastYRef = useRef(0)
    const lastTimeRef = useRef(null)
    const animationRef = useRef(null)

    // Initialize last time on mount
    useEffect(() => {
        if (!lastTimeRef.current) {
            lastTimeRef.current = Date.now()
        }
    }, [])

    const itemHeight = 40
    const visibleItems = 5
    const containerHeight = itemHeight * visibleItems

    // Gerar lista de valores (memoized para evitar recriação a cada render)
    const values = useMemo(() => {
        const arr = []
        for (let i = min; i <= max; i++) {
            arr.push(i)
        }
        return arr
    }, [min, max])

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
    useEffect(() => {
        if (!isScrolling && scrollRef.current) {
            const scrollTop = scrollRef.current.scrollTop
            const closestIndex = Math.round(scrollTop / itemHeight)
            const snappedValue = Math.max(min, Math.min(max, values[closestIndex] || currentValue))
            if (snappedValue !== currentValue) {
                // Use a small timeout to avoid cascading renders
                const timer = setTimeout(() => {
                    setCurrentValue(snappedValue)
                    onChange(snappedValue)
                }, 0)
                return () => clearTimeout(timer)
            }
        }
    }, [isScrolling, min, max, currentValue, onChange, values])

    const handleWheel = (e) => {
        e.preventDefault()
        setIsScrolling(true)
        const delta = e.deltaY > 0 ? 1 : -1
        const newValue = Math.max(min, Math.min(max, currentValue + delta))
        setCurrentValue(newValue)
        onChange(newValue)

        if (scrollRef.current) {
            const index = values.indexOf(newValue)
            const scrollTop = index * itemHeight - (containerHeight / 2 - itemHeight / 2)
            scrollRef.current.scrollTop = scrollTop
        }

        setTimeout(() => setIsScrolling(false), 400)
    }

    const handleTouchStart = (e) => {
        setIsDragging(true)
        setIsScrolling(true)
        lastYRef.current = e.touches[0].clientY
        lastTimeRef.current = Date.now()
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current)
        }
    }

    const handleTouchMove = (e) => {
        if (!isDragging) return

        const currentY = e.touches[0].clientY
        const now = Date.now()
        const deltaY = currentY - lastYRef.current
        const deltaTime = now - lastTimeRef.current

        if (deltaTime > 0) {
            setVelocity(-deltaY / deltaTime)
        }

        const delta = Math.round(-deltaY / itemHeight)
        if (delta !== 0) {
            const newValue = Math.max(min, Math.min(max, currentValue + delta))
            setCurrentValue(newValue)
            onChange(newValue)
            lastYRef.current = currentY
            lastTimeRef.current = now
        }
    }

    const handleTouchEnd = () => {
        setIsDragging(false)

        // Inércia suave e fluida
        let currentVel = velocity
        const friction = 0.92  // Reduzido de 0.95 para deixar mais fluido

        const animate = () => {
            if (Math.abs(currentVel) > 0.05) {  // Aumentado de 0.1 para deslizar mais tempo
                const delta = Math.round(-currentVel * itemHeight)
                const newValue = Math.max(min, Math.min(max, currentValue + delta))
                if (newValue !== currentValue) {
                    setCurrentValue(newValue)
                    onChange(newValue)
                }
                currentVel *= friction
                animationRef.current = requestAnimationFrame(animate)
            } else {
                setIsScrolling(false)
            }
        }

        if (Math.abs(velocity) > 0.01) {
            animate()
        } else {
            setIsScrolling(false)
        }
    }

    const handleItemClick = (val) => {
        setCurrentValue(val)
        onChange(val)
        setIsScrolling(true)
        if (scrollRef.current) {
            const index = values.indexOf(val)
            const scrollTop = index * itemHeight - (containerHeight / 2 - itemHeight / 2)
            scrollRef.current.scrollTop = scrollTop
        }
        setTimeout(() => setIsScrolling(false), 400)
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
            ref={scrollRef}
            role="spinbutton"
            aria-valuenow={currentValue}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-label={`Seletor de valor entre ${min} e ${max}`}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            style={{
                height: `${containerHeight}px`,
                overflow: 'auto',
                position: 'relative',
                scrollBehavior: 'smooth',
                background: 'linear-gradient(to bottom, rgba(var(--brand-primary-rgb, 100, 200, 255), 0.05), transparent, rgba(var(--brand-primary-rgb, 100, 200, 255), 0.05))',
                borderRadius: 'var(--radius-pro)',
                border: '1px solid var(--border-subtle)',
                padding: `${containerHeight / 2 - itemHeight / 2}px 0`,
                boxSizing: 'border-box',
                scrollSnapType: 'none',
                WebkitOverflowScrolling: 'touch',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
                willChange: 'scroll-position',
            }}
        >
            {/* Overlay superior com fade suave */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '100px',
                    pointerEvents: 'none',
                    background: 'linear-gradient(to bottom, var(--bg-base) 0%, var(--bg-base) 40%, transparent 100%)',
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

            {/* Overlay inferior com fade suave */}
            <div
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '100px',
                    pointerEvents: 'none',
                    background: 'linear-gradient(to top, var(--bg-base) 0%, var(--bg-base) 40%, transparent 100%)',
                    zIndex: 10
                }}
            />

            {/* Highlight sutil no centro */}
            <div
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: 0,
                    right: 0,
                    height: `${itemHeight + 8}px`,
                    background: 'radial-gradient(ellipse at center, rgba(var(--brand-primary-rgb, 100, 200, 255), 0.1) 0%, transparent 70%)',
                    transform: 'translateY(-50%)',
                    zIndex: 4,
                    pointerEvents: 'none',
                    borderRadius: 'var(--radius-pro)'
                }}
            />
        </div>
    )
}
