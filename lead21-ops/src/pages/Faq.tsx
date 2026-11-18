import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { PageTitle } from "../components/PageTitle";

const FAQ = [
  {
    q: "Puan nasıl hesaplanır?",
    a: "Modül aşamalarından türetilir (yapıldı / devam / sorun / bekliyor). Manuel override varsa o geçer. Bonus ayrı satırdır; %80 baraj bonus hariç 925 ideali üzerinden.",
  },
  {
    q: "Müdahale kuyruğu neye bakar?",
    a: "Baraj altı, modül sorunu, eksik plan teslimi ve geciken mentör görüşmesi. “Yaz” Super Mario zincirine gider ve doz sayacını artırır.",
  },
  {
    q: "Mail gerçekten gidiyor mu?",
    a: "RESEND_API_KEY + MAIL_FROM tanımlıysa Resend ile gider; yoksa örnek log tutulur. API yalnızca oturum açmış Cursor kullanıcısına açıktır.",
  },
  {
    q: "Mentör Global puanı nerede?",
    a: "Excel’de Global satırı belirsiz. Mentörler ekranında eşleşme ve durum takip edilir; puanı gerekirse override ile yaz.",
  },
  {
    q: "Demo veriyi nasıl sıfırlarım?",
    a: "Sol menüdeki “Demo veriyi sıfırla” localStorage v5’i temizler ve seed’i yeniden yükler.",
  },
];

export function FaqPage() {
  return (
    <div className="page">
      <PageTitle title="SSS" />
      <Breadcrumbs items={[{ label: "Bu ay", to: "/" }, { label: "SSS" }]} />
      <header className="page-head">
        <div>
          <p className="eyebrow">Yardım</p>
          <h1>Sık sorulanlar</h1>
          <p className="lede">Erşen paneli — beş net cevap.</p>
        </div>
        <Link className="btn ghost" to="/gizlilik">
          Gizlilik →
        </Link>
      </header>
      <div className="faq-list">
        {FAQ.map((item) => (
          <details key={item.q} className="faq-item">
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
