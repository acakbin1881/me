# Kişisel site

Astro + Tailwind v4, GitHub Pages'e GitHub Actions ile yayınlanır:
**https://acakbin1881.github.io/me/**

Tasarım kararları: `docs/superpowers/specs/2026-11-11-personal-site-design.md`

## Komutlar

| Komut | Ne yapar |
| --- | --- |
| `npm install` | Bağımlılıkları kurar |
| `npm run dev` | Yerel geliştirme sunucusu (`localhost:4321/me/`) |
| `npm run build` | Switzer fontunu indirir (ilk seferde), `dist/` klasörüne statik site üretir |
| `npm run check` | Build alır ve tüm testleri çalıştırır |
| `npm run preview` | Build çıktısını yerelde gösterir |

## İçeriği güncellemek

Sitedeki bütün metin tek bir dosyada: **`src/data/profile.ts`**. Yeni bir deneyim,
okul ya da link eklemek için sadece bu dosyayı değiştir, sonra `npm run check` çalıştır.

## Yapı

- `src/data/profile.ts`: isim, başlık, deneyim, eğitim, linkler.
- `src/components/`: `Nav`, `Hero`, `RowSection` (deneyim/eğitim/iletişim satırları), `Footer`.
- `src/styles/global.css`: renkler, fontlar, grid. Görünümün tek kaynağı.
- `src/layouts/Layout.astro`: ortak `<head>`, SEO ve link önizleme etiketleri.
- `src/lib/url.ts`: linklere `/me` ön ekini ekleyen yardımcı.
- `scripts/fetch-fonts.mjs`: Switzer'ı build öncesi Fontshare'den indirir.
- `scripts/og.html`: `public/og.png` önizleme görselinin kaynağı (yeniden üretme notu içinde).
- `tests/`: `npm run check` ile çalışan testler.
- `.github/workflows/deploy.yml`: `main`'e her push'ta yayınlar.

## Notlar

- **`/me` alt yolu:** İç linkleri ve `public/` dosyalarını her zaman `url()` ile yaz:
  `href={url('/')}`, `src={url('/foto.jpg')}`. Düz `href="/..."` linki kırar (testler yakalar).
- **Switzer fontu git'te yok.** Lisansı fontu kendi sitende kullanmana izin veriyor ama
  repo üzerinden dağıtmana izin vermiyor. Bu yüzden her build'de indiriliyor
  (`src/styles/fonts/*.woff2` gitignore'da).

## Yapılacaklar

- [ ] TrustRFQ başlangıç tarihi → `src/data/profile.ts` içindeki `TODO(aras)`
