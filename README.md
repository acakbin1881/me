# Kişisel site

Astro + Tailwind v4, GitHub Pages'e GitHub Actions ile yayınlanır.

## Komutlar

| Komut | Ne yapar |
| --- | --- |
| `npm install` | Bağımlılıkları kurar |
| `npm run dev` | Yerel geliştirme sunucusu (`localhost:4321`) |
| `npm run build` | `dist/` klasörüne statik site üretir |
| `npm run preview` | Build çıktısını yerelde gösterir |

## Yapı

- `src/styles/global.css`: tasarım değerleri (font, renk). Görünümün tek kaynağı.
- `src/layouts/Layout.astro`: ortak `<head>`, SEO ve link önizleme etiketleri.
- `src/pages/`: her dosya bir sayfa (`index.astro` → `/`, `404.astro` → 404).
- `public/`: olduğu gibi kopyalanan dosyalar (favicon, `og.png`).
- `src/lib/url.ts`: linklere `/me` ön ekini ekleyen yardımcı.
- `.github/workflows/deploy.yml`: `main`'e her push'ta yayınlar.

## Yayına alma

`me` reposunun `main` branch'ine her push'ta GitHub Actions siteyi build edip yayınlar:
**https://acakbin1881.github.io/me/**

Site `/me` alt yolunda çalıştığı için iç linkleri ve `public/` dosyalarını her zaman
`url()` yardımcısıyla yaz (`src/lib/url.ts`): `href={url('/projeler')}`, `src={url('/foto.jpg')}`.
Düz `href="/..."` yazarsan link `acakbin1881.github.io/...` adresine gider ve kırılır.

## Yapılacaklar

- [ ] Tasarım kararları: konsept, fontlar, renkler → `global.css`
- [ ] `Layout.astro` içindeki `TODO` başlık ve açıklama
- [ ] `public/og.png` (1200×630 link önizleme görseli)
- [ ] İçerik ve bölümler
