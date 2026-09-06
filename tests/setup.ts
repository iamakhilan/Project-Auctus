import '@testing-library/jest-dom';

// Mock Web Audio API
class AudioContextMock {
  state = 'running';
  currentTime = 0;
  destination = {};
  createOscillator() {
    return {
      type: 'sine',
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      disconnect: vi.fn(),
    };
  }
  createGain() {
    return {
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      disconnect: vi.fn(),
    };
  }
  createBiquadFilter() {
    return {
      type: 'lowpass',
      frequency: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
      disconnect: vi.fn(),
    };
  }
  createBuffer() {
    return {
      getChannelData: vi.fn().mockReturnValue(new Float32Array(1024)),
    };
  }
  createBufferSource() {
    return {
      buffer: null,
      loop: false,
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      disconnect: vi.fn(),
    };
  }
  resume() {
    return Promise.resolve();
  }
  close() {
    return Promise.resolve();
  }
}

// Attach mocks to global window / globalThis
(globalThis as unknown as { AudioContext: typeof AudioContextMock }).AudioContext = AudioContextMock;
(globalThis as unknown as { webkitAudioContext: typeof AudioContextMock }).webkitAudioContext = AudioContextMock;

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
