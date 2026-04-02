import { useState } from "react";
import { Search, Filter, MapPin, Briefcase, ChevronLeft, UserX } from "lucide-react";

const GOLD = "#C8A96A";
const BG = "#0b0b0b";
const CARD_BG = "#111111";

const ARTISTS = [
  { id: 1, name: "أحمد الرشيدي", specialty: "إخراج سينمائي", country: "السعودية", city: "الرياض", experience: "٨ سنوات", initials: "أر", color: "#1a1400" },
  { id: 2, name: "نور الأزهري", specialty: "تصميم إضاءة", country: "مصر", city: "القاهرة", experience: "٥ سنوات", initials: "نا", color: "#0a1a0a" },
  { id: 3, name: "خالد المنصوري", specialty: "تأليف وكتابة", country: "الإمارات", city: "دبي", experience: "١٢ سنة", initials: "خم", color: "#100a1a" },
  { id: 4, name: "سارة بن علي", specialty: "تمثيل", country: "تونس", city: "تونس", experience: "٧ سنوات", initials: "سع", color: "#1a0a0a" },
  { id: 5, name: "يوسف القطان", specialty: "تصميم ديكور", country: "الكويت", city: "الكويت", experience: "١٠ سنوات", initials: "يق", color: "#001218" },
  { id: 6, name: "ليلى الحسيني", specialty: "إخراج مسرحي", country: "لبنان", city: "بيروت", experience: "١٥ سنة", initials: "لح", color: "#1a1400" },
  { id: 7, name: "رامي الشرقاوي", specialty: "تصوير", country: "مصر", city: "الإسكندرية", experience: "٦ سنوات", initials: "رش", color: "#0a0a1a" },
  { id: 8, name: "دانة المطيري", specialty: "مونتاج", country: "السعودية", city: "جدة", experience: "٤ سنوات", initials: "دم", color: "#1a1400" },
];

const SPECIALTIES = ["الكل", "إخراج سينمائي", "إخراج مسرحي", "تمثيل", "تأليف وكتابة", "تصميم إضاءة", "تصميم ديكور", "تصوير", "مونتاج"];

function ArtistCard({ artist }: { artist: typeof ARTISTS[0] }) {
  return (
    <div style={{
      background: CARD_BG,
      border: "1px solid rgba(200,169,106,0.12)",
      borderRadius: 16,
      overflow: "hidden",
      transition: "border-color 0.2s, transform 0.2s",
      cursor: "pointer",
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,169,106,0.3)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,169,106,0.12)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* Avatar area */}
      <div style={{ background: artist.color, height: 120, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: `radial-gradient(135deg, ${GOLD}33 0%, ${GOLD}11 100%)`,
          border: `2px solid ${GOLD}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Cairo', sans-serif", fontSize: 22, fontWeight: 700, color: GOLD,
        }}>
          {artist.initials}
        </div>
        {/* Subtle glow */}
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 120%, ${GOLD}08 0%, transparent 70%)`, pointerEvents: "none" }} />
      </div>

      {/* Info */}
      <div style={{ padding: "16px 16px 18px" }}>
        <h3 style={{ fontFamily: "'Cairo', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", margin: 0, marginBottom: 4 }}>{artist.name}</h3>
        <p style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 13, color: GOLD, margin: 0, marginBottom: 10, fontWeight: 500 }}>{artist.specialty}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 4 }}>
            <MapPin size={11} style={{ flexShrink: 0 }} />
            {artist.city}، {artist.country}
          </span>
          <span style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 4 }}>
            <Briefcase size={11} style={{ flexShrink: 0 }} />
            {artist.experience}
          </span>
        </div>
      </div>
    </div>
  );
}

export function RefinedClarity() {
  const [search, setSearch] = useState("");
  const [activeSpec, setActiveSpec] = useState("الكل");

  const filtered = ARTISTS.filter(a =>
    (activeSpec === "الكل" || a.specialty === activeSpec) &&
    (a.name.includes(search) || a.specialty.includes(search))
  );

  return (
    <div dir="rtl" style={{ fontFamily: "'Tajawal', sans-serif", background: BG, minHeight: "100vh", color: "#fff" }}>
      {/* Nav */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50, padding: "0 32px",
        background: "rgba(11,11,11,0.85)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(200,169,106,0.15)",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 64,
      }}>
        <span style={{ fontFamily: "'Cairo', sans-serif", fontSize: 26, fontWeight: 800, background: `linear-gradient(135deg, ${GOLD} 0%, #e8c97a 50%, ${GOLD} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          كواليس
        </span>
        <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <a style={{ fontFamily: "'Cairo', sans-serif", fontSize: 15, color: GOLD, textDecoration: "none", fontWeight: 600 }}>الرئيسية</a>
          <a style={{ fontFamily: "'Cairo', sans-serif", fontSize: 15, color: "#aaa", textDecoration: "none" }}>تواصل معنا</a>
          <a style={{
            fontFamily: "'Cairo', sans-serif", fontSize: 14, color: GOLD, textDecoration: "none",
            border: `1.5px solid ${GOLD}`, borderRadius: 24, padding: "6px 18px", fontWeight: 600,
            background: "rgba(200,169,106,0.05)",
          }}>انضم كفنان</a>
        </nav>
      </header>

      {/* Hero */}
      <section style={{ position: "relative", minHeight: "72vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 40, overflow: "hidden" }}>
        {/* Background layers */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(200,169,106,0.07) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, #0b0b0b 95%)" }} />
        {/* Film grain texture */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: 820, width: "100%", padding: "0 32px", textAlign: "center" }}>
          {/* Eyebrow */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "5px 16px", borderRadius: 20,
            background: "rgba(200,169,106,0.1)", border: "1px solid rgba(200,169,106,0.2)",
            marginBottom: 28,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD }} />
            <span style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 13, color: GOLD, fontWeight: 500 }}>المنصة الاحترافية للمواهب العربية</span>
          </div>

          <h1 style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: "clamp(52px, 8vw, 88px)", fontWeight: 900, lineHeight: 1.1,
            margin: "0 0 20px", letterSpacing: "-0.02em",
            color: "#fff",
          }}>
            اكتشف <span style={{ background: `linear-gradient(135deg, #C8A96A 0%, #E8C97A 40%, #C8A96A 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>المواهب</span>
            <br />خلف الكواليس
          </h1>

          <p style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 18, color: "#bbb", marginBottom: 36, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 36px" }}>
            المنصة الأولى المخصصة لربط صناع المسرح، السينما، والفنون بأفضل الكفاءات والمحترفين في العالم العربي.
          </p>

          {/* Search bar — refined */}
          <div style={{ position: "relative", maxWidth: 580, margin: "0 auto" }}>
            <div style={{ position: "absolute", inset: -1, borderRadius: 17, background: `linear-gradient(135deg, ${GOLD}33, transparent, ${GOLD}22)`, pointerEvents: "none" }} />
            <div style={{ position: "relative", display: "flex", alignItems: "center", background: "rgba(0,0,0,0.6)", borderRadius: 16, border: "1px solid rgba(200,169,106,0.2)", backdropFilter: "blur(20px)", overflow: "hidden" }}>
              <div style={{ padding: "0 16px", display: "flex", alignItems: "center", flexShrink: 0 }}>
                <Search size={20} style={{ color: GOLD }} />
              </div>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="ابحث عن مخرج، مصمم إضاءة، كاتب..."
                style={{
                  flex: 1, background: "none", border: "none", outline: "none",
                  fontFamily: "'Tajawal', sans-serif", fontSize: 16, color: "#fff",
                  padding: "17px 0", direction: "rtl",
                }}
              />
              <button style={{
                margin: 6, padding: "10px 20px", borderRadius: 12,
                background: `linear-gradient(135deg, ${GOLD}, #e8c97a)`,
                border: "none", cursor: "pointer",
                fontFamily: "'Cairo', sans-serif", fontSize: 14, fontWeight: 700, color: "#0b0b0b",
                display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
              }}>
                بحث <ChevronLeft size={14} />
              </button>
            </div>
          </div>

          {/* Quick filters under search */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 12, color: "#555" }}>بحث سريع:</span>
            {["مخرج", "ممثل", "كاتب", "مصمم"].map(q => (
              <button key={q} onClick={() => setSearch(q)} style={{
                fontFamily: "'Tajawal', sans-serif", fontSize: 12, color: "#666",
                background: "none", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12,
                padding: "3px 12px", cursor: "pointer",
              }}>{q}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Directory Section */}
      <section style={{ padding: "48px 32px 80px", maxWidth: 1200, margin: "0 auto" }}>
        {/* Section header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Gold accent bar — vibrant and visible */}
            <div style={{ width: 4, height: 32, borderRadius: 2, background: `linear-gradient(to bottom, #E8C97A, ${GOLD})` }} />
            <h2 style={{ fontFamily: "'Cairo', sans-serif", fontSize: 28, fontWeight: 800, color: "#fff", margin: 0 }}>الدليل المهني</h2>
            <span style={{
              fontFamily: "'Tajawal', sans-serif", fontSize: 12, color: GOLD,
              background: "rgba(200,169,106,0.1)", border: "1px solid rgba(200,169,106,0.2)",
              borderRadius: 12, padding: "2px 10px",
            }}>{filtered.length} فنان</span>
          </div>

          {/* Filters — wrapped in a container */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "6px 8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, paddingLeft: 8, borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
              <Filter size={13} style={{ color: "#555" }} />
              <span style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 12, color: "#555" }}>تصفية</span>
            </div>
            <div style={{ display: "flex", gap: 4, overflowX: "auto" }}>
              {SPECIALTIES.slice(0, 5).map(spec => (
                <button key={spec} onClick={() => setActiveSpec(spec)} style={{
                  fontFamily: "'Tajawal', sans-serif", fontSize: 13,
                  padding: "5px 14px", borderRadius: 8, border: "none",
                  background: activeSpec === spec ? GOLD : "transparent",
                  color: activeSpec === spec ? "#0b0b0b" : "#888",
                  fontWeight: activeSpec === spec ? 700 : 400,
                  cursor: "pointer", whiteSpace: "nowrap",
                  transition: "all 0.15s",
                }}>
                  {spec}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Artist Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 32px" }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "rgba(200,169,106,0.06)", border: "1px solid rgba(200,169,106,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
            }}>
              <UserX size={28} style={{ color: "#555" }} />
            </div>
            <h3 style={{ fontFamily: "'Cairo', sans-serif", fontSize: 22, color: "#fff", margin: "0 0 8px" }}>لم نجد نتائج مطابقة</h3>
            <p style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 15, color: "#666", margin: "0 0 24px", maxWidth: 400, marginInline: "auto" }}>
              حاول البحث بكلمات مختلفة أو غيّر التصفية لرؤية المزيد من المواهب.
            </p>
            <button onClick={() => { setSearch(""); setActiveSpec("الكل"); }} style={{
              fontFamily: "'Cairo', sans-serif", fontSize: 14, color: GOLD,
              background: "none", border: `1px solid ${GOLD}55`, borderRadius: 20, padding: "8px 24px", cursor: "pointer",
            }}>مسح التصفية</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {filtered.map(artist => <ArtistCard key={artist.id} artist={artist} />)}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "40px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 22, fontWeight: 800, background: `linear-gradient(135deg, ${GOLD}, #e8c97a)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>كواليس</div>
          <p style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 13, color: "#555", margin: "4px 0 0" }}>المنصة الاحترافية لصناع الفن والمسرح</p>
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          {["الفنانون", "انضم كفنان", "تواصل معنا"].map(l => (
            <a key={l} style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 13, color: "#555", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
        <p style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 12, color: "#444" }}>© ٢٠٢٦ كواليس. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}
