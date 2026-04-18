# ADR-007: AI Agent Kaldırılması

**Durum:** Önerildi
**Tarih:** 2026-04-17
**Karar sahibi:** Burak Arda Özgül
**Bağlı:** `docs/superpowers/specs/2026-04-17-simplification-design.md`, `ADR-001-agent-orchestration.md`

## Bağlam

ADR-001 Vercel AI SDK + Gemini agent'ını seçti. Agent rezervasyon ve brief oluşturma tool'ları ile entegre edildi. Ancak launch fazında:

- Kritik yolculuklar (rezervasyon = Cal.com, brief = contact form) agent olmadan zaten çalışıyor
- Agent'in somut conversion etkisi ölçülmedi
- Gemini API maliyeti, tool call disiplin yükü, fallback state karmaşıklığı devam ediyor
- Sadeleştirme girişimi kapsamında ek karmaşıklık kaldırılıyor

## Karar

AI agent tamamen kaldırılır. `src/app/api/agent/*`, `src/server/agent/*`, ilgili chatbot UI component'leri silinir. `docs/07-ai-agent-spec.md` arşivlenir (dosya silinmez, başına "Arşive alındı" notu eklenir). Vercel AI SDK + Gemini dependency'leri çıkar.

## Sonuç

**Olumlu:**
- `@ai-sdk/google`, `ai` dependency'leri kalkar
- `/api/agent` route + tool orchestration kodu silinir (~500 satır)
- Gemini API quota/maliyet endişesi biter

**Olumsuz:**
- Chatbot deneyimi kaybolur; ziyaretçi sorusu olursa contact form veya popup'a yönlenir
- Popup persona+problems context'i chatbot'a inject edilmez (spec §8 düşer)

## Yeniden değerlendirme tetikleyicileri

- Launch sonrası 6 ay: ziyaretçi sorularının hacmi formu tetiklemeden sorulup cevapsız kalıyorsa agent FAQ asistanı olarak dönebilir
- Rezervasyon conversion'ı <%3'te takılıyorsa agent lead-qualification rolüyle yeniden düşünülür
