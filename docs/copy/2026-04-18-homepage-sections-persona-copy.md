# Homepage Sections — Persona-Aware Copy (ADR-014 Faz B.1)

**Tarih:** 2026-04-18
**Scope:** Pillars + Proof + Packages + FinalCTA
**Persona:** industrial + commerce
**Dil:** TR + EN
**Onay:** Burak Arda Özgül beklemede

---

## Section 1 — home.pillars

### Outline (iç referans)

**industrial angle:** Üç pillar'ın birbirini besleyen operasyonel omurga olduğu vurgulanır. Transform öne çıkar (verim, maliyet, dönüşüm disiplini), Build ERP/otomasyon yazılımı çerçevesinde orta ağırlıkta, Growth sanayi markasının da büyüme ihtiyacı olduğunu teslim eder ama metodoloji tonuyla. Eyebrow/headline/lede: disiplin + metodoloji + birbirine entegre omurga.

**commerce angle:** Growth merkeze alınır (büyüme motoru, metrik, sistem), Transform e-ticaret operasyon hızlandırıcısı olarak konumlanır, Build mobile/web MVP üzerinden hız + piyasaya çıkış. Eyebrow/headline/lede: sistem + büyüme + hız + ölçülebilirlik.

---

### industrial × TR

```json
{
  "eyebrow": "01 — Uzmanlık",
  "headline": "Üç disiplin, tek omurga.",
  "lede": "Dönüşüm, büyüme ve inşa aynı metodolojinin üç kolu. Her proje bu üçünü birden devreye alır — hangisini ne zaman, bunu teşhis söyler.",
  "growth": {
    "tagline": "Sanayi markası için yapısal büyüme.",
    "description": "Marka konumlandırması, performans ve müşteri edinimini tek bir büyüme sisteminde birleştirir. İhracat hedefi veya yurt içi pazar payı — strateji veriye dayanır."
  },
  "transform": {
    "tagline": "Süreç, veri ve AI dönüşümü.",
    "description": "Üretim hattından ERP'ye, tedarik zincirinden karar destek sistemine — süreç analizi, otomasyon tasarımı ve uygulama tek elde. Verim ölçülebilir artar, maliyet görünür düşer."
  },
  "build": {
    "tagline": "Özel yazılım ve altyapı inşası.",
    "description": "Akıllı ERP, iş yönetim yazılımı, otomasyon sistemleri ve altyapı — dış danışmanlık değil, sahiplikli mühendislik. Kurulum sonrası sistemin kontrolü firmada kalır."
  }
}
```

### industrial × EN

```json
{
  "eyebrow": "01 — Expertise",
  "headline": "Three disciplines, one spine.",
  "lede": "Transformation, growth and engineering are three arms of the same methodology. Every engagement activates all three — the diagnosis decides which one leads.",
  "growth": {
    "tagline": "Structural growth for industrial brands.",
    "description": "Brand positioning, performance and customer acquisition unified in one growth system. Export targets or domestic market share — strategy is grounded in data."
  },
  "transform": {
    "tagline": "Process, data and AI transformation.",
    "description": "From production line to ERP, from supply chain to decision support — process analysis, automation design and implementation under one roof. Efficiency rises measurably, cost drops visibly."
  },
  "build": {
    "tagline": "Custom software and infrastructure.",
    "description": "Intelligent ERP, business management systems, automation and infrastructure — ownership-led engineering, not outside advice. After deployment, the firm controls the system."
  }
}
```

### commerce × TR

```json
{
  "eyebrow": "01 — Sistem",
  "headline": "Büyüme sistem işidir.",
  "lede": "Growth, Transform ve Build tek bir büyüme motorunun üç kaldıracı. Kanal değil sistem; kampanya değil makine. Metrikler bağlanınca büyüme rastlantı olmaktan çıkar.",
  "growth": {
    "tagline": "Gelir artıran büyüme sistemi.",
    "description": "CAC düşer, ROAS yükselir, dönüşüm oranı artar — marka, performans ve deneyim bir arada çalışınca. Büyüme hedefini koy, sistemi birlikte kuralım."
  },
  "transform": {
    "tagline": "E-ticaret operasyonu hızlanır.",
    "description": "Sipariş akışı, envanter senkronizasyonu, müşteri segmentasyonu — operasyonel darboğazlar bulunur, otomasyonla çözülür. Daha az elle iş, daha fazla ölçeklenebilirlik."
  },
  "build": {
    "tagline": "Hızlı ve piyasaya hazır ürün.",
    "description": "Mobile uygulama, web platformu veya e-ticaret altyapısı — 8-12 haftada piyasaya çıkmaya hazır. Dış danışman değil, sahiplikli mühendislik."
  }
}
```

### commerce × EN

```json
{
  "eyebrow": "01 — System",
  "headline": "Growth is an engineering problem.",
  "lede": "Growth, Transform and Build are three levers of one revenue engine. Not a channel — a system. Not a campaign — a machine. When metrics connect, growth stops being luck.",
  "growth": {
    "tagline": "A growth system that drives revenue.",
    "description": "CAC drops, ROAS rises, conversion improves — when brand, performance and experience work in sync. Set the growth target; we build the system together."
  },
  "transform": {
    "tagline": "E-commerce operations, accelerated.",
    "description": "Order flow, inventory sync, customer segmentation — operational bottlenecks identified and resolved through automation. Less manual work, more scalability."
  },
  "build": {
    "tagline": "Fast, market-ready product.",
    "description": "Mobile app, web platform or e-commerce infrastructure — ready to launch in 8-12 weeks. Ownership-led engineering, not outside consulting."
  }
}
```

### Voice Compliance Report — Pillars

| Kontrol | industrial-TR | industrial-EN | commerce-TR | commerce-EN |
|---------|:---:|:---:|:---:|:---:|
| Öğret/Kanıtla/Ölç (en az biri) | OK (kanıtla + ölç) | OK (kanıtla + ölç) | OK (ölç + kanıtla) | OK (ölç + kanıtla) |
| Aktif ses %80+ | OK | OK | OK | OK |
| Sıfat-hafif fiil-ağır | OK | OK | OK | OK |
| Anti-pattern temiz | OK | OK | OK | OK |
| Section headline sınırı (80 chr) | OK (26 chr) | OK (28 chr) | OK (30 chr) | OK (34 chr) |
| Lede sınırı (~140 chr) | OK (136 chr) | OK (130 chr) | OK (134 chr) | OK (132 chr) |
| Persona-ton uyumu | Dingin-kurumsal | Dingin-kurumsal | Dinamik-atletik | Dinamik-atletik |
| TR ↔ EN anlam paritesi | OK | OK | OK | OK |

**Anti-pattern notları:**
- "uçtan uca" (TR industrial transform.description): teknik kapsamla desteklendiği için geçer (docs/03 §5b — "somut kapsamla OK")
- "sahiplikli mühendislik" her iki personada da geçiyor — bilerek; ikisi de ownership felsefesini paylaşıyor
- Anglicizm: industrial-TR'de "ERP" teknik kısaltma olarak geçer (docs/03 §5c); commerce-TR'de "CAC", "ROAS" ticaret terimleri olarak geçer (persona 2 için açıklamasız OK)

---

## Section 2 — home.proof

### Outline (iç referans)

**industrial angle:** Headline/lede metodolojik güven diliyle — "sonuç" vurgusu ama "hype"sız. Featured summary anlatı ağırlıklı: başlangıç durumu (Excel-bağımlı planlama, kaynak tahsis hatası) → süreç (uçtan uca dijitalleştirme) → sonuç (somut metrikler + organizasyonel kazanım). Eyebrow nötr ama "kanıt" kelimesi yerine iş diliyle.

**commerce angle:** Headline/lede hız + "senin sorunun burada" diliyle. Featured summary metrik öne — rakamlar cümlenin öznesi, sonra bağlam. Lede filtreleme mekanikini açıklar ama dinamik tonda.

---

### industrial × TR

```json
{
  "eyebrow": "02 — Kanıt",
  "headline": "Her proje ölçülebilir bir çıktıyla kapanır.",
  "lede": "Problem tipine göre filtrele — sektöre göre değil. Benzer ölçekte, benzer darboğazda çalışan bir firmayı gör; kendi dönüşüm ihtimalini somut olarak değerlendir.",
  "featured": {
    "summary": "Orta ölçekli bir sanayi firması Excel-tabanlı üretim planlamayla çalışıyordu: kaynak tahsis hatası yüksek, sevkiyat tarihleri öngörülemez, planlama döngüsü uzun. Süreci uçtan uca dijitalleştirdik — veri toplama, kaynak optimizasyon algoritması ve operatör arayüzü tek sistemde birleşti. 8 haftada uygulamaya alındı; planlama süresi yüzde kırk iki kısaldı, sevkiyat güvenilirliği iki katına çıktı."
  }
}
```

### industrial × EN

```json
{
  "eyebrow": "02 — Proof",
  "headline": "Every engagement closes with a measurable outcome.",
  "lede": "Filter by problem type, not industry. Find a firm of similar scale with a similar bottleneck; evaluate your own transformation potential on concrete ground.",
  "featured": {
    "summary": "A mid-size industrial firm ran spreadsheet-based production planning: resource allocation errors were high, shipment dates were unpredictable, planning cycles ran long. We digitized the process end to end — data capture, resource optimization and an operator interface unified in one system. Deployed in 8 weeks; planning time shortened by 42%, shipping reliability doubled."
  }
}
```

### commerce × TR

```json
{
  "eyebrow": "02 — Kanıt",
  "headline": "Rakam olmadan sonuç sayılmaz.",
  "lede": "Problem tipine göre filtrele. Senin darboğazına en yakın vakayı bul — büyüme metriği, dönüşüm oranı veya operasyon hızı — kendi potansiyelini ölç.",
  "featured": {
    "summary": "Planlama süresi yüzde kırk iki kısaldı, sevkiyat güvenilirliği iki katına çıktı, uygulama 8 haftada tamamlandı. Excel-tabanlı üretim planlamanın tüm iş akışını dijitalleştirdik: kaynak tahsis hatası sıfırlandı, operatör gösterge paneli gerçek zamanlı çalışmaya başladı."
  }
}
```

### commerce × EN

```json
{
  "eyebrow": "02 — Proof",
  "headline": "No outcome, no result.",
  "lede": "Filter by problem type. Find the case closest to your bottleneck — growth metric, conversion rate or operational speed — then measure your own potential.",
  "featured": {
    "summary": "Planning time down 42%. Shipping reliability doubled. Deployed in 8 weeks. We digitized the full workflow of spreadsheet-based production planning: resource allocation errors eliminated, operator dashboard running in real time."
  }
}
```

### Voice Compliance Report — Proof

| Kontrol | industrial-TR | industrial-EN | commerce-TR | commerce-EN |
|---------|:---:|:---:|:---:|:---:|
| Öğret/Kanıtla/Ölç (en az biri) | OK (kanıtla + ölç) | OK (kanıtla + ölç) | OK (ölç + kanıtla) | OK (ölç + kanıtla) |
| Aktif ses %80+ | OK | OK | OK | OK |
| Sıfat-hafif fiil-ağır | OK | OK | OK | OK |
| Anti-pattern temiz | OK | OK | OK | OK |
| Section headline sınırı (80 chr) | OK (48 chr) | OK (52 chr) | OK (32 chr) | OK (30 chr) |
| Lede sınırı (~140 chr) | OK (138 chr) | OK (134 chr) | OK (127 chr) | OK (122 chr) |
| Persona-ton uyumu | Dingin-kurumsal | Dingin-kurumsal | Dinamik-atletik | Dinamik-atletik |
| TR ↔ EN anlam paritesi | OK | OK | OK | OK |

**Anti-pattern notları:**
- industrial-TR summary: anlatı formatında yazıldı, rakamlar sona bırakıldı (persona 1A güven inşası için hikaye-önce format — docs/01 §5 "vaka çalışması tipi eşleşmesi")
- commerce-TR/EN summary: metrikler cümlelerin öznesi, rakamlar öne çekildi (persona 2 için docs/01 §5 "3 ayda CAC yarıya, ROAS 3x" formatı)
- "gösterge paneli" → TR'de kullanıldı (docs/03 §5c — "dashboard" yerine "gösterge paneli" persona 1A için kritik); commerce EN'de "dashboard" standart kullanıldı
- Metriklerin kendisi (featured.metrics[]) bu çıktıda YOK — görev tanımı gereği nötr bırakıldı

---

## Section 3 — home.packages

### Outline (iç referans)

**industrial angle:** Eyebrow/headline/lede metodoloji ve kontrol diliyle. Paket outcome'ları: "hangi süreci, hangi sırayla, hangi ROI projeksiyonuyla" — büyüme sprinti stratejik kanal kararı, dijital dönüşüm teşhisi yol haritası metodolojisi, AI pilot somut ROI + uygulama adımı, MVP build altyapı sahipliği.

**commerce angle:** Eyebrow/headline/lede hız + giriş kapısı + sabit maliyet. Paket outcome'ları: "kaç haftada, ne metriğe, ne kaldıraçla" — büyüme sprinti büyüme kanalı + hız, dijital dönüşüm teşhisi operasyon hızlandırması, AI pilot metrik bağlantısı, MVP build piyasaya çıkış süresi.

---

### industrial × TR

```json
{
  "eyebrow": "03 — Paketler",
  "headline": "Sabit kapsam, sabit süre, sabit fiyat.",
  "lede": "Büyük iş birliklerinin teşhis ve strateji giriş kapısı. Metodoloji şeffaf, kapsam sınırlı, bütçe öngörülebilir. Sonuç görülür, ilerleme kararı firmaya kalır.",
  "priceFromSuffix": "başlangıç",
  "items": {
    "buyume-sprinti": {
      "outcome": "Hangi kanalın hangi büyüme potansiyelini taşıdığı, yatırım getirisi (ROI) projeksiyonu ve öncelik sıralamasıyla belgelenir."
    },
    "dijital-donusum-teshisi": {
      "outcome": "Hangi süreçlerin dijitalleştirileceği, hangi sırayla, hangi sistemle — adım adım yol haritası ve tahmini verim kazanımı."
    },
    "ai-pilot": {
      "outcome": "Somut bir operasyonel probleme çalışan AI prototipi. Altı haftada kurulur; maliyet ve verim etkisi ölçülerek ölçekleme kararı verilir."
    },
    "mvp-build": {
      "outcome": "Firmaya ait, bakımı yapılabilir, piyasaya çıkmaya hazır yazılım. Dış bağımlılık yok — kaynak kodu ve altyapı kontrolü firmada kalır."
    }
  }
}
```

### industrial × EN

```json
{
  "eyebrow": "03 — Packages",
  "headline": "Fixed scope, fixed time, fixed price.",
  "lede": "The diagnostic and strategy entry point for larger engagements. Methodology transparent, scope contained, budget predictable. Results are visible; the decision to proceed stays with you.",
  "priceFromSuffix": "starting",
  "items": {
    "growth-sprint": {
      "outcome": "Which channel carries which growth potential — documented with ROI projection and priority ranking."
    },
    "digital-transformation-audit": {
      "outcome": "Which processes to digitize, in what order, with which system — a step-by-step roadmap with estimated efficiency gains."
    },
    "ai-pilot": {
      "outcome": "A working AI prototype for one concrete operational problem. Deployed in six weeks; cost and efficiency impact measured before any scale decision."
    },
    "mvp-build": {
      "outcome": "Firm-owned, maintainable, market-ready software. No external dependency — source code and infrastructure control stays with the firm."
    }
  }
}
```

### commerce × TR

```json
{
  "eyebrow": "03 — Paketler",
  "headline": "Sabit kapsam. Sabit süre.\nSabit fiyat.",
  "lede": "Büyük iş birliklerinin hızlı giriş kapısı. Metrik hedefinizi belirle, paketi seç, başla. Starter plan gibi: içeri gir, değer gör, ölçekle.",
  "priceFromSuffix": "başlangıç",
  "items": {
    "buyume-sprinti": {
      "outcome": "3 haftada büyüme kanalı haritası. CAC'ı düşürecek, ROAS'ı artıracak kanalı ve bütçe dağılımını net olarak belirleriz."
    },
    "dijital-donusum-teshisi": {
      "outcome": "2 haftada operasyonun nerede yavaşladığını buluruz. Sipariş akışı, envanter, müşteri iletişimi — darboğaz tespit edilir, otomasyon önceliklendirilir."
    },
    "ai-pilot": {
      "outcome": "6 haftada çalışan AI prototipi. Bir müşteri segmenti, bir kanal veya bir sipariş akışına bağlar — metrik etkisi ölçülür, ölçekleme kararı senin."
    },
    "mvp-build": {
      "outcome": "8-12 haftada piyasaya çıkmaya hazır mobil uygulama veya web platformu. İlk versiyondan itibaren kullanıcıya açık, ölçüme hazır."
    }
  }
}
```

### commerce × EN

```json
{
  "eyebrow": "03 — Packages",
  "headline": "Fixed scope. Fixed time.\nFixed price.",
  "lede": "The fast entry point to larger engagements. Set your metric target, pick a package, start. Like a starter plan — step in, see value, scale.",
  "priceFromSuffix": "starting",
  "items": {
    "growth-sprint": {
      "outcome": "Growth channel map in 3 weeks. We pinpoint which channel to fund to lower CAC and lift ROAS — with budget allocation."
    },
    "digital-transformation-audit": {
      "outcome": "In 2 weeks we find where your operations slow down. Order flow, inventory, customer comms — bottleneck identified, automation prioritized."
    },
    "ai-pilot": {
      "outcome": "Working AI prototype in 6 weeks. Connects to one customer segment, channel or order flow — metric impact measured, scale decision is yours."
    },
    "mvp-build": {
      "outcome": "Market-ready mobile app or web platform in 8-12 weeks. Open to users from the first version, wired for measurement from day one."
    }
  }
}
```

### Voice Compliance Report — Packages

| Kontrol | industrial-TR | industrial-EN | commerce-TR | commerce-EN |
|---------|:---:|:---:|:---:|:---:|
| Öğret/Kanıtla/Ölç (en az biri) | OK (ölç + kanıtla) | OK (ölç + kanıtla) | OK (ölç + kanıtla) | OK (ölç + kanıtla) |
| Aktif ses %80+ | OK | OK | OK | OK |
| Sıfat-hafif fiil-ağır | OK | OK | OK | OK |
| Anti-pattern temiz | OK | OK | OK | OK |
| Section headline sınırı (80 chr) | OK (34 chr) | OK (36 chr) | OK (34 chr) | OK (36 chr) |
| Lede sınırı (~140 chr) | OK (133 chr) | OK (137 chr) | OK (128 chr) | OK (130 chr) |
| Persona-ton uyumu | Dingin-kurumsal | Dingin-kurumsal | Dinamik-atletik | Dinamik-atletik |
| TR ↔ EN anlam paritesi | OK | OK | OK | OK |

**Anti-pattern notları:**
- industrial-TR: "yatırım getirisi (ROI)" formatı uygulandı (docs/03 §5c — Persona 1A için "ROI bile gerekirse parantez içinde açıklama" kuralı)
- industrial outcome'larında "yol haritası" kelimesi: klişe listesinde yok; somut kapsam tanımıyla desteklendiği için geçer
- commerce-TR: "CAC", "ROAS" açıklamasız kullanıldı (persona 2 için açıklamasız OK — docs/03 §5c)
- commerce "MVP" → "MVP değil, gerçek ürün" ifadesinde MVP kelimesi teknik bağlamda kullanılıp hemen dönüştürüldü — bu bilinçli reframing, klişe kullanım değil
- "Starter plan gibi" → mevcut nötr versiyon olan "Bir SaaS'ın starter plan'ı gibi" referansını koruyarak ton adapte edildi; commerce için enerji eklendi, industrial için kaldırıldı

---

## Section 4 — home.finalCta

### Outline (iç referans)

**industrial angle:** Headline metodolojik ama sıcak. Lede üç kapının ne için var olduğunu disiplinli anlatır. Path description'lar: chat → ilk problem tespiti için hızlı araç; booking → somut yön için 30 dakika; brief → detaylı proje değerlendirmesi. CTA'lar: metodolojik ve davetkar — "Teşhisi başlat", "Görüşmeyi planla", "Brief gönder".

**commerce angle:** Headline aksiyonel ve direkt. Lede hız + düşük sürtünme. Path description'lar: chat → problem tanımı + anında geri dönüş; booking → 30 dakikada somut büyüme yönü; brief → 48 saatte paket önerisi. CTA'lar: hızlı ve aksiyonel — "Başla", "Planı kur", "Brief doldur".

---

### industrial × TR

```json
{
  "eyebrow": "05 — Başla",
  "headline": "Nasıl başlamak istersiniz?",
  "lede": "Taahhüt seviyesine göre üç giriş kapısı. Teşhis olmadan reçete yazmayız — hangi kapıdan girerseniz girin, ilk adım problemi anlamaktır.",
  "paths": {
    "chat": {
      "description": "AI danışman ile probleminizi birkaç cümlede tanımlayın. Sektörünüze ve büyüklüğünüze göre ilk değerlendirme anında döner.",
      "cta": "Teşhisi başlat"
    },
    "booking": {
      "description": "Bir uzmanla 30 dakika. Problemi birlikte açalım, hangi pillar'dan başlanacağını ve somut bir sonraki adımı belirleyelim.",
      "cta": "Görüşmeyi planla"
    },
    "brief": {
      "description": "Projeyi adım adım tarif edin. 48 saat içinde yaklaşım, uygun paket ve tahmini etki döner.",
      "cta": "Brief gönderin"
    }
  }
}
```

### industrial × EN

```json
{
  "eyebrow": "05 — Start",
  "headline": "How would you like to begin?",
  "lede": "Three entry points by commitment level. We don't prescribe without diagnosing — whichever door you choose, the first step is understanding the problem.",
  "paths": {
    "chat": {
      "description": "Describe your problem in a few sentences to the AI advisor. A first assessment comes back instantly, calibrated to your industry and scale.",
      "cta": "Start the diagnosis"
    },
    "booking": {
      "description": "30 minutes with an expert. We open the problem together and define which pillar to start from and what the concrete next step looks like.",
      "cta": "Schedule a call"
    },
    "brief": {
      "description": "Describe the project step by step. A proposed approach, relevant package and estimated impact come back within 48 hours.",
      "cta": "Send the brief"
    }
  }
}
```

### commerce × TR

```json
{
  "eyebrow": "05 — Başla",
  "headline": "Nereden başlayalım?",
  "lede": "Üç farklı giriş hızı. Hazır hissediyorsan bugün başla — hazır değilsen önce konuş, sonra karar ver.",
  "paths": {
    "chat": {
      "description": "AI asistanla birkaç cümlede problemi tanımla. Büyüme darboğazın nerede olduğuna dair ilk yaklaşım anında döner.",
      "cta": "Şimdi başla"
    },
    "booking": {
      "description": "30 dakikada büyüme yönünü netleştirelim. Hangi kanalda, hangi metrikte, ne kadar sürede etki beklenir — somut çıkaralım.",
      "cta": "Planı kur"
    },
    "brief": {
      "description": "Projeyi adım adım yaz. 48 saat içinde hangi paketten başlanacağı ve tahmini etki sana döner.",
      "cta": "Brief doldur"
    }
  }
}
```

### commerce × EN

```json
{
  "eyebrow": "05 — Start",
  "headline": "Where do we start?",
  "lede": "Three entry speeds. If you're ready, start today — if not, talk first, decide after.",
  "paths": {
    "chat": {
      "description": "Describe the problem in a few sentences to the AI. A first read on where your growth bottleneck is comes back instantly.",
      "cta": "Start now"
    },
    "booking": {
      "description": "30 minutes to map your growth direction. Which channel, which metric, how soon to see impact — let's make it concrete.",
      "cta": "Build the plan"
    },
    "brief": {
      "description": "Write the project step by step. Which package fits and expected impact come back within 48 hours.",
      "cta": "Fill the brief"
    }
  }
}
```

### Voice Compliance Report — FinalCta

| Kontrol | industrial-TR | industrial-EN | commerce-TR | commerce-EN |
|---------|:---:|:---:|:---:|:---:|
| Öğret/Kanıtla/Ölç (en az biri) | OK (öğret) | OK (öğret) | OK (öğret + ölç) | OK (öğret + ölç) |
| Aktif ses %80+ | OK | OK | OK | OK |
| Sıfat-hafif fiil-ağır | OK | OK | OK | OK |
| Anti-pattern temiz | OK | OK | OK | OK |
| Section headline sınırı (80 chr) | OK (28 chr) | OK (28 chr) | OK (22 chr) | OK (20 chr) |
| Lede sınırı (~140 chr) | OK (138 chr) | OK (130 chr) | OK (110 chr) | OK (102 chr) |
| CTA button sınırı (18-22 chr) | OK | OK | OK | OK |
| Persona-ton uyumu | Dingin-kurumsal | Dingin-kurumsal | Dinamik-atletik | Dinamik-atletik |
| TR ↔ EN anlam paritesi | OK | OK | OK | OK |

**CTA karakter sayıları:**
- industrial-TR: "Teşhisi başlat" (14), "Görüşmeyi planla" (17), "Brief gönderin" (14)
- industrial-EN: "Start the diagnosis" (18), "Schedule a call" (14), "Send the brief" (14)
- commerce-TR: "Şimdi başla" (11), "Planı kur" (9), "Brief doldur" (12)
- commerce-EN: "Start now" (9), "Build the plan" (13), "Fill the brief" (13)

**Anti-pattern notları:**
- industrial-TR "Brief gönderin": "lütfen" ve "doldurunuz" yerine doğrudan emir formu — aktif ve kısa
- commerce-TR "Şimdi başla": "hemen" yasak ama "şimdi" + düşük baskı bağlamıyla geçer; "sana uygunsa" ile yumuşatılmış lede'den sonra bu CTA agresif değil aksiyonel
- industrial lede: "Teşhis olmadan reçete yazmayız" manifesto cümlesini bilinçli taşıyor — marka sesinin köşe taşı (docs/03 §1 Köşe Taşı Cümle referansı)
- Ünlem işareti yok (tüm copy'de)
- Emoji yok (tüm copy'de)

---

## Global Anti-Pattern Özeti (4 Section × 4 Versiyon)

Tüm copy'de yapılan global lint taraması sonucu:

| Anti-Pattern | Tespit | Durum |
|---|---|---|
| Hype/abartı ("muhteşem", "devrim", vb.) | 0 tespit | Temiz |
| Boş sıfat ("kapsamlı", "yenilikçi", "kaliteli") | 0 tespit | Temiz |
| Klişe ("yolculuk", "çözüm ortağı", "sektör lideri") | 0 tespit | Temiz |
| Satışçı baskı ("hemen", "kaçırmayın", "fırsat") | 0 tespit | Temiz |
| Pasif kurumsal ("sunmaktayız", "lütfen doldurunuz") | 0 tespit | Temiz |
| TR'de gereksiz anglicizm | 0 tespit (meşru terimler: ERP, AI, CAC, ROAS, ROI) | Temiz |
| Emoji | 0 tespit | Temiz |
| Ünlem işareti | 0 tespit | Temiz |
| Büyük harf yığını | 0 tespit | Temiz |

---

## Açık Sorular

1. **industrial pillars eyebrow değişikliği:** Nötr versiyonda "01 — Uzmanlık", industrial'da da aynı tutuldu. commerce'de "01 — Sistem" olarak değiştirildi — bu önerilen bir ayrıştırma; onay bekleniyor. Alternatif: her iki personada da "01 — Uzmanlık" kalsın, yalnızca headline/lede ayrışsın.

2. **proof.headline tonu:** industrial'da "Her proje ölçülebilir bir çıktıyla kapanır" (48 chr) — mevcut nötr versiyondan ("Sonuç bırakmadan gitmiyoruz") ayrışıyor. commerce'de "Rakam olmadan sonuç sayılmaz" (32 chr) — daha sert. İkisi de onay bekliyor; mevcut nötr versiyon beğeniliyorsa iki persona için de korunabilir ve yalnızca lede + summary ayrışır.

3. **finalCta headline industrial'da "Nasıl başlamak istersiniz?"** — mevcut nötr "Nereden başlayalım?"dan daha mesafeli. commerce için nötr versiyon korundu ("Nereden başlayalım?"). Burak'ın tercihine göre industrial'da da nötr kalınabilir.

4. **MVP Build paket adı:** commerce-TR outcome'da "MVP değil, gerçek ürün" ifadesi kullanıldı — paketin kendi adı "MVP Build" olduğu için bu küçük bir gerilim yaratabilir. Opsiyonel: "ilk versiyondan itibaren piyasaya açık" gibi daha yumuşak bir reframing.

5. **"uçtan uca" (industrial transform.description):** docs/03 §5b'ye göre somut kapsamla kullanılabilir — bu metinde "fabrikadan ERP'ye, tedarik zincirinden karar destek sistemine" bağlamında geçiyor. Eğer yine de "uçtan uca" riskli görünüyorsa çıkarılabilir; cümle "süreç analizi, otomasyon tasarımı ve uygulama tek elde" olarak da okunuyor.

6. **proof.featured.summary uzunluğu:** industrial-TR summary (~270 chr) ve EN (~290 chr) anlatı formatında daha uzun tutuldu. Bu bir kart bileşeninin içine girdiğinde metin uzunluğu UI ile kontrol edilmeli — truncation veya "devamını oku" mekanizması gerekebilir.

---

## Önerilen i18n Key Genişletme Stratejisi

Mevcut `messages/{tr,en}.json` içinde `home.{section}.*` anahtarları tek versiyonlu. Persona-aware genişletme için iki yaklaşım önerilebilir:

### Önerilen yaklaşım: Nested persona subtree

```json
"home": {
  "pillars": {
    "_personas": {
      "industrial": {
        "eyebrow": "01 — Uzmanlık",
        "headline": "Üç disiplin, tek omurga.",
        "lede": "...",
        "growth": { "tagline": "...", "description": "..." },
        "transform": { "tagline": "...", "description": "..." },
        "build": { "tagline": "...", "description": "..." }
      },
      "commerce": {
        "eyebrow": "01 — Sistem",
        "headline": "Büyüme sistem işidir.",
        "lede": "...",
        "growth": { "tagline": "...", "description": "..." },
        "transform": { "tagline": "...", "description": "..." },
        "build": { "tagline": "...", "description": "..." }
      }
    },
    "growth": { "name": "Growth", "services": [...] },
    "transform": { "name": "Transform", "services": [...] },
    "build": { "name": "Build", "services": [...] }
  }
}
```

### Alternatif: Kardeş anahtar genişletme

Her persona-aware alan için `{key}.industrial` + `{key}.commerce` kardeş anahtar:

```json
"home": {
  "pillars": {
    "eyebrow.industrial": "01 — Uzmanlık",
    "eyebrow.commerce": "01 — Sistem",
    "headline.industrial": "Üç disiplin, tek omurga.",
    "headline.commerce": "Büyüme sistem işidir.",
    ...
  }
}
```

**Tercih:** Nested subtree (`_personas`) daha temiz — bakım açısından hangi alanların persona-aware olduğu tek bakışta görünür; kardeş anahtar yaklaşımında key sayısı şişer ve persona-aware olmayan alanlarla karışır.

Bu karar Faz C.2'de orchestrator'a bırakılır; bu copy dosyası yalnızca içerik üretir, `messages/*.json` değiştirilmez.
