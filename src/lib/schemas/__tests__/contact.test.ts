import { describe, it, expect } from 'vitest';
import { contactSchema } from '../contact';

describe('contactSchema', () => {
  const validPayload = {
    firstName: 'Burak',
    lastName: 'Özgül',
    email: 'burak@indoles.com.tr',
    phone: '+905551112233',
    company: 'INDOLES',
    subject: 'Dönüşüm projesi',
    message: 'Kısa bir açıklama, en az 20 karakter olmalı ki geçsin.',
    budgetRange: '100k-250k',
    timeline: '1-3-months',
    kvkkConsent: true,
    locale: 'tr',
    turnstileToken: 'tkn-abc',
  };

  it('geçerli payload kabul edilir', () => {
    expect(() => contactSchema.parse(validPayload)).not.toThrow();
  });

  it('message minimum 20 karakter', () => {
    expect(() => contactSchema.parse({ ...validPayload, message: 'çok kısa' })).toThrow();
  });

  it('kvkkConsent mutlaka true olmalı', () => {
    expect(() => contactSchema.parse({ ...validPayload, kvkkConsent: false })).toThrow();
  });
});
