export enum ClockMode {
  DIGITAL = 'DIGITAL',
  ANALOG = 'ANALOG'
}

export enum ClockSkin {
  CYBERPUNK = 'CYBERPUNK',
  RETRO = 'RETRO',
  MINIMAL = 'MINIMAL'
}

export enum ThemeColor {
  CYBER_BLUE = '#00f3ff',
  NEON_RED = '#ff003c',
  MATRIX_GREEN = '#0aff00',
  PURPLE_HAZE = '#bc13fe',
  SOLAR_YELLOW = '#ffee00'
}

export interface Alarm {
  id: string;
  time: string; // Format "HH:MM"
  label: string;
  enabled: boolean;
}

export interface TimerState {
  mode: 'STOPWATCH' | 'COUNTDOWN';
  status: 'IDLE' | 'RUNNING' | 'PAUSED';
  elapsed: number; // ms elapsed for stopwatch
  remaining: number; // ms remaining for countdown
  initialDuration: number; // ms for countdown reset
  lastTick: number; // timestamp for accurate interval calculation
}

export interface WeatherState {
  temperature: number | null;
  weatherCode: number | null;
  isDay: boolean;
  loading: boolean;
  error: string | null;
}

export interface AppSettings {
  is24Hour: boolean;
  showSeconds: boolean;
  showDate: boolean;
  showWeather: boolean;
  theme: ThemeColor;
  mode: ClockMode;
  skin: ClockSkin;
  matrixSpeed: number;
}