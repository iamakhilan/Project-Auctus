// @vitest-environment jsdom
import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useFocusTrap } from './useFocusTrap';

describe('useFocusTrap', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('calls onClose when Escape key is pressed on open trap', () => {
    const onClose = vi.fn();
    const TestModal = ({ isOpen }: { isOpen: boolean }) => {
      const ref = useFocusTrap<HTMLDivElement>(isOpen, onClose);
      return isOpen ? (
        <div ref={ref}>
          <button>Action</button>
        </div>
      ) : null;
    };

    const { unmount } = render(<TestModal isOpen={true} />);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
    unmount();
  });

  it('does not call onClose when isOpen is false', () => {
    const onClose = vi.fn();
    const TestModal = ({ isOpen }: { isOpen: boolean }) => {
      const ref = useFocusTrap<HTMLDivElement>(isOpen, onClose);
      return isOpen ? (
        <div ref={ref}>
          <button>Action</button>
        </div>
      ) : null;
    };

    render(<TestModal isOpen={false} />);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(onClose).not.toHaveBeenCalled();
  });
});
