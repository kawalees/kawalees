import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  UserCircle, Clapperboard, Sparkles,
  Building2, Users, ArrowLeft,
  CheckCircle2, Palette, Handshake
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";

const STEPS: Record<string, { icon: typeof UserCircle; title: string; desc: string; href: string; cta: string }[]> = {
  artist: [
    {
      icon: UserCircle,
      title: "أنشئ ملفك الشخصي",
      desc: "أضف صورتك وتخصصاتك وأعمالك لتظهر في الدليل الاحترافي",
      href: "/join",
      cta: "إنشاء الملف الشخصي",
    },
    {
      icon: Clapperboard,
      title: "تصفّح فرص الكاستنج",
      desc: "اكتشف المشاريع المتاحة من شركات إنتاج موثوقة",
      href: "/projects",
      cta: "تصفّح المشاريع",
    },
    {
      icon: Sparkles,
      title: "تقدّم واحترف",
      desc: "أرسل طلبك على المشاريع المناسبة وابنِ مسيرتك",
      href: "/projects",
      cta: "ابدأ التقديم",
    },
  ],
  company: [
    {
      icon: Building2,
      title: "انشر أول مشروع",
      desc: "صف مشروعك واستقبل طلبات الفنانين المناسبين",
      href: "/dashboard/company",
      cta: "نشر مشروع جديد",
    },
    {
      icon: UserCircle,
      title: "تصفّح دليل الفنانين",
      desc: "ابحث عن المواهب المناسبة بحسب التخصص والخبرة",
      href: "/",
      cta: "تصفّح الدليل",
    },
    {
      icon: Handshake,
      title: "تواصل وأبرم الصفقات",
      desc: "راجع المتقدمين واختر المناسبين لمشروعك",
      href: "/dashboard/company",
      cta: "إدارة المشاريع",
    },
  ],
  group: [
    {
      icon: Users,
      title: "أنشئ ملف فرقتك",
      desc: "قدّم فرقتك المسرحية للعالم بمحتوى احترافي",
      href: "/join",
      cta: "إنشاء ملف الفرقة",
    },
    {
      icon: Clapperboard,
      title: "انشر فرص العضوية",
      desc: "أعلن عن أدوار وفرص الانضمام لفرقتك",
      href: "/dashboard/artist",
      cta: "نشر فرصة",
    },
    {
      icon: Sparkles,
      title: "اكتشف المواهب",
      desc: "تصفّح الفنانين وتواصل مع من يناسب رؤيتك",
      href: "/",
      cta: "تصفّح الفنانين",
    },
  ],
};

const TYPE_LABELS: Record<string, { label: string; icon: typeof Palette; color: string }> = {
  artist:  { label: "فنان / مبدع",         icon: Palette,   color: "text-primary" },
  company: { label: "شركة إنتاج",          icon: Building2,  color: "text-blue-400" },
  group:   { label: "فرقة مسرحية",         icon: Users,      color: "text-purple-400" },
};

export default function Onboarding() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  if (!user) {
    navigate("/register");
    return null;
  }

  const userType = user.type as "artist" | "company" | "group";
  const steps = STEPS[userType] ?? STEPS.artist;
  const typeInfo = TYPE_LABELS[userType] ?? TYPE_LABELS.artist;
  const TypeIcon = typeInfo.icon;
  const dashboardPath = userType === "company" ? "/dashboard/company" : "/dashboard/artist";

  return (
    <AppLayout>
      <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16">
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Welcome Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 mb-6"
              >
                <span className="font-display text-4xl text-primary font-bold">
                  {user.name.charAt(0)}
                </span>
              </motion.div>

              <h1 className="font-display text-4xl text-white mb-2">
                أهلًا بك، <span className="text-gradient-gold">{user.name}</span>!
              </h1>

              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mt-2 mb-3">
                <TypeIcon size={13} className={typeInfo.color} />
                <span className="text-gray-300 text-xs">{typeInfo.label}</span>
              </div>

              <p className="text-gray-400 max-w-md mx-auto">
                حسابك جاهز! إليك الخطوات الأولى لتبدأ رحلتك على كواليس
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-4 mb-10">
              {steps.map(({ icon: StepIcon, title, desc, href, cta }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.12 }}
                  className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-primary/30 hover:bg-white/8 transition-all group"
                >
                  {/* Step number */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center relative">
                    <StepIcon className="text-primary" size={18} />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-background border border-primary/30 text-primary text-xs font-bold rounded-full flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white text-sm mb-0.5">{title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                  </div>

                  {/* CTA */}
                  <Link
                    href={href}
                    className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary text-xs font-medium rounded-lg hover:bg-primary hover:text-background transition-all"
                  >
                    {cta}
                    <ArrowLeft size={12} />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Primary CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="text-center"
            >
              <Link
                href={steps[0].href}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-background font-bold rounded-xl hover:bg-primary/90 transition-all shadow-[0_4px_20px_rgba(200,169,106,0.3)] text-base"
              >
                <CheckCircle2 size={18} />
                ابدأ الآن
              </Link>

              <div className="mt-4">
                <Link
                  href={dashboardPath}
                  className="text-gray-500 text-sm hover:text-gray-300 transition-colors"
                >
                  تخطّي — الذهاب للوحة التحكم
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
