import { describe, it, expect } from 'vitest';
import { render } from '@react-email/render';
import VisitorProfileLeadNotification from '../VisitorProfileLeadNotification';
import VisitorProfileAutoreply from '../VisitorProfileAutoreply';
import ContactNotification from '../ContactNotification';
import ContactAutoreply from '../ContactAutoreply';

const sampleLead = {
  firstName: 'Burak',
  lastName: 'Özgül',
  email: 'burak@indoles.com.tr',
  phone: '+905551112233',
  company: 'INDOLES',
  title: 'Kurucu',
};

describe('email templates', () => {
  it('VisitorProfileLeadNotification render olur', async () => {
    const html = await render(
      <VisitorProfileLeadNotification
        persona="donusum-teknoloji"
        problems={['manuel-surecler', 'ai-uygulanma', 'verim-olcum']}
        lead={sampleLead}
        submissionType="booking"
        locale="tr"
      />,
    );
    expect(html).toContain('Burak');
    expect(html).toContain('INDOLES');
  });

  it('VisitorProfileAutoreply persona tonu içerir (sanayici)', async () => {
    const html = await render(
      <VisitorProfileAutoreply
        persona="donusum-teknoloji"
        firstName="Burak"
        submissionType="contact"
        locale="tr"
      />,
    );
    expect(html).toContain('Burak');
  });

  it('ContactNotification render olur', async () => {
    const html = await render(
      <ContactNotification
        firstName="Ayşe"
        lastName="Yılmaz"
        email="a@b.c"
        phone="+905550001122"
        company="Acme"
        subject="Proje"
        message="Uzun bir mesaj, 20 karakterden fazla."
        budgetRange="100k-250k"
        timeline="1-3-months"
        locale="tr"
      />,
    );
    expect(html).toContain('Ayşe');
    expect(html).toContain('100k-250k');
  });

  it('ContactAutoreply render olur', async () => {
    const html = await render(
      <ContactAutoreply firstName="Ayşe" locale="tr" />,
    );
    expect(html).toContain('Ayşe');
  });
});
