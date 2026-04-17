# CI/CD Workflows

Bu klasör `checks.yml`, `preview.yml` ve `production.yml` dosyalarını içerecek.

Yapı `docs/05-tech-architecture.md` §12.1'de tanımlı:

- **checks.yml** — PR üzerinde lint, typecheck, test, build
- **preview.yml** — Per-PR Neon branch + `sst deploy --stage pr-{n}` + Playwright
- **production.yml** — `main` merge → migration apply → `sst deploy --stage production`

Workflow dosyalarını yazarken `github.event.*` gibi untrusted input'ları `env:` bloğuna mapping'le — doğrudan `${{ ... }}` olarak shell'e gömmek injection riskidir.

Örnek güvenli pattern:
```yaml
env:
  TITLE: ${{ github.event.issue.title }}
run: echo "$TITLE"
```
