import React from 'react';
import './GlassCard.css';

export default function GlassCard({
  children,
  className = '',
  variant = 'default', // 'default' | 'gold' | 'interactive' | 'elevated'
  onClick,
  style = {},
  ...props
}) {
  const classes = [
    'glass-card',
    `glass-card--${variant}`,
    onClick ? 'glass-card--clickable' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      onClick={onClick}
      style={style}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      <div className="glass-card-glow" />
      <div className="glass-card-content">{children}</div>
    </div>
  );
}
