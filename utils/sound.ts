// Simple audio synthesizer for alarms and ticks
export const playSound = (type: 'ALARM' | 'TICK' | 'CLICK') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'ALARM') {
      // Alarm: Repeating beep pattern
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1760, now + 0.1);
      osc.frequency.setValueAtTime(880, now + 0.2);
      osc.frequency.setValueAtTime(1760, now + 0.3);
      
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      
      osc.start(now);
      osc.stop(now + 0.8);
    } else if (type === 'TICK') {
      // Tick: Short high pitch
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2000, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'CLICK') {
        // UI Click
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        
        osc.start(now);
        osc.stop(now + 0.1);
    }
  } catch (e) {
    console.error("Audio playback failed", e);
  }
};