import React from 'react';
import { AppSettings, WeatherState, ClockSkin } from '../types';
import { getWeatherIcon, getWeatherDescription } from '../utils/weather';
import { Loader2, AlertCircle } from 'lucide-react';

interface WeatherWidgetProps {
  weather: WeatherState;
  settings: AppSettings;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, settings }) => {
  const { theme, skin } = settings;
  const { temperature, weatherCode, isDay, loading, error } = weather;

  if (!settings.showWeather) return null;

  // Loading State
  if (loading) {
    return (
      <div className="absolute top-8 left-8 flex items-center gap-2 animate-pulse opacity-50">
        <Loader2 className="w-5 h-5 animate-spin" style={{ color: theme }} />
        <span className="font-mono-tech text-xs" style={{ color: theme }}>SCANNING ATMOSPHERE...</span>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="absolute top-8 left-8 flex items-center gap-2 opacity-50" title={error}>
        <AlertCircle className="w-5 h-5 text-red-500" />
        <span className="font-mono-tech text-xs text-red-400">OFFLINE</span>
      </div>
    );
  }

  if (temperature === null || weatherCode === null) return null;

  const Icon = getWeatherIcon(weatherCode, isDay);
  const description = getWeatherDescription(weatherCode);

  // --- Skin Styles ---

  // Cyberpunk Style
  if (skin === ClockSkin.CYBERPUNK) {
    return (
      <div className="absolute top-6 left-6 md:top-10 md:left-10 flex flex-col gap-1 select-none animate-in fade-in slide-in-from-left-4 duration-700">
        <div className="flex items-center gap-4">
          <div className="relative">
             <Icon className="w-10 h-10 md:w-14 md:h-14" style={{ color: theme, filter: `drop-shadow(0 0 10px ${theme})` }} />
          </div>
          <div>
            <div className="text-3xl md:text-5xl font-bold font-orbitron" style={{ color: '#fff', textShadow: `0 0 20px ${theme}` }}>
              {Math.round(temperature)}°
            </div>
            <div className="h-1 w-full bg-zinc-800 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-white w-2/3 animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="text-xs font-mono-tech tracking-[0.2em] uppercase mt-1" style={{ color: theme, textShadow: `0 0 5px ${theme}` }}>
            {description}
        </div>
      </div>
    );
  }

  // Retro Style
  if (skin === ClockSkin.RETRO) {
    return (
      <div className="absolute top-6 left-6 flex items-center gap-4 select-none font-retro p-4 border-2 rounded-lg" style={{ borderColor: theme, backgroundColor: 'rgba(0,0,0,0.8)' }}>
        <Icon className="w-8 h-8" style={{ color: theme }} strokeWidth={2.5} />
        <div className="flex flex-col">
           <span className="text-3xl leading-none" style={{ color: theme }}>{Math.round(temperature)}°C</span>
           <span className="text-sm uppercase opacity-80" style={{ color: theme }}>{description}</span>
        </div>
      </div>
    );
  }

  // Minimal Style
  return (
    <div className="absolute top-8 left-8 flex items-center gap-3 select-none">
       <Icon className="w-6 h-6" style={{ color: theme }} />
       <span className="text-2xl font-minimal font-light text-white">{Math.round(temperature)}°</span>
    </div>
  );
};