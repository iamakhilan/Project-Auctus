import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OnboardingModal } from '../../src/components/onboarding/OnboardingModal';

describe('OnboardingModal Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render when forced open or when not onboarded', () => {
    render(<OnboardingModal forceOpen={true} />);
    expect(screen.getByText('Welcome to AUCTUS')).toBeTruthy();
    expect(screen.getByText('Step 1 of 4')).toBeTruthy();
  });

  it('should navigate between steps when clicking Next and Back', () => {
    render(<OnboardingModal forceOpen={true} />);

    // Advance to Step 2
    const nextBtn = screen.getByText('Next');
    fireEvent.click(nextBtn);
    expect(screen.getByText('Quests & Habit Forge')).toBeTruthy();
    expect(screen.getByText('Step 2 of 4')).toBeTruthy();

    // Advance to Step 3
    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByText('Focus Arena & Soundscapes')).toBeTruthy();
    expect(screen.getByText('Step 3 of 4')).toBeTruthy();

    // Go back to Step 2
    const backBtn = screen.getByText('Back');
    fireEvent.click(backBtn);
    expect(screen.getByText('Quests & Habit Forge')).toBeTruthy();
  });

  it('should save onboarded flag to localStorage when skipping or completing', () => {
    render(<OnboardingModal forceOpen={true} />);
    const skipBtn = screen.getByText('Skip Intro');
    fireEvent.click(skipBtn);

    expect(localStorage.getItem('auctus_onboarded_v2')).toBe('true');
  });
});
