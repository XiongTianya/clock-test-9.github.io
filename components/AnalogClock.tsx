import React from 'react';
import { AppSettings, ClockSkin } from '../types';

interface AnalogClockProps {
  time: Date;
  settings: AppSettings;
}

export const AnalogClock: React.FC<AnalogClockProps> = ({ time, settings }) => {
  const { theme, skin } = settings;

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  // Calculate degrees
  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = ((minutes + seconds / 60) / 60) * 360;
  const hourDeg = ((hours % 12 + minutes / 60) / 12) * 360;

  const glowFilterId = "glow-filter";
  
  // Skin Configuration
  const isCyber = skin === ClockSkin.CYBERPUNK;
  const isRetro = skin === ClockSkin.RETRO;
  const isMinimal = skin === ClockSkin.MINIMAL;

  return (
    <div className="relative w-[300px] h-[300px] md:w-[500px] md:h-[500px] flex items-center justify-center select-none">
      <svg width="100%" height="100%" viewBox="0 0 300 300" className={isCyber ? "drop-shadow-2xl" : ""}>
        <defs>
          <filter id={glowFilterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Ring */}
        {isCyber && (
          <circle cx="150" cy="150" r="140" fill="none" stroke={theme} strokeWidth="4" filter={`url(#${glowFilterId})`} className="opacity-50" />
        )}
        {isRetro && (
          <rect x="10" y="10" width="280" height="280" rx="40" fill="none" stroke={theme} strokeWidth="8" />
        )}
        {isMinimal && (
           <circle cx="150" cy="150" r="145" fill="none" stroke={theme} strokeWidth="2" className="opacity-80" />
        )}
        
        {/* Inner Ticks (Hours) */}
        {[...Array(12)].map((_, i) => {
          const rotation = i * 30;
          return (
            <line
              key={i}
              x1="150"
              y1={isRetro ? "40" : "25"}
              x2="150"
              y2={isRetro ? "60" : "40"}
              stroke={theme}
              strokeWidth={isRetro ? "6" : isMinimal ? "2" : "4"}
              transform={`rotate(${rotation} 150 150)`}
              filter={isCyber ? `url(#${glowFilterId})` : undefined}
            />
          );
        })}

        {/* Inner Ticks (Minutes) - Skip for Retro/Minimal for cleaner look */}
        {isCyber && [...Array(60)].map((_, i) => {
          if (i % 5 === 0) return null;
          const rotation = i * 6;
          return (
            <line
              key={i}
              x1="150"
              y1="25"
              x2="150"
              y2="30"
              stroke={theme}
              strokeWidth="1"
              className="opacity-40"
              transform={`rotate(${rotation} 150 150)`}
            />
          );
        })}

        {/* Hour Hand */}
        <line
          x1="150"
          y1="150"
          x2="150"
          y2={isRetro ? "90" : "80"}
          stroke={isMinimal ? theme : "#ffffff"}
          strokeWidth={isRetro ? "12" : "6"}
          strokeLinecap={isRetro ? "butt" : "round"}
          transform={`rotate(${hourDeg} 150 150)`}
          filter={isCyber ? `url(#${glowFilterId})` : undefined}
        />

        {/* Minute Hand */}
        <line
          x1="150"
          y1="150"
          x2="150"
          y2={isRetro ? "60" : "50"}
          stroke={isMinimal ? theme : "#ffffff"}
          strokeWidth={isRetro ? "8" : "4"}
          strokeLinecap={isRetro ? "butt" : "round"}
          transform={`rotate(${minuteDeg} 150 150)`}
          filter={isCyber ? `url(#${glowFilterId})` : undefined}
        />

        {/* Second Hand */}
        <line
          x1="150"
          y1={isMinimal ? "150" : "160"}
          x2="150"
          y2="35"
          stroke={theme}
          strokeWidth={isRetro ? "4" : "2"}
          transform={`rotate(${secondDeg} 150 150)`}
          filter={isCyber ? `url(#${glowFilterId})` : undefined}
        />

        {/* Center Dot */}
        <circle cx="150" cy="150" r={isRetro ? "10" : "6"} fill={theme} filter={isCyber ? `url(#${glowFilterId})` : undefined} />
      </svg>
      
      {/* Date in Analog */}
      {settings.showDate && (
        <div 
          className={`absolute bottom-16 md:bottom-28 text-lg md:text-xl tracking-widest uppercase font-bold ${isRetro ? 'font-retro text-2xl' : isMinimal ? 'font-minimal' : 'font-mono-tech'}`}
          style={{ color: theme, textShadow: isCyber ? `0 0 8px ${theme}` : 'none' }}
        >
          {time.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
        </div>
      )}
    </div>
  );
};