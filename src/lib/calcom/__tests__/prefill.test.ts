import { describe, it, expect, vi, beforeEach } from 'vitest';
import { openCalEmbed } from '../prefill';

describe('openCalEmbed', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    delete (window as unknown as { Cal?: unknown }).Cal;
  });

  it('Cal global varsa cal modal tetiklenir', () => {
    const calSpy = vi.fn();
    (window as unknown as { Cal: typeof calSpy }).Cal = calSpy;
    openCalEmbed('https://cal.com/indoles/test');
    expect(calSpy).toHaveBeenCalledWith('ui', expect.any(Object));
    expect(calSpy).toHaveBeenCalledWith('modal', { url: 'https://cal.com/indoles/test' });
  });

  it('Cal global yoksa yeni tab açılır', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    openCalEmbed('https://cal.com/indoles/test');
    expect(openSpy).toHaveBeenCalledWith('https://cal.com/indoles/test', '_blank', 'noopener,noreferrer');
  });
});
