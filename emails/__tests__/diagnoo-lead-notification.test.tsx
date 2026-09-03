import { describe, it, expect } from 'vitest';
import { render } from '@react-email/render';
import DiagnooLeadNotification from '../DiagnooLeadNotification';

const baseProps = {
  email: 'cmo@firma.com',
  company: 'Firma A.Ş.',
  fullName: 'Ayşe Yılmaz',
  url: 'https://firma.com',
  healthScore: 54,
  totalRecoverable: { low: 74000, expected: 114000, high: 154000 },
  hasRealMetrics: false,
  reportPath: '/tr/araclar/diagnoo/rapor/11111111-1111-4111-8111-111111111111',
};

describe('DiagnooLeadNotification', () => {
  it('lead e-postası, şirket, url, skor ve rapor yolu render olur', async () => {
    const html = await render(<DiagnooLeadNotification {...baseProps} />);
    expect(html).toContain('cmo@firma.com');
    expect(html).toContain('Firma A.Ş.');
    expect(html).toContain('https://firma.com');
    expect(html).toContain('54');
    expect(html).toContain('/tr/araclar/diagnoo/rapor/11111111-1111-4111-8111-111111111111');
  });

  it('hasRealMetrics true iken "gerçek veri" ibaresi geçer', async () => {
    const html = await render(<DiagnooLeadNotification {...baseProps} hasRealMetrics />);
    expect(html).toContain('gerçek veri');
  });

  it('hasRealMetrics false iken "gerçek veri" ibaresi geçmez', async () => {
    const html = await render(<DiagnooLeadNotification {...baseProps} hasRealMetrics={false} />);
    expect(html).not.toContain('gerçek veri');
  });

  it('fullName verilmemişse (null) şablon çökmez, şirket adı yine görünür', async () => {
    const html = await render(<DiagnooLeadNotification {...baseProps} fullName={null} />);
    expect(html).toContain('Firma A.Ş.');
  });

  it('kurtarılabilir aralık (totalRecoverable) render olur', async () => {
    const html = await render(<DiagnooLeadNotification {...baseProps} />);
    expect(html).toContain('114');
  });
});
