import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { PageTitle } from "../components/PageTitle";

export function PrivacyPage() {
  return (
    <div className="page">
      <PageTitle title="Gizlilik" />
      <Breadcrumbs items={[{ label: "Bu ay", to: "/" }, { label: "Gizlilik" }]} />
      <header className="page-head">
        <div>
          <p className="eyebrow">Privacy</p>
          <h1>Gizlilik politikası</h1>
          <p className="lede">LEAD21 Ops koordinatör paneli — örnek / operasyon verisi.</p>
        </div>
      </header>
      <section className="panel prose-panel">
        <h2>Ne tutulur?</h2>
        <p>
          Fellow isimleri, e-posta örnekleri, puan/aşama, mentör eşleşmeleri ve mail log’u tarayıcı
          localStorage’ında (veya senin cihazında) tutulur. Yayında uygulama Private’tır; yalnızca
          Cursor hesabınla açılır.
        </p>
        <h2>Mail</h2>
        <p>
          Gönderim için Resend kullanılabilir. Anahtar sunucu ortamında tutulur; istemciye
          gönderilmez. API çağıranı Cursor kimliği ile doğrular.
        </p>
        <h2>Üçüncü taraflar</h2>
        <p>
          Arama motoru indekslemesi robots.txt ile engellenir. Google Analytics yoktur.
        </p>
        <h2>İletişim</h2>
        <p>
          Veri silme / erişim için program koordinatörüne yaz.{" "}
          <Link to="/sss">SSS</Link> · <Link to="/">Panele dön</Link>
        </p>
      </section>
    </div>
  );
}