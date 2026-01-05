import React, { useState, useEffect, useRef } from 'react';
import { Settings as SettingsIcon, BellRing, Timer as TimerIcon } from 'lucide-react';
import { useCurrentTime } from './hooks/useCurrentTime';
import { MatrixBackground } from './components/MatrixBackground';
import { DigitalClock } from './components/DigitalClock';
import { AnalogClock } from './components/AnalogClock';
import { SettingsPanel } from './components/SettingsPanel';
import { WeatherWidget } from './components/WeatherWidget';
import { AppSettings, ClockMode, ThemeColor, ClockSkin, Alarm, TimerState, WeatherState } from './types';
import { playSound } from './utils/sound';
import { fetchWeatherData } from './utils/weather';

const App: React.FC = () => {
  const time = useCurrentTime();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeAlarmId, setActiveAlarmId] = useState<string | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  
  // -- PWA INSTALL PROMPT LISTENER --
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e);
      console.log("Install Prompt Captured");
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  // -- SETTINGS STATE --
  const [settings, setSettings] = useState<AppSettings>({
    is24Hour: true,
    showSeconds: true,
    showDate: true,
    showWeather: true,
    theme: ThemeColor.CYBER_BLUE,
    mode: ClockMode.DIGITAL,
    skin: ClockSkin.CYBERPUNK,
    matrixSpeed: 8,
  });

  // -- WEATHER STATE --
  const [weather, setWeather] = useState<WeatherState>({
    temperature: null,
    weatherCode: null,
    isDay: true,
    loading: true,
    error: null
  });

  // -- ALARM STATE --
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  // -- TIMER STATE --
  const [timer, setTimer] = useState<TimerState>({
    mode: 'STOPWATCH',
    status: 'IDLE',
    elapsed: 0,
    remaining: 300000, // 5 min default
    initialDuration: 300000,
    lastTick: 0,
  });

  // Ref for Timer Loop
  const timerRef = useRef<number | null>(null);

  // -- WEATHER EFFECT --
  useEffect(() => {
    if (!settings.showWeather) return;

    const loadWeather = async () => {
        setWeather(prev => ({ ...prev, loading: true, error: null }));
        const data = await fetchWeatherData();
        setWeather(prev => ({ ...prev, ...data }));
    };

    loadWeather();
    // Refresh weather every 30 minutes
    const interval = setInterval(loadWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [settings.showWeather]);

  // -- ALARM LOGIC --
  useEffect(() => {
    // Check alarms every second (when seconds === 0 for precision matching)
    if (time.getSeconds() === 0) {
      const currentHM = time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      const matchedAlarm = alarms.find(a => a.enabled && a.time === currentHM);
      
      if (matchedAlarm && !activeAlarmId) {
        setActiveAlarmId(matchedAlarm.id);
        playSound('ALARM');
        // Simple loop for alarm sound
        const interval = setInterval(() => playSound('ALARM'), 2000);
        // Auto dismiss after 20s
        setTimeout(() => {
           clearInterval(interval);
           setActiveAlarmId(null);
        }, 20000);
        // Store interval ID to clear if user dismisses manually (simplified for this demo)
        (window as any).currentAlarmInterval = interval;
      }
    }
  }, [time, alarms, activeAlarmId]);

  const dismissAlarm = () => {
    if ((window as any).currentAlarmInterval) {
      clearInterval((window as any).currentAlarmInterval);
    }
    setActiveAlarmId(null);
  };

  const handleAddAlarm = (timeStr: string) => {
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time: timeStr,
      label: 'Alarm',
      enabled: true
    };
    setAlarms([...alarms, newAlarm]);
    playSound('CLICK');
  };

  const handleToggleAlarm = (id: string) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
    playSound('CLICK');
  };

  const handleDeleteAlarm = (id: string) => {
    setAlarms(alarms.filter(a => a.id !== id));
    playSound('CLICK');
  };

  // -- TIMER LOGIC --
  useEffect(() => {
    if (timer.status === 'RUNNING') {
      timerRef.current = requestAnimationFrame(updateTimer);
    } else if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
    }
    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, [timer.status]);

  const updateTimer = () => {
    setTimer(prev => {
      const now = Date.now();
      const delta = now - prev.lastTick;
      
      if (prev.mode === 'STOPWATCH') {
        return { ...prev, elapsed: prev.elapsed + delta, lastTick: now };
      } else {
        const newRemaining = Math.max(0, prev.remaining - delta);
        if (newRemaining === 0 && prev.remaining > 0) {
           playSound('ALARM'); // Timer finished
           return { ...prev, remaining: 0, status: 'IDLE', lastTick: now };
        }
        return { ...prev, remaining: newRemaining, lastTick: now };
      }
    });
    if (timer.status === 'RUNNING') {
       timerRef.current = requestAnimationFrame(updateTimer);
    }
  };

  const handleTimerAction = (action: 'START' | 'PAUSE' | 'RESET' | 'SET_MODE', value?: any) => {
    playSound('CLICK');
    const now = Date.now();

    if (action === 'SET_MODE') {
      setTimer(prev => ({ ...prev, mode: value, status: 'IDLE', elapsed: 0, remaining: prev.initialDuration }));
    } else if (action === 'START') {
      setTimer(prev => ({ ...prev, status: 'RUNNING', lastTick: now }));
    } else if (action === 'PAUSE') {
      setTimer(prev => ({ ...prev, status: 'PAUSED' }));
    } else if (action === 'RESET') {
      setTimer(prev => ({ 
        ...prev, 
        status: 'IDLE', 
        elapsed: 0, 
        remaining: value !== undefined ? value : prev.initialDuration,
        initialDuration: value !== undefined ? value : prev.initialDuration 
      }));
    }
  };

  const formatTimerSimple = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center text-white ${settings.skin === ClockSkin.MINIMAL ? 'bg-zinc-950' : ''}`}>
      
      {/* Dynamic Background - Only show matrix for non-minimal themes or allow toggle */}
      {settings.skin !== ClockSkin.MINIMAL && (
        <MatrixBackground color={settings.theme} speed={settings.matrixSpeed} />
      )}

      {/* Main Content Area */}
      <main className="z-10 w-full flex-grow flex flex-col items-center justify-center p-4 relative">
        {/* Weather Widget (Top Left) */}
        <WeatherWidget weather={weather} settings={settings} />

        {settings.mode === ClockMode.DIGITAL ? (
          <DigitalClock time={time} settings={settings} />
        ) : (
          <AnalogClock time={time} settings={settings} />
        )}

        {/* Floating Timer Indicator if Running */}
        {(timer.status === 'RUNNING' || timer.status === 'PAUSED') && (
           <div className="absolute bottom-24 bg-black/60 backdrop-blur px-4 py-2 rounded-full border border-zinc-700 flex items-center gap-3 animate-in slide-in-from-bottom-5">
             <TimerIcon className={`w-4 h-4 ${timer.status === 'RUNNING' ? 'text-green-500 animate-pulse' : 'text-yellow-500'}`} />
             <span className="font-mono-tech text-xl">
               {timer.mode === 'STOPWATCH' ? formatTimerSimple(timer.elapsed) : formatTimerSimple(timer.remaining)}
             </span>
           </div>
        )}
      </main>

      {/* Alarm Overlay */}
      {activeAlarmId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur animate-in zoom-in duration-300">
           <div className="bg-zinc-900 border-2 border-neon-red p-8 rounded-2xl flex flex-col items-center gap-6 shadow-[0_0_50px_rgba(255,0,60,0.5)]">
             <BellRing className="w-16 h-16 text-neon-red animate-bounce" />
             <h2 className="text-4xl font-orbitron text-white">ALARM</h2>
             <div className="text-2xl font-mono-tech text-zinc-400">
               {alarms.find(a => a.id === activeAlarmId)?.time}
             </div>
             <button 
               onClick={dismissAlarm}
               className="bg-neon-red hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition-all text-xl"
             >
               DISMISS
             </button>
           </div>
        </div>
      )}

      {/* Settings Trigger */}
      <div className="absolute bottom-8 right-8 z-20 opacity-30 hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => {
            playSound('CLICK');
            setIsSettingsOpen(true);
          }}
          className="p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 hover:border-white/50 hover:scale-110 transition-all duration-300"
          style={{ boxShadow: `0 0 10px ${settings.theme}` }}
        >
          <SettingsIcon className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Overlay Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdate={(s) => { playSound('CLICK'); setSettings(s); }}
        alarms={alarms}
        onAddAlarm={handleAddAlarm}
        onToggleAlarm={handleToggleAlarm}
        onDeleteAlarm={handleDeleteAlarm}
        timer={timer}
        onTimerAction={handleTimerAction}
        installPrompt={installPrompt}
      />
    </div>
  );
};

export default App;