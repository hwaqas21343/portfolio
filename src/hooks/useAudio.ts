import { useCallback, useRef } from 'react';

interface HumHandle {
  osc: OscillatorNode;
  osc2: OscillatorNode;
  gain: GainNode;
  crackleTimer: number;
}

export function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const humRef = useRef<HumHandle | null>(null);

  const getCtx = useCallback(() => {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return null;
    if (!ctxRef.current) ctxRef.current = new Ctx();
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  /** A short, dry relay click. Nav is a quick tap; heavy (select) carries a touch more weight. */
  const click = useCallback(
    (heavy = false) => {
      const ctx = getCtx();
      if (!ctx) return;

      const t = ctx.currentTime;
      const dur = heavy ? 0.045 : 0.022;

      const len = Math.floor(ctx.sampleRate * dur);
      const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.5);
      }

      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = heavy ? 2200 : 3200;
      bandpass.Q.value = 1.5;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(heavy ? 0.2 : 0.13, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

      // A very short higher-pitched body right at the attack, giving the
      // switch its metallic "tk" rather than a bare burst of noise. Heavy
      // gets a second, lower knock a beat later for a two-stage "confirm".
      const tick = ctx.createOscillator();
      tick.type = 'square';
      tick.frequency.value = heavy ? 1200 : 1700;
      const tickGain = ctx.createGain();
      tickGain.gain.setValueAtTime(heavy ? 0.045 : 0.03, t);
      tickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.01);
      tick.connect(tickGain);
      tickGain.connect(ctx.destination);
      tick.start(t);
      tick.stop(t + 0.012);

      src.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      src.start(t);

      if (heavy) {
        const knock = ctx.createOscillator();
        knock.type = 'sine';
        knock.frequency.setValueAtTime(180, t + 0.03);
        knock.frequency.exponentialRampToValueAtTime(90, t + 0.09);
        const knockGain = ctx.createGain();
        knockGain.gain.setValueAtTime(0.0001, t + 0.03);
        knockGain.gain.linearRampToValueAtTime(0.05, t + 0.038);
        knockGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
        knock.connect(knockGain);
        knockGain.connect(ctx.destination);
        knock.start(t + 0.03);
        knock.stop(t + 0.11);
      }
    },
    [getCtx],
  );

  /** One brief, quiet burst of static — an occasional crackle, not a bed of noise. */
  const playCrackle = useCallback(
    (ctx: AudioContext) => {
      const t = ctx.currentTime;
      const dur = 0.06 + Math.random() * 0.1;
      const len = Math.floor(ctx.sampleRate * dur);
      const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < len; i++) {
        // Fade in and out within the burst itself so it pops rather than
        // starting/stopping on a hard edge.
        const env = Math.sin((Math.PI * i) / len);
        data[i] = (Math.random() * 2 - 1) * env;
      }

      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 3500;
      const gain = ctx.createGain();
      gain.gain.value = 0.012 + Math.random() * 0.014;
      src.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(ctx.destination);
      src.start(t);
    },
    [],
  );

  const setHum = useCallback(
    (on: boolean) => {
      const ctx = getCtx();
      if (!ctx) return;

      if (on) {
        if (humRef.current) return;

        // Low CRT transformer hum, continuous and quiet.
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const lowpass = ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 320;
        osc.type = 'sine';
        osc.frequency.value = 50;
        osc2.type = 'sine';
        osc2.frequency.value = 100.5;
        gain.gain.value = 0;
        osc.connect(lowpass);
        osc2.connect(lowpass);
        lowpass.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc2.start();
        gain.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 1.2);

        // Occasional static crackles, not a constant hiss.
        const scheduleNext = () => {
          const delay = 1800 + Math.random() * 4200;
          return window.setTimeout(() => {
            playCrackle(ctx);
            if (humRef.current) humRef.current.crackleTimer = scheduleNext();
          }, delay);
        };

        humRef.current = { osc, osc2, gain, crackleTimer: scheduleNext() };
      } else if (humRef.current) {
        const h = humRef.current;
        const t = ctx.currentTime;
        window.clearTimeout(h.crackleTimer);
        h.gain.gain.linearRampToValueAtTime(0, t + 0.6);
        h.osc.stop(t + 0.7);
        h.osc2.stop(t + 0.7);
        humRef.current = null;
      }
    },
    [getCtx, playCrackle],
  );

  return { click, setHum };
}
