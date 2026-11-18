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
  /** Kaç kez uyarı / müdahale yapıldı (doz) */
  warnCount?: number;
};

export function seedFellowMeta(): FellowMeta[] {
  return FELLOWS_10.map((name, i) => ({
    name,
    status: i === 2 || i === 6 || i === 14 ? "uyari" : "aktif",
    notes: "",
    warnCount: i === 2 || i === 6 || i === 14 ? 1 : 0,
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

export type MentorKind = "LM" | "UDY" | "SM" | "Global";

export type MentorStatus = "eslesti" | "planlandi" | "yapildi" | "sorun" | "bekliyor";

export type MentorMatch = {
  id: string;
  fellow: string;
  kind: MentorKind;
  mentorName: string;
  targetAt: string;
  doneAt?: string;
  status: MentorStatus;
  note?: string;
  /** Erşen: doğrudan CEO maili vs iletişimci loop */
  pipeline: "dogrudan" | "iletisimci";
};

const MENTOR_NAMES: Record<MentorKind, string[]> = {
  LM: ["Ayşe Yılmaz", "Can Demir", "Elif Kaya", "Murat Öz"],
  UDY: ["Selim Arı", "Deniz Kurt", "Hande Acar", "Kerem Uslu"],
  SM: ["Startup Mentor A", "Startup Mentor B", "Startup Mentor C", "Startup Mentor D"],
  Global: ["Alex Chen", "Maria Lopez", "Omar Hassan", "Priya Shah"],
};

/** Fellow × LM/UDY/SM (+ Global örnek); sorunlu fellow’larda 2. görüşme aksar */
export function seedMentors(): MentorMatch[] {
  const out: MentorMatch[] = [];
  let n = 0;
  for (const fellow of FELLOWS_10) {
    const fi = FELLOWS_10.indexOf(fellow);
    const troubled = fi === 2 || fi === 6 || fi === 14;
    const kinds: MentorKind[] = ["LM", "UDY", "SM"];
    if (fi % 3 === 0) kinds.push("Global");
    for (const kind of kinds) {
      n += 1;
      const namePool = MENTOR_NAMES[kind];
      const mentorName = namePool[fi % namePool.length];
      const round1Done = true;
      const round2Target = kind === "Global" ? "2026-10-15" : "2026-10-31";
      // 1. görüşme (Nisan)
      out.push({
        id: `ment-${n}-1`,
        fellow,
        kind,
        mentorName,
        targetAt: "2026-04-30",
        doneAt: "2026-04-20",
        status: "yapildi",
        pipeline: kind === "Global" || fi % 2 === 0 ? "dogrudan" : "iletisimci",
        note: round1Done ? "1. görüşme tamam" : undefined,
      });
      n += 1;
      // 2. görüşme (Ekim)
      let status: MentorStatus = troubled && (kind === "SM" || kind === "UDY") ? "sorun" : "planlandi";
      if (!troubled && fi % 5 === 0) status = "yapildi";
      out.push({
        id: `ment-${n}-2`,
        fellow,
        kind,
        mentorName,
        targetAt: round2Target,
        doneAt: status === "yapildi" ? "2026-10-18" : undefined,
        status,
        pipeline: kind === "Global" || fi % 2 === 0 ? "dogrudan" : "iletisimci",
        note:
          status === "sorun"
            ? "2. görüşme ayarlanmadı — Eylül teması kaçtı"
            : status === "planlandi"
              ? "Takvim bekleniyor"
              : undefined,
      });
    }
  }
  return out;
}

/** Bu ay şeridi — ay → kritik modül kodları */
export const MONTH_MODULES: Record<number, string[]> = {
  1: ["base"],
  2: ["kariyer", "slj", "lead_talks", "kurucu_acilis"],
  3: ["slj", "kocluk", "lead_talks", "ekip_ici"],
  4: ["slj", "kocluk", "mentorluk", "lead_talks", "summit1", "ekip_ici"],
  5: ["slj", "kocluk", "mentorluk", "lead_talks", "ekip_ici"],
  6: ["kocluk", "duyuru", "mentorluk", "lead_talks", "ekip_ici"],
  7: ["duyuru", "ai", "finansal", "mentorluk", "ekip_ici"],
  8: ["mentorluk", "finansal", "ai", "ekip_ici"],
  9: ["sektorel", "mentorluk", "lead_talks", "ekip_ici", "finansal"],
  10: ["summit2", "slj", "sektorel", "lead_talks", "mentorluk"],
  11: ["mentorluk", "lead_talks", "ekip_ici", "sektorel"],
  12: ["summit3", "gelistirme", "kurucu_kapanis", "lead_talks", "base"],
};

/** Heatmap kolonları */
export const HEATMAP_MODULES = [
  "mentorluk",
  "slj",
  "sektorel",
  "ekip_ici",
  "lead_talks",
  "summit2",
  "kariyer",
  "kocluk",
] as const;

/** Yıllık plan — fellow teslim / katılım kalemleri */
export type PlanItem = {
  id: string;
  title: string;
  due: string;
  month: number;
  kind: string;
  pointsCode?: string;
};

export const PLAN_ITEMS: PlanItem[] = [
  { id: "p-base", title: "Base katılım (4 gün)", due: "2026-01-15", month: 1, kind: "base", pointsCode: "base" },
  { id: "p-hbs", title: "HBS CV teslimi", due: "2026-02-01", month: 2, kind: "kariyer", pointsCode: "kariyer" },
  { id: "p-li", title: "LinkedIn eğitimi katılımı", due: "2026-02-10", month: 2, kind: "kariyer", pointsCode: "kariyer" },
  { id: "p-slj-haz", title: "SLJ hazırlık teslimi", due: "2026-02-11", month: 2, kind: "slj", pointsCode: "slj" },
  { id: "p-slj-kes", title: "SLJ keşif teslimi", due: "2026-02-25", month: 2, kind: "slj", pointsCode: "slj" },
  { id: "p-slj-cp", title: "SLJ checkpoint — son karar raporu", due: "2026-03-04", month: 3, kind: "slj", pointsCode: "slj" },
  { id: "p-talks-mar", title: "LEAD Talks (Mart) katılım", due: "2026-03-15", month: 3, kind: "talks", pointsCode: "lead_talks" },
  { id: "p-ekip-mar", title: "Ekip içi görüşme (Mart)", due: "2026-03-31", month: 3, kind: "ekip", pointsCode: "ekip_ici" },
  { id: "p-koc-1", title: "Koçluk seans 1", due: "2026-03-31", month: 3, kind: "kocluk", pointsCode: "kocluk" },
  { id: "p-mentor-1", title: "Mentörlük 1. görüşme (LM/UDY/SM)", due: "2026-04-30", month: 4, kind: "mentor", pointsCode: "mentorluk" },
  { id: "p-summit1", title: "Summit 1 katılım", due: "2026-04-18", month: 4, kind: "summit", pointsCode: "summit1" },
  { id: "p-koc-2", title: "Koçluk seans 2", due: "2026-04-30", month: 4, kind: "kocluk", pointsCode: "kocluk" },
  { id: "p-slj-fin", title: "SLJ final / tamamlandı", due: "2026-06-15", month: 6, kind: "slj", pointsCode: "slj" },
  { id: "p-koc-4", title: "Koçluk seans 4 (son)", due: "2026-06-30", month: 6, kind: "kocluk", pointsCode: "kocluk" },
  { id: "p-duyuru", title: "11. dönem duyuru desteği", due: "2026-07-19", month: 7, kind: "duyuru", pointsCode: "duyuru" },
  { id: "p-ai", title: "AI seansları tamamlandı", due: "2026-08-15", month: 8, kind: "ai", pointsCode: "ai" },
  { id: "p-fin", title: "Finansal okuryazarlık seansları", due: "2026-08-31", month: 8, kind: "finansal", pointsCode: "finansal" },
  { id: "p-sektor", title: "Sektörel derinleşme — final rapor", due: "2026-11-30", month: 11, kind: "sektorel", pointsCode: "sektorel" },
  { id: "p-mentor-2", title: "Mentörlük 2. görüşme", due: "2026-10-31", month: 10, kind: "mentor", pointsCode: "mentorluk" },
  { id: "p-summit2", title: "Summit 2 katılım", due: "2026-10-04", month: 10, kind: "summit", pointsCode: "summit2" },
  { id: "p-demo", title: "Sosyal etki demo day", due: "2026-10-15", month: 10, kind: "slj", pointsCode: "slj" },
  { id: "p-summit3", title: "Summit 3 katılım", due: "2026-12-19", month: 12, kind: "summit", pointsCode: "summit3" },
  { id: "p-gelistir", title: "Geliştirme görüşmesi", due: "2026-12-20", month: 12, kind: "gelistirme", pointsCode: "gelistirme" },
];

export type ActivityStatus = "teslim" | "kismi" | "yok";

export type Activity = {
  id: string;
  fellow: string;
  planItemId: string;
  at: string;
  evidence?: string;
  note?: string;
  status: ActivityStatus;
};

export type MailLog = {
  id: string;
  at: string;
  to: string[];
  subject: string;
  body: string;
  mode: "gonderildi" | "ornek" | "hata";
  detail?: string;
};

/** Demo teslimler — çoğu fellow geçmiş kalemleri tamamlamış, birkaç eksik */
export function seedActivities(): Activity[] {
  const out: Activity[] = [];
  let n = 0;
  const past = PLAN_ITEMS.filter((p) => p.due <= "2026-11-18");
  for (const fellow of FELLOWS_10) {
    const fi = FELLOWS_10.indexOf(fellow);
    for (const item of past) {
      // 3 uyarı fellow bazı kalemleri kaçırır
      const skip =
        (fi === 2 || fi === 6 || fi === 14) &&
        (item.id === "p-sektor" || item.id === "p-mentor-2" || item.id === "p-demo" || item.id === "p-slj-fin");
      if (skip) continue;
      // rastgele küçük eksikler
      if ((fi + item.month) % 11 === 0 && item.kind === "talks") continue;
      n += 1;
      out.push({
        id: `a-${n}`,
        fellow,
        planItemId: item.id,
        at: item.due,
        status: "teslim",
        evidence: item.kind === "slj" ? "https://docs.google.com/document/d/ornek" : undefined,
        note: item.kind === "summit" ? "Yoklama alındı" : undefined,
      });
    }
  }
  return out;
}

export type StageStatus = "yapildi" | "devam" | "bekliyor" | "sorun";

export type StageProgress = {
  id: string;
  fellow: string;
  moduleCode: string;
  stageCode: string;
  status: StageStatus;
  at?: string;
  note?: string;
  issue?: string;
};

/** Modüllerde items yoksa kullanılan varsayılan aşamalar */
export const MODULE_FALLBACK_STAGES: Record<string, { code: string; label: string }[]> = {
  sm_profil: [{ code: "bio", label: "SM / LinkedIn #LEAD21" }],
  kurucu_acilis: [{ code: "leadup", label: "LEAD UP açılış" }],
  kocluk: [
    { code: "s1", label: "Seans 1" },
    { code: "s2", label: "Seans 2" },
    { code: "s3", label: "Seans 3" },
    { code: "s4", label: "Seans 4" },
  ],
  finansal: [
    { code: "prep", label: "Ön hazırlık" },
    { code: "seans", label: "Seanslar" },
    { code: "plan", label: "Kişisel finans planı" },
  ],
  kariyer: [
    { code: "cv", label: "CV / HBS" },
    { code: "linkedin", label: "LinkedIn" },
    { code: "ik", label: "İK birebir" },
    { code: "konusmaci", label: "Konuşmacı seansları" },
  ],
  summit1: [
    { code: "katilim", label: "Katılım" },
    { code: "circles", label: "Circles" },
    { code: "sm", label: "Sosyal medya" },
    { code: "form", label: "Değerlendirme formu" },
  ],
  summit2: [
    { code: "katilim", label: "Katılım" },
    { code: "circles", label: "Circles" },
    { code: "sm", label: "Sosyal medya" },
    { code: "form", label: "Değerlendirme formu" },
  ],
  summit3: [
    { code: "katilim", label: "Katılım" },
    { code: "form", label: "Değerlendirme formu" },
  ],
  gelistirme: [{ code: "gorusme", label: "Birebir geliştirme" }],
  kurucu_kapanis: [{ code: "yemek", label: "Kapanış yemeği" }],
  ekip_ici: [
    { code: "mar", label: "Mart" },
    { code: "nis", label: "Nisan" },
    { code: "may", label: "Mayıs" },
    { code: "haz", label: "Haziran" },
    { code: "tem", label: "Temmuz" },
    { code: "agu", label: "Ağustos" },
    { code: "eyl", label: "Eylül" },
    { code: "eki", label: "Ekim" },
    { code: "kas", label: "Kasım" },
  ],
  lead_talks: [
    { code: "sub", label: "Şubat oturumu" },
    { code: "mar", label: "Mart oturumu" },
    { code: "nis", label: "Nisan oturumu" },
    { code: "may", label: "Mayıs oturumu" },
    { code: "haz", label: "Haziran oturumu" },
    { code: "eyl", label: "Eylül oturumu" },
    { code: "eki", label: "Ekim oturumu" },
  ],
};

export function moduleStages(moduleCode: string): { code: string; label: string; ideal?: number }[] {
  const cat = SCORE_CATEGORIES.find((c) => c.code === moduleCode);
  if (cat?.items?.length) return cat.items.map((i) => ({ code: i.code, label: i.label, ideal: i.ideal }));
  return (MODULE_FALLBACK_STAGES[moduleCode] ?? [{ code: "tamam", label: "Tamamlandı" }]).map((s) => ({
    ...s,
  }));
}

/** Demo aşama ilerlemeleri + sorunlar */
export function seedStages(): StageProgress[] {
  const out: StageProgress[] = [];
  let n = 0;
  const asOf = "2026-11-18";
  for (const fellow of FELLOWS_10) {
    const fi = FELLOWS_10.indexOf(fellow);
    const troubled = fi === 2 || fi === 6 || fi === 14;
    for (const cat of SCORE_CATEGORIES) {
      const stages = moduleStages(cat.code);
      // Geçmiş odaklı: yıl sonu modülleri (summit3, kapanış) bekliyor
      const lateModules = ["summit3", "kurucu_kapanis", "gelistirme"];
      stages.forEach((st, si) => {
        n += 1;
        let status: StageStatus = "yapildi";
        let issue: string | undefined;
        let note: string | undefined;
        let at: string | undefined = `2026-${String(Math.min(10, 1 + si)).padStart(2, "0")}-${String(10 + (si % 18)).padStart(2, "0")}`;

        if (lateModules.includes(cat.code)) {
          status = "bekliyor";
          at = undefined;
        } else if (
          troubled &&
          (cat.code === "slj" ||
            cat.code === "sektorel" ||
            cat.code === "mentorluk" ||
            cat.code === "ekip_ici" ||
            cat.code === "summit2" ||
            cat.code === "lead_talks")
        ) {
          // Baraj altı demo: kritik modüllerde yarısından sonrası sorun/eksik
          const cut = Math.max(1, Math.floor(stages.length * 0.45));
          if (si >= cut) {
            status = "sorun";
            issue =
              cat.code === "slj"
                ? "Sprint/final gecikmesi — WA uyarısı yapıldı"
                : cat.code === "sektorel"
                  ? "Final rapor deadline riski (Kasım sonu)"
                  : cat.code === "mentorluk"
                    ? "2. mentör görüşmesi ayarlanmadı"
                    : cat.code === "ekip_ici"
                      ? "Foto/not yok — kamera kuralı"
                      : cat.code === "summit2"
                        ? "Summit 2 katılım/form eksiği"
                        : "LEAD Talks katılım kaydı yok";
            at = asOf;
          } else if (si === cut - 1) {
            status = "devam";
            note = "Devam ediyor";
          }
        } else if ((fi + si) % 13 === 0 && cat.code === "lead_talks") {
          status = "bekliyor";
          at = undefined;
          note = "Katılım kaydı yok";
        } else if ((fi + si) % 17 === 0 && cat.code === "ekip_ici" && si >= 6) {
          status = "devam";
          note = "Foto/not bekleniyor";
        }

        out.push({
          id: `s-${n}`,
          fellow,
          moduleCode: cat.code,
          stageCode: st.code,
          status,
          at,
          note,
          issue,
        });
      });
    }
  }
  return out;
}

export const MAIL_TEMPLATES = [
  {
    id: "eksik",
    label: "Eksik teslim hatırlatması",
    subject: "LEAD21 — eksik teslim hatırlatması",
    body: `Merhaba {{isim}},

{{kalem}} için henüz teslim/katılım kaydı görünmüyor (deadline: {{deadline}}).

Lütfen kanıt linkini veya kısa notu Erşen'e ilet.

Teşekkürler,
LEAD21 Ops`,
  },
  {
    id: "baraj",
    label: "%80 baraj uyarısı",
    subject: "LEAD21 — puan barajı uyarısı",
    body: `Merhaba {{isim}},

Güncel puanın barajın (%80) altında. Kısa bir check-in yapalım; geciken teslimleri birlikte netleştirelim.

Erşen`,
  },
  {
    id: "deadline",
    label: "Yaklaşan deadline",
    subject: "LEAD21 — yaklaşan deadline",
    body: `Merhaba {{isim}},

Hatırlatma: {{kalem}} — {{deadline}}.

LEAD21`,
  },
] as const;

/** Super Mario — aşamalı mail zincirleri (Erşen dili) */
export type MailChainStep = {
  level: number;
  label: string;
  subject: string;
  body: string;
};

export type MailChain = {
  id: string;
  label: string;
  steps: MailChainStep[];
};

export const MAIL_CHAINS: MailChain[] = [
  {
    id: "eksik-mario",
    label: "Eksik teslim — Super Mario",
    steps: [
      {
        level: 1,
        label: "Nazik hatırlatma",
        subject: "LEAD21 — kısa hatırlatma: {{kalem}}",
        body: `Merhaba {{isim}},

{{kalem}} için kayıt henüz yok (deadline {{deadline}}). Kısa bir update yeter.

Erşen`,
      },
      {
        level: 2,
        label: "Net uyarı",
        subject: "LEAD21 — ikinci hatırlatma: {{kalem}}",
        body: `Merhaba {{isim}},

{{kalem}} hâlâ eksik. Bu tur puanı etkiliyor; bugün/yarın netleştirelim.

Erşen`,
      },
      {
        level: 3,
        label: "Baraj / disiplin",
        subject: "LEAD21 — son çağrı: {{kalem}}",
        body: `Merhaba {{isim}},

{{kalem}} için üçüncü yazım. %80 baraj ve summit katılımı risk altında. Lütfen hemen yaz.

Erşen`,
      },
    ],
  },
  {
    id: "baraj-mario",
    label: "%80 baraj — Super Mario",
    steps: [
      {
        level: 1,
        label: "Check-in",
        subject: "LEAD21 — puan check-in",
        body: `Merhaba {{isim}},

Puanın barajın altında görünüyor. 15 dk konuşalım mı?

Erşen`,
      },
      {
        level: 2,
        label: "Aksiyon listesi",
        subject: "LEAD21 — baraj için net aksiyonlar",
        body: `Merhaba {{isim}},

Baraj için öncelik: geciken teslimler + mentör/SLJ. Listeyi bu hafta kapatalım.

Erşen`,
      },
      {
        level: 3,
        label: "Yaptırım sinyali",
        subject: "LEAD21 — baraj ve summit",
        body: `Merhaba {{isim}},

%80 altına kalırsak summit/puan yaptırımı masada. Bu hafta toparlayalım.

Erşen`,
      },
    ],
  },
  {
    id: "disiplin-mario",
    label: "Modül sorunu — dozajlı",
    steps: [
      {
        level: 1,
        label: "Soft",
        subject: "LEAD21 — {{kalem}} takibi",
        body: `Merhaba {{isim}},

{{kalem}} tarafında bir takılma görünüyor. Ne lazım?

Erşen`,
      },
      {
        level: 2,
        label: "Sert",
        subject: "LEAD21 — {{kalem}} netleştirme",
        body: `Merhaba {{isim}},

{{kalem}} için deadline kaçmış durumda. Bugün cevap bekliyorum.

Erşen`,
      },
      {
        level: 3,
        label: "Artistlik",
        subject: "LEAD21 — son uyarı",
        body: `Merhaba {{isim}},

Bu üçüncü yazım. Program disiplinini bozan taraftayız; hemen toparla.

Erşen`,
      },
    ],
  },
  {
    id: "mentor-mario",
    label: "Mentör görüşmesi",
    steps: [
      {
        level: 1,
        label: "Takvim iste",
        subject: "LEAD21 — mentör görüşmesi takvimi",
        body: `Merhaba {{isim}},

Mentör 2. görüşme için tarih netleşsin. Mentörüne yazıp bana CC.

Erşen`,
      },
      {
        level: 2,
        label: "Eylül kaçtı",
        subject: "LEAD21 — mentör görüşmesi gecikmesi",
        body: `Merhaba {{isim}},

Ekim mentörü için Eylül temasını kaçırmışız. Bu hafta slot kilitle.

Erşen`,
      },
      {
        level: 3,
        label: "Triple yasak",
        subject: "LEAD21 — mentörlük kuralı",
        body: `Merhaba {{isim}},

Görüşmeleri üst üste yığmak (triple) yok. Planı düzgün yay.

Erşen`,
      },
    ],
  },
];

