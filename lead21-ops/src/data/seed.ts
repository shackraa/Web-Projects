/** Örnek / kaynak verisi — üretimde Erşen paneliyle güncellenir. */

export const FELLOWS_10 = [
  "Atakan Turpçu",
  "Batuhan Yüzer",
  "Bora Büyüksivri",
  "Çağan Çalışkan",
  "Dilek İkra Günsoy",
  "Ece Erenler",
  "Fulya Karakuş",
  "Gökçe Sinanoğlu",
  "Göktürk Önal",
  "İsmail Emre Acar",
  "Kaan Fırat",
  "Mehmet Buğra Alageyik",
  "Melih Macit",
  "Meryem Balcı",
  "Nurşah Şirin",
  "Semih Narin",
  "Seyid Baran Bakumdi",
  "Sıla Yılmaz",
  "Sude Ekici",
  "Yağız Kaan Çankaya",
  "Zeynep Rodoplu",
] as const;

/** Ana Puanlandırma sheet idealleri (xlsx). Alt sheet tutarsızlıkları docs'ta. */
export const SCORE_IDEALS: { code: string; label: string; ideal: number }[] = [
  { code: "base", label: "Base", ideal: 82 },
  { code: "sm_profil", label: "SM Profil #LEAD21", ideal: 15 },
  { code: "kurucu_acilis", label: "Kurucular — açılış", ideal: 6 },
  { code: "kocluk", label: "Koçluk", ideal: 16 },
  { code: "mentorluk", label: "Mentörlük", ideal: 117 },
  { code: "slj", label: "SLJ", ideal: 110 },
  { code: "finansal", label: "Finansal okuryazarlık", ideal: 48 },
  { code: "ai", label: "AI", ideal: 25 },
  { code: "sektorel", label: "Sektörel derinleşme", ideal: 74 },
  { code: "kariyer", label: "Kariyer hızlandırıcı", ideal: 54 },
  { code: "summit1", label: "Summit 1", ideal: 72 },
  { code: "summit2", label: "Summit 2", ideal: 81 },
  { code: "summit3", label: "Summit 3", ideal: 72 },
  { code: "gelistirme", label: "Geliştirme görüşmeleri", ideal: 12 },
  { code: "kurucu_kapanis", label: "Kurucular — kapanış", ideal: 6 },
  { code: "ekip_ici", label: "Ekip içi iletişim", ideal: 80 },
  { code: "lead_talks", label: "LEAD Talks", ideal: 30 },
  { code: "duyuru", label: "11. dönem duyuru", ideal: 25 },
];

export const TOTAL_IDEAL = SCORE_IDEALS.reduce((s, c) => s + c.ideal, 0);

export const MONTHLY_FLOW: { month: string; items: string[] }[] = [
  { month: "Ocak", items: ["BASE", "Mentörlük (ertesi yıl)", "Mezuniyet"] },
  { month: "Şubat", items: ["Kariyer hızlandırıcı", "SLJ", "LEAD Talks", "LEAD UP"] },
  { month: "Mart", items: ["SLJ", "Koçluk", "LEAD Talks", "Ekip içi"] },
  { month: "Nisan", items: ["SLJ", "Koçluk", "Mentörlük", "LEAD Talks", "Summit 1"] },
  { month: "Mayıs", items: ["SLJ", "Koçluk", "Mentörlük", "LEAD Talks"] },
  { month: "Haziran", items: ["Koçluk", "Duyuru desteği", "Mentörlük", "LM ilham"] },
  { month: "Temmuz", items: ["Duyuru", "YZ modülü", "Finansal ok.", "Mentörlük"] },
  { month: "Ağustos", items: ["Mentörlük (hafif)", "Finansal ok.", "YZ"] },
  { month: "Eylül", items: ["Sektörel derinleşme", "Mentör temas hızlanır", "Mülakat", "LEAD Talks"] },
  { month: "Ekim", items: ["Summit 2", "Demo day", "Mülakat", "Sektörel"] },
  { month: "Kasım", items: ["Final seçme", "LEAD Talks", "Mentörlük"] },
  { month: "Aralık", items: ["Summit 3", "Geliştirme görüşmeleri", "Mezuniyet yemeği", "Base hazırlık"] },
];

export type OpsTask = {
  id: string;
  title: string;
  due: string;
  status: "open" | "done";
  kind: string;
  note?: string;
};

export const DEFAULT_TASKS: OpsTask[] = [
  {
    id: "t1",
    title: "Özyeğin / Dilek — Base konaklama yoklaması",
    due: "2026-12-01",
    status: "open",
    kind: "base",
    note: "Eylül–Ekim hafif temas; Aralık başı yoğun. Varsayım hatırlatma.",
  },
  {
    id: "t2",
    title: "Ekim mentör görüşmeleri için Eylül temasını başlat",
    due: "2026-09-05",
    status: "open",
    kind: "mentor",
  },
  {
    id: "t3",
    title: "11. dönem kabul mailleri / online tanıştırma",
    due: "2026-11-15",
    status: "done",
    kind: "secme",
  },
  {
    id: "t4",
    title: "Sektörel derinleşme rapor deadline",
    due: "2026-11-30",
    status: "open",
    kind: "modul",
    note: "Bu dönem Kasım sonuna ertelendi (anlatım).",
  },
  {
    id: "t5",
    title: "Aralık bütçe planlaması",
    due: "2026-12-05",
    status: "open",
    kind: "ops",
  },
  {
    id: "t6",
    title: "QNB mekan — Summit 3 / kapanış",
    due: "2026-12-01",
    status: "open",
    kind: "summit",
  },
  {
    id: "t7",
    title: "%80 altı fellow’lara müdahale turu",
    due: "2026-11-20",
    status: "open",
    kind: "puan",
  },
];

export const SHIP_ROLES = [
  "Biyolojist",
  "Başbakan",
  "Fatih Terim",
  "Çocuklu anne",
  "İnsan hakları hukukçusu",
  "Dini lider",
  "Felsefe öğrencisi",
  "İşsiz mühendis",
  "Araştırmacı gazeteci",
  "Emekli albay",
];

export const MARS_ITEMS = [
  { id: "A", name: "Portatif oksijen rezervi", desc: "Ek oksijen; kıyafet süresini uzatır" },
  { id: "B", name: "Yüksek kalorili gıda paketi", desc: "7 kişiye bir öğün" },
  { id: "C", name: "Navigasyon tableti", desc: "Üsse güvenli rota" },
  { id: "D", name: "Bilimsel numune kutusu", desc: "Araştırma örnekleri" },
  { id: "E", name: "Yedek enerji ünitesi", desc: "Kıyafet sistemlerine ek enerji" },
  { id: "F", name: "Acil durum iletişim cihazı", desc: "Ana üsse kısa mesafe sinyal" },
  { id: "G", name: "Isı yalıtımlı acil örtüler", desc: "Beklemede ek yalıtım" },
  { id: "H", name: "Su rezervi", desc: "7 kişi kısa süreli su" },
  { id: "I", name: "Kıyafet onarım seti", desc: "Küçük sızdırmazlık onarımı" },
  { id: "J", name: "Kompakt ilk yardım kiti", desc: "Küçük yaralanmalar" },
];

export const MUSEUM_CASES = ["Theranos", "WeWork", "Quibi", "Juicero", "FTX", "Fyre Festival"];

export const QUOTE_CARDS: { n: number; text: string; source: string }[] = [
  { n: 1, text: "Şüphe etmeyen bakmaz; bakmayan görmez; görmeyen körlükte kalır.", source: "Gazali · Mîzânü’l-amel" },
  { n: 2, text: "Bilgi her gün bir şey ekler; bilgelik her gün bir şey eksiltir.", source: "Lao Tzu · Tao Te Ching 48" },
  { n: 3, text: "Bilen konuşmaz; konuşan bilmez.", source: "Lao Tzu · Tao Te Ching 56" },
  { n: 4, text: "Gereksiz yasalar, gerekli yasaları zayıflatır.", source: "Montesquieu · Kanunların Ruhu XXIX.16" },
  { n: 5, text: "Yeni çareleri uygulamayan, yeni kötülükleri beklemelidir; çünkü zaman en büyük yenilikçidir.", source: "Francis Bacon · Denemeler" },
  { n: 6, text: "Herkesin nefret ettiğini de, herkesin sevdiğini de kendin sına.", source: "Konfüçyüs · Konuşmalar 15.28" },
  { n: 7, text: "Yalnızca eylemin üzerinde hakkın var, sonuçları üzerinde asla.", source: "Bhagavad Gita 2.47" },
  { n: 8, text: "En büyük zafer, hiç savaşmadan kazanılandır.", source: "Sun Tzu · Savaş Sanatı 3" },
  { n: 9, text: "Delilik bireylerde nadirdir; gruplarda, partilerde, uluslarda ve çağlarda ise kuraldır.", source: "Nietzsche · İyinin ve Kötünün Ötesinde 156" },
  { n: 10, text: "Sorgulanmamış bir hayat yaşanmaya değmez.", source: "Sokrates · Platon’un Savunma’sı" },
  { n: 11, text: "Bir şeyi iyi olduğu için istemeyiz; istediğimiz için iyi buluruz.", source: "Spinoza · Etika III" },
  { n: 12, text: "Her yerde olan, hiçbir yerde değildir.", source: "Seneca · Lucilius’a Mektuplar 2" },
  { n: 13, text: "Bizi üzen olaylar değil, olaylar hakkındaki yargılarımızdır.", source: "Epiktetos · Enkheiridion 5" },
  { n: 14, text: "Yolda duran engel, yolun kendisi olur.", source: "Marcus Aurelius · Kendime Düşünceler 5.20" },
  { n: 15, text: "İkisi birden olamıyorsa, sevilmektense korkulmak daha güvenlidir.", source: "Machiavelli · Hükümdar 17" },
  { n: 16, text: "Yenilen, her zaman yeneni taklit etmeye heveslidir.", source: "İbn Haldun · Mukaddime" },
  { n: 17, text: "En iyi, iyinin düşmanıdır.", source: "Voltaire · La Bégueule" },
  { n: 18, text: "Bir insana maske verin, size gerçeği söylesin.", source: "Oscar Wilde · Eleştirmen Olarak Sanatçı" },
  { n: 19, text: "Kendi aklını kullanmamak öyle rahattır ki.", source: "Kant · Aydınlanma Nedir?" },
  { n: 20, text: "Yönetmeyi reddeden iyi insanların cezası, kendilerinden daha kötülerin yönetimine katlanmaktır.", source: "Platon · Devlet I, 347c" },
  { n: 21, text: "Eşitlik adildir, ama yalnızca eşitler arasında.", source: "Aristoteles · Politika III" },
  { n: 22, text: "Hayat geriye doğru anlaşılır, ama ileriye doğru yaşanmak zorundadır.", source: "Kierkegaard · Günlükler, 1843" },
  { n: 23, text: "Bir çocuğu mutsuz etmenin en kesin yolu, ona her istediğini vermektir.", source: "Rousseau · Emile II" },
  { n: 24, text: "Bir davada yalnızca kendi tarafını bilen, onu çok az bilir.", source: "John Stuart Mill · Özgürlük Üstüne" },
  { n: 25, text: "Herkes kendi görüş alanının sınırlarını, dünyanın sınırları sanır.", source: "Schopenhauer · Parerga II" },
  { n: 26, text: "Körler ülkesinde tek gözlü kraldır.", source: "Erasmus · Adagia" },
  { n: 27, text: "Nefret nefretle dinmez; yalnızca nefretsizlikle diner.", source: "Buda · Dhammapada 5" },
  { n: 28, text: "Bir şeyi eksik bırakmak onu ilginç kılar ve büyümeye yer açar.", source: "Kenkō · Tsurezuregusa 82" },
];

export type JuryGame = {
  id: string;
  date: string;
  title: string;
  criteria: { key: string; label: string; weight?: number }[];
  formula: "sum" | "weighted" | "halfhalf" | "avg";
  sampleCandidates: string[];
};

export const JURY_GAMES: JuryGame[] = [
  {
    id: "07-1",
    date: "07 Kasım",
    title: "Batmakta Olan Gemi",
    formula: "sum",
    criteria: [
      { key: "alan", label: "Fikirlere alan açar" },
      { key: "ifade", label: "Fikrini açık ifade eder" },
      { key: "yapici", label: "Fikir ayrılığında yapıcı" },
    ],
    sampleCandidates: [
      "Arda Yağcı",
      "Arzu Nur Gün",
      "Cenker Arın",
      "Esma Nur Tiftik",
      "Sude Naz Sarımeşe",
      "Şevval Hayat Yaylakcıoğlu",
      "Yaren Ünlü",
    ],
  },
  {
    id: "07-2",
    date: "07 Kasım",
    title: "Mars Survival",
    formula: "sum",
    criteria: [
      { key: "ozgun", label: "Özgün / analitik" },
      { key: "gerekce", label: "Gerekçeli iletişim" },
      { key: "yarar", label: "Fikirlerden yararlanır" },
      { key: "yapici", label: "Fikir ayrılığında yapıcı" },
    ],
    sampleCandidates: [
      "Ali Orhun Demirelli",
      "Arhan Özgür",
      "Arzu Nur Gün",
      "Asmin Şana Acar",
      "Ayşe Nehir Özmetin",
      "Canse Coșar",
      "Elif Duru Sığan",
    ],
  },
  {
    id: "07-3",
    date: "07 Kasım",
    title: "İlk Bakışta Yanlış",
    formula: "weighted",
    criteria: [
      { key: "ozgun", label: "Özgün düşünce", weight: 0.35 },
      { key: "muhakeme", label: "Muhakeme", weight: 0.3 },
      { key: "farkli", label: "Farklı bakış", weight: 0.25 },
      { key: "anlatim", label: "Açık anlatım", weight: 0.1 },
    ],
    sampleCandidates: [
      "Canse Coșar",
      "Emir Alp Aktar",
      "İrem Sena Arslan",
      "Melis Gürkale",
      "Ömer Cem Batırel",
      "Sude Naz Sarımeşe",
      "Hasan Doğru",
    ],
  },
  {
    id: "08-1",
    date: "08 Kasım",
    title: "2035: Görünmez İhtiyaç",
    formula: "halfhalf",
    criteria: [
      { key: "t1", label: "1. tur özgün fikir" },
      { key: "t2", label: "2. tur katkı" },
      { key: "t3", label: "3. tur senaryo" },
      { key: "tercih", label: "Gerekçeli tercih" },
      { key: "dinle", label: "Fikirleri dikkate alır" },
      { key: "yapici", label: "Yapıcı kalır" },
    ],
    sampleCandidates: [
      "Ali Orhun Demirelli",
      "Ardıl Deniz Sustam",
      "Büşra Berrin Konurhan",
      "Damla Su Bilge",
      "Enes Güngör",
      "Esma Nur Tiftik",
      "İrem Sena Arslan",
    ],
  },
  {
    id: "08-3",
    date: "08 Kasım",
    title: "Milyar Dolarlık Başarısızlıklar Müzesi",
    formula: "avg",
    criteria: [
      { key: "gerekce", label: "Gerekçelendirme" },
      { key: "kanit", label: "Kanıtı kullanma" },
      { key: "neden", label: "Nedenleri sorgulama" },
      { key: "ozgun", label: "Özgün katkı" },
      { key: "isbirligi", label: "Yapıcı iş birliği" },
    ],
    sampleCandidates: [
      "Canse Coșar",
      "Damla Su Bilge",
      "Esma Nur Tiftik",
      "İpek Ateş",
      "Nisanur İçer",
      "Sudem Türkoğlu",
      "Zeynep Yazıcı",
    ],
  },
];
