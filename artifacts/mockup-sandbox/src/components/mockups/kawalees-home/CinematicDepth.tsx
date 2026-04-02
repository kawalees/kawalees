import { useState } from "react";
import { Search, MapPin, Briefcase, Star, ArrowLeft } from "lucide-react";

const GOLD = "#C8A96A";
const GOLD_LIGHT = "#E8C97A";
const BG = "#080808";

const ARTISTS = [
  { id: 1, name: "أحمد الرشيدي", specialty: "إخراج سينمائي", country: "السعودية", city: "الرياض", experience: "٨ سنوات", initials: "أر", hue: "30" },
  { id: 2, name: "نور الأزهري", specialty: "تصميم إضاءة", country: "مصر", city: "القاهرة", experience: "٥ سنوات", initials: "نا", hue: "140" },
  { id: 3, name: "خالد المنصوري", specialty: "تأليف وكتابة", country: "الإمارات", city: "دبي", experience: "١٢ سنة", initials: "خم", hue: "260" },
  { id: 4, name: "سارة بن علي", specialty: "تمثيل", country: "تونس", city: "تونس", experience: "٧ سنوات", initials: "سع", hue: "0" },
  { id: 5, name: "يوسف القطان", specialty: "تصميم ديكور", country: "الكويت", city: "الكويت", experience: "١٠ سنوات", initials: "يق", hue: "200" },
  { id: 6, name: "ليلى الحسيني", specialty: "إخراج مسرحي", country: "لبنان", city: "بيروت", experience: "١٥ سنة", initials: "لح", hue: "45" },
  { id: 7, name: "رامي الشرقاوي", specialty: "تصوير", country: "مصر", city: "الإسكندرية", experience: "٦ سنوات", initials: "رش", hue: "220" },
  { id: 8, name: "دانة المطيري", specialty: "مونتاج", country: "السعودية", city: "جدة", experience: "٤ سنوات", initials: "دم", hue: "40" },
];

const SPECIALTIES = ["الكل", "إخراج سينمائي", "إخراج مسرحي", "تمثيل", "تأليف وكتابة", "تصميم إضاءة"];

const STATS = [
  { value: "١٢٠+", label: "فنان مسجل" },
  { value: "١٨", label: "تخصصاً" },
  { value: "٩", label: "دول عربية" },
  { value: "٣٠٠+", label: "تواصل ناجح" },
];

function ArtistCard({ artist }: { artist: typeof ARTISTS[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 20, overflow: "hidden", cursor: "pointer",
        border: `1px solid ${hovered ? "rgba(200,169,106,0.25)" : "rgba(255,255,255,0.06)"}`,
        background: "#111",
        transform: hovered ? "translateY(-3px)" : "none",
        transition: "all 0.25s ease",
        boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.5)" : "none",
      }}
    >
      {/* Taller avatar area — cinematic ratio */}
      <div style={{
        height: 160, position: "relative",
        background: `radial-gradient(ellipse at 50% 80%, hsl(${artist.hue} 40% 8%) 0%, #0d0d0d 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {/* Spotlight from top */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "60%", height: "100%",
          background: `radial-gradient(ellipse at 50% 0%, rgba(200,169,106,0.12) 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div style={{
          width: 84, height: 84, borderRadius: "50%",
          background: `conic-gradient(from 180deg, hsl(${artist.hue} 50% 15%), hsl(${artist.hue} 30% 8%))`,
          border: `2px solid rgba(200,169,106,0.3)`,
          boxShadow: `0 0 20px rgba(200,169,106,0.1)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Cairo', sans-serif", fontSize: 26, fontWeight: 800, color: GOLD_LIGHT,
        }}>
          {artist.initials}
        </div>
        {/* Specialty badge at bottom of avatar area */}
        <div style={{
          position: "absolute", bottom: 10, right: 12,
          background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
          border: "1px solid rgba(200,169,106,0.2)", borderRadius: 8,
          padding: "3px 10px",
          fontFamily: "'Tajawal', sans-serif", fontSize: 11, color: GOLD, fontWeight: 500,
        }}>
          {artist.specialty}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px 16px" }}>
        <h3 style={{ fontFamily: "'Cairo', sans-serif", fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
          {artist.name}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <span style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 12, color: "#666", display: "flex", alignItems: "center", gap: 5 }}>
            <MapPin size={10} style={{ color: "#555" }} />{artist.city}، {artist.country}
          </span>
          <span style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 12, color: "#666", display: "flex", alignItems: "center", gap: 5 }}>
            <Briefcase size={10} style={{ color: "#555" }} />{artist.experience}
          </span>
        </div>
        {/* View profile */}
        <div style={{
          marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 12, color: hovered ? GOLD : "#555", transition: "color 0.2s" }}>عرض الملف</span>
          <ArrowLeft size={13} style={{ color: hovered ? GOLD : "#444", transition: "color 0.2s" }} />
        </div>
      </div>
    </div>
  );
}

export function CinematicDepth() {
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
        position: "sticky", top: 0, zIndex: 50, padding: "0 40px",
        background: "rgba(8,8,8,0.9)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(200,169,106,0.1)",
        display: "flex", alignItems: "center", justifyContent: "space-between", height: 60,
      }}>
        <span style={{
          fontFamily: "'Cairo', sans-serif", fontSize: 24, fontWeight: 900, letterSpacing: "0.04em",
          background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 50%, ${GOLD} 100%)`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          كواليس
        </span>
        <nav style={{ display: "flex", alignItems: "center", gap: 36 }}>
          <a style={{ fontFamily: "'Cairo', sans-serif", fontSize: 14, color: GOLD, textDecoration: "none", fontWeight: 600, borderBottom: `2px solid ${GOLD}`, paddingBottom: 2 }}>الرئيسية</a>
          <a style={{ fontFamily: "'Cairo', sans-serif", fontSize: 14, color: "#777", textDecoration: "none" }}>تواصل معنا</a>
          <a style={{
            fontFamily: "'Cairo', sans-serif", fontSize: 13, fontWeight: 700,
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
            color: "#080808", borderRadius: 6, padding: "7px 20px", textDecoration: "none",
          }}>انضم كفنان</a>
        </nav>
      </header>

      {/* Hero */}
      <section style={{ position: "relative", minHeight: "75vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 32, overflow: "hidden" }}>
        {/* Multi-layer atmospheric background */}
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 80% 70% at 50% 30%, rgba(200,169,106,0.06) 0%, transparent 65%)` }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(to bottom, rgba(200,169,106,0.02) 0%, transparent 100%)" }} />
        {/* Horizontal light lines */}
        <div style={{ position: "absolute", top: "25%", left: 0, right: 0, height: 1, background: `linear-gradient(to right, transparent, rgba(200,169,106,0.06), transparent)` }} />
        <div style={{ position: "absolute", top: "75%", left: 0, right: 0, height: 1, background: `linear-gradient(to right, transparent, rgba(200,169,106,0.04), transparent)` }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, #080808 95%)" }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: 780, width: "100%", padding: "0 40px", textAlign: "center" }}>
          {/* Tag */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
            <div style={{ width: 24, height: 1, background: `${GOLD}88` }} />
            <span style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 12, color: `${GOLD}cc`, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>
              دليل المواهب العربية
            </span>
            <div style={{ width: 24, height: 1, background: `${GOLD}88` }} />
          </div>

          <h1 style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: "clamp(48px, 7.5vw, 84px)", fontWeight: 900, lineHeight: 1.1,
            margin: "0 0 24px", color: "#fff",
          }}>
            اكتشف <span style={{ background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 40%, #F0D890 60%, ${GOLD} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>المواهب</span>
            <br />
            <span style={{ fontWeight: 400, color: "#ccc", fontSize: "0.85em" }}>خلف الكواليس</span>
          </h1>

          <p style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 17, color: "#888", marginBottom: 36, lineHeight: 1.8, maxWidth: 520, margin: "0 auto 36px" }}>
            المنصة الأولى المخصصة لربط صناع المسرح، السينما، والفنون بأفضل الكفاءات والمحترفين في العالم العربي.
          </p>

          {/* Search */}
          <div style={{ position: "relative", maxWidth: 560, margin: "0 auto 40px" }}>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ابحث عن مخرج، مصمم إضاءة، كاتب..."
              style={{
                width: "100%", boxSizing: "border-box",
                background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(200,169,106,0.18)",
                borderRadius: 14, padding: "16px 52px 16px 20px",
                fontFamily: "'Tajawal', sans-serif", fontSize: 15, color: "#fff",
                outline: "none", direction: "rtl",
              }}
            />
            <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)" }}>
              <Search size={20} style={{ color: `${GOLD}99` }} />
            </div>
          </div>

          {/* Stats strip */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0 }}>
            {STATS.map((stat, i) => (
              <div key={stat.label} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ textAlign: "center", padding: "0 24px" }}>
                  <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 22, fontWeight: 800, color: GOLD }}>{stat.value}</div>
                  <div style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 11, color: "#555", marginTop: 2 }}>{stat.label}</div>
                </div>
                {i < STATS.length - 1 && (
                  <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.08)" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Directory */}
      <section style={{ padding: "40px 40px 80px", maxWidth: 1200, margin: "0 auto" }}>
        {/* Section header — editorial treatment */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Cairo', sans-serif", fontSize: 32, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-0.01em" }}>
              الدليل المهني
            </h2>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, rgba(200,169,106,0.2))` }} />
            <span style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 13, color: "#555" }}>{filtered.length} فنان</span>
          </div>

          {/* Tab-style filters */}
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {SPECIALTIES.map(spec => (
              <button key={spec} onClick={() => setActiveSpec(spec)} style={{
                fontFamily: "'Tajawal', sans-serif", fontSize: 13, fontWeight: activeSpec === spec ? 600 : 400,
                color: activeSpec === spec ? GOLD : "#666",
                background: "none", border: "none", cursor: "pointer",
                padding: "10px 18px",
                borderBottom: activeSpec === spec ? `2px solid ${GOLD}` : "2px solid transparent",
                marginBottom: -1,
                transition: "all 0.15s", whiteSpace: "nowrap",
              }}>
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "100px 32px" }}>
            {/* Warm glow */}
            <div style={{ position: "relative", display: "inline-block", marginBottom: 24 }}>
              <div style={{
                position: "absolute", inset: -20,
                background: `radial-gradient(ellipse, rgba(200,169,106,0.1) 0%, transparent 70%)`,
                borderRadius: "50%",
              }} />
              <Star size={40} style={{ color: GOLD, opacity: 0.4, position: "relative" }} />
            </div>
            <h3 style={{ fontFamily: "'Cairo', sans-serif", fontSize: 22, color: "#fff", margin: "0 0 10px" }}>لم نجد نتائج</h3>
            <p style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 15, color: "#555", margin: "0 0 24px" }}>
              حاول البحث بكلمات مختلفة أو غيّر التصفية
            </p>
            <button onClick={() => { setSearch(""); setActiveSpec("الكل"); }} style={{
              fontFamily: "'Cairo', sans-serif", fontSize: 14, fontWeight: 600,
              background: "rgba(200,169,106,0.08)", border: `1px solid rgba(200,169,106,0.2)`,
              color: GOLD, borderRadius: 10, padding: "9px 24px", cursor: "pointer",
            }}>عرض الكل</button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {filtered.map(artist => <ArtistCard key={artist.id} artist={artist} />)}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.04)", padding: "32px 40px",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16,
        position: "relative",
      }}>
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "30%", height: 1, background: `linear-gradient(to right, transparent, rgba(200,169,106,0.25), transparent)` }} />
        <div>
          <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 20, fontWeight: 900, background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>كواليس</div>
          <p style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 12, color: "#444", margin: "3px 0 0" }}>المنصة الاحترافية لصناع الفن والمسرح</p>
        </div>
        <div style={{ display: "flex", gap: 28 }}>
          {["الفنانون", "انضم كفنان", "تواصل معنا"].map(l => (
            <a key={l} style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 13, color: "#444", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
        <p style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 12, color: "#333" }}>© ٢٠٢٦ كواليس</p>
      </footer>
    </div>
  );
}
