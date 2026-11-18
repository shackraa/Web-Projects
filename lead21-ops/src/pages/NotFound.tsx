import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { PageTitle } from "../components/PageTitle";

export function NotFound() {
  return (
    <div className="page">
      <PageTitle title="404" />
      <Breadcrumbs items={[{ label: "Bu ay", to: "/" }, { label: "404" }]} />
      <header className="page-head">
        <div>
          <p className="eyebrow">Bulunamadı</p>
          <h1>Bu sayfa yok</h1>
          <p className="lede">Link kırık veya taşındı. Panele dönüp devam et.</p>
        </div>
      </header>
      <div className="toolbar">
        <Link className="btn" to="/">
          Bu aya dön
        </Link>
        <Link className="btn ghost" to="/fellows">
          Fellow’lar
        </Link>
      </div>
    </div>
  );
}
