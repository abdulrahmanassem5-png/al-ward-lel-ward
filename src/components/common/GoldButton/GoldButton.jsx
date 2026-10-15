import React from 'react';
import './GoldButton.css';

export default function GoldButton({
  children,
  variant = 'primary', // 'primary' | 'outline' | 'ghost' | 'rose'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon = null,
  iconPosition = 'start',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const classes = [
    'gold-button',
    `gold-button--${variant}`,
    `gold-button--${size}`,
    loading ? 'gold-button--loading' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      <span className="gold-button-shine" />
      <span className="gold-button-content">
        {loading ? (
          <span className="gold-button-spinner" />
        ) : (
          <>
            {icon && iconPosition === 'start' && <span className="btn-icon">{icon}</span>}
            <span className="btn-text">{children}</span>
            {icon && iconPosition === 'end' && <span className="btn-icon">{icon}</span>}
          </>
        )}
      </span>
    </button>
  );
}
