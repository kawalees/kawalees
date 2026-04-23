import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Phone, MapPin, Briefcase, GraduationCap, Link2, Film,
  CheckCircle2, Send, ChevronDown, Lock, Shield, ImageIcon,
  Upload, X, Languages, Users, ChevronRight,
  Theater, AlertCircle, Music, Pen, Clapperboard, Sparkles, Search,
  ZoomIn, ZoomOut, RotateCw, Crop, Square, Circle
} from "lucide-react";
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { AppLayout } from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xpwznoel";

// ─── Specialty Groups ──────────────────────────────────────────
const SPECIALTY_GROUPS = [
  {
    label: "الأداء",
    icon: Theater,
    items: [
      "ممثل مسرحي",
      "ممثل سينمائي",
      "ممثل تلفزيوني",
      "ممثل صوت ودبلجة",
      "راقص / فنان رقص معاصر",
      "مؤدي حركي",
      "ممثل كوميدي",
      "مؤدي فنون الشارع",
      "قصاص / راوٍ",
    ],
  },
  {
    label: "الإخراج",
    icon: Clapperboard,
    items: [
      "مخرج مسرحي",
      "مخرج سينمائي",
      "مخرج تلفزيوني",
      "مخرج تنفيذي",
      "مساعد مخرج",
      "مخرج ثانٍ",
    ],
  },
  {
    label: "الكتابة الإبداعية",
    icon: Pen,
    items: [
      "كاتب مسرحي",
      "كاتب سيناريو سينمائي",
      "كاتب سيناريو تلفزيوني",
      "كاتب حوار",
      "دراماتورج",
      "ناقد مسرحي / سينمائي",
      "مطوّر قصة",
    ],
  },
  {
    label: "التصميم الفني",
    icon: Sparkles,
    items: [
      "سينوغراف / مصمم ديكور",
      "مصمم إضاءة",
      "مصمم أزياء",
      "مصمم مكياج مسرحي / سينمائي",
      "مصمم شعر وباروكة",
      "مدير فني (Art Director)",
      "مصمم جرافيك للمسرح والسينما",
    ],
  },
  {
    label: "التصوير السينمائي",
    icon: Film,
    items: [
      "مدير تصوير (DOP)",
      "مصور / كاميرامان",
      "مشغّل كاميرا",
      "مصوّر فوتوغرافي للأعمال",
      "مونتير",
      "فني مؤثرات بصرية (VFX)",
      "فني مؤثرات خاصة (SFX)",
      "فني تلوين وتصحيح ألوان (Colorist)",
    ],
  },
  {
    label: "الصوت والموسيقى",
    icon: Music,
    items: [
      "مؤلف موسيقي",
      "مصمم صوت",
      "مهندس صوت",
      "مهندس صوت ميداني",
      "موسيقي مباشر",
      "منسق موسيقى تصويرية",
    ],
  },
  {
    label: "الإنتاج",
    icon: Users,
    items: [
      "منتج تنفيذي",
      "منتج مسرحي",
      "منتج سينمائي / تلفزيوني",
      "مدير إنتاج",
      "مدير مسرح (Stage Manager)",
      "منسق إنتاج",
      "مساعد إنتاج",
      "مدير توزيع وعروض",
      "مدير استديو",
    ],
  },
  {
    label: "التدريب والأكاديميا",
    icon: GraduationCap,
    items: [
      "مدرب تمثيل",
      "مدرب صوت وإلقاء",
      "مدرب حركة جسدية",
      "مستشار فني",
      "محاضر / أكاديمي في الفنون",
      "مدرب ارتجال مسرحي",
    ],
  },
];

const WORK_TYPES = ["مسرح", "سينما", "تلفزيون", "إعلانات"];

const EXPERIENCE_OPTIONS = [
  "أقل من سنة", "1-3 سنوات", "3-5 سنوات", "5-10 سنوات", "أكثر من 10 سنوات",
];

// ─── Age range from DOB ────────────────────────────────────────
function calcAgeRange(dob: string): string {
  if (!dob) return "";
  const birthYear = new Date(dob).getFullYear();
  const age = new Date().getFullYear() - birthYear;
  if (age < 18) return "أقل من 18";
  const low = Math.floor(age / 5) * 5;
  return `${low}–${low + 4}`;
}

// ─── Crop utilities ───────────────────────────────────────────
type CropArea = { x: number; y: number; width: number; height: number };

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
  });
}

async function getCroppedImg(imageSrc: string, pixelCrop: CropArea, rotation = 0): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const rad = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const bW = image.width * cos + image.height * sin;
  const bH = image.width * sin + image.height * cos;
  canvas.width = bW;
  canvas.height = bH;
  ctx.translate(bW / 2, bH / 2);
  ctx.rotate(rad);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);
  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.putImageData(data, 0, 0);
  return new Promise((resolve, reject) => {
    canvas.toBlob(b => b ? resolve(b) : reject(new Error("Crop failed")), "image/jpeg", 0.92);
  });
}

// ─── Crop Modal Component ─────────────────────────────────────
function ImageCropModal({ src, onConfirm, onCancel }: {
  src: string;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [isRound, setIsRound] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((_: any, pixels: CropArea) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const blob = await getCroppedImg(src, croppedAreaPixels, rotation);
      onConfirm(blob);
    } catch {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-lg bg-[#0e0e0e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <h3 className="font-display text-white font-bold text-base flex items-center gap-2">
            <Crop size={16} className="text-primary" />
            ضبط إطار الصورة
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsRound(r => !r)}
              title={isRound ? "تبديل إلى مربع" : "تبديل إلى دائرة"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-xs transition-colors"
            >
              {isRound ? <Square size={13} /> : <Circle size={13} />}
              <span>{isRound ? "مربع" : "دائرة"}</span>
            </button>
            <button type="button" onClick={onCancel} className="p-1.5 text-gray-600 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Crop canvas */}
        <div className="relative bg-black" style={{ height: 320 }}>
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            cropShape={isRound ? "round" : "rect"}
            showGrid
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Controls */}
        <div className="px-5 pt-4 pb-2 space-y-3">
          {/* Zoom */}
          <div className="flex items-center gap-3">
            <ZoomOut size={15} className="text-gray-500 flex-shrink-0" />
            <input
              type="range" min={1} max={3} step={0.05}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className="flex-1 h-1.5 rounded-full appearance-none bg-white/10 accent-[#C8A96A] cursor-pointer"
              style={{ direction: "ltr" }}
            />
            <ZoomIn size={15} className="text-gray-500 flex-shrink-0" />
            <span className="text-gray-600 text-xs w-8 text-center">{Math.round(zoom * 100)}%</span>
          </div>

          {/* Rotation */}
          <div className="flex items-center gap-3">
            <RotateCw size={15} className="text-gray-500 flex-shrink-0" />
            <input
              type="range" min={-180} max={180} step={1}
              value={rotation}
              onChange={e => setRotation(Number(e.target.value))}
              className="flex-1 h-1.5 rounded-full appearance-none bg-white/10 accent-[#C8A96A] cursor-pointer"
              style={{ direction: "ltr" }}
            />
            <span className="text-gray-600 text-xs w-10 text-center">{rotation}°</span>
            <button
              type="button"
              onClick={() => setRotation(0)}
              className="text-xs text-gray-600 hover:text-primary transition-colors px-1"
            >
              إعادة
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-5 py-4 border-t border-white/8">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-sm transition-colors"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isProcessing}
            className="flex-1 py-2.5 rounded-xl bg-primary text-background font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isProcessing ? "جاري المعالجة..." : "تطبيق الاقتصاص"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Image upload hook ────────────────────────────────────────
function useImageUpload(baseUrl: string) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) { setError("يرجى رفع ملف صورة (JPG، PNG، WebP)"); return; }
    if (file.size > 5 * 1024 * 1024) { setError("حجم الصورة أكبر من 5 ميغابايت"); return; }
    setIsUploading(true); setError(null);
    setPreview(URL.createObjectURL(file));
    try {
      const r = await fetch(`${baseUrl}/api/storage/uploads/request-url`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
      });
      if (!r.ok) throw new Error();
      const { uploadURL, objectPath } = await r.json();
      const put = await fetch(uploadURL, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      if (!put.ok) throw new Error();
      setUploadedUrl(`${window.location.origin}${baseUrl}/api/storage${objectPath}`);
    } catch { setError("فشل رفع الصورة. حاول مرة أخرى."); setPreview(null); }
    finally { setIsUploading(false); }
  };

  const clear = () => { setUploadedUrl(null); setPreview(null); setError(null); };
  return { upload, isUploading, uploadedUrl, preview, error, clear };
}

// ─── Multi-select checkbox ─────────────────────────────────────
function MultiCheck({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all duration-150 text-right w-full ${
        checked
          ? "bg-primary/15 border-primary/40 text-primary"
          : "bg-white/3 border-white/8 text-gray-400 hover:border-white/20 hover:text-gray-200"
      }`}
    >
      <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
        checked ? "bg-primary border-primary" : "border-white/20"
      }`}>
        {checked && <CheckCircle2 size={10} className="text-background" />}
      </div>
      <span>{label}</span>
    </button>
  );
}

// ─── Section wrapper ───────────────────────────────────────────
function Section({ title, icon: Icon, children }: {
  title: string; icon: any; children: React.ReactNode
}) {
  return (
    <div className="relative">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
          <Icon size={18} className="text-primary" />
        </div>
        <h3 className="font-display text-lg font-bold text-white">{title}</h3>
        <div className="flex-1 h-px bg-white/5 mr-2" />
      </div>
      {children}
    </div>
  );
}

// ─── Input / Label helpers ─────────────────────────────────────
const inputCls = "w-full bg-zinc-900/80 border border-white/8 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all placeholder-gray-600 font-sans";
const labelCls = "block text-sm font-medium text-gray-400 mb-1.5";
const errCls = "text-red-400 text-xs mt-1 flex items-center gap-1";

function FieldNote({ icon: Icon = Lock, text }: { icon?: any; text: string }) {
  return (
    <p className="flex items-center gap-1.5 text-xs text-gray-600 mt-1.5">
      <Icon size={11} className="text-gray-600 flex-shrink-0" />{text}
    </p>
  );
}

// ═══════════════════════════════════════════════════════════════
export default function JoinAsArtist() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
  const { upload, isUploading, uploadedUrl, preview, error: uploadError, clear: clearImg } = useImageUpload(baseUrl);
  const [cropSrc, setCropSrc] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [education, setEducation] = useState("");
  const [portfolioLinks, setPortfolioLinks] = useState("");
  const [works, setWorks] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [languages, setLanguages] = useState("");
  const [dialects, setDialects] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);
  const [specialtySearch, setSpecialtySearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<number[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const ageRange = calcAgeRange(dateOfBirth);

  const toggleSpecialty = (s: string) =>
    setSelectedSpecialties(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
  const toggleWorkType = (w: string) =>
    setSelectedWorkTypes(p => p.includes(w) ? p.filter(x => x !== w) : [...p, w]);
  const toggleGroup = (i: number) =>
    setExpandedGroups(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "الاسم الكامل مطلوب";
    if (!country.trim()) e.country = "دولة الإقامة مطلوبة";
    if (selectedSpecialties.length === 0) e.specialties = "يرجى اختيار تخصص واحد على الأقل";
    if (!experience) e.experience = "سنوات الخبرة مطلوبة";
    if (!gender) e.gender = "يرجى تحديد الجنس";
    if (!dateOfBirth) e.dateOfBirth = "تاريخ الميلاد مطلوب";
    if (!phone.trim()) e.phone = "رقم الهاتف مطلوب";
    if (phone.trim() && phone.trim().length < 7) e.phone = "رقم الهاتف غير صحيح";
    if (!email.trim()) e.email = "البريد الإلكتروني مطلوب";
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "البريد الإلكتروني غير صحيح";
    if (!termsAccepted) e.terms = "يجب الموافقة على الشروط لإكمال التسجيل";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast({ variant: "destructive", title: "يرجى مراجعة البيانات", description: "تحقق من الحقول المطلوبة" });
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          specialty: selectedSpecialties.join("،"),
          country: country.trim(),
          city: city.trim() || undefined,
          experience,
          bio: bio.trim() || undefined,
          education: education.trim() || undefined,
          imageUrl: uploadedUrl || undefined,
          portfolioLinks: portfolioLinks.trim() || undefined,
          works: works.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim(),
          gender,
          dateOfBirth,
          workTypes: selectedWorkTypes.join("،"),
          languages: languages.trim() || undefined,
          dialects: dialects.trim() || undefined,
        }),
      });
      if (!res.ok) {
        throw new Error("فشل الإرسال");
      }
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "حدث خطأ", description: err.message || "لم نتمكن من إرسال طلبك. يرجى المحاولة مرة أخرى." });
    } finally { setIsSubmitting(false); }
  };

  // ─── Success screen ──────────────────────────────────────────
  if (isSuccess) {
    return (
      <AppLayout>
        <div className="pt-40 pb-24 max-w-2xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-12">
            <div className="w-24 h-24 bg-primary/15 border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} className="text-primary" />
            </div>
            <h2 className="font-display text-3xl font-bold text-white mb-3">تم استلام طلبك</h2>
            <p className="text-gray-400 text-base mb-2 max-w-lg mx-auto leading-relaxed">
              شكراً للانضمام إلى كواليس. سيتم مراجعة ملفك من قِبَل فريقنا خلال 3–5 أيام عمل وسنخبرك بالنتيجة عبر رقم هاتفك.
            </p>
            <p className="text-gray-600 text-sm mb-8">لن تظهر أي بياناتك الشخصية حتى تتم الموافقة ونشر ملفك.</p>
            <button onClick={() => (window.location.href = "/")}
              className="px-8 py-3 bg-white/8 text-white hover:bg-primary hover:text-background font-display font-bold rounded-xl transition-colors">
              العودة للرئيسية
            </button>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  // ─── Crop confirm handler ─────────────────────────────────────
  const handleCropConfirm = async (blob: Blob) => {
    const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
    setCropSrc(null);
    await upload(file);
  };

  const handleCropCancel = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── Main Form ───────────────────────────────────────────────
  return (
    <AppLayout>
      {/* Crop Modal */}
      <AnimatePresence>
        {cropSrc && (
          <ImageCropModal
            src={cropSrc}
            onConfirm={handleCropConfirm}
            onCancel={handleCropCancel}
          />
        )}
      </AnimatePresence>

      <div className="pt-28 pb-24 max-w-3xl mx-auto px-4 sm:px-6">

        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-5">
            <Theater size={13} />سجّل ملفك المهني
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
            انضم إلى <span className="text-gradient-gold">كواليس</span>
          </h1>
          <p className="text-gray-400 text-base max-w-xl mx-auto leading-relaxed">
            دليل المواهب الاحترافية للمسرح، السينما، والتلفزيون في العالم العربي.
          </p>
        </div>

        {/* Info banner */}
        <div className="mb-4 p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={16} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-primary font-semibold text-sm">انضمامك مجاني تمامًا</p>
            <p className="text-gray-500 text-xs">
              بعد مراجعة طلبك سيُضاف ملفك للدليل خلال 3–5 أيام عمل
            </p>
          </div>
        </div>

        {/* Privacy Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-primary/5 border border-primary/15 flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Shield size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-primary font-display font-semibold text-sm mb-1">خصوصيتك تهمنا</p>
            <p className="text-gray-400 text-xs leading-relaxed">
              جميع البيانات الشخصية محفوظة بشكل آمن ولن تُعرض في ملفك العام، وتُستخدم فقط لإدارة طلبات التواصل عبر منصة كواليس.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-10">

            {/* ── SECTION 1: Basic Info ── */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6 sm:p-8">
              <Section title="المعلومات الأساسية" icon={User}>
                {/* Photo Upload */}
                <div className="mb-6">
                  <label className={labelCls}>الصورة الشخصية <span className="text-red-400">*</span></label>
                  <div className="flex items-start gap-4">
                    {/* Preview / placeholder */}
                    <div
                      onClick={() => !preview && fileInputRef.current?.click()}
                      className={`w-24 h-24 rounded-2xl border-2 border-dashed flex items-center justify-center flex-shrink-0 overflow-hidden cursor-pointer transition-colors ${preview ? "border-primary/30" : "border-white/10 hover:border-primary/30"}`}
                    >
                      {preview
                        ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
                        : <div className="flex flex-col items-center gap-1 text-gray-600"><ImageIcon size={22} /><span className="text-xs">اختر صورة</span></div>
                      }
                    </div>

                    <div className="flex-1 space-y-2">
                      {/* Primary action */}
                      {!preview ? (
                        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-sm transition-colors disabled:opacity-40">
                          <Upload size={15} />{isUploading ? "جاري الرفع..." : "رفع صورة"}
                        </button>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-green-400 text-xs flex items-center gap-1">
                            <CheckCircle2 size={12} />تم الرفع بنجاح
                          </span>
                          {/* Re-crop button */}
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 text-xs transition-colors"
                          >
                            <Crop size={12} />إعادة الاقتصاص
                          </button>
                          {/* Remove button */}
                          <button type="button" onClick={() => { clearImg(); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                            className="p-1 text-gray-600 hover:text-red-400 transition-colors"><X size={13} /></button>
                        </div>
                      )}
                      {uploadError && <p className={errCls}><AlertCircle size={11} />{uploadError}</p>}
                      <p className="text-gray-600 text-xs">صورة واضحة بخلفية بسيطة — JPG، PNG، WebP (حد أقصى 5MB)</p>
                    </div>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      if (!f.type.startsWith("image/")) return;
                      clearImg();
                      const objectUrl = URL.createObjectURL(f);
                      setCropSrc(objectUrl);
                      e.target.value = "";
                    }} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className={labelCls}>الاسم الكامل <span className="text-red-400">*</span></label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputCls}
                      placeholder="مثال: اسم الفنان" />
                    {errors.name && <p className={errCls}><AlertCircle size={11} />{errors.name}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>دولة الإقامة <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <input type="text" value={country} onChange={e => setCountry(e.target.value)} className={`${inputCls} pr-9`}
                        placeholder="مثال: قطر" />
                      <MapPin size={15} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 pointer-events-none" />
                    </div>
                    {errors.country && <p className={errCls}><AlertCircle size={11} />{errors.country}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>المدينة <span className="text-gray-600 text-xs">(اختياري)</span></label>
                    <input type="text" value={city} onChange={e => setCity(e.target.value)} className={inputCls}
                      placeholder="مثال: الدوحة" />
                  </div>
                  <div>
                    <label className={labelCls}>تاريخ الميلاد <span className="text-red-400">*</span></label>
                    <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)}
                      max={new Date(new Date().setFullYear(new Date().getFullYear() - 16)).toISOString().split("T")[0]}
                      className={`${inputCls} [color-scheme:dark]`} />
                    <FieldNote text="يُستخدم فقط لحساب الفئة العمرية التقريبية" />
                    {ageRange && (
                      <p className="mt-2 text-xs text-primary flex items-center gap-1.5">
                        <CheckCircle2 size={11} />الفئة العمرية: <strong>{ageRange} سنة</strong>
                      </p>
                    )}
                    {errors.dateOfBirth && <p className={errCls}><AlertCircle size={11} />{errors.dateOfBirth}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>الجنس <span className="text-red-400">*</span></label>
                    <div className="flex gap-3 mt-1">
                      {["ذكر", "أنثى"].map(g => (
                        <button key={g} type="button" onClick={() => setGender(g)}
                          className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                            gender === g
                              ? "bg-primary/15 border-primary/40 text-primary"
                              : "bg-white/3 border-white/8 text-gray-400 hover:border-white/20"
                          }`}>{g}</button>
                      ))}
                    </div>
                    {errors.gender && <p className={errCls}><AlertCircle size={11} />{errors.gender}</p>}
                  </div>
                </div>
              </Section>
            </div>

            {/* ── SECTION 2: Professional Info ── */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6 sm:p-8">
              <Section title="المعلومات الفنية" icon={Briefcase}>
                {/* Specialties accordion */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <label className={`${labelCls} mb-0`}>
                      التخصصات المهنية <span className="text-red-400">*</span>
                    </label>
                    {selectedSpecialties.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-primary text-xs px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                          {selectedSpecialties.length} تخصص محدد
                        </span>
                        <button type="button" onClick={() => setSelectedSpecialties([])}
                          className="text-xs text-gray-600 hover:text-red-400 transition-colors flex items-center gap-1">
                          <X size={10} />مسح الكل
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Selected chips */}
                  {selectedSpecialties.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
                      {selectedSpecialties.map(s => (
                        <span key={s} className="flex items-center gap-1 pl-1 pr-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs">
                          {s}
                          <button type="button" onClick={() => toggleSpecialty(s)} className="hover:text-white transition-colors">
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Search */}
                  <div className="relative mb-3">
                    <input type="text" value={specialtySearch} onChange={e => setSpecialtySearch(e.target.value)}
                      placeholder="ابحث عن تخصص..." className={`${inputCls} pr-9 py-2 text-sm`} />
                    <Search size={14} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 pointer-events-none" />
                    {specialtySearch && (
                      <button type="button" onClick={() => setSpecialtySearch("")}
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-600 hover:text-white">
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {errors.specialties && <p className={`${errCls} mb-3`}><AlertCircle size={11} />{errors.specialties}</p>}

                  {/* Accordion groups */}
                  <div className="rounded-xl border border-white/7 overflow-hidden divide-y divide-white/5">
                    {SPECIALTY_GROUPS.map((group, gi) => {
                      const filtered = specialtySearch
                        ? group.items.filter(i => i.includes(specialtySearch))
                        : group.items;
                      if (filtered.length === 0) return null;
                      const isOpen = expandedGroups.includes(gi) || !!specialtySearch;
                      const selectedInGroup = filtered.filter(i => selectedSpecialties.includes(i)).length;
                      return (
                        <div key={group.label}>
                          <button type="button" onClick={() => toggleGroup(gi)}
                            className="w-full flex items-center gap-2.5 px-4 py-3 text-right transition-colors hover:bg-white/3">
                            <group.icon size={13} className="text-primary/70 flex-shrink-0" />
                            <span className={`flex-1 text-sm font-semibold ${isOpen ? "text-white" : "text-gray-400"}`}>{group.label}</span>
                            <span className="text-xs text-gray-600">{group.items.length} تخصص</span>
                            {selectedInGroup > 0 && (
                              <span className="text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5">{selectedInGroup}</span>
                            )}
                            <ChevronDown size={13} className={`text-gray-600 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-4 pt-1 flex flex-wrap gap-2 bg-white/[0.015]">
                              {filtered.map(item => {
                                const checked = selectedSpecialties.includes(item);
                                return (
                                  <button key={item} type="button" onClick={() => toggleSpecialty(item)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-all duration-150 ${
                                      checked
                                        ? "bg-primary/12 border-primary/35 text-primary"
                                        : "bg-white/3 border-white/8 text-gray-400 hover:border-white/18 hover:text-gray-200"
                                    }`}>
                                    {checked && <CheckCircle2 size={10} className="text-primary flex-shrink-0" />}
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

                  {specialtySearch && SPECIALTY_GROUPS.every(g => g.items.every(i => !i.includes(specialtySearch))) && (
                    <p className="text-center text-gray-600 text-sm py-4">لا توجد تخصصات مطابقة لـ "{specialtySearch}"</p>
                  )}
                </div>

                {/* Work types */}
                <div className="mb-6">
                  <label className={labelCls}>أنواع الأعمال المفضلة</label>
                  <div className="flex flex-wrap gap-2">
                    {WORK_TYPES.map(w => (
                      <button key={w} type="button" onClick={() => toggleWorkType(w)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                          selectedWorkTypes.includes(w)
                            ? "bg-primary/15 border-primary/40 text-primary"
                            : "bg-white/3 border-white/8 text-gray-400 hover:border-white/20"
                        }`}>{w}</button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>سنوات الخبرة <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <select value={experience} onChange={e => setExperience(e.target.value)}
                        className={`${inputCls} appearance-none pr-9`}>
                        <option value="">-- اختر --</option>
                        {EXPERIENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <ChevronDown size={15} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 pointer-events-none" />
                    </div>
                    {errors.experience && <p className={errCls}><AlertCircle size={11} />{errors.experience}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>المؤهل التعليمي <span className="text-gray-600 text-xs">(اختياري)</span></label>
                    <input type="text" value={education} onChange={e => setEducation(e.target.value)} className={inputCls}
                      placeholder="بكالوريوس فنون — جامعة..." />
                  </div>
                </div>

                <div className="mt-5">
                  <label className={labelCls}>السيرة الفنية <span className="text-gray-600 text-xs">(اختياري)</span></label>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} className={`${inputCls} resize-none`}
                    placeholder="نبذة عن تجربتك الفنية وما تتميز به..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                  <div>
                    <label className={labelCls}>أبرز الأعمال <span className="text-gray-600 text-xs">(اختياري)</span></label>
                    <textarea value={works} onChange={e => setWorks(e.target.value)} rows={3} className={`${inputCls} resize-none`}
                      placeholder="مسرحية ليلة القمر 2024، فيلم المدينة 2023..." />
                  </div>
                  <div>
                    <label className={labelCls}>روابط البورتفوليو <span className="text-gray-600 text-xs">(اختياري)</span></label>
                    <div className="relative">
                      <textarea value={portfolioLinks} onChange={e => setPortfolioLinks(e.target.value)} rows={3}
                        className={`${inputCls} resize-none pr-9`}
                        placeholder="https://youtube.com/...&#10;https://vimeo.com/..." />
                      <Link2 size={14} className="absolute top-3.5 right-3 text-gray-600 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </Section>
            </div>

            {/* ── SECTION 3: Skills ── */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6 sm:p-8">
              <Section title="المهارات" icon={Languages}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>اللغات <span className="text-gray-600 text-xs">(اختياري)</span></label>
                    <input type="text" value={languages} onChange={e => setLanguages(e.target.value)} className={inputCls}
                      placeholder="العربية، الإنجليزية، الفرنسية" />
                  </div>
                  <div>
                    <label className={labelCls}>اللهجات <span className="text-gray-600 text-xs">(اختياري)</span></label>
                    <input type="text" value={dialects} onChange={e => setDialects(e.target.value)} className={inputCls}
                      placeholder="خليجية، مصرية، شامية" />
                  </div>
                </div>
              </Section>
            </div>

            {/* ── SECTION 4: Contact ── */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6 sm:p-8">
              <Section title="بيانات التواصل" icon={Phone}>
                <div className="mb-2 p-3 rounded-xl bg-primary/5 border border-primary/10 text-xs text-gray-500 flex items-center gap-2">
                  <Lock size={12} className="text-primary flex-shrink-0" />
                  بيانات التواصل لن تُعرض لأي مستخدم وتُستخدم فقط لإدارة طلبات التواصل عبر المنصة.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                  <div>
                    <label className={labelCls}>رقم الهاتف <span className="text-red-400">*</span></label>
                    <div className="relative">
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={`${inputCls} pr-9`}
                        placeholder="+974 5x xxx xxxx" />
                      <Phone size={15} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 pointer-events-none" />
                    </div>
                    <FieldNote text="لن يتم عرض رقمك لأي مستخدم" />
                    {errors.phone && <p className={errCls}><AlertCircle size={11} />{errors.phone}</p>}
                  </div>
                  <div>
                    <label className={labelCls}>البريد الإلكتروني <span className="text-red-400">*</span></label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls}
                      placeholder="example@email.com" />
                    <FieldNote text="يُستخدم لإرسال إشعار قبول الطلب" />
                    {errors.email && <p className={errCls}><AlertCircle size={11} />{errors.email}</p>}
                  </div>
                </div>
              </Section>
            </div>

            {/* ── SECTION 5: Legal ── */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6 sm:p-8">
              <Section title="الموافقة والشروط" icon={Shield}>
                {/* Terms accordion */}
                <div className="space-y-3 mb-6">
                  <button type="button" onClick={() => setShowTerms(!showTerms)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/3 border border-white/8 text-sm text-gray-300 hover:border-white/15 transition-colors">
                    <span className="font-display font-medium">شروط الاستخدام</span>
                    <ChevronRight size={16} className={`text-gray-500 transition-transform ${showTerms ? "rotate-90" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {showTerms && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-4 py-4 bg-zinc-900/50 rounded-xl border border-white/5 text-xs text-gray-500 leading-relaxed space-y-2">
                          {["المنصة تعمل كوسيط لعرض الملفات الفنية فقط.",
                            "لا يتم مشاركة بيانات التواصل الشخصية بشكل مباشر.",
                            "المستخدم مسؤول عن صحة البيانات المُدخلة.",
                            "يحق للمنصة رفض أو حذف أي محتوى لا يتوافق مع معاييرها.",
                            "يُمنع استخدام المنصة لأغراض غير قانونية أو مضللة."].map((t, i) => (
                            <p key={i} className="flex gap-2"><span className="text-primary flex-shrink-0">•</span>{t}</p>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button type="button" onClick={() => setShowPrivacy(!showPrivacy)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/3 border border-white/8 text-sm text-gray-300 hover:border-white/15 transition-colors">
                    <span className="font-display font-medium">سياسة الخصوصية</span>
                    <ChevronRight size={16} className={`text-gray-500 transition-transform ${showPrivacy ? "rotate-90" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {showPrivacy && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-4 py-4 bg-zinc-900/50 rounded-xl border border-white/5 text-xs text-gray-500 leading-relaxed space-y-2">
                          {["يتم جمع البيانات لأغراض تشغيل المنصة فقط.",
                            "لا يتم بيع أو مشاركة البيانات مع أطراف خارجية.",
                            "يتم حماية البيانات وفق أفضل الممارسات التقنية المتاحة.",
                            "يمكن للمستخدم طلب تعديل أو حذف بياناته في أي وقت.",
                            "يتم استخدام البيانات بما يتوافق مع قوانين حماية الخصوصية في دولة قطر."].map((t, i) => (
                            <p key={i} className="flex gap-2"><span className="text-primary flex-shrink-0">•</span>{t}</p>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Consent checkbox */}
                <button type="button" onClick={() => setTermsAccepted(!termsAccepted)}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl border text-right transition-all ${
                    termsAccepted
                      ? "bg-primary/8 border-primary/30"
                      : errors.terms ? "bg-red-500/5 border-red-500/20" : "bg-white/3 border-white/10 hover:border-white/20"
                  }`}>
                  <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    termsAccepted ? "bg-primary border-primary" : "border-white/20"
                  }`}>
                    {termsAccepted && <CheckCircle2 size={12} className="text-background" />}
                  </div>
                  <span className="text-sm text-gray-300 leading-relaxed">
                    أوافق على <strong className="text-primary">شروط الاستخدام</strong> و<strong className="text-primary">سياسة الخصوصية</strong>، وأقر بأن جميع المعلومات التي أدخلتها صحيحة ودقيقة.
                  </span>
                </button>
                {errors.terms && <p className={errCls}><AlertCircle size={11} />{errors.terms}</p>}
              </Section>
            </div>

            {/* Pre-submit notice */}
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/8 flex items-start gap-3 text-sm text-gray-500">
              <Lock size={15} className="text-gray-600 flex-shrink-0 mt-0.5" />
              <p>سيتم مراجعة طلبك من قِبَل فريق كواليس قبل نشره. لن يتم عرض أي معلومات شخصية أو وسيلة تواصل مباشرة في الملف العام.</p>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isSubmitting || isUploading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-gold text-background font-display font-bold text-lg rounded-2xl shadow-[0_4px_24px_rgba(200,169,106,0.2)] hover:shadow-[0_8px_32px_rgba(200,169,106,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300">
              {isSubmitting
                ? <span className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                : <><Send size={18} className="rotate-180" />إرسال طلب التسجيل</>
              }
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
