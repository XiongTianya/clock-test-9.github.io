import React from 'react';
import { AppSettings, ClockSkin } from '../types';

interface DigitalClockProps {
  time: Date;
  settings: AppSettings;
}

export const DigitalClock: React.FC<DigitalClockProps> = ({ time, settings }) => {
  const { is24Hour, showSeconds, theme, skin } = settings;

  const hours = is24Hour ? time.getHours() : time.getHours() % 12 || 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM';

  const pad = (num: number) => num.toString().padStart(2, '0');

  // Styles based on Skin
  const getStyles = () => {
    switch (skin) {
      case ClockSkin.RETRO:
        return {
          fontFamily: 'font-retro', // VT323
          glow: `0 0 5px ${theme}`,
          digitGlow: `2px 2px 0px rgba(0,0,0,0.5)`, // Retro shadow
          separator: 'opacity-100', // Solid separator
          containerClass: 'gap-4',
        };
      case ClockSkin.MINIMAL:
        return {
          fontFamily: 'font-minimal', // Inter
          glow: 'none',
          digitGlow: 'none',
          separator: 'opacity-80 font-light',
          containerClass: 'gap-2',
        };
      case ClockSkin.CYBERPUNK:
      default:
        return {
          fontFamily: 'font-orbitron',
          glow: `0 0 10px ${theme}`,
          digitGlow: `0 0 20px ${theme}, 0 0 40px ${theme}, 0 0 80px ${theme}`,
          separator: 'animate-pulse-slow',
          containerClass: 'mx-2 md:mx-4',
        };
    }
  };

  const style = getStyles();

  return (
    <div className={`flex flex-col items-center justify-center select-none ${style.fontFamily}`}>
      {/* Time Display */}
      <div className="flex items-baseline leading-none tracking-widest relative">
        
        {/* Hours */}
        <div className={`flex flex-col items-center ${style.containerClass}`}>
          <span 
            className="text-[5rem] md:text-[8rem] lg:text-[12rem] font-bold tabular-nums transition-all duration-300"
            style={{ 
              color: skin === ClockSkin.CYBERPUNK ? '#fff' : theme,
              textShadow: style.digitGlow 
            }}
          >
            {pad(hours)}
          </span>
          {skin === ClockSkin.CYBERPUNK && (
            <span style={{ color: theme, textShadow: style.glow }} className="text-sm md:text-xl font-mono-tech tracking-[0.5em] opacity-80 mt-2">HOURS</span>
          )}
        </div>

        {/* Separator */}
        <div 
          className={`text-[4rem] md:text-[6rem] lg:text-[8rem] self-start mt-4 md:mt-8 ${style.separator}`}
          style={{ color: skin === ClockSkin.MINIMAL ? '#fff' : 'gray' }}
        >
          :
        </div>

        {/* Minutes */}
        <div className={`flex flex-col items-center ${style.containerClass}`}>
          <span 
            className="text-[5rem] md:text-[8rem] lg:text-[12rem] font-bold tabular-nums transition-all duration-300"
            style={{ 
              color: skin === ClockSkin.CYBERPUNK ? '#fff' : theme,
              textShadow: style.digitGlow 
            }}
          >
            {pad(minutes)}
          </span>
          {skin === ClockSkin.CYBERPUNK && (
            <span style={{ color: theme, textShadow: style.glow }} className="text-sm md:text-xl font-mono-tech tracking-[0.5em] opacity-80 mt-2">MINUTES</span>
          )}
        </div>

        {/* Seconds (Optional) */}
        {showSeconds && (
          <>
            <div 
               className={`text-[4rem] md:text-[6rem] lg:text-[8rem] self-start mt-4 md:mt-8 ${style.separator}`}
               style={{ color: skin === ClockSkin.MINIMAL ? '#fff' : 'gray' }}
            >
              :
            </div>
            <div className={`flex flex-col items-center ${style.containerClass}`}>
              <span 
                className="text-[5rem] md:text-[8rem] lg:text-[12rem] font-bold tabular-nums transition-all duration-300"
                style={{ 
                    color: skin === ClockSkin.CYBERPUNK ? '#fff' : theme,
                    textShadow: style.digitGlow 
                }}
              >
                {pad(seconds)}
              </span>
              {skin === ClockSkin.CYBERPUNK && (
                <span style={{ color: theme, textShadow: style.glow }} className="text-sm md:text-xl font-mono-tech tracking-[0.5em] opacity-80 mt-2">SECONDS</span>
              )}
            </div>
          </>
        )}

        {/* AM/PM Indicator for 12h mode */}
        {!is24Hour && (
          <div className="absolute -right-8 top-4 md:-right-16 md:top-8">
            <span 
                className="text-2xl md:text-4xl font-bold"
                style={{ color: theme }}
            >
              {ampm}
            </span>
          </div>
        )}
      </div>

      {/* Date Display */}
      {settings.showDate && (
        <div className="mt-8 md:mt-16">
          <div 
            className={`text-lg md:text-3xl tracking-[0.2em] uppercase transition-colors duration-300 ${skin === ClockSkin.CYBERPUNK ? 'border-y-2 py-2 px-6 font-mono-tech' : ''}`}
            style={{ 
                borderColor: theme, 
                color: theme, 
                textShadow: style.glow,
                fontFamily: skin === ClockSkin.RETRO ? 'VT323' : undefined
            }}
          >
            {time.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
      )}
    </div>
  );
};