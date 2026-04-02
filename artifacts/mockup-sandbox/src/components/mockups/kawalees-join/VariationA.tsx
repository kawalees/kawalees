import { useState } from "react";
import {
  User, Phone, MapPin, Briefcase, GraduationCap, Film,
  CheckCircle2, Send, Lock, Shield, ImageIcon,
  Languages, Calendar, Users, Theater, AlertCircle,
  Music, Pen, Clapperboard, Sparkles, Search, ChevronDown, X
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

const STEPS = ["الأساسيات", "التواصل", "الفني", "المهارات", "التأكيد"];

const gold = "#c9a84c";
const goldDim = "rgba(201,168,76,0.12)";
const goldBorder = "rgba(201,168,76,0.22)";

const inputStyle: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12, padding: "11px 14px", color: "#fff", fontSize: 14,
  outline: "none", fontFamily: "Cairo, sans-serif", boxSizing: "border-box",
  transition: "border-color .15s",
};

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 13, fontWeight: 500, color: "#9ca3af", marginBottom: 6,
};

function SectionCard({ title, icon: Icon, children, number }: { title: string; icon: any; children: React.ReactNode; number: number }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "24px 28px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: goldDim, border: `1px solid ${goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={16} color={gold} />
        </div>
        <span style={{ fontFamily: "Cairo, sans-serif", fontWeight: 700, fontSize: 16, color: "#fff" }}>{title}</span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)", marginRight: 4 }} />
        <span style={{ fontFamily: "Cairo, sans-serif", fontSize: 12, color: "rgba(201,168,76,0.5)", fontWeight: 700 }}>0{number}</span>
      </div>
      {children}
    </div>
  );
}

function Field({ label, required, children, error, note }: { label: string; required?: boolean; children: React.ReactNode; error?: string; note?: string }) {
  return (
    <div>
      <label style={labelStyle}>{label} {required && <span style={{ color: "#f87171" }}>*</span>}</label>
      {children}
      {note && <p style={{ fontSize: 11, color: "#4b5563", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}><Lock size={10} color="#4b5563" />{note}</p>}
      {error && <p style={{ fontSize: 11, color: "#f87171", marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}><AlertCircle size={11} />{error}</p>}
    </div>
  );
}

export function VariationA() {
  const [activeStep] = useState(0);
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
  const [expandedGroups, setExpandedGroups] = useState<number[]>([0]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors] = useState<Record<string, string>>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

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

  const getFocusedStyle = (name: string): React.CSSProperties =>
    focusedInput === name ? { ...inputStyle, borderColor: `${gold}88`, boxShadow: `0 0 0 3px ${gold}18` } : inputStyle;

  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: "#0d0d0d", fontFamily: "Cairo, sans-serif", paddingBottom: 80 }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px" }}>

        {/* Top Nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ fontFamily: "Cairo, sans-serif", fontWeight: 800, fontSize: 20, color: gold }}>كواليس</span>
          <div style={{ display: "flex", gap: 20 }}>
            {["الرئيسية","الفنانون","انضم"].map((t, i) => (
              <span key={t} style={{ fontSize: 13, color: i === 2 ? gold : "#6b7280", cursor: "pointer" }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Hero */}
        <div style={{ textAlign: "center", padding: "40px 0 32px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: goldDim, border: `1px solid ${goldBorder}`, borderRadius: 999, padding: "5px 14px", fontSize: 12, color: gold, marginBottom: 16 }}>
            <Theater size={12} color={gold} />سجّل ملفك المهني
          </div>
          <h1 style={{ fontFamily: "Cairo, sans-serif", fontWeight: 800, fontSize: 38, color: "#fff", margin: "0 0 10px" }}>
            انضم إلى <span style={{ color: gold }}>كواليس</span>
          </h1>
          <p style={{ color: "#6b7280", fontSize: 14, maxWidth: 420, margin: "0 auto", lineHeight: 1.7 }}>
            دليل المواهب الاحترافية للمسرح، السينما، والتلفزيون في العالم العربي.
          </p>
        </div>

        {/* Step Indicator */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 32, position: "relative" }}>
          {STEPS.map((step, i) => (
            <div key={step} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative", zIndex: 1 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: i === activeStep ? gold : i < activeStep ? goldDim : "rgba(255,255,255,0.04)",
                  border: `1.5px solid ${i <= activeStep ? gold : "rgba(255,255,255,0.1)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700,
                  color: i === activeStep ? "#0d0d0d" : i < activeStep ? gold : "#4b5563",
                  transition: "all .2s",
                }}>
                  {i < activeStep ? <CheckCircle2 size={14} /> : i + 1}
                </div>
                <span style={{ fontSize: 11, color: i <= activeStep ? gold : "#4b5563", whiteSpace: "nowrap", fontWeight: i === activeStep ? 700 : 400 }}>{step}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width: 48, height: 1, background: i < activeStep ? gold : "rgba(255,255,255,0.08)", margin: "0 4px", marginBottom: 22, flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>

        {/* Privacy Banner */}
        <div style={{ display: "flex", gap: 12, background: goldDim, border: `1px solid ${goldBorder}`, borderRadius: 14, padding: "12px 16px", marginBottom: 28 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Shield size={14} color={gold} />
          </div>
          <div>
            <p style={{ color: gold, fontWeight: 600, fontSize: 13, margin: "0 0 3px" }}>خصوصيتك تهمنا</p>
            <p style={{ color: "#6b7280", fontSize: 12, margin: 0, lineHeight: 1.6 }}>
              جميع البيانات الشخصية محفوظة بشكل آمن ولن تُعرض في ملفك العام، وتُستخدم فقط لإدارة طلبات التواصل عبر منصة كواليس.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Section 1: Basic */}
          <SectionCard title="المعلومات الأساسية" icon={User} number={1}>
            {/* Avatar Upload */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                border: `2px dashed rgba(255,255,255,0.12)`,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0, background: "rgba(255,255,255,0.02)",
              }}>
                <ImageIcon size={22} color="#4b5563" />
                <span style={{ fontSize: 10, color: "#4b5563", marginTop: 4 }}>صورة</span>
              </div>
              <div>
                <p style={{ color: "#9ca3af", fontSize: 13, margin: "0 0 6px", fontWeight: 500 }}>الصورة الشخصية <span style={{ color: "#f87171" }}>*</span></p>
                <button style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "6px 14px", color: "#9ca3af", fontSize: 12, cursor: "pointer", fontFamily: "Cairo, sans-serif" }}>
                  رفع صورة
                </button>
                <p style={{ color: "#374151", fontSize: 11, marginTop: 5 }}>JPG، PNG، WebP — حد أقصى 5MB</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="الاسم الكامل" required error={errors.name}>
                  <input style={getFocusedStyle("name")} value={name} onChange={e => setName(e.target.value)}
                    onFocus={() => setFocusedInput("name")} onBlur={() => setFocusedInput(null)}
                    placeholder="مثال: اسم الفنان" />
                </Field>
              </div>
              <Field label="دولة الإقامة" required error={errors.country}>
                <div style={{ position: "relative" }}>
                  <input style={{ ...getFocusedStyle("country"), paddingRight: 36 }} value={country} onChange={e => setCountry(e.target.value)}
                    onFocus={() => setFocusedInput("country")} onBlur={() => setFocusedInput(null)}
                    placeholder="مثال: قطر" />
                  <MapPin size={14} color="#4b5563" style={{ position: "absolute", top: "50%", right: 12, transform: "translateY(-50%)" }} />
                </div>
              </Field>
              <Field label="المدينة">
                <input style={getFocusedStyle("city")} value={city} onChange={e => setCity(e.target.value)}
                  onFocus={() => setFocusedInput("city")} onBlur={() => setFocusedInput(null)}
                  placeholder="مثال: الدوحة" />
              </Field>
              <Field label="تاريخ الميلاد" required error={errors.dateOfBirth} note="يُستخدم فقط لحساب الفئة العمرية التقريبية">
                <div style={{ position: "relative" }}>
                  <input type="date" style={{ ...getFocusedStyle("dob"), colorScheme: "dark", paddingRight: 36 }}
                    value={dob} onChange={e => setDob(e.target.value)}
                    onFocus={() => setFocusedInput("dob")} onBlur={() => setFocusedInput(null)} />
                  <Calendar size={14} color="#4b5563" style={{ position: "absolute", top: "50%", right: 12, transform: "translateY(-50%)" }} />
                </div>
                {ageRange && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: goldDim, border: `1px solid ${goldBorder}`, borderRadius: 999, padding: "2px 10px", fontSize: 11, color: gold, marginTop: 6 }}>
                    <CheckCircle2 size={10} color={gold} />الفئة العمرية: {ageRange} سنة
                  </div>
                )}
              </Field>
              <div>
                <label style={labelStyle}>الجنس <span style={{ color: "#f87171" }}>*</span></label>
                <div style={{ display: "flex", gap: 10 }}>
                  {["ذكر", "أنثى"].map(g => (
                    <button key={g} type="button" onClick={() => setGender(g)} style={{
                      flex: 1, padding: "10px 0", borderRadius: 10, border: `1px solid ${gender === g ? goldBorder : "rgba(255,255,255,0.08)"}`,
                      background: gender === g ? goldDim : "rgba(255,255,255,0.02)",
                      color: gender === g ? gold : "#6b7280", fontSize: 13, fontFamily: "Cairo, sans-serif",
                      cursor: "pointer", fontWeight: gender === g ? 600 : 400, transition: "all .15s",
                    }}>{g}</button>
                  ))}
                </div>
                {errors.gender && <p style={{ fontSize: 11, color: "#f87171", marginTop: 5 }}>{errors.gender}</p>}
              </div>
            </div>
          </SectionCard>

          {/* Section 2: Contact */}
          <SectionCard title="بيانات التواصل" icon={Phone} number={2}>
            <div style={{ display: "flex", gap: 8, background: "rgba(201,168,76,0.06)", border: `1px solid rgba(201,168,76,0.1)`, borderRadius: 10, padding: "8px 12px", marginBottom: 18 }}>
              <Lock size={12} color={gold} style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.5 }}>بيانات التواصل لن تُعرض لأي مستخدم وتُستخدم فقط لإدارة طلبات التواصل عبر المنصة.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="رقم الهاتف" required error={errors.phone} note="لن يتم عرض رقمك لأي مستخدم">
                <div style={{ position: "relative" }}>
                  <input type="tel" style={{ ...getFocusedStyle("phone"), paddingRight: 36 }} value={phone} onChange={e => setPhone(e.target.value)}
                    onFocus={() => setFocusedInput("phone")} onBlur={() => setFocusedInput(null)}
                    placeholder="+974 5x xxx xxxx" />
                  <Phone size={14} color="#4b5563" style={{ position: "absolute", top: "50%", right: 12, transform: "translateY(-50%)" }} />
                </div>
              </Field>
              <Field label="البريد الإلكتروني" required error={errors.email} note="يُستخدم لإرسال إشعار قبول الطلب">
                <input type="email" style={getFocusedStyle("email")} value={email} onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocusedInput("email")} onBlur={() => setFocusedInput(null)}
                  placeholder="example@email.com" />
              </Field>
            </div>
          </SectionCard>

          {/* Section 3: Professional */}
          <SectionCard title="المعلومات الفنية" icon={Briefcase} number={3}>
            {/* Specialty Search + Selected chips */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <label style={labelStyle}>التخصصات المهنية <span style={{ color: "#f87171" }}>*</span></label>
                {selectedSpecialties.length > 0 && (
                  <span style={{ fontSize: 11, color: gold, background: goldDim, borderRadius: 999, padding: "2px 8px" }}>
                    {selectedSpecialties.length} محدد
                  </span>
                )}
              </div>

              {/* Search */}
              <div style={{ position: "relative", marginBottom: 14 }}>
                <input style={{ ...getFocusedStyle("search"), paddingRight: 36, paddingLeft: 14 }}
                  placeholder="ابحث في التخصصات..." value={specialtySearch}
                  onChange={e => setSpecialtySearch(e.target.value)}
                  onFocus={() => setFocusedInput("search")} onBlur={() => setFocusedInput(null)} />
                <Search size={14} color="#4b5563" style={{ position: "absolute", top: "50%", right: 12, transform: "translateY(-50%)" }} />
              </div>

              {/* Selected chips row */}
              {selectedSpecialties.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14, padding: "10px 12px", background: goldDim, borderRadius: 10, border: `1px solid ${goldBorder}` }}>
                  {selectedSpecialties.map(s => (
                    <div key={s} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(201,168,76,0.18)", borderRadius: 999, padding: "3px 10px", fontSize: 12, color: gold }}>
                      {s}
                      <button type="button" onClick={() => toggleSpecialty(s)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", color: gold }}>
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Groups accordion */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {filteredGroups.map((group, gi) => {
                  const isOpen = expandedGroups.includes(gi);
                  const selectedInGroup = group.items.filter(it => selectedSpecialties.includes(it)).length;
                  const GroupIcon = group.icon;
                  return (
                    <div key={group.label} style={{ border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, overflow: "hidden" }}>
                      <button type="button" onClick={() => toggleGroup(gi)} style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                        background: isOpen ? "rgba(255,255,255,0.03)" : "transparent", border: "none", cursor: "pointer",
                        fontFamily: "Cairo, sans-serif", color: "#d1d5db", textAlign: "right",
                      }}>
                        <GroupIcon size={14} color={gold} />
                        <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{group.label}</span>
                        {selectedInGroup > 0 && (
                          <span style={{ fontSize: 11, background: goldDim, color: gold, borderRadius: 999, padding: "1px 7px" }}>{selectedInGroup}</span>
                        )}
                        <ChevronDown size={13} color="#6b7280" style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
                      </button>
                      {isOpen && (
                        <div style={{ padding: "6px 14px 14px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                          {group.items.map(item => {
                            const checked = selectedSpecialties.includes(item);
                            return (
                              <button key={item} type="button" onClick={() => toggleSpecialty(item)} style={{
                                display: "flex", alignItems: "center", gap: 7, padding: "7px 10px", borderRadius: 10,
                                border: `1px solid ${checked ? goldBorder : "rgba(255,255,255,0.06)"}`,
                                background: checked ? goldDim : "rgba(255,255,255,0.02)",
                                cursor: "pointer", textAlign: "right", fontFamily: "Cairo, sans-serif",
                                fontSize: 12, color: checked ? gold : "#6b7280", transition: "all .15s",
                              }}>
                                <div style={{
                                  width: 14, height: 14, borderRadius: 4, border: `1.5px solid ${checked ? gold : "rgba(255,255,255,0.15)"}`,
                                  background: checked ? gold : "transparent", flexShrink: 0,
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                  {checked && <CheckCircle2 size={8} color="#0d0d0d" />}
                                </div>
                                <span style={{ lineHeight: 1.4 }}>{item}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {errors.specialties && <p style={{ fontSize: 11, color: "#f87171", marginTop: 8, display: "flex", gap: 4 }}><AlertCircle size={11} />{errors.specialties}</p>}
            </div>

            {/* Work Types */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>مجالات العمل</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {WORK_TYPES.map(w => {
                  const sel = selectedWorkTypes.includes(w);
                  return (
                    <button key={w} type="button" onClick={() => toggleWorkType(w)} style={{
                      padding: "7px 18px", borderRadius: 999,
                      border: `1px solid ${sel ? goldBorder : "rgba(255,255,255,0.08)"}`,
                      background: sel ? goldDim : "rgba(255,255,255,0.02)",
                      color: sel ? gold : "#6b7280", fontSize: 13, fontFamily: "Cairo, sans-serif",
                      cursor: "pointer", fontWeight: sel ? 600 : 400, transition: "all .15s",
                    }}>{w}</button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="سنوات الخبرة" required error={errors.experience}>
                  <div style={{ position: "relative" }}>
                    <select style={{ ...getFocusedStyle("exp"), appearance: "none", cursor: "pointer" }}
                      value={experience} onChange={e => setExperience(e.target.value)}
                      onFocus={() => setFocusedInput("exp")} onBlur={() => setFocusedInput(null)}>
                      <option value="">اختر سنوات الخبرة</option>
                      {EXPERIENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={14} color="#4b5563" style={{ position: "absolute", top: "50%", left: 12, transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </Field>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="نبذة مهنية">
                  <textarea style={{ ...getFocusedStyle("bio"), minHeight: 96, resize: "vertical", lineHeight: 1.6 }}
                    value={bio} onChange={e => setBio(e.target.value)}
                    onFocus={() => setFocusedInput("bio")} onBlur={() => setFocusedInput(null)}
                    placeholder="اكتب نبذة مختصرة عن تجربتك المهنية..." />
                </Field>
              </div>
              <Field label="المؤهل التعليمي">
                <input style={getFocusedStyle("edu")} value={education} onChange={e => setEducation(e.target.value)}
                  onFocus={() => setFocusedInput("edu")} onBlur={() => setFocusedInput(null)}
                  placeholder="مثال: بكالوريوس فنون مسرحية" />
              </Field>
              <Field label="روابط الأعمال">
                <input style={getFocusedStyle("portfolio")} value={portfolioLinks} onChange={e => setPortfolioLinks(e.target.value)}
                  onFocus={() => setFocusedInput("portfolio")} onBlur={() => setFocusedInput(null)}
                  placeholder="رابط يوتيوب، IMDb، Vimeo..." />
              </Field>
              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="أبرز الأعمال">
                  <textarea style={{ ...getFocusedStyle("works"), minHeight: 72, resize: "vertical", lineHeight: 1.6 }}
                    value={works} onChange={e => setWorks(e.target.value)}
                    onFocus={() => setFocusedInput("works")} onBlur={() => setFocusedInput(null)}
                    placeholder="مثال: مسرحية «اسم العمل» 2023، فيلم «اسم الفيلم» 2022..." />
                </Field>
              </div>
            </div>
          </SectionCard>

          {/* Section 4: Skills */}
          <SectionCard title="المهارات" icon={Languages} number={4}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="اللغات">
                <input style={getFocusedStyle("lang")} value={languages} onChange={e => setLanguages(e.target.value)}
                  onFocus={() => setFocusedInput("lang")} onBlur={() => setFocusedInput(null)}
                  placeholder="مثال: عربي، إنجليزي، فرنسي" />
              </Field>
              <Field label="اللهجات العربية">
                <input style={getFocusedStyle("dial")} value={dialects} onChange={e => setDialects(e.target.value)}
                  onFocus={() => setFocusedInput("dial")} onBlur={() => setFocusedInput(null)}
                  placeholder="مثال: خليجي، مصري، شامي" />
              </Field>
            </div>
          </SectionCard>

          {/* Section 5: Legal */}
          <SectionCard title="الموافقة والشروط" icon={Shield} number={5}>
            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <p style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.8, margin: 0 }}>
                بتقديم هذا الطلب، تؤكد أن جميع المعلومات المقدمة صحيحة ودقيقة، وتوافق على{" "}
                <span style={{ color: gold, textDecoration: "underline", cursor: "pointer" }}>شروط الاستخدام</span>{" "}
                و<span style={{ color: gold, textDecoration: "underline", cursor: "pointer" }}>سياسة الخصوصية</span>{" "}
                لمنصة كواليس. يحق للمنصة مراجعة ملفك والتحقق منه قبل النشر.
              </p>
            </div>
            <button type="button" onClick={() => setTermsAccepted(p => !p)} style={{
              display: "flex", alignItems: "flex-start", gap: 10, width: "100%",
              background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "right",
              fontFamily: "Cairo, sans-serif",
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${termsAccepted ? gold : "rgba(255,255,255,0.2)"}`,
                background: termsAccepted ? gold : "transparent", flexShrink: 0, marginTop: 1,
                display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s",
              }}>
                {termsAccepted && <CheckCircle2 size={10} color="#0d0d0d" />}
              </div>
              <span style={{ fontSize: 13, color: termsAccepted ? "#d1d5db" : "#6b7280", lineHeight: 1.5 }}>
                أوافق على الشروط وأؤكد صحة المعلومات المُدخلة
              </span>
            </button>
            {errors.terms && <p style={{ fontSize: 11, color: "#f87171", marginTop: 8, display: "flex", gap: 4 }}><AlertCircle size={11} />{errors.terms}</p>}
          </SectionCard>
        </div>

        {/* Submit */}
        <div style={{ marginTop: 28, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#4b5563", marginBottom: 14 }}>
            سيتم مراجعة ملفك من قِبَل فريقنا خلال 3–5 أيام عمل وستصلك النتيجة عبر بريدك الإلكتروني.
          </p>
          <button type="button" style={{
            width: "100%", padding: "14px 0", borderRadius: 14,
            background: `linear-gradient(135deg, ${gold}, #a07830)`,
            border: "none", color: "#0d0d0d", fontSize: 16, fontWeight: 800,
            fontFamily: "Cairo, sans-serif", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            boxShadow: `0 4px 24px rgba(201,168,76,0.25)`,
          }}>
            <Send size={17} />إرسال طلب الانضمام
          </button>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "28px 0 0", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 32 }}>
          <span style={{ color: gold, fontWeight: 800, fontSize: 16, fontFamily: "Cairo, sans-serif" }}>كواليس</span>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 8 }}>
            {["الرئيسية","الفنانون","اتصل بنا"].map(t => (
              <span key={t} style={{ fontSize: 12, color: "#374151", cursor: "pointer" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
