import React from 'react';

const Logo = ({ width = "2.5em", height = "1.4em" }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* Background gradient circle */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#c770f0', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#8a49a8', stopOpacity: 1 }} />
        </linearGradient>
        
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#f0e6ff', stopOpacity: 1 }} />
        </linearGradient>

        {/* Glow effect */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Rounded rectangle background with gradient */}
      <rect
        x="2"
        y="2"
        width="116"
        height="56"
        rx="16"
        fill="url(#logoGradient)"
        filter="url(#glow)"
      />
      
      {/* Inner border for depth */}
      <rect
        x="4"
        y="4"
        width="112"
        height="52"
        rx="14"
        fill="none"
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="1"
      />

      {/* HT Text */}
      <text
        x="60"
        y="42"
        fontFamily="'Segoe UI', 'Roboto', 'Arial', sans-serif"
        fontSize="36"
        fontWeight="700"
        fill="url(#textGradient)"
        textAnchor="middle"
        letterSpacing="2"
      >
        HT
      </text>

      {/* Decorative dot accent */}
      <circle cx="95" cy="15" r="3" fill="rgba(255, 255, 255, 0.6)" />
    </svg>
  );
};

export default Logo;
