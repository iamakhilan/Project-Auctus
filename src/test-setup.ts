// Mock localStorage and sessionStorage for jsdom test environment
// This file must be executed before any test files that access localStorage
const createMockStorage = () => {
  const store: { [key: string]: string } = {};

  // Create a mock Storage object that properly inherits from Storage.prototype
  // This allows spies on Storage.prototype methods to work correctly
  const storage = Object.create(Storage.prototype);
  
  // Define the methods on our mock object
  storage.getItem = (key: string) => {
    return store[key] || null;
  };
  
  storage.setItem = (key: string, value: string) => {
    store[key] = String(value);
  };
  
  storage.removeItem = (key: string) => {
    delete store[key];
  };
  
  storage.clear = () => {
    Object.keys(store).forEach(key => delete store[key]);
  };
  
  storage.key = (index: number) => {
    return Object.keys(store)[index] || null;
  };
  
  Object.defineProperty(storage, 'length', {
    get: () => Object.keys(store).length,
    configurable: true
  });

  return storage;
};

// Completely replace localStorage and sessionStorage with our mocks
Object.defineProperty(window, 'localStorage', {
  value: createMockStorage(),
  writable: true,
  configurable: true
});

Object.defineProperty(window, 'sessionStorage', {
  value: createMockStorage(),
  writable: true,
  configurable: true
});

// Mock BroadcastChannel to throw errors, forcing fallback to localStorage
// This ensures syncChannel tests work properly by testing the fallback path
const BroadcastChannelMock = class {
  constructor() {
    throw new Error('BroadcastChannel not available in jsdom');
  }
  postMessage() {
    throw new Error('BroadcastChannel not available in jsdom');
  }
  close() {}
};

// Only mock if BroadcastChannel exists (it should in jsdom test env)
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  Object.defineProperty(window, 'BroadcastChannel', {
    value: BroadcastChannelMock,
    writable: true,
    configurable: true
  });
}

// Import jest-dom after mocks to ensure it works properly
import '@testing-library/jest-dom';

// Log to verify the setup is running
console.log('Test setup executed - localStorage, sessionStorage, and BroadcastChannel mocked');