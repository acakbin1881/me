# Kişisel site

Astro + Tailwind v4, Vercel'de yayınlanır. GitHub reposu Vercel'e bağlı:
`main`'e her push production'a, diğer branch'ler önizleme (preview) linkine çıkar.

## Tasarım fikri

Sayfa tek bir kâğıt yaprağı gibi kurulu, iki yüzü var:

- **Ön yüz (beyaz): iş.** Sadece tipografi. Merdiven gibi dizilmiş cümle, Experience ve Education.
- **Arka yüz (İsviçre bayrak kırmızısı): hayat.** Her fiil (Trains, Cooks, Speaks...) bir bölüm, fotoğraflar kırmızı kâğıda
  siyah baskı gibi durur; üzerine gelince (telefonda ekranın ortasından geçerken) gerçek renklerine döner.
- **Köşe:** sağ alttaki katlanmış köşe her zaman diğer yüzün rengini gösterir ve oraya götürür.
  Ön yüzün sonunda sayfa, kaydırdıkça o köşeden 45 derece açıyla çevrilir. Bunu desteklemeyen
  tarayıcılarda ve "hareketi azalt" ayarında kırmızı yüz sadece eğik bir kenarla başlar.
- **Renkler:** kâğıt beyazı `#f6f6f3`, mürekkep siyahı `#0c0c0b` ve tek renk olarak İsviçre bayrak
  kırmızısı `#da291c` (Pantone 485 C). Kırmızı zeminde sadece beyaz yazı erişilebilirlik testini
  geçtiği için arka yüzdeki bütün yazılar beyaz.

## Komutlar

| Komut | Ne yapar |
| --- | --- |
| `npm install` | Bağımlılıkları kurar |
| `npm run dev` | Yerel geliştirme sunucusu (`localhost:4321`) |
| `npm run build` | Switzer fontunu indirir (ilk seferde), `dist/` klasörüne statik site üretir |
| `npm run check` | Build alır ve tüm testleri çalıştırır |
| `npm run preview` | Build çıktısını yerelde gösterir |

## İçeriği güncellemek

Sitedeki bütün metin tek bir dosyada: **`src/data/profile.ts`**. Değiştirdikten sonra
`npm run check` çalıştır.

- **Cümleler:** `work` (ön yüz) ve `life` (arka yüz). İsimden sonraki satırlar; her satır en fazla
  20 karakter, yoksa merdivene sığmaz.
- **Deneyim, eğitim, linkler:** `experience`, `education`, `links`. `end: 'Present'` kırmızı "Now" olur.
- **Hayat bölümleri:** `chapters`. Her bölüm bir fiil (en fazla 7 harf), tek cümlelik bir not ve
  1 ile 3 arası fotoğraf. İlk fotoğraf en büyük yere oturur. Dört farklı yerleşim sırayla tekrar
  eder, yani bölüm ekleyip çıkarabilirsin.

**Fotoğraflar:** dosyayı `src/assets/photos/` klasörüne koy (JPG, PNG veya WebP; iPhone'un
HEIC dosyalarını önce JPG olarak dışa aktar), sonra `chapters` içinde dosya adıyla kullan.
Build sırasında fotoğraflar küçültülür ve konum (GPS) bilgisi silinir. Her fotoğrafa `alt`
metni ve `caption` (yer, yıl) gerekir. Fotoğraflar yerleşimdeki kutuya göre kırpılır, o yüzden
konu ortada olsun. `placeholder-*.jpg` dosyaları ve bölümlerdeki notlar geçici; gerçekleri
gelince silinecek.

## Yapı

- `src/data/profile.ts`: bütün içerik.
- `src/pages/index.astro`: iki yüzün sırası (ön yüz, sayfa çevirme, arka yüz).
- `src/components/`: `Masthead` (üst satır), `Stair` (merdiven cümle), `Record` (deneyim ve
  eğitim tablosu), `Corner` (katlanmış köşe), `Chapter` (hayat bölümü), `Arrow` (ok).
- `src/styles/global.css`: renkler, font, yerleşim ve hareket. Görünümün tek kaynağı.
- `src/layouts/Layout.astro`: ortak `<head>`, SEO ve link önizleme etiketleri.
- `src/lib/url.ts`: iç linkleri ve `public/` dosyalarını `base`'e göre yazan yardımcı. `src/lib/photos.ts`: fotoğraf bulucu.
- `scripts/fetch-fonts.mjs`: Switzer'ı build öncesi Fontshare'den indirir.
- `scripts/og.html`: `public/og.png` önizleme görselinin kaynağı (yeniden üretme komutu içinde).
- `tests/`: `npm run check` ile çalışan testler.

## Notlar

- **Linkler:** Site artık alan adının kökünde (`/me` alt yolu yok). Yine de iç linkleri ve
  `public/` dosyalarını `url()` ile yaz: `href={url('/')}`, `src={url('/foto.jpg')}`.
- **Alan adı:** `astro.config.mjs` içindeki `site`, Vercel'in build sırasında verdiği
  `VERCEL_PROJECT_PRODUCTION_URL` değerinden gelir. Özel alan adı eklersen ayrıca bir şey yapmana gerek yok.
- **Switzer fontu git'te yok.** Lisansı fontu kendi sitende kullanmana izin veriyor ama
  repo üzerinden dağıtmana izin vermiyor. Bu yüzden her build'de indiriliyor
  (`src/styles/fonts/*.woff2` gitignore'da).

## Yapılacaklar

- [ ] TrustRFQ başlangıç tarihi → `src/data/profile.ts` içindeki `TODO(aras)`
- [ ] Gerçek fotoğraflar, bölüm notları ve altyazılar → `chapters` üstündeki `TODO(aras)`
