import { describe, expect, it } from 'vitest';
import { buildMime, dotStuff, encodeHeader } from '../smtp';

describe('encodeHeader', () => {
  it('saf ASCII başlığa dokunmaz', () => {
    expect(encodeHeader('New message from the site')).toBe('New message from the site');
  });

  it('Türkçe karakterli başlığı RFC 2047 ile kodlar', () => {
    // Kodlanmazsa konu satırı alıcıda bozuk görünür.
    const out = encodeHeader('İletişim — Ayşe Yılmaz');
    expect(out.startsWith('=?UTF-8?B?')).toBe(true);
    expect(out.endsWith('?=')).toBe(true);
    const decoded = Buffer.from(out.slice(10, -2), 'base64').toString('utf-8');
    expect(decoded).toBe('İletişim — Ayşe Yılmaz');
  });
});

describe('dotStuff', () => {
  it('satır başındaki tek noktayı çiftler', () => {
    // Kaçırılmazsa "." satırı DATA gövdesini erken bitirir ve mail kesilir.
    expect(dotStuff('bir\r\n.\r\niki')).toBe('bir\r\n..\r\niki');
  });

  it('gövdenin ilk karakteri nokta ise onu da kaçırır', () => {
    expect(dotStuff('.gizli')).toBe('..gizli');
  });

  it('satır ortasındaki noktaya dokunmaz', () => {
    expect(dotStuff('indoles.com.tr')).toBe('indoles.com.tr');
  });
});

describe('buildMime', () => {
  const base = {
    from: { name: 'INDOLES', email: 'noreply@indoles.com.tr' },
    to: ['digital@indoles.com.tr', 'burak@indoles.com.tr'],
    replyTo: 'digital@indoles.com.tr',
    subject: 'Test',
    text: 'düz metin',
    html: '<p>zengin</p>',
    date: 'Thu, 28 Aug 2026 00:00:00 GMT',
    boundary: 'SINIR',
  };

  it('zorunlu başlıkları basar', () => {
    const m = buildMime(base);
    expect(m).toContain('From: INDOLES <noreply@indoles.com.tr>');
    expect(m).toContain('To: digital@indoles.com.tr, burak@indoles.com.tr');
    expect(m).toContain('Reply-To: digital@indoles.com.tr');
    expect(m).toContain('MIME-Version: 1.0');
    expect(m).toContain('Content-Type: multipart/alternative; boundary="SINIR"');
  });

  it('düz metin ve HTML parçalarını base64 olarak taşır', () => {
    const m = buildMime(base);
    expect(m).toContain('Content-Type: text/plain; charset=UTF-8');
    expect(m).toContain('Content-Type: text/html; charset=UTF-8');
    expect(m).toContain(Buffer.from('düz metin', 'utf-8').toString('base64'));
    expect(m).toContain(Buffer.from('<p>zengin</p>', 'utf-8').toString('base64'));
  });

  it('sınırı doğru kapatır', () => {
    expect(buildMime(base).trimEnd().endsWith('--SINIR--')).toBe(true);
  });

  it('replyTo verilmezse Reply-To başlığı hiç basılmaz', () => {
    const { replyTo: _drop, ...noReply } = base;
    expect(buildMime(noReply)).not.toContain('Reply-To:');
  });

  it('çıplak LF bırakmaz — her satır sonu CRLF', () => {
    // SMTP salt LF kabul etmiyor. Son satırda kapanış CRLF'i YOK: onu
    // sendSmtpMail gövde bitiricisiyle birlikte ekliyor.
    const m = buildMime(base);
    expect(/(?<!\r)\n/.test(m)).toBe(false);
    expect(m.endsWith('--SINIR--')).toBe(true);
  });
});
