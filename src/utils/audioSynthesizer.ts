export type SoundscapeTrack = 'none' | 'cyber-rain' | 'binaural' | 'forest' | 'white-noise' | 'deep-brown';

export interface SoundscapePreset {
  id: SoundscapeTrack;
  name: string;
  filterType?: BiquadFilterType;
  filterFreq?: number;
  gain: number;
}

export const SOUNDSCAPE_PRESETS: Record<SoundscapeTrack, SoundscapePreset> = {
  'none': { id: 'none', name: 'Silent', gain: 0 },
  'cyber-rain': { id: 'cyber-rain', name: 'Cyber Rain', filterType: 'lowpass', filterFreq: 800, gain: 0.06 },
  'binaural': { id: 'binaural', name: 'Binaural Focus', gain: 0.08 },
  'forest': { id: 'forest', name: 'Whispering Forest', filterType: 'bandpass', filterFreq: 1200, gain: 0.05 },
  'white-noise': { id: 'white-noise', name: 'White Static', filterType: 'lowpass', filterFreq: 350, gain: 0.05 },
  'deep-brown': { id: 'deep-brown', name: 'Deep Brown Noise', filterType: 'lowpass', filterFreq: 220, gain: 0.09 },
};

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private currentSoundscapeNodes: { source: AudioNode; gain: GainNode }[] = [];
  public isMuted: boolean = false;
  private masterVolume: number = 0.8;

  constructor() {
    this.loadPreferences();
  }

  public loadPreferences(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem('auctus_duo_audio_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed.soundEnabled === 'boolean') {
          this.isMuted = !parsed.soundEnabled;
        }
        if (typeof parsed.masterVolume === 'number') {
          this.setMasterVolume(parsed.masterVolume);
        }
      }
    } catch {
      // fallback
    }
  }

  public setMasterVolume(vol: number): void {
    this.masterVolume = Math.max(0, Math.min(1, vol));
  }

  public getMasterVolume(): number {
    return this.masterVolume;
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playClick(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15 * this.masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  public playSuccess(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.2 * this.masterVolume, ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
    });
  }

  public playLevelUp(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const melody = [440, 554.37, 659.25, 880, 1108.73];
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);

      gain.gain.setValueAtTime(0.25 * this.masterVolume, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.3);
    });
  }

  public playCoinCollect(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
    osc.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08); // E6

    gain.gain.setValueAtTime(0.2 * this.masterVolume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  public startSoundscape(track: SoundscapeTrack): void {
    this.stopSoundscape();
    if (this.isMuted || track === 'none') return;
    const ctx = this.getContext();
    if (!ctx) return;

    const preset = SOUNDSCAPE_PRESETS[track];
    if (!preset) return;

    try {
      if (track === 'binaural') {
        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        const merger = ctx.createChannelMerger(2);
        const gain = ctx.createGain();

        oscL.type = 'sine';
        oscL.frequency.setValueAtTime(432, ctx.currentTime);
        oscR.type = 'sine';
        oscR.frequency.setValueAtTime(438, ctx.currentTime);

        gain.gain.setValueAtTime(preset.gain * this.masterVolume, ctx.currentTime);

        oscL.connect(merger, 0, 0);
        oscR.connect(merger, 0, 1);
        merger.connect(gain);
        gain.connect(ctx.destination);

        oscL.start();
        oscR.start();

        this.currentSoundscapeNodes.push({ source: oscL, gain }, { source: oscR, gain });
      } else {
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        if (track === 'deep-brown') {
          let lastOut = 0.0;
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
          }
        } else {
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(preset.gain * this.masterVolume, ctx.currentTime);

        if (preset.filterType && preset.filterFreq) {
          const filter = ctx.createBiquadFilter();
          filter.type = preset.filterType;
          filter.frequency.setValueAtTime(preset.filterFreq, ctx.currentTime);
          whiteNoise.connect(filter);
          filter.connect(gain);
        } else {
          whiteNoise.connect(gain);
        }

        gain.connect(ctx.destination);
        whiteNoise.start();
        this.currentSoundscapeNodes.push({ source: whiteNoise, gain });
      }
    } catch {
      // AudioContext policy fallback
    }
  }

  public stopSoundscape(): void {
    const ctx = this.ctx;
    this.currentSoundscapeNodes.forEach(({ source, gain }) => {
      try {
        if (ctx && gain.gain) {
          gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        }
        setTimeout(() => {
          try {
            if ('stop' in source && typeof (source as AudioScheduledSourceNode).stop === 'function') {
              (source as AudioScheduledSourceNode).stop();
            }
            gain.disconnect();
          } catch {
            // ignore
          }
        }, 60);
      } catch {
        // ignore
      }
    });
    this.currentSoundscapeNodes = [];
  }
}

export const soundEngine = new AudioSynthesizer();
