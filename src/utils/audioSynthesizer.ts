// Web Audio API zero-dependency sound effects generator for Auctus

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private noiseNode: AudioNode | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Tactile button click
  playClick(enabled = true) {
    if (!enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Quest completed fanfare
  playQuestComplete(enabled = true) {
    if (!enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch {
      // Audio fallback
    }
  }

  // Coin / Loot pickup chime
  playCoinClaim(enabled = true) {
    if (!enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.32);
    } catch {
      // Audio fallback
    }
  }

  // Level Up Glorious Fanfare
  playLevelUp(enabled = true) {
    if (!enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const chords = [
        [440, 554.37, 659.25], // A major
        [554.37, 659.25, 880], // C#m
        [659.25, 830.61, 987.77], // E
        [880, 1108.73, 1318.51, 1760] // High A major triumph
      ];

      chords.forEach((chord, i) => {
        if (!this.ctx) return;
        const time = now + i * 0.12;
        chord.forEach(freq => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = i === chords.length - 1 ? 'sawtooth' : 'triangle';
          osc.frequency.setValueAtTime(freq, time);

          gain.gain.setValueAtTime(0.12, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + (i === chords.length - 1 ? 0.8 : 0.25));

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(time);
          osc.stop(time + 0.85);
        });
      });
    } catch {
      // Audio fallback
    }
  }

  // Mana Overcharge burst
  playOvercharge(enabled = true) {
    if (!enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.35);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.55);
    } catch {
      // Audio fallback
    }
  }

  // Ambient soundscape generator for Focus Arena
  startAmbience(type: 'binaural' | 'cyber-rain' | 'forest-spire' | 'white-noise') {
    this.stopAmbience();
    this.init();
    if (!this.ctx) return;

    try {
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      this.ambientGain.connect(this.ctx.destination);

      if (type === 'binaural' || type === 'forest-spire') {
        // Binaural 432 Hz carrier + 4Hz theta beat (436Hz)
        this.ambientOsc1 = this.ctx.createOscillator();
        this.ambientOsc2 = this.ctx.createOscillator();

        this.ambientOsc1.type = 'sine';
        this.ambientOsc1.frequency.setValueAtTime(216, this.ctx.currentTime); // Harmonic 432 / 2

        this.ambientOsc2.type = 'sine';
        this.ambientOsc2.frequency.setValueAtTime(220, this.ctx.currentTime); // 4Hz delta beat

        this.ambientOsc1.connect(this.ambientGain);
        this.ambientOsc2.connect(this.ambientGain);

        this.ambientOsc1.start();
        this.ambientOsc2.start();
      } else {
        // Pink / Rain noise buffer
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.05;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(type === 'cyber-rain' ? 800 : 450, this.ctx.currentTime);

        noise.connect(filter);
        filter.connect(this.ambientGain);
        noise.start();
        this.noiseNode = noise;
      }
    } catch {
      // Audio fallback
    }
  }

  stopAmbience() {
    try {
      if (this.ambientOsc1) {
        this.ambientOsc1.stop();
        this.ambientOsc1.disconnect();
        this.ambientOsc1 = null;
      }
      if (this.ambientOsc2) {
        this.ambientOsc2.stop();
        this.ambientOsc2.disconnect();
        this.ambientOsc2 = null;
      }
      if (this.noiseNode) {
        (this.noiseNode as AudioBufferSourceNode).stop();
        this.noiseNode.disconnect();
        this.noiseNode = null;
      }
      if (this.ambientGain) {
        this.ambientGain.disconnect();
        this.ambientGain = null;
      }
    } catch {
      // Cleanup
    }
  }
}

export const soundEngine = new SoundEngine();
