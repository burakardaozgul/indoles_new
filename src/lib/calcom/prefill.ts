export function openCalEmbed(url: string): void {
  if (typeof window === 'undefined') return;
  const cal = (window as unknown as { Cal?: (cmd: string, ...args: unknown[]) => void }).Cal;
  if (cal) {
    cal('ui', { styles: { branding: { brandColor: '#000' } } });
    cal('modal', { url });
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
