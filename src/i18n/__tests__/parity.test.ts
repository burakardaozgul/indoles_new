import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

function flatten(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null
      ? flatten(v as Record<string, unknown>, prefix ? `${prefix}.${k}` : k)
      : [prefix ? `${prefix}.${k}` : k],
  );
}

describe('i18n parity', () => {
  const msgDir = path.join(process.cwd(), 'messages');
  const trPath = path.join(msgDir, 'tr.json');
  const enPath = path.join(msgDir, 'en.json');

  it("tr.json ve en.json key'leri eşit", () => {
    const tr = JSON.parse(fs.readFileSync(trPath, 'utf-8'));
    const en = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
    const trKeys = new Set(flatten(tr));
    const enKeys = new Set(flatten(en));
    const missingInEn = [...trKeys].filter((k) => !enKeys.has(k));
    const missingInTr = [...enKeys].filter((k) => !trKeys.has(k));
    expect({ missingInEn, missingInTr }).toEqual({ missingInEn: [], missingInTr: [] });
  });
});
