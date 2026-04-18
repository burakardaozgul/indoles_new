import { describe, it, expect } from 'vitest';
import { visitorProfileSchema } from '../visitor-profile';

describe('visitorProfileSchema', () => {
  const validPayload = {
    persona: 'donusum-teknoloji',
    problems: ['a', 'b', 'c'],
    lead: {
      firstName: 'Burak',
      lastName: 'Özgül',
      phone: '+905551112233',
      email: 'burak@indoles.com.tr',
      company: 'INDOLES',
      title: 'Kurucu',
    },
    submissionType: 'booking',
    kvkkConsent: true,
    locale: 'tr',
    turnstileToken: 'tkn-abc',
  };

  it('geçerli payload kabul edilir', () => {
    expect(() => visitorProfileSchema.parse(validPayload)).not.toThrow();
  });

  it('problems tam 3 eleman olmalı', () => {
    expect(() => visitorProfileSchema.parse({ ...validPayload, problems: ['a', 'b'] })).toThrow();
    expect(() => visitorProfileSchema.parse({ ...validPayload, problems: ['a', 'b', 'c', 'd'] })).toThrow();
  });

  it('kvkkConsent mutlaka true olmalı', () => {
    expect(() => visitorProfileSchema.parse({ ...validPayload, kvkkConsent: false })).toThrow();
  });

  it('email format invalid reddedilir', () => {
    expect(() => visitorProfileSchema.parse({
      ...validPayload,
      lead: { ...validPayload.lead, email: 'x' },
    })).toThrow();
  });

  it('persona enum dışında değer reddedilir', () => {
    expect(() => visitorProfileSchema.parse({ ...validPayload, persona: 'other' })).toThrow();
  });

  it('preferredSlot optional — yoksa kabul edilir', () => {
    expect(() => visitorProfileSchema.parse(validPayload)).not.toThrow();
  });

  it('preferredSlot geçerli format — kabul edilir', () => {
    const withSlot = { ...validPayload, preferredSlot: { date: '2026-04-25', time: '10:00' } };
    expect(() => visitorProfileSchema.parse(withSlot)).not.toThrow();
  });

  it('preferredSlot hatalı date formatı reddedilir', () => {
    const withBadSlot = { ...validPayload, preferredSlot: { date: '25-04-2026', time: '10:00' } };
    expect(() => visitorProfileSchema.parse(withBadSlot)).toThrow();
  });

  it('preferredSlot hatalı time formatı reddedilir', () => {
    const withBadTime = { ...validPayload, preferredSlot: { date: '2026-04-25', time: '10' } };
    expect(() => visitorProfileSchema.parse(withBadTime)).toThrow();
  });
});
