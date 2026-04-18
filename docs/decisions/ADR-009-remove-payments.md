# ADR-009: Payment (Stripe + iyzico) Kaldırılması

**Durum:** Önerildi
**Tarih:** 2026-04-17
**Karar sahibi:** Burak Arda Özgül

## Bağlam

Mimari stripe (global) + iyzico (TR) dual gateway kurgulamış. Ancak INDOLES'in satış modeli şu an:
- Paketler görüşme-sonrası teklifleşme ile satılır
- Online self-checkout ihtiyacı yok
- Ödeme webhook + fatura üretimi backoffice'te yürür

Dual gateway'in bakımı launch funnel'ına değer katmıyor.

## Karar

Stripe ve iyzico dependency'leri + webhook handler'ları + checkout UI'ı kaldırılır.

## Sonuç

**Olumlu:** `stripe`, `iyzipay` + webhook retry logic + ödeme state machine silinir.

**Olumsuz:** Ödeme gelirse elle süreç kurulur. İlk 12 ay için kabul edilebilir.

## Yeniden değerlendirme tetikleyicileri

- Ürünleşmiş paketlerde online self-checkout talebi >10 lead/ay
- Kampanya flow'u online ödeme gerektirirse
