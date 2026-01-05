import React, { useState } from 'react';
import { Settings, X, Monitor, Type, Calendar, Clock, Activity, Download, Bell, Timer, Trash2, Plus, Play, Pause, RotateCcw, Cloud, Smartphone, MonitorDown, Check } from 'lucide-react';
import { AppSettings, ClockMode, ThemeColor, ClockSkin, Alarm, TimerState } from '../types';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdate: (newSettings: AppSettings) => void;
  // Alarm Props
  alarms: Alarm[];
  onAddAlarm: (time: string) => void;
  onToggleAlarm: (id: string) => void;
  onDeleteAlarm: (id: string) => void;
  // Timer Props
  timer: TimerState;
  onTimerAction: (action: 'START' | 'PAUSE' | 'RESET' | 'SET_MODE', value?: any) => void;
  // Install Prop
  installPrompt: any;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  isOpen, onClose, settings, onUpdate,
  alarms, onAddAlarm, onToggleAlarm, onDeleteAlarm,
  timer, onTimerAction,
  installPrompt
}) => {
  const [activeTab, setActiveTab] = useState<'VISUAL' | 'ALARM' | 'TIMER' | 'INSTALL'>('VISUAL');
  const [newAlarmTime, setNewAlarmTime] = useState("08:00");
  const [countdownMinutes, setCountdownMinutes] = useState(5);

  if (!isOpen) return null;

  const toggleBoolean = (key: keyof AppSettings) => {
    onUpdate({ ...settings, [key]: !settings[key] });
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted install');
        }
      });
    }
  };

  // Format Timer Display for the panel
  const formatTimer = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    const decimal = Math.floor((ms % 1000) / 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${decimal.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div 
        className="bg-zinc-900 border border-zinc-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px]"
        style={{ boxShadow: `0 0 30px ${settings.theme}40` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50 shrink-0">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-white" />
            <h2 className="text-xl font-orbitron font-bold text-white tracking-wider">SYSTEM CONFIG</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 shrink-0 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('VISUAL')}
            className={`flex-1 py-4 px-2 font-mono-tech text-sm flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'VISUAL' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Monitor className="w-4 h-4" /> VISUAL
          </button>
          <button 
            onClick={() => setActiveTab('ALARM')}
            className={`flex-1 py-4 px-2 font-mono-tech text-sm flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'ALARM' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Bell className="w-4 h-4" /> ALARMS
          </button>
          <button 
            onClick={() => setActiveTab('TIMER')}
            className={`flex-1 py-4 px-2 font-mono-tech text-sm flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'TIMER' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Timer className="w-4 h-4" /> TIMER
          </button>
          <button 
            onClick={() => setActiveTab('INSTALL')}
            className={`flex-1 py-4 px-2 font-mono-tech text-sm flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'INSTALL' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Download className="w-4 h-4" /> APP
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          
          {/* --- VISUAL TAB --- */}
          {activeTab === 'VISUAL' && (
            <div className="space-y-8">
              {/* Skin Selector */}
               <div className="space-y-3">
                <label className="text-xs font-mono-tech uppercase text-zinc-500 tracking-widest font-bold">Skin Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {[ClockSkin.CYBERPUNK, ClockSkin.RETRO, ClockSkin.MINIMAL].map((skin) => (
                    <button
                      key={skin}
                      onClick={() => onUpdate({ ...settings, skin })}
                      className={`py-2 rounded-lg font-mono-tech text-xs border border-zinc-700 transition-all ${settings.skin === skin ? 'bg-zinc-800 text-white border-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      {skin}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Selector */}
              <div className="space-y-3">
                <label className="text-xs font-mono-tech uppercase text-zinc-500 tracking-widest font-bold">Theme Color</label>
                <div className="grid grid-cols-5 gap-3">
                  {Object.values(ThemeColor).map((color) => (
                    <button
                      key={color}
                      onClick={() => onUpdate({ ...settings, theme: color })}
                      className={`h-10 rounded-lg border-2 transition-all duration-300 ${settings.theme === color ? 'scale-110 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`}
                      style={{ 
                        backgroundColor: color,
                        borderColor: settings.theme === color ? '#fff' : 'transparent',
                        boxShadow: settings.theme === color ? `0 0 15px ${color}` : 'none'
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Mode Selector */}
              <div className="space-y-3">
                <label className="text-xs font-mono-tech uppercase text-zinc-500 tracking-widest font-bold">Display Mode</label>
                <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded-xl">
                  <button
                    onClick={() => onUpdate({ ...settings, mode: ClockMode.DIGITAL })}
                    className={`flex items-center justify-center gap-2 py-3 rounded-lg font-mono-tech text-sm transition-all ${settings.mode === ClockMode.DIGITAL ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    <Monitor className="w-4 h-4" /> DIGITAL
                  </button>
                  <button
                    onClick={() => onUpdate({ ...settings, mode: ClockMode.ANALOG })}
                    className={`flex items-center justify-center gap-2 py-3 rounded-lg font-mono-tech text-sm transition-all ${settings.mode === ClockMode.ANALOG ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    <Clock className="w-4 h-4" /> ANALOG
                  </button>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2">
                {[
                  { key: 'is24Hour', label: '24-Hour Format', icon: Type },
                  { key: 'showSeconds', label: 'Show Seconds', icon: Activity },
                  { key: 'showDate', label: 'Show Date', icon: Calendar },
                  { key: 'showWeather', label: 'Show Weather', icon: Cloud },
                ].map((item) => (
                  <button 
                    key={item.key}
                    onClick={() => toggleBoolean(item.key as keyof AppSettings)}
                    className="flex w-full items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-600 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                      <span className="font-mono-tech text-zinc-300">{item.label}</span>
                    </div>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${settings[item.key as keyof AppSettings] ? 'bg-green-500' : 'bg-zinc-700'}`}>
                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${settings[item.key as keyof AppSettings] ? 'left-6' : 'left-1'}`} />
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-zinc-800">
                <button 
                  onClick={handleFullscreen}
                  className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-mono-tech rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <Monitor className="w-4 h-4" /> FULLSCREEN
                </button>
              </div>
            </div>
          )}

          {/* --- ALARM TAB --- */}
          {activeTab === 'ALARM' && (
            <div className="space-y-6">
              <div className="flex gap-2">
                <input 
                  type="time" 
                  value={newAlarmTime}
                  onChange={(e) => setNewAlarmTime(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-2 text-white font-mono-tech focus:border-white outline-none"
                />
                <button 
                  onClick={() => onAddAlarm(newAlarmTime)}
                  className="bg-neon-blue/20 text-neon-blue border border-neon-blue/50 hover:bg-neon-blue/40 px-4 rounded-lg font-bold"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {alarms.length === 0 && (
                  <div className="text-center text-zinc-500 py-8 font-mono-tech">NO ALARMS SET</div>
                )}
                {alarms.map(alarm => (
                  <div key={alarm.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-orbitron text-white">{alarm.time}</div>
                      <div className="text-xs text-zinc-500 font-mono-tech">{alarm.label}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => onToggleAlarm(alarm.id)}
                        className={`w-12 h-6 rounded-full relative transition-colors ${alarm.enabled ? 'bg-green-500' : 'bg-zinc-700'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${alarm.enabled ? 'left-7' : 'left-1'}`} />
                      </button>
                      <button 
                        onClick={() => onDeleteAlarm(alarm.id)}
                        className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- TIMER TAB --- */}
          {activeTab === 'TIMER' && (
            <div className="space-y-8 flex flex-col items-center">
              
              {/* Timer Type Selector */}
              <div className="flex gap-2 bg-zinc-950 p-1 rounded-lg">
                <button 
                  onClick={() => onTimerAction('SET_MODE', 'STOPWATCH')}
                  className={`px-4 py-2 rounded-md font-mono-tech text-xs transition-colors ${timer.mode === 'STOPWATCH' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
                >
                  STOPWATCH
                </button>
                <button 
                   onClick={() => onTimerAction('SET_MODE', 'COUNTDOWN')}
                   className={`px-4 py-2 rounded-md font-mono-tech text-xs transition-colors ${timer.mode === 'COUNTDOWN' ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}
                >
                  COUNTDOWN
                </button>
              </div>

              {/* Display */}
              <div className="text-6xl font-mono-tech tabular-nums tracking-wider text-white">
                {timer.mode === 'STOPWATCH' 
                  ? formatTimer(timer.elapsed) 
                  : formatTimer(timer.remaining)
                }
              </div>

              {/* Countdown Controls */}
              {timer.mode === 'COUNTDOWN' && timer.status === 'IDLE' && (
                 <div className="w-full space-y-2">
                    <label className="text-xs font-mono-tech text-zinc-500">SET MINUTES</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="60" 
                      value={countdownMinutes}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setCountdownMinutes(val);
                        onTimerAction('RESET', val * 60 * 1000);
                      }}
                      className="w-full accent-white"
                    />
                    <div className="text-center font-mono-tech text-zinc-400">{countdownMinutes} MIN</div>
                 </div>
              )}

              {/* Control Buttons */}
              <div className="flex gap-6">
                {timer.status === 'RUNNING' ? (
                  <button 
                    onClick={() => onTimerAction('PAUSE')}
                    className="w-16 h-16 rounded-full bg-yellow-600/20 border border-yellow-500 text-yellow-500 flex items-center justify-center hover:bg-yellow-600/40 transition-all"
                  >
                    <Pause className="w-8 h-8 fill-current" />
                  </button>
                ) : (
                  <button 
                    onClick={() => onTimerAction('START')}
                    className="w-16 h-16 rounded-full bg-green-600/20 border border-green-500 text-green-500 flex items-center justify-center hover:bg-green-600/40 transition-all"
                  >
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </button>
                )}
                
                <button 
                  onClick={() => onTimerAction('RESET', timer.mode === 'COUNTDOWN' ? countdownMinutes * 60 * 1000 : 0)}
                  className="w-16 h-16 rounded-full bg-red-600/20 border border-red-500 text-red-500 flex items-center justify-center hover:bg-red-600/40 transition-all"
                >
                  <RotateCcw className="w-8 h-8" />
                </button>
              </div>
            </div>
          )}

          {/* --- INSTALL / APP TAB --- */}
          {activeTab === 'INSTALL' && (
            <div className="space-y-6 font-mono-tech">
              
              {/* Desktop Install Section */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-3 mb-4 text-neon-blue">
                  <MonitorDown className="w-6 h-6" />
                  <h3 className="font-bold text-lg">DESKTOP INSTALL</h3>
                </div>
                
                {installPrompt ? (
                  <div className="space-y-3">
                     <p className="text-zinc-400 text-sm">
                       Ready to install. Click below to install Neon Chronos as a standalone desktop application.
                     </p>
                     <button 
                      onClick={handleInstallClick}
                      className="w-full py-3 bg-neon-blue text-black font-bold rounded hover:bg-white transition-colors flex items-center justify-center gap-2 animate-pulse"
                     >
                       <Download className="w-5 h-5" /> INSTALL APPLICATION
                     </button>
                  </div>
                ) : (
                  <>
                     <p className="text-zinc-400 text-sm mb-3">
                       Install as a standalone desktop app via your browser.
                     </p>
                     <div className="flex items-start gap-2 text-zinc-500 text-sm bg-zinc-900 p-2 rounded">
                       <div className="shrink-0 mt-0.5"><Check className="w-4 h-4 text-green-500" /></div>
                       <span>If the "Install" button doesn't appear above, check your browser address bar (right side) for an install icon.</span>
                     </div>
                  </>
                )}
              </div>

              {/* Mobile Install Section */}
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                <div className="flex items-center gap-3 mb-2 text-neon-green">
                  <Smartphone className="w-6 h-6" />
                  <h3 className="font-bold text-lg">iPHONE / ANDROID</h3>
                </div>
                <p className="text-zinc-400 text-sm mb-3">
                  Get the full App experience without an app store.
                </p>
                <ol className="list-decimal list-inside text-zinc-500 text-sm space-y-2">
                  <li className="pl-1">Open <b>Safari</b> (iOS) or <b>Chrome</b> (Android).</li>
                  <li className="pl-1">Tap the <b>Share</b> button (iOS) or <b>Menu</b> (Android).</li>
                  <li className="pl-1">Select <span className="text-white">"Add to Home Screen"</span>.</li>
                </ol>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};