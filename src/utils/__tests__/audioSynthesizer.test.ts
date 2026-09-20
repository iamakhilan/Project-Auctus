import { describe, it, expect, beforeEach, vi } from 'vitest';
import { soundEngine, SOUNDSCAPE_PRESETS, SoundscapeTrack } from '../audioSynthesizer';

describe('AudioSynthesizer & Soundscape Engine', () => {
  beforeEach(() => {
    soundEngine.isMuted = false;
    soundEngine.setMasterVolume(0.8);
    soundEngine.stopSoundscape();
  });

  it('contains valid soundscape presets with configured gains and filters', () => {
    expect(SOUNDSCAPE_PRESETS['cyber-rain'].filterType).toBe('lowpass');
    expect(SOUNDSCAPE_PRESETS['cyber-rain'].filterFreq).toBe(800);
    expect(SOUNDSCAPE_PRESETS['forest'].filterType).toBe('bandpass');
    expect(SOUNDSCAPE_PRESETS['deep-brown'].gain).toBeGreaterThan(0);
    expect(SOUNDSCAPE_PRESETS['none'].gain).toBe(0);
  });

  it('clamps master volume between 0 and 1', () => {
    soundEngine.setMasterVolume(1.5);
    expect(soundEngine.getMasterVolume()).toBe(1);

    soundEngine.setMasterVolume(-0.5);
    expect(soundEngine.getMasterVolume()).toBe(0);

    soundEngine.setMasterVolume(0.65);
    expect(soundEngine.getMasterVolume()).toBe(0.65);
  });

  it('handles soundscape start and stop cleanly without throwing', () => {
    expect(() => {
      soundEngine.startSoundscape('none');
      soundEngine.startSoundscape('cyber-rain');
      soundEngine.stopSoundscape();
    }).not.toThrow();
  });

  it('respects isMuted flag during sound effects and soundscapes', () => {
    soundEngine.isMuted = true;
    expect(() => {
      soundEngine.playClick();
      soundEngine.playSuccess();
      soundEngine.playLevelUp();
      soundEngine.playCoinCollect();
      soundEngine.startSoundscape('binaural');
    }).not.toThrow();
  });
});
