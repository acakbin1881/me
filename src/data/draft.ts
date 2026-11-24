/**
 * Content for the /draft page: one long homepage, read top to bottom.
 *
 * This is a working draft, kept apart from profile.ts on purpose so the live
 * page and its tests stay untouched. Career rows and life chapters are still
 * read from profile.ts.
 *
 * Every piece carries a status, shown as a tag on the page:
 *   fact      = taken from a source (LinkedIn, a README, git history, a transaction)
 *   proposal  = written by Claude, waiting for Aras to accept, edit or drop
 *   needed    = only Aras can supply it
 *
 * `note` is a remark for Aras (in Turkish). It is shown on the draft only and
 * must not ship.
 */

export type Status = 'fact' | 'proposal' | 'needed';

/** A box beside About: a tool in use (black), a subject being learned (white), a pursuit (red). */
export type Kind = 'build' | 'learn' | 'life';

export const statusLabel: Record<Status, string> = {
  fact: 'Kaynaklı',
  proposal: 'Öneri',
  needed: 'Senden',
};

interface Marked {
  status: Status;
  note?: string;
}

export interface Project extends Marked {
  name: string;
  line: string;
  body: string;
  when: string;
  tags: string[];
  links: { label: string; href: string }[];
}

export const draft = {
  /** The idea that holds the page together. */
  hero: {
    status: 'fact' as Status,
    /** The lines under the name, in Aras's words. */
    lines: ['Builds, reads, lifts'],
    roles: ['Founder, Ostrom', 'Stellar Ambassador'],
    photo: {
      file: 'hero-golden-gate.jpg',
      alt: 'Aras Akbin, eyes closed and arms crossed, sitting by the water in front of the Golden Gate Bridge.',
      caption: 'San Francisco.',
    },
    note: 'Satırlar senden. İsim en büyük boyda, altındaki satır daha küçük; ekran daraldıkça hepsi birlikte küçülüyor. Satır sonuna nokta koymadım, senin yazdığın gibi bıraktım. “Signed, then settled.” satırı Ostrom’a özgü olduğu için kaldırıldı. Fotoğraf senden; alt yazı yalnızca “San Francisco.”',
  },

  about: {
    status: 'proposal' as Status,
    title: 'About',
    paragraphs: [
      'At 18 I walked out of Turkey’s top technical university and flew to San Francisco with $4,000. In that city, that is two months of rent and not much else.',
      'So I made coffee for a living and built a company with the hours that were left. The coffee paid for the runway. The company is Ostrom.',
      'Before any of that I spent four years fencing, three at a table tennis table and one under a barbell. Three sports with nothing in common except a score. That is where I learned to go looking for the stronger opponent.',
      'The rest I got from books: physics, philosophy, politics, sociology, history. I read across subjects on purpose, because the answer to a problem in one field is usually sitting in another.',
      'These days I work from wherever I am, travelling alone and building as I go. In 2027 I start university in the United States. I never stopped learning. I just took school out of order.',
    ],
    note: 'Bilgilerin hepsi senden; sıra, bağlantılar ve ton benim. Bilerek yapmadıklarım: “hustle” kelimesi yok, “rekabetçi” ve “disiplinler arası” demiyorum, gösteriyorum. Son cümle okulu bırakmanla 2027’yi birbirine bağlıyor. Benim eklediğim iki yorum var, yanlışsa söyle: “daha güçlü rakibi aramayı öğrendim” ve “bir alandaki sorunun cevabı çoğu zaman başka bir alanda durur”.',
  },

  /**
   * The boxes beside About: the tools from the projects on this page, what
   * Aras is learning, and the things Aras does away from them.
   * See Kind for what each color means.
   */
  stack: {
    title: 'Full stack, all the way down.',
    titleAlternatives: ['I am the full stack.', 'My stack goes deeper than code.', 'The stack, including the person.'],
    /** What each color means, shown above the boxes. The verbs run past, present, next. */
    legend: [
      { kind: 'build', color: 'Black', text: 'what I build with' },
      { kind: 'learn', color: 'White', text: 'what I’m learning' },
      { kind: 'life', color: 'Red', text: 'what built me' },
    ] as { kind: Kind; color: string; text: string }[],
    status: 'proposal' as Status,
    /** The boxes. The page groups them by color in the key's order; within a color, this order holds. */
    items: [
      { name: 'Stellar', kind: 'build' },
      { name: 'Blockchain', kind: 'build' },
      { name: 'Smart contracts', kind: 'build' },
      { name: 'DeFi', kind: 'build' },
      { name: 'Web3', kind: 'build' },
      { name: 'Python', kind: 'learn' },
      { name: 'Pandas', kind: 'learn' },
      { name: 'NumPy', kind: 'learn' },
      { name: 'scikit-learn', kind: 'learn' },
      { name: 'Machine learning', kind: 'learn' },
      { name: 'Deep learning', kind: 'learn' },
      { name: 'TensorFlow', kind: 'learn' },
      { name: 'Computer vision', kind: 'learn' },
      { name: 'NLP', kind: 'learn' },
      { name: 'LLMs', kind: 'learn' },
      { name: 'Fencing', kind: 'life' },
      { name: 'Table tennis', kind: 'life' },
      { name: 'Powerlifting', kind: 'life' },
      { name: 'Reading', kind: 'life' },
      { name: 'Cooking', kind: 'life' },
      { name: 'Tailoring', kind: 'life' },
      { name: 'Baking', kind: 'life' },
    ] as { name: string; kind: Kind }[],
    note: 'Başlık: yazılımcılar hem arayüzü hem arka ucu yapabildiklerini söylemek için kendilerine “full stack” der. “All the way down” ise “sonuna kadar, en dibe kadar” demek. Yani yığın kodla bitmiyor; aşağı indikçe öğrendiklerine (beyaz) ve en altta seni kuran şeylere (kırmızı) varıyor. Üç renk, üç zaman: kırmızı geçmiş, siyah bugün elindeki araçlar, beyaz sıradaki. Siyah: sayfadaki projelerden genel terimler. Beyaz: Europe Coding School “Veri Bilimi ve Yapay Zekâ” programının ana konuları. Kırmızı: uğraşların; kırmızı sitenin baştan beri “kişi” rengi. Renkler karanlık modda da aynı. Kutular renk açıklamasının sırasıyla gruplanmış.',
  },

  flagship: {
    /** The small label above the project name. */
    kicker: 'Now building',
    kickerStatus: 'proposal' as Status,
    kickerNote: 'Bölüm adı için önerim “Now building”: tek projen olduğunu değil, şu an üzerinde çalıştığın ana iş olduğunu söylüyor. “Highlighted project” bir portfolyo şablonu gibi duruyor. Diğer seçenekler: “Main work”, “Flagship”, “Featured project”.',

    name: 'Ostrom',

    /** One line, in Aras's words. */
    line: 'The first request-for-quote protocol built on Stellar.',

    lead: 'Zero slippage, by signature.',
    body: 'Market makers price a trade off-chain and sign every term of it; takers settle on-chain in one transaction, at exactly the signed price. Makers run their own quote servers and takers call them directly, so no operator sits in the middle. Next we connect it to routers and aggregators: a router contract has already settled a live quote as the taker on Testnet, which puts these prices one integration away from any swap screen on Stellar.',
    bodyStatus: 'proposal' as Status,
    bodyNote: 'Tek cümle senin; yalnızca başına “The” ve “request-for-quote” için tire ekledim. Paragraf benim: zero slippage, market maker ve taker, aracı olmaması, router ve aggregator bağlantısı. “First” iddiasını doğrulayamadım; Stellar’da başka bir RFQ protokolü çıkarsa bu cümle karşına gelir.',
    built: 'Two smart contracts, an SDK, a reference maker and a trading desk.',

    standing: 'Live on Testnet. Not audited yet.',

    /** Screen recording of the desk, on the right of the section. Lives in public/media/. */
    demo: {
      src: '/media/ostrom-demo.mp4',
      label: 'A 30-second screen recording of Ostrom: a quote for 620,000 XLM and the trading desk',
      caption: 'Ostrom in 30 seconds, on Testnet.',
      status: 'fact' as Status,
      note: 'Video senden: 30 saniye, 1920×1080. Sessiz ve döngüde, ekrana girince kendiliğinden başlıyor, çıkınca duruyor; böylece aşağı inmeyen ziyaretçi 12,7 MB’ı hiç indirmiyor. “Hareketi azalt” ayarı açık olanlarda başlamıyor, kontrollerle kendileri oynatabiliyor. Videoda arayüzün yanında tanıtım sayfası da göründüğü için alt yazıyı “desk” yerine “Ostrom in 30 seconds” yaptım.',
    },
    /** The funding line under the figures, with the two buttons beside it. */
    grant: { value: '$15K', label: 'SCF Instaward', by: 'Stellar Community Fund Instawards' },
    grantNote: 'Hibe kutusu ve iki buton aynı yükseklikte, tek satırda. Programın resmi adı “SCF Instawards”; kutuda tekil hali “SCF Instaward” yazıyor. $15K, programın proje başına üst sınırı. Rakam senden. GitHub butonu github.com/acakbin1881/TrustRFQ adresine gidiyor; bu adres şu an dışarıdan 404 veriyor (repo gizli görünüyor). Repoyu açana kadar buton ziyaretçide boş sayfaya çıkar.',
    links: [
      { label: 'Website', href: 'https://trustrfq.vercel.app', primary: true },
      { label: 'GitHub', href: 'https://github.com/acakbin1881/TrustRFQ', primary: false },
    ],
    note: 'Senin isteğinle çıkanlar: üç rakam kutusu ve “A settled trade” kartı. Adım adım akış ve kontrat ayrıntıları da bu bölümde yok.',
  },

  /** Second highlighted project, under Ostrom, with the same shape. */
  carp: {
    kicker: 'Built at ETH Oxford',
    name: 'CARP',
    line: 'Perpetual futures on any chain, from one wallet.',
    lineStatus: 'proposal' as Status,
    lead: 'Liquidity without the bridge run.',
    body: 'Money sitting on one chain can’t easily trade on another: moving it is slow, expensive and takes too many steps. CARP hides all of that. You open a position from a single screen, a dWallet on Sui signs for you on the other side, and Hyperliquid fills the trade. Two of us built it in one weekend in Oxford.',
    bodyStatus: 'proposal' as Status,
    built: 'With Yutaka Shibata · February 2026 · Sui, Ika dWallets, Hyperliquid.',
    links: [
      { label: 'Live demo', href: 'https://carpf.vercel.app', primary: true },
      { label: 'GitHub', href: 'https://github.com/acakbin1881/nexus', primary: false },
    ],
    photo: {
      file: 'carp-ethoxford.jpg',
      alt: 'Aras Akbin and his teammate Yutaka Shibata on either side of the ETH Oxford sponsor banner.',
      caption: 'With Yutaka Shibata at ETH Oxford.',
      href: 'https://www.linkedin.com/posts/aras-akbin-36b9842a7_ethoxford-hackathon-web3-activity-7426970748906442752-9nQ2',
    },
    note: 'Fotoğraf ve olgular LinkedIn gönderinden (10 Şubat 2026) ve CARP reposundan: iki kişilik takım, ETH Oxford, zincirler arası likidite parçalanması, Sui üzerinde dWallet, Hyperliquid’de işlem. Tek cümle ve paragraf benim. Derece yok (senden); bölüm derece iddiası taşımıyor. Repo adı “nexus”, GitHub butonu oraya gidiyor; canlı demo linki çalışıyor. Video linki senin isteğinle kaldırıldı.',
  },

  projects: {
    title: 'Also built',
    items: [
      {
        name: 'TR Mock Anchor',
        line: 'A Turkish lira on/off-ramp to integrate against, before a real one exists.',
        body: 'A mock TRY to USDC ramp on Stellar Testnet that speaks the standard SEP path (SEP-1, 10, 6, 12 and 38). The bank, KYC and payout legs are simulated; the Stellar side is real.',
        when: 'Aug to Sep 2026',
        tags: ['Stellar', 'SEP', 'Anchors'],
        links: [
          { label: 'Source', href: 'https://github.com/acakbin1881/trustrfq-anchor' },
        ],
        status: 'fact',
        note: 'GitHub’da fork olarak görünüyor. Buradaki rolünü bir cümleyle yazar mısın?',
      },
    ] as Project[],
  },

  record: {
    /** Shown first under Education: what comes next. */
    next: { when: '2027', who: 'University in the United States', what: 'Studying for the SAT now' },
    /** Under the 2027 row: the course Aras is taking now. */
    bootcamp: { when: 'Now', who: 'Europe Coding School', what: 'Data Science & Artificial Intelligence (15 weeks)', href: 'https://europecodingschool.com/egitimler/veri-bilimi-yapay-zeka-egitimi/' },
    nextStatus: 'proposal' as Status,
    note: 'profile.ts’ten geliyor. Ostrom başlangıcı boş; ilk commit 10 Haziran 2026 olduğu için “Jun 2026” öneriyorum. De Anza satırı senin isteğinle hem taslaktan hem canlı siteden (profile.ts) çıktı. Bootcamp’i de “Now” olarak ikinci satıra ekledim; başlangıç ayını yazarsan “Sep 2026 to Now” gibi gösteririz. En üstte 2027 satırı var: SAT’e hazırlandığını ve 2027’de ABD’de üniversiteye başlayacağını söylüyor, About’taki 2027 cümlesiyle de örtüşüyor.',
  },
};
