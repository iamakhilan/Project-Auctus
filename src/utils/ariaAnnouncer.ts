export type AnnouncementPriority = 'polite' | 'assertive';

class AriaAnnouncer {
  private liveRegion: HTMLDivElement | null = null;

  public init(): void {
    if (typeof document === 'undefined') return;
    if (this.liveRegion) return;

    const existing = document.getElementById('a11y-live-region') as HTMLDivElement | null;
    if (existing) {
      this.liveRegion = existing;
      return;
    }

    const region = document.createElement('div');
    region.id = 'a11y-live-region';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.setAttribute('role', 'status');
    region.style.position = 'absolute';
    region.style.width = '1px';
    region.style.height = '1px';
    region.style.padding = '0';
    region.style.margin = '-1px';
    region.style.overflow = 'hidden';
    region.style.clip = 'rect(0, 0, 0, 0)';
    region.style.whiteSpace = 'nowrap';
    region.style.border = '0';

    document.body.appendChild(region);
    this.liveRegion = region;
  }

  public announce(message: string, priority: AnnouncementPriority = 'polite'): void {
    if (typeof document === 'undefined') return;
    if (!this.liveRegion) {
      this.init();
    }

    if (this.liveRegion) {
      this.liveRegion.setAttribute('aria-live', priority);
      // Clear and re-populate to trigger screen reader announcement reliably
      this.liveRegion.textContent = '';
      window.setTimeout(() => {
        if (this.liveRegion) {
          this.liveRegion.textContent = message;
        }
      }, 50);
    }
  }

  public clear(): void {
    if (this.liveRegion) {
      this.liveRegion.textContent = '';
    }
  }
}

export const ariaAnnouncer = new AriaAnnouncer();
