import React from 'react';

export default function WeeklyRoadmap({ weeklyPlan, completedDays, currentDayIndex, selectedDayIndex, onSelectDay }) {
    return (
        <div className="weekly-roadmap-v3" style={{ display: 'flex', gap: '10px' }}>
            {weeklyPlan.map((day, idx) => {
                const isCompleted = completedDays.includes(idx);
                const isSelected = selectedDayIndex === idx;
                return (
                    <div key={idx} onClick={() => onSelectDay(idx)}
                        style={{ flex: 1, textAlign: 'center', cursor: 'pointer', opacity: isSelected ? 1 : 0.4, transition: 'all 0.2s' }}>
                        <p className="data-label" style={{ fontSize: '0.55rem' }}>{day.label}</p>
                        <div style={{
                            height: '30px',
                            background: isCompleted ? 'var(--brand-primary)' : (isSelected ? 'transparent' : 'var(--bg-card)'),
                            border: isCompleted ? '1px solid var(--brand-primary)' : (isSelected ? '1px solid var(--brand-primary)' : '1px solid var(--border-subtle)'),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: isCompleted ? '#000' : (isSelected ? 'var(--brand-primary)' : '#fff'),
                            fontSize: '0.7rem', fontWeight: 900, borderRadius: '4px'
                        }}>
                            {isCompleted ? '✓' : (day.isRest ? 'Z' : (idx === currentDayIndex ? '●' : '—'))}
                        </div>
                    </div>
                )
            })}
        </div>
    );
}
