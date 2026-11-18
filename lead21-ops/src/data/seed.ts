/** 10. dönem kaynak verisi — xlsx + Notion + Erşen anlatımı */

export const PERIOD = {
  name: "10. Dönem",
  year: 2026,
  barrierPct: 0.8,
};

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

export type ScoreCategory = {
  code: string;
  label: string;
  ideal: number;
  items?: { code: string; label: string; ideal: number }[];
};

/** Ana Puanlandırma sheet — resmi kart */
export const SCORE_CATEGORIES: ScoreCategory[] = [
  {
    code: "base",
    label: "Base",
    ideal: 82,
    items: [
      { code: "g1", label: "1. Gün (sinerji)", ideal: 20 },
      { code: "g2", label: "2. Gün (iletişim)", ideal: 20 },
      { code: "g3", label: "3. Gün (yönetim)", ideal: 20 },
      { code: "g4", label: "4. Gün (dönüşüm)", ideal: 15 },
      { code: "li", label: "LinkedIn post — 5 gün", ideal: 7 },
    ],
  },
  { code: "sm_profil", label: "SM Profil #LEAD21", ideal: 15 },
  { code: "kurucu_acilis", label: "Kurucular — açılış", ideal: 6 },
  { code: "kocluk", label: "Koçluk", ideal: 16 },
  {
    code: "mentorluk",
    label: "Mentörlük",
    ideal: 117,
    items: [
      { code: "lm1", label: "LM1", ideal: 15 },
      { code: "lm2", label: "LM2", ideal: 15 },
      { code: "lm3", label: "LM3", ideal: 15 },
      { code: "udy1", label: "UDY1", ideal: 12 },
      { code: "udy2", label: "UDY2", ideal: 12 },
      { code: "udy3", label: "UDY3", ideal: 12 },
      { code: "sm1", label: "SM1", ideal: 12 },
      { code: "sm2", label: "SM2", ideal: 12 },
      { code: "sm3", label: "SM3", ideal: 12 },
    ],
  },
  {
    code: "slj",
    label: "SLJ",
    ideal: 110,
    items: [
      { code: "hazirlik", label: "Hazırlık", ideal: 15 },
      { code: "sm", label: "Sosyal medya", ideal: 5 },
      { code: "kesif", label: "Keşif", ideal: 20 },
      { code: "cozum", label: "Çözüm", ideal: 15 },
      { code: "s1", label: "Sprint 1", ideal: 5 },
      { code: "s2", label: "Sprint 2", ideal: 5 },
      { code: "s3", label: "Sprint 3", ideal: 5 },
      { code: "s4", label: "Sprint 4", ideal: 5 },
      { code: "s5", label: "Sprint 5", ideal: 5 },
      { code: "final", label: "Final raporu", ideal: 10 },
      { code: "done", label: "Tamamlandı", ideal: 20 },
    ],
  },
  { code: "finansal", label: "Finansal okuryazarlık", ideal: 48 },
  {
    code: "ai",
    label: "AI",
    ideal: 25,
    items: [
      { code: "a1", label: "LLM / halüsinasyon", ideal: 5 },
      { code: "a2", label: "Prompt engineering", ideal: 5 },
      { code: "a3", label: "System prompts / GPT", ideal: 5 },
      { code: "a4", label: "API ilk bakış", ideal: 5 },
      { code: "a5", label: "API / MCP", ideal: 5 },
    ],
  },
  {
    code: "sektorel",
    label: "Sektörel derinleşme",
    ideal: 74,
    items: [
      { code: "adim1", label: "Adım 1", ideal: 7 },
      { code: "adim2", label: "Adım 2", ideal: 10 },
      { code: "liste", label: "Kişi listesi bonus", ideal: 2 },
      { code: "rapor", label: "Final raporu", ideal: 30 },
      { code: "gorusme", label: "3 görüşme", ideal: 10 },
      { code: "done", label: "Tamamlandı", ideal: 15 },
    ],
  },
  { code: "kariyer", label: "Kariyer hızlandırıcı", ideal: 54 },
  { code: "summit1", label: "Summit 1", ideal: 72 },
  { code: "summit2", label: "Summit 2", ideal: 81 },
  { code: "summit3", label: "Summit 3", ideal: 72 },
  { code: "gelistirme", label: "Geliştirme görüşmeleri", ideal: 12 },
  { code: "kurucu_kapanis", label: "Kurucular — kapanış", ideal: 6 },
  { code: "ekip_ici", label: "Ekip içi iletişim", ideal: 80 },
  { code: "lead_talks", label: "LEAD Talks", ideal: 30 },
  {
    code: "duyuru",
    label: "11. dönem duyuru",
    ideal: 25,
    items: [
      { code: "haz_ig", label: "Haziran Insta", ideal: 5 },
      { code: "tem_ig", label: "Temmuz Insta", ideal: 5 },
      { code: "haz_wp", label: "Haziran WP", ideal: 5 },
      { code: "tem_wp", label: "Temmuz WP", ideal: 5 },
      { code: "li", label: "LinkedIn", ideal: 5 },
    ],
  },
];

export const TOTAL_IDEAL = SCORE_CATEGORIES.reduce((s, c) => s + c.ideal, 0);

export const MONTHLY_FLOW: { month: string; monthKey: number; items: string[] }[] = [
  { month: "Ocak", monthKey: 1, items: ["BASE"] },
  { month: "Şubat", monthKey: 2, items: ["Kariyer hızlandırıcı", "SLJ", "LEAD Talks", "LEAD UP"] },
  { month: "Mart", monthKey: 3, items: ["SLJ", "Koçluk", "LEAD Talks", "Ekip içi"] },
  { month: "Nisan", monthKey: 4, items: ["SLJ", "Koçluk", "Mentörlük", "LEAD Talks", "Summit 1", "Ekip içi"] },
  { month: "Mayıs", monthKey: 5, items: ["SLJ", "Koçluk", "Mentörlük", "LEAD Talks", "Ekip içi"] },
  { month: "Haziran", monthKey: 6, items: ["Koçluk", "Duyuru desteği", "Mentörlük", "LEAD Talks", "LM ilham", "Ekip içi"] },
  { month: "Temmuz", monthKey: 7, items: ["Duyuru", "YZ / AI", "Finansal ok.", "Mentörlük", "Ekip içi", "LM ilham"] },
  { month: "Ağustos", monthKey: 8, items: ["Mentörlük (hafif)", "Finansal ok.", "AI", "Ekip içi"] },
  { month: "Eylül", monthKey: 9, items: ["Sektörel derinleşme", "Mentör temas", "LEAD Talks", "Ekip içi", "Finansal ok."] },
  { month: "Ekim", monthKey: 10, items: ["Summit 2", "Sosyal etki demo day", "Sektörel", "LEAD Talks", "Mentörlük"] },
  { month: "Kasım", monthKey: 11, items: ["Mentörlük", "LEAD Talks", "Ekip içi", "Sektörel rapor deadline"] },
  { month: "Aralık", monthKey: 12, items: ["Summit 3", "Geliştirme görüşmeleri", "Mezuniyet yemeği", "LEAD Talks", "Base hazırlık"] },
];

export type SpecialDate = {
  id: string;
  date: string;
  title: string;
  kind: string;
};

export const SPECIAL_DATES: SpecialDate[] = [
  { id: "d1", date: "2026-02-01", title: "HBS CV + LEAD Talks + kısa özgeçmiş", kind: "kariyer" },
  { id: "d2", date: "2026-02-08", title: "YZ ile HBS CV değerlendirme", kind: "kariyer" },
  { id: "d3", date: "2026-02-09", title: "Kurucular LEAD UP (19:30)", kind: "kurucu" },
  { id: "d4", date: "2026-02-10", title: "Etkili LinkedIn — Aysu Bilgin (19:00)", kind: "kariyer" },
  { id: "d5", date: "2026-02-12", title: "Dominos CHRO — işe alım perspektifi", kind: "kariyer" },
  { id: "d6", date: "2026-02-11", title: "SLJ hazırlık aşaması bitiş", kind: "slj" },
  { id: "d7", date: "2026-02-25", title: "SLJ keşif aşaması bitiş", kind: "slj" },
  { id: "d8", date: "2026-03-04", title: "SLJ checkpoint — son karar raporu", kind: "slj" },
  { id: "d9", date: "2026-03-15", title: "LEAD Talks 20:00–22:00", kind: "talks" },
  { id: "d10", date: "2026-04-15", title: "Summit 1 (Nisan — xlsx)", kind: "summit" },
  { id: "d11", date: "2026-07-19", title: "11. dönem başvuru kapanış + duyuru turu", kind: "duyuru" },
  { id: "d12", date: "2026-10-02", title: "Summit 2 / Güz (xlsx Ekim)", kind: "summit" },
  { id: "d13", date: "2026-10-15", title: "Sosyal etki demo day", kind: "slj" },
  { id: "d14", date: "2026-11-30", title: "Sektörel derinleşme rapor deadline", kind: "sektorel" },
  { id: "d15", date: "2026-12-01", title: "Base / Dilek yoğun temas + bütçe", kind: "base" },
  { id: "d16", date: "2026-12-18", title: "Summit 3 / Kış + mezuniyet yemeği penceresi", kind: "summit" },
];

export type TaskStatus = "yapilmadi" | "gecikti" | "yapildi";

export type OpsTask = {
  id: string;
  title: string;
  due: string;
  status: TaskStatus;
  kind: string;
  fellowId?: string;
  evidence?: string;
  note?: string;
  pointsCode?: string;
  pointsIdeal?: number;
};

/** Demo görevler — geciken + yaklaşan karışık */
export const DEFAULT_TASKS: OpsTask[] = [
  {
    id: "t1",
    title: "Özyeğin / Dilek — Base konaklama yoklaması",
    due: "2026-12-01",
    status: "yapilmadi",
    kind: "base",
    note: "Eylül–Ekim hafif; Aralık başı yoğun.",
  },
  {
    id: "t2",
    title: "Ekim mentör görüşmeleri için Eylül teması",
    due: "2026-09-05",
    status: "gecikti",
    kind: "mentor",
  },
  {
    id: "t3",
    title: "Sektörel derinleşme — final rapor",
    due: "2026-11-30",
    status: "yapilmadi",
    kind: "sektorel",
    pointsCode: "sektorel",
    pointsIdeal: 30,
    note: "Deadline Kasım sonu.",
  },
  {
    id: "t4",
    title: "SLJ checkpoint — son karar raporu",
    due: "2026-03-04",
    status: "yapildi",
    kind: "slj",
  },
  {
    id: "t5",
    title: "Aralık bütçe planlaması",
    due: "2026-12-05",
    status: "yapilmadi",
    kind: "ops",
  },
  {
    id: "t6",
    title: "QNB — Summit 3 / kapanış mekan",
    due: "2026-12-01",
    status: "yapilmadi",
    kind: "summit",
  },
  {
    id: "t7",
    title: "%80 altı fellow müdahale turu",
    due: "2026-11-20",
    status: "gecikti",
    kind: "puan",
  },
  {
    id: "t8",
    title: "LEAD Talks konuşmacı daveti (Kasım)",
    due: "2026-11-10",
    status: "gecikti",
    kind: "talks",
  },
  {
    id: "t9",
    title: "Mentör takip SharePoint güncelle",
    due: "2026-11-15",
    status: "yapilmadi",
    kind: "mentor",
  },
  {
    id: "t10",
    title: "Geliştirme görüşmeleri slotları",
    due: "2026-12-10",
    status: "yapilmadi",
    kind: "gelistirme",
  },
];

/** Deterministik demo puan — çoğu %80 üstü, 3 fellow baraj altı */
export function seedScores(): Record<string, Record<string, number>> {
  const out: Record<string, Record<string, number>> = {};
  FELLOWS_10.forEach((name, i) => {
    const row: Record<string, number> = {};
    // Full-year completion mix so baraj anlamlı: ~0.86–0.98
    const factor = 0.88 + ((i * 7) % 11) / 100;
    for (const cat of SCORE_CATEGORIES) {
      const wobble = 0.92 + ((i * 3 + cat.ideal) % 10) / 100;
      const raw = Math.round(cat.ideal * factor * wobble);
      row[cat.code] = Math.min(cat.ideal, Math.max(0, raw));
    }
    // 3 fellow baraj altına düşür (demo)
    if (i === 2 || i === 6 || i === 14) {
      row.slj = Math.round((row.slj ?? 0) * 0.35);
      row.mentorluk = Math.round((row.mentorluk ?? 0) * 0.4);
      row.ekip_ici = Math.round((row.ekip_ici ?? 0) * 0.25);
      row.sektorel = Math.round((row.sektorel ?? 0) * 0.3);
      row.summit2 = Math.round((row.summit2 ?? 0) * 0.2);
    }
    out[name] = row;
  });
  return out;
}

export type BonusEntry = {
  id: string;
  fellow: string;
  points: number;
  reason: string;
  at: string;
};

export const DEFAULT_BONUSES: BonusEntry[] = [
  {
    id: "b1",
    fellow: "Atakan Turpçu",
    points: 5,
    reason: "SLJ demo day ekstra katkı",
    at: "2026-10-16",
  },
  {
    id: "b2",
    fellow: "Zeynep Rodoplu",
    points: 3,
    reason: "LEAD Talks konuşmacı önerisi",
    at: "2026-09-20",
  },
];

export type FellowMeta = {
  name: string;
  status: "aktif" | "uyari" | "mezuniyet";
  notes: string;
  email?: string;
  phone?: string;
};

export function seedFellowMeta(): FellowMeta[] {
  return FELLOWS_10.map((name, i) => ({
    name,
    status: i === 2 || i === 6 || i === 14 ? "uyari" : "aktif",
    notes: "",
    email: `${name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ı/g, "i")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/\s+/g, ".")}@ornek.lead21`,
  }));
}
