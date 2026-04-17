# ADR-001 — AI Agent Orchestration: Vercel AI SDK

**Statü:** Accepted
**Tarih:** 2026-04-16
**Karar veren:** Burak Arda Özgül (Founder / CTO)
**Etkilenen dosyalar:** `docs/05-tech-architecture.md`, `docs/07-ai-agent-spec.md`

---

## Bağlam

INDOLES web platformunun AI chatbot'u üç temel işi yapacak:

1. **Teşhis / yönlendirme** — Ziyaretçiyi uygun pillar'a (Growth / Transform / Build) veya uygun pakete yönlendirmek.
2. **Tool calling** — Paket listesi, danışman uygunluğu, case study araması, brief taslağı oluşturma gibi iç tool'ları çağırmak.
3. **Streaming UX** — Editorial-minimalist UI'da progressive markdown render ile düşük gecikmeli cevap.

LLM sağlayıcısı olarak Google Gemini sabitlenmiş durumda (maliyet, TR dil kalitesi, context window, enterprise roadmap dengesi). Açık kalan soru: **orkestrasyon katmanı** — tool calling, streaming, conversation state, retries, timeout, error boundary — hangi kütüphane ile yönetilecek?

## Değerlendirilen seçenekler

### A) Vercel AI SDK (`ai` + `@ai-sdk/google`)

- `streamText`, `generateObject`, `tool()` helper'ları ile TypeScript-native API.
- Vercel RSC + Next.js streaming ile doğrudan uyumlu; `createUIMessageStream` ile client side markdown render zaten template haline gelmiş.
- Multi-step tool calling built-in (`maxSteps`), parallel tool calls destekli.
- Provider-agnostic — ileride model swap (Gemini → Claude / OpenAI) tek satır değişiklik.
- Olgun, aktif bakım, geniş topluluk, Vercel'in ana bahisi.

### B) LangGraph (`@langchain/langgraph`)

- Graph-based stateful orchestration, cycle'lar destekli.
- Kompleks multi-agent senaryolar (supervisor → worker pattern) için güçlü.
- Ama: Python-first mental model, TypeScript SDK daha genç; dökümantasyon çoğunlukla Python örnekleri üzerinden.
- Çalışma zamanı büyük — INDOLES'in tek agent + ~8 tool senaryosu için aşırı kapsamlı.
- Next.js RSC streaming entegrasyonu el ile yazılmalı.

### C) Custom orchestrator (Google GenAI SDK doğrudan)

- `@google/generative-ai` SDK ile doğrudan Gemini API çağrısı.
- Maximum kontrol, minimum abstraksiyon.
- Tool calling, streaming, state yönetimi, retry, timeout her şey el yazımı.
- Provider lock-in kabul edilmiş olur; future model swap zor.
- Başlangıçta hızlı görünür ama 3 ay sonra kendi AI SDK'mızı yazmış olmaya döner.

## Karar

**Vercel AI SDK seçildi.**

## Gerekçe

1. **Senaryo uyumu.** INDOLES'in AI agent senaryosu "tek agent, ~8 iç tool, RSC streaming" — Vercel AI SDK'nın sweet spot'u tam bu. LangGraph'ın multi-agent/cycle kabiliyetleri şu an ve öngörülebilir 12 ayda gereksiz.
2. **Next.js uyumu.** Projenin geri kalanı Next.js 15 RSC üzerine kurulu. `ai` SDK'nın `streamText` → SSE → client'ta `useChat` akışı zero-glue çalışıyor. LangGraph'ta aynı akış için manual streaming bridge gerekir.
3. **Provider flexibility.** SDK provider-agnostic; ileride Claude veya OpenAI'a fallback eklemek için tek satır değişiklik (v2 için not edildi, `05-tech-architecture.md` §12.4).
4. **Olgunluk + ekip ergonomisi.** Tek kişilik decision maker için (Burak), öğrenme eğrisi düşük ve dokümantasyon zengin bir araç; bug diagnostics Vercel topluluğunda hızlı.
5. **TypeScript-native.** Tip güvenliği tool input/output seviyesine kadar iniyor (`zod` + `tool()` pattern'i). LangGraph TS sürümünde tip çıkarımları daha gevşek.
6. **Lock-in kabul edilebilir.** Vercel AI SDK open source (Apache 2.0), Vercel olmadan da çalışır. Bu lock-in değil, dependency.

## Sonuçlar

### Pozitif
- AI agent'in ilk üretilebilir versiyonu 1-2 sprint içinde çıkar.
- Yeni tool eklemek standart pattern: `tool({ description, parameters: z.object({...}), execute: async (input) => {...} })`.
- Client UI (`useChat` + markdown render) minimal boilerplate.
- Model swap için tek satır: `google("gemini-1.5-pro")` → `anthropic("claude-sonnet-4-6")`.

### Negatif / trade-off
- Ultra-kompleks multi-agent graph senaryosu gelirse migration gerekir (mevcut senaryoda yok).
- SDK bazı low-level Gemini feature'larını (ör. system instructions'daki özel cache mechanism) zamanla destekleyebilir; yeni özellikler için SDK update beklemek gerekir.

### Yeniden değerlendirme tetikleyicileri
Aşağıdaki durumlardan **biri** gerçekleşirse ADR yeniden açılır:

- Agent senaryosu multi-agent graph + cycle + human-in-the-loop approval gerektirirse.
- Gemini dışında iki+ model'i paralel orchestrate etmek gerekirse (ör. "planner Gemini + coder Claude").
- Vercel AI SDK bakımı yavaşlar veya breaking change momentumu artarsa.

## Implementasyon notları

- Agent handler: `src/app/api/agent/route.ts`
- Tool tanımları: `src/lib/ai/tools/*.ts` (her tool ayrı dosya)
- System prompt: `src/lib/ai/prompts/indoles-agent.ts` (bkz. `07-ai-agent-spec.md`)
- Model routing: kısa Q&A → `gemini-1.5-flash`, tool-heavy (brief triage, search) → `gemini-1.5-pro`

## Referanslar

- Vercel AI SDK dokümantasyonu: `https://sdk.vercel.ai/docs`
- LangGraph (değerlendirildi, reddedildi): `https://langchain-ai.github.io/langgraphjs/`
- Google GenAI SDK: `https://ai.google.dev/`
- İlgili belgeler: `docs/05-tech-architecture.md` §4.6, `docs/07-ai-agent-spec.md`
