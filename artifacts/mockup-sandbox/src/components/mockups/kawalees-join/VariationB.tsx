import { useState } from "react";
import {
  User, Phone, MapPin, Briefcase, GraduationCap, Film,
  CheckCircle2, Send, Lock, Shield, ImageIcon,
  Languages, Calendar, Users, Theater, AlertCircle,
  Music, Pen, Clapperboard, Sparkles, Search, ChevronDown, X, Upload
} from "lucide-react";

const SPECIALTY_GROUPS = [
  { label: "الأداء", icon: Theater, items: ["ممثل مسرحي","ممثل سينمائي","ممثل تلفزيوني","ممثل صوت ودبلجة","راقص / فنان رقص معاصر","مؤدي حركي","ممثل كوميدي","مؤدي فنون الشارع","قصاص / راوٍ"] },
  { label: "الإخراج", icon: Clapperboard, items: ["مخرج مسرحي","مخرج سينمائي","مخرج تلفزيوني","مخرج تنفيذي","مساعد مخرج","مخرج ثانٍ"] },
  { label: "الكتابة الإبداعية", icon: Pen, items: ["كاتب مسرحي","كاتب سيناريو سينمائي","كاتب سيناريو تلفزيوني","كاتب حوار","دراماتورج","ناقد مسرحي / سينمائي","مطوّر قصة"] },
  { label: "التصميم الفني", icon: Sparkles, items: ["سينوغراف / مصمم ديكور","مصمم إضاءة","مصمم أزياء","مصمم مكياج مسرحي / سينمائي","مصمم شعر وباروكة","مدير فني (Art Director)","مصمم جرافيك للمسرح والسينما"] },
  { label: "التصوير السينمائي", icon: Film, items: ["مدير تصوير (DOP)","مصور / كاميرامان","مشغّل كاميرا","مصوّر فوتوغرافي للأعمال","مونتير","فني مؤثرات بصرية (VFX)","فني مؤثرات خاصة (SFX)","فني تلوين وتصحيح ألوان (Colorist)"] },
  { label: "الصوت والموسيقى", icon: Music, items: ["مؤلف موسيقي","مصمم صوت","مهندس صوت","مهندس صوت ميداني","موسيقي مباشر","منسق موسيقى تصويرية"] },
  { label: "الإنتاج", icon: Users, items: ["منتج تنفيذي","منتج مسرحي","منتج سينمائي / تلفزيوني","مدير إنتاج","مدير مسرح (Stage Manager)","منسق إنتاج","مساعد إنتاج","مدير توزيع وعروض","مدير استديو"] },
  { label: "التدريب والأكاديميا", icon: GraduationCap, items: ["مدرب تمثيل","مدرب صوت وإلقاء","مدرب حركة جسدية","مستشار فني","محاضر / أكاديمي في الفنون","مدرب ارتجال مسرحي"] },
];

const WORK_TYPES = ["مسرح", "سينما", "تلفزيون", "إعلانات"];
const EXPERIENCE_OPTIONS = ["أقل من سنة", "1-3 سنوات", "3-5 سنوات", "5-10 سنوات", "أكثر من 10 سنوات"];

function calcAgeRange(dob: string): string {
  if (!dob) return "";
  const age = new Date().getFullYear() - new Date(dob).getFullYear();
  if (age < 18) return "أقل من 18";
  const low = Math.floor(age / 5) * 5;
  return `${low}–${low + 4}`;
}

const gold = "#c9a84c";
const goldDim = "rgba(201,168,76,0.1)";
const goldBorder = "rgba(201,168,76,0.2)";

const inputStyle: React.CSSProperties = {
  width: "100%", background: "transparent",
  borderTop: "none", borderRight: "none", borderLeft: "none",
  borderBottom: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 0, padding: "10px 0",
  color: "#fff", fontSize: 14, outline: "none",
  fontFamily: "Cairo, sans-serif", boxSizing: "border-box",
  transition: "border-color .15s",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280",
  letterSpacing: "0.03em", marginBottom: 5, textTransform: "uppercase",
};

function SectionBlock({ number, title, icon: Icon, children }: { number: string; title: string; icon: any; children: React.ReactNode }) {
  return (
    <div style={{ paddingTop: 40, paddingBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 28 }}>
        <span style={{ fontFamily: "Cairo, sans-serif", fontWeight: 900, fontSize: 42, color: "rgba(201,168,76,0.15)", lineHeight: 1, userSelect: "none" }}>{number}</span>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <Icon size={15} color={gold} />
            <span style={{ fontFamily: "Cairo, sans-serif", fontWeight: 700, fontSize: 18, color: "#fff" }}>{title}</span>
          </div>
          <div style={{ width: 32, height: 2, background: gold, borderRadius: 999, marginRight: 0 }} />
        </div>
      </div>
      {children}
    </div>
  );
}

function LineField({ label, required, children, note, error }: { label: string; required?: boolean; children: React.ReactNode; note?: string; error?: string }) {
  return (
    <div style={{ paddingBottom: 4 }}>
      <label style={labelStyle}>{label} {required && <span style={{ color: "#f87171" }}>*</span>}</label>
      {children}
      {note && <p style={{ fontSize: 11, color: "#374151", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><Lock size={9} color="#374151" />{note}</p>}
      {error && <p style={{ fontSize: 11, color: "#f87171", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><AlertCircle size={11} />{error}</p>}
    </div>
  );
}

export function VariationB() {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [education, setEducation] = useState("");
  const [portfolioLinks, setPortfolioLinks] = useState("");
  const [works, setWorks] = useState("");
  const [languages, setLanguages] = useState("");
  const [dialects, setDialects] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const [specialtySearch, setSpecialtySearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<number[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors] = useState<Record<string, string>>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [hasPhoto] = useState(false);

  const ageRange = calcAgeRange(dob);
  const toggleSpecialty = (s: string) =>
    setSelectedSpecialties(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const toggleWorkType = (w: string) =>
    setSelectedWorkTypes(p => p.includes(w) ? p.filter(x => x !== w) : [...p, w]);
  const toggleGroup = (i: number) =>
    setExpandedGroups(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);

  const filteredGroups = SPECIALTY_GROUPS.map(g => ({
    ...g,
    items: g.items.filter(it => !specialtySearch || it.includes(specialtySearch)),
  })).filter(g => !specialtySearch || g.items.length > 0);

  const getFocusedStyle = (name: string): React.CSSProperties => ({
    ...inputStyle,
    borderBottomColor: focusedInput === name ? gold : "rgba(255,255,255,0.12)",
  });

  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "Cairo, sans-serif", paddingBottom: 100 }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px" }}>

        {/* Nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ fontFamily: "Cairo, sans-serif", fontWeight: 800, fontSize: 20, color: gold }}>كواليس</span>
          <div style={{ display: "flex", gap: 24 }}>
            {["الرئيسية","الفنانون","انضم"].map((t, i) => (
              <span key={t} style={{ fontSize: 13, color: i === 2 ? gold : "#4b5563", cursor: "pointer" }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Header */}
        <div style={{ padding: "52px 0 0" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: goldDim, border: `1px solid ${goldBorder}`, borderRadius: 999, padding: "4px 14px", fontSize: 12, color: gold, marginBottom: 20 }}>
            <Theater size={11} color={gold} />سجّل ملفك المهني
          </div>
          <h1 style={{ fontFamily: "Cairo, sans-serif", fontWeight: 900, fontSize: 44, color: "#fff", margin: "0 0 12px", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
            انضم إلى <br /><span style={{ color: gold }}>كواليس</span>
          </h1>
          <p style={{ color: "#4b5563", fontSize: 14, maxWidth: 380, lineHeight: 1.7, margin: 0 }}>
            دليل المواهب الاحترافية للمسرح، السينما، والتلفزيون في العالم العربي.
          </p>

          {/* Subtle privacy line */}
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 20 }}>
            <Shield size={12} color={gold} />
            <span style={{ fontSize: 12, color: "#4b5563" }}>جميع البيانات محفوظة بشكل آمن ولن تُعرض في ملفك العام</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "linear-gradient(to left, transparent, rgba(201,168,76,0.3), transparent)", marginTop: 32 }} />

        {/* Photo Upload Banner */}
        <div style={{ marginTop: 36, border: "1px dashed rgba(255,255,255,0.08)", borderRadius: 16, padding: "20px 24px", display: "flex", alignItems: "center", gap: 20, cursor: "pointer", transition: "border-color .15s" }}>
          <div style={{
            width: 68, height: 68, borderRadius: "50%",
            border: `1.5px solid ${hasPhoto ? gold : "rgba(255,255,255,0.12)"}`,
            background: "rgba(255,255,255,0.02)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <ImageIcon size={20} color="#374151" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: "#9ca3af", fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>الصورة الشخصية <span style={{ color: "#f87171" }}>*</span></p>
            <p style={{ color: "#374151", fontSize: 12, margin: 0 }}>صورة واضحة بخلفية بسيطة — JPG، PNG، WebP (حد أقصى 5MB)</p>
          </div>
          <button type="button" style={{
            display: "flex", alignItems: "center", gap: 7, padding: "8px 16px",
            borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.03)", color: "#6b7280", fontSize: 13,
            fontFamily: "Cairo, sans-serif", cursor: "pointer",
          }}>
            <Upload size={14} />رفع صورة
          </button>
        </div>

        {/* Section 1 */}
        <SectionBlock number="01" title="المعلومات الأساسية" icon={User}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <LineField label="الاسم الكامل" required error={errors.name}>
                <input style={getFocusedStyle("name")} value={name} onChange={e => setName(e.target.value)}
                  onFocus={() => setFocusedInput("name")} onBlur={() => setFocusedInput(null)}
                  placeholder="مثال: اسم الفنان" />
              </LineField>
            </div>
            <LineField label="دولة الإقامة" required error={errors.country}>
              <div style={{ position: "relative" }}>
                <input style={{ ...getFocusedStyle("country"), paddingRight: 24 }} value={country} onChange={e => setCountry(e.target.value)}
                  onFocus={() => setFocusedInput("country")} onBlur={() => setFocusedInput(null)}
                  placeholder="مثال: قطر" />
                <MapPin size={13} color="#374151" style={{ position: "absolute", top: "50%", right: 0, transform: "translateY(-50%)" }} />
              </div>
            </LineField>
            <LineField label="المدينة">
              <input style={getFocusedStyle("city")} value={city} onChange={e => setCity(e.target.value)}
                onFocus={() => setFocusedInput("city")} onBlur={() => setFocusedInput(null)}
                placeholder="مثال: الدوحة" />
            </LineField>
            <LineField label="تاريخ الميلاد" required error={errors.dateOfBirth} note="يُستخدم فقط لحساب الفئة العمرية التقريبية">
              <div style={{ position: "relative" }}>
                <input type="date" style={{ ...getFocusedStyle("dob"), colorScheme: "dark", paddingRight: 24 }}
                  value={dob} onChange={e => setDob(e.target.value)}
                  onFocus={() => setFocusedInput("dob")} onBlur={() => setFocusedInput(null)} />
                <Calendar size={13} color="#374151" style={{ position: "absolute", top: "50%", right: 0, transform: "translateY(-50%)" }} />
              </div>
              {ageRange && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: goldDim, border: `1px solid ${goldBorder}`, borderRadius: 999, padding: "2px 10px", fontSize: 11, color: gold, marginTop: 7 }}>
                  <CheckCircle2 size={10} color={gold} />{ageRange} سنة
                </span>
              )}
            </LineField>
            <div>
              <label style={labelStyle}>الجنس <span style={{ color: "#f87171" }}>*</span></label>
              <div style={{ display: "flex", gap: 6, paddingTop: 4 }}>
                {["ذكر", "أنثى"].map(g => (
                  <button key={g} type="button" onClick={() => setGender(g)} style={{
                    flex: 1, padding: "9px 0", borderRadius: 8,
                    border: `1px solid ${gender === g ? goldBorder : "rgba(255,255,255,0.07)"}`,
                    background: gender === g ? goldDim : "transparent",
                    color: gender === g ? gold : "#6b7280", fontSize: 13,
                    fontFamily: "Cairo, sans-serif", cursor: "pointer", transition: "all .15s",
                  }}>{g}</button>
                ))}
              </div>
            </div>
          </div>
        </SectionBlock>

        <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

        {/* Section 2 */}
        <SectionBlock number="02" title="بيانات التواصل" icon={Phone}>
          <div style={{ display: "flex", gap: 8, background: "rgba(201,168,76,0.05)", borderRadius: 10, padding: "9px 12px", marginBottom: 20 }}>
            <Lock size={11} color={gold} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 12, color: "#4b5563", margin: 0, lineHeight: 1.5 }}>بيانات التواصل لن تُعرض لأي مستخدم وتُستخدم فقط لإدارة طلبات التواصل عبر المنصة.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px" }}>
            <LineField label="رقم الهاتف" required error={errors.phone} note="لن يتم عرض رقمك لأي مستخدم">
              <div style={{ position: "relative" }}>
                <input type="tel" style={{ ...getFocusedStyle("phone"), paddingRight: 24 }} value={phone} onChange={e => setPhone(e.target.value)}
                  onFocus={() => setFocusedInput("phone")} onBlur={() => setFocusedInput(null)}
                  placeholder="+974 5x xxx xxxx" />
                <Phone size={13} color="#374151" style={{ position: "absolute", top: "50%", right: 0, transform: "translateY(-50%)" }} />
              </div>
            </LineField>
            <LineField label="البريد الإلكتروني" required error={errors.email} note="يُستخدم لإرسال إشعار قبول الطلب">
              <input type="email" style={getFocusedStyle("email")} value={email} onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocusedInput("email")} onBlur={() => setFocusedInput(null)}
                placeholder="example@email.com" />
            </LineField>
          </div>
        </SectionBlock>

        <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

        {/* Section 3 */}
        <SectionBlock number="03" title="المعلومات الفنية" icon={Briefcase}>
          {/* Specialties */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <label style={labelStyle}>التخصصات المهنية <span style={{ color: "#f87171" }}>*</span></label>
              {selectedSpecialties.length > 0 && (
                <span style={{ fontSize: 11, color: gold, background: goldDim, borderRadius: 999, padding: "2px 10px" }}>
                  {selectedSpecialties.length} تخصص محدد
                </span>
              )}
            </div>

            {/* Search */}
            <div style={{ position: "relative", marginBottom: 12 }}>
              <input style={{
                ...inputStyle, paddingRight: 28,
                borderBottom: `1px solid ${focusedInput === "spec-search" ? gold : "rgba(255,255,255,0.12)"}`,
              }}
                placeholder="ابحث في التخصصات..." value={specialtySearch}
                onChange={e => setSpecialtySearch(e.target.value)}
                onFocus={() => setFocusedInput("spec-search")} onBlur={() => setFocusedInput(null)} />
              <Search size={13} color="#374151" style={{ position: "absolute", top: "50%", right: 0, transform: "translateY(-50%)" }} />
            </div>

            {/* Selected tags */}
            {selectedSpecialties.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                {selectedSpecialties.map(s => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 5, background: goldDim, border: `1px solid ${goldBorder}`, borderRadius: 999, padding: "4px 12px", fontSize: 12, color: gold }}>
                    {s}
                    <button type="button" onClick={() => toggleSpecialty(s)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: gold, display: "flex" }}>
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Accordion groups */}
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {filteredGroups.map((group, gi) => {
                const isOpen = expandedGroups.includes(gi);
                const selectedInGroup = group.items.filter(it => selectedSpecialties.includes(it)).length;
                const GroupIcon = group.icon;
                const isLast = gi === filteredGroups.length - 1;
                return (
                  <div key={group.label} style={{ borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)" }}>
                    <button type="button" onClick={() => toggleGroup(gi)} style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "12px 0",
                      background: "none", border: "none", cursor: "pointer",
                      fontFamily: "Cairo, sans-serif", color: "#9ca3af", textAlign: "right",
                    }}>
                      <GroupIcon size={13} color={isOpen ? gold : "#4b5563"} />
                      <span style={{ flex: 1, fontSize: 13, fontWeight: isOpen ? 700 : 500, color: isOpen ? "#fff" : "#6b7280" }}>{group.label}</span>
                      <span style={{ fontSize: 11, color: "#374151" }}>{group.items.length} تخصص</span>
                      {selectedInGroup > 0 && (
                        <span style={{ fontSize: 11, background: goldDim, color: gold, borderRadius: 999, padding: "1px 8px", marginLeft: 4 }}>{selectedInGroup}</span>
                      )}
                      <ChevronDown size={13} color="#374151" style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
                    </button>
                    {isOpen && (
                      <div style={{ paddingBottom: 16, display: "flex", flexWrap: "wrap", gap: 7 }}>
                        {group.items.map(item => {
                          const checked = selectedSpecialties.includes(item);
                          return (
                            <button key={item} type="button" onClick={() => toggleSpecialty(item)} style={{
                              padding: "5px 14px", borderRadius: 999,
                              border: `1px solid ${checked ? goldBorder : "rgba(255,255,255,0.07)"}`,
                              background: checked ? goldDim : "transparent",
                              color: checked ? gold : "#6b7280", fontSize: 12,
                              fontFamily: "Cairo, sans-serif", cursor: "pointer",
                              display: "flex", alignItems: "center", gap: 6, transition: "all .15s",
                            }}>
                              {checked && <CheckCircle2 size={10} color={gold} />}
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {errors.specialties && <p style={{ fontSize: 11, color: "#f87171", marginTop: 8 }}>{errors.specialties}</p>}
          </div>

          {/* Work Types */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>مجالات العمل</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingTop: 8 }}>
              {WORK_TYPES.map(w => {
                const sel = selectedWorkTypes.includes(w);
                return (
                  <button key={w} type="button" onClick={() => toggleWorkType(w)} style={{
                    padding: "6px 20px", borderRadius: 999,
                    border: `1px solid ${sel ? goldBorder : "rgba(255,255,255,0.07)"}`,
                    background: sel ? goldDim : "transparent",
                    color: sel ? gold : "#4b5563", fontSize: 13,
                    fontFamily: "Cairo, sans-serif", cursor: "pointer",
                    fontWeight: sel ? 600 : 400, transition: "all .15s",
                  }}>{w}</button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <LineField label="سنوات الخبرة" required error={errors.experience}>
                <div style={{ position: "relative" }}>
                  <select style={{ ...getFocusedStyle("exp"), appearance: "none", cursor: "pointer", paddingLeft: 24 }}
                    value={experience} onChange={e => setExperience(e.target.value)}
                    onFocus={() => setFocusedInput("exp")} onBlur={() => setFocusedInput(null)}>
                    <option value="">اختر</option>
                    {EXPERIENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={13} color="#374151" style={{ position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)", pointerEvents: "none" }} />
                </div>
              </LineField>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <LineField label="نبذة مهنية">
                <textarea style={{ ...getFocusedStyle("bio"), minHeight: 88, resize: "vertical", lineHeight: 1.65 }}
                  value={bio} onChange={e => setBio(e.target.value)}
                  onFocus={() => setFocusedInput("bio")} onBlur={() => setFocusedInput(null)}
                  placeholder="اكتب نبذة مختصرة عن تجربتك المهنية..." />
              </LineField>
            </div>
            <LineField label="المؤهل التعليمي">
              <input style={getFocusedStyle("edu")} value={education} onChange={e => setEducation(e.target.value)}
                onFocus={() => setFocusedInput("edu")} onBlur={() => setFocusedInput(null)}
                placeholder="بكالوريوس فنون مسرحية..." />
            </LineField>
            <LineField label="روابط الأعمال">
              <input style={getFocusedStyle("portfolio")} value={portfolioLinks} onChange={e => setPortfolioLinks(e.target.value)}
                onFocus={() => setFocusedInput("portfolio")} onBlur={() => setFocusedInput(null)}
                placeholder="يوتيوب، IMDb، Vimeo..." />
            </LineField>
            <div style={{ gridColumn: "1 / -1" }}>
              <LineField label="أبرز الأعمال">
                <textarea style={{ ...getFocusedStyle("works"), minHeight: 72, resize: "vertical", lineHeight: 1.65 }}
                  value={works} onChange={e => setWorks(e.target.value)}
                  onFocus={() => setFocusedInput("works")} onBlur={() => setFocusedInput(null)}
                  placeholder="مثال: مسرحية «اسم العمل» 2023، فيلم «اسم الفيلم» 2022..." />
              </LineField>
            </div>
          </div>
        </SectionBlock>

        <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

        {/* Section 4 */}
        <SectionBlock number="04" title="المهارات" icon={Languages}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 32px" }}>
            <LineField label="اللغات">
              <input style={getFocusedStyle("lang")} value={languages} onChange={e => setLanguages(e.target.value)}
                onFocus={() => setFocusedInput("lang")} onBlur={() => setFocusedInput(null)}
                placeholder="عربي، إنجليزي، فرنسي..." />
            </LineField>
            <LineField label="اللهجات العربية">
              <input style={getFocusedStyle("dial")} value={dialects} onChange={e => setDialects(e.target.value)}
                onFocus={() => setFocusedInput("dial")} onBlur={() => setFocusedInput(null)}
                placeholder="خليجي، مصري، شامي..." />
            </LineField>
          </div>
        </SectionBlock>

        <div style={{ height: 1, background: "rgba(255,255,255,0.05)" }} />

        {/* Section 5: Legal */}
        <SectionBlock number="05" title="الموافقة والشروط" icon={Shield}>
          <p style={{ color: "#4b5563", fontSize: 13, lineHeight: 1.8, marginBottom: 20 }}>
            بتقديم هذا الطلب، تؤكد أن جميع المعلومات المقدمة صحيحة ودقيقة، وتوافق على{" "}
            <span style={{ color: gold, cursor: "pointer", borderBottom: `1px solid ${goldBorder}` }}>شروط الاستخدام</span>{" "}
            و<span style={{ color: gold, cursor: "pointer", borderBottom: `1px solid ${goldBorder}` }}>سياسة الخصوصية</span>{" "}
            لمنصة كواليس. يحق للمنصة مراجعة ملفك والتحقق منه قبل النشر.
          </p>
          <button type="button" onClick={() => setTermsAccepted(p => !p)} style={{
            display: "flex", alignItems: "flex-start", gap: 12, background: "none",
            border: "none", cursor: "pointer", padding: 0, textAlign: "right", fontFamily: "Cairo, sans-serif",
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: 4,
              border: `1.5px solid ${termsAccepted ? gold : "rgba(255,255,255,0.15)"}`,
              background: termsAccepted ? gold : "transparent", flexShrink: 0, marginTop: 2,
              display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s",
            }}>
              {termsAccepted && <CheckCircle2 size={10} color="#0a0a0a" />}
            </div>
            <span style={{ fontSize: 13, color: termsAccepted ? "#d1d5db" : "#6b7280", lineHeight: 1.6 }}>
              أوافق على شروط الاستخدام وسياسة الخصوصية وأؤكد صحة المعلومات المُدخلة
            </span>
          </button>
          {errors.terms && <p style={{ fontSize: 11, color: "#f87171", marginTop: 8 }}>{errors.terms}</p>}
        </SectionBlock>

        {/* Submit */}
        <div style={{ marginTop: 12 }}>
          <div style={{ height: 1, background: `linear-gradient(to left, transparent, ${gold}44, transparent)`, marginBottom: 28 }} />
          <p style={{ fontSize: 12, color: "#374151", marginBottom: 18, textAlign: "center" }}>
            سيتم مراجعة ملفك من قِبَل فريقنا خلال 3–5 أيام عمل وستصلك النتيجة عبر بريدك الإلكتروني.
          </p>
          <button type="button" style={{
            width: "100%", padding: "15px 0", borderRadius: 12,
            background: `linear-gradient(135deg, ${gold} 0%, #b8922e 100%)`,
            border: "none", color: "#0a0a0a", fontSize: 16, fontWeight: 800,
            fontFamily: "Cairo, sans-serif", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            letterSpacing: "0.01em",
            boxShadow: `0 8px 32px rgba(201,168,76,0.2), 0 2px 8px rgba(0,0,0,0.4)`,
          }}>
            <Send size={16} />إرسال طلب الانضمام
          </button>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "32px 0 0", marginTop: 32 }}>
          <span style={{ color: gold, fontWeight: 800, fontSize: 16 }}>كواليس</span>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 10 }}>
            {["الرئيسية","الفنانون","اتصل بنا"].map(t => (
              <span key={t} style={{ fontSize: 12, color: "#374151", cursor: "pointer" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
