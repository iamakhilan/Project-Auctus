import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { TabType } from '../types';

interface CapacitorNativeOptions {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isModalOpen?: boolean;
  onCloseModal?: () => void;
  onAppResume?: () => void;
}

export function useCapacitorNative({
  activeTab,
  setActiveTab,
  isModalOpen = false,
  onCloseModal,
  onAppResume,
}: CapacitorNativeOptions) {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // 1. Configure Native Status Bar for Auctus Dark Theme
    const setupNativeUI = async () => {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#0c0d1a' });
        await StatusBar.setOverlaysWebView({ overlay: false });
      } catch {
        // Status bar plugin fallback
      }

      try {
        await SplashScreen.hide();
      } catch {
        // Splash screen plugin fallback
      }
    };

    setupNativeUI();

    // 2. Register Android Native Back Button Handler
    const backButtonHandler = CapApp.addListener('backButton', () => {
      if (isModalOpen && onCloseModal) {
        onCloseModal();
        return;
      }

      if (activeTab !== 'realm') {
        setActiveTab('realm');
        return;
      }

      // If at home realm with no modals open, minimize the app cleanly
      CapApp.minimizeApp().catch(() => {});
    });

    // 3. Register Native App Lifecycle Resumption Handler
    const appStateChangeHandler = CapApp.addListener('appStateChange', state => {
      if (state.isActive && onAppResume) {
        onAppResume();
      }
    });

    return () => {
      backButtonHandler.then(handle => handle.remove()).catch(() => {});
      appStateChangeHandler.then(handle => handle.remove()).catch(() => {});
    };
  }, [activeTab, setActiveTab, isModalOpen, onCloseModal, onAppResume]);
}
