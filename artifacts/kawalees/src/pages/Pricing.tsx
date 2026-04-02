import { useState } from "react";
import { Link } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import {
  Check, Crown, Zap, Star, Users, Building2,
  ChevronLeft, X, ChevronDown, ChevronUp
} from "lucide-react";

const artistComparison = [
  { feature: "التقديم على المشاريع", free: "3 مشاريع", pro: "غير محدود", elite: "غير محدود" },
  { feature: "ظهور في الدليل", free: true, pro: true, elite: true },
  { feature: "أولوية في نتائج البحث", free: false, pro: true, elite: true },
  { feature: "ظهور في قسم المميزين", free: false, pro: false, elite: true },
  { feature: "شارة على الملف الشخصي", free: false, pro: "Pro", elite: "Elite" },
  { feature: "استقبال عروض التواصل", free: true, pro: true, elite: true },
  { feature: "دعم ذو أولوية", free: false, pro: true, elite: true },
];

type Tab = "artist" | "company" | "group";

const artistPlans = [
  {
    key: "free",
    name: "المجانية",
    nameEn: "Free",
    price: "مجانًا",
    period: "للسنة الأولى",
    description: "ابدأ رحلتك في عالم الكاستنج",
    icon: Star,
    featured: false,
    color: "text-gray-300",
    borderClass: "border-white/10",
    bgClass: "bg-white/3",
    features: [
      "التقديم على 3 مشاريع كحد أقصى",
      "قائمة في دليل الفنانين",
      "بروفايل أساسي",
      "استقبال عروض التواصل",
    ],
    missing: [
      "التقديم غير المحدود على المشاريع",
      "بروفايل مميز في نتائج البحث",
      "شارة Pro أو Elite",
    ],
    cta: "ابدأ مجانًا",
    ctaHref: "/register",
  },
  {
    key: "pro",
    name: "Pro",
    nameEn: "Pro",
    price: "99",
    period: "ريال / سنة",
    description: "للفنانين الجادين في تطوير مسيرتهم",
    icon: Zap,
    featured: false,
    color: "text-blue-400",
    borderClass: "border-blue-400/30",
    bgClass: "bg-blue-400/5",
    features: [
      "تقديم غير محدود على المشاريع",
      "قائمة مميزة في الدليل",
      "شارة Pro على بروفايلك",
      "استقبال عروض التواصل",
      "أولوية في نتائج البحث",
    ],
    missing: [],
    cta: "اشترك في Pro",
    ctaHref: "/register",
  },
  {
    key: "elite",
    name: "Elite",
    nameEn: "Elite",
    price: "249",
    period: "ريال / سنة",
    description: "للنجوم الذين يريدون الحضور الأقوى",
    icon: Crown,
    featured: true,
    color: "text-primary",
    borderClass: "border-primary/40",
    bgClass: "bg-primary/5",
    features: [
      "كل مميزات Pro",
      "شارة Elite الذهبية",
      "أعلى أولوية في البحث",
      "ظهور في قسم الفنانين المميزين",
      "دعم متقدم",
    ],
    missing: [],
    cta: "اشترك في Elite",
    ctaHref: "/register",
  },
];

const companyPlans = [
  {
    key: "basic",
    name: "الأساسية",
    price: "499",
    period: "ريال / سنة",
    description: "للجهات الإنتاجية الناشئة",
    icon: Building2,
    featured: false,
    color: "text-gray-300",
    borderClass: "border-white/10",
    bgClass: "bg-white/3",
    features: [
      "نشر حتى 3 مشاريع كاستنج",
      "عرض المتقدمين على كل مشروع",
      "بروفايل الجهة الإنتاجية",
      "إشعارات بالطلبات الجديدة",
    ],
    missing: [
      "نشر مشاريع غير محدودة",
      "نشر مشاريع مميزة (Featured)",
      "دعم متقدم",
    ],
    cta: "ابدأ بالأساسية",
    ctaHref: "/register",
  },
  {
    key: "pro",
    name: "Pro",
    price: "999",
    period: "ريال / سنة",
    description: "للشركات الإنتاجية النشطة",
    icon: Zap,
    featured: true,
    color: "text-primary",
    borderClass: "border-primary/40",
    bgClass: "bg-primary/5",
    features: [
      "نشر حتى 10 مشاريع كاستنج",
      "نشر مشروع مميز (Featured) واحد",
      "عرض المتقدمين مع بياناتهم كاملة",
      "فلترة متقدمة للمتقدمين",
      "أولوية في ظهور المشاريع",
    ],
    missing: [
      "مشاريع غير محدودة",
    ],
    cta: "اشترك في Pro",
    ctaHref: "/register",
  },
  {
    key: "premium",
    name: "Premium",
    price: "1,999",
    period: "ريال / سنة",
    description: "للمنتجين الكبار وشركات الإنتاج",
    icon: Crown,
    featured: false,
    color: "text-blue-400",
    borderClass: "border-blue-400/30",
    bgClass: "bg-blue-400/5",
    features: [
      "مشاريع كاستنج غير محدودة",
      "مشاريع مميزة (Featured) غير محدودة",
      "وصول كامل لدليل الفنانين",
      "فلترة متقدمة ومفصّلة",
      "مدير حساب مخصص",
      "دعم على مدار الساعة",
    ],
    missing: [],
    cta: "تواصل معنا",
    ctaHref: "/contact",
  },
];

const groupPlans = [
  {
    key: "theatre_basic",
    name: "الفرق الأساسية",
    price: "999",
    period: "ريال / سنة",
    description: "للفرق المسرحية والفنية الناشئة",
    icon: Users,
    featured: false,
    color: "text-gray-300",
    borderClass: "border-white/10",
    bgClass: "bg-white/3",
    features: [
      "بروفايل الفرقة مع اسمها وشعارها",
      "نشر حتى 3 مشاريع كاستنج",
      "إدارة أعضاء الفرقة في الدليل",
      "استقبال طلبات الانضمام",
    ],
    missing: [
      "مشاريع غير محدودة",
      "شارة الفرقة المميزة",
      "أولوية في الظهور",
    ],
    cta: "سجّل فرقتك",
    ctaHref: "/register",
  },
  {
    key: "theatre_pro",
    name: "الفرق المتقدمة",
    price: "1,999",
    period: "ريال / سنة",
    description: "للفرق المسرحية الاحترافية",
    icon: Crown,
    featured: true,
    color: "text-primary",
    borderClass: "border-primary/40",
    bgClass: "bg-primary/5",
    features: [
      "كل مميزات الباقة الأساسية",
      "مشاريع كاستنج غير محدودة",
      "شارة الفرقة المميزة الذهبية",
      "أولوية في ظهور مشاريع الفرقة",
      "قسم مخصص للفرق المميزة في الموقع",
      "دعم متقدم",
    ],
    missing: [],
    cta: "اشترك الآن",
    ctaHref: "/register",
  },
];

const tabs: { key: Tab; label: string; icon: typeof Star }[] = [
  { key: "artist", label: "فنانون", icon: Star },
  { key: "company", label: "شركات إنتاج", icon: Building2 },
  { key: "group", label: "فرق مسرحية", icon: Users },
];

function PlanCard({ plan }: { plan: typeof artistPlans[0] }) {
  const Icon = plan.icon;
  return (
    <div
      className={`relative rounded-2xl border p-6 flex flex-col transition-all ${plan.bgClass} ${plan.borderClass} ${plan.featured ? "ring-1 ring-primary/30" : ""}`}
    >
      {plan.featured && (
        <div className="absolute -top-3.5 right-1/2 translate-x-1/2">
          <span className="bg-primary text-background text-xs font-bold px-4 py-1 rounded-full">
            الأكثر اختيارًا
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10`}>
          <Icon className={plan.color} size={20} />
        </div>
        <div>
          <h3 className={`font-display text-lg font-bold ${plan.color}`}>{plan.name}</h3>
          <p className="text-xs text-gray-500">{plan.description}</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          {plan.price === "مجانًا" ? (
            <span className="font-display text-3xl font-bold text-white">{plan.price}</span>
          ) : (
            <>
              <span className="font-display text-3xl font-bold text-white">{plan.price}</span>
              <span className="text-gray-400 text-sm">{plan.period}</span>
            </>
          )}
        </div>
        {plan.price === "مجانًا" && (
          <p className="text-gray-400 text-sm mt-0.5">{plan.period}</p>
        )}
      </div>

      <ul className="space-y-2.5 mb-6 flex-1">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-gray-200">
            <Check size={15} className="text-primary flex-shrink-0 mt-0.5" />
            {f}
          </li>
        ))}
        {plan.missing?.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
            <span className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 flex items-center justify-center">
              <span className="w-1.5 h-0.5 bg-gray-700 rounded-full block" />
            </span>
            {f}
          </li>
        ))}
      </ul>

      <Link
        href={plan.ctaHref}
        data-testid={`link-plan-${plan.key}`}
        className={`w-full text-center py-3 rounded-xl text-sm font-medium transition-all ${
          plan.featured
            ? "bg-primary text-background hover:bg-primary/90"
            : "border border-white/20 text-gray-200 hover:border-white/40 hover:bg-white/5"
        }`}
      >
        {plan.cta}
      </Link>
    </div>
  );
}

function ComparisonCell({ value }: { value: boolean | string }) {
  if (value === true) return <Check size={16} className="text-primary mx-auto" />;
  if (value === false) return <X size={14} className="text-gray-700 mx-auto" />;
  return <span className="text-primary text-xs font-bold">{value}</span>;
}

function ArtistComparisonTable() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 mx-auto text-sm text-gray-400 hover:text-white transition-colors mb-4"
      >
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {open ? "إخفاء" : "عرض"} جدول مقارنة الباقات
      </button>
      {open && (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-right py-3 px-4 text-gray-400 font-medium w-1/2">الميزة</th>
                <th className="text-center py-3 px-4 text-gray-300 font-medium">المجانية</th>
                <th className="text-center py-3 px-4 text-blue-400 font-bold">Pro</th>
                <th className="text-center py-3 px-4 text-primary font-bold">Elite</th>
              </tr>
            </thead>
            <tbody>
              {artistComparison.map((row, i) => (
                <tr
                  key={row.feature}
                  className={`border-b border-white/5 ${i % 2 === 0 ? "bg-white/2" : ""}`}
                >
                  <td className="py-3 px-4 text-gray-300">{row.feature}</td>
                  <td className="py-3 px-4 text-center"><ComparisonCell value={row.free} /></td>
                  <td className="py-3 px-4 text-center"><ComparisonCell value={row.pro} /></td>
                  <td className="py-3 px-4 text-center"><ComparisonCell value={row.elite} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function Pricing() {
  const [activeTab, setActiveTab] = useState<Tab>("artist");
  const { user } = useAuth();

  const plans =
    activeTab === "artist" ? artistPlans : activeTab === "company" ? companyPlans : groupPlans;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-5">
            <Crown className="text-primary" size={14} />
            <span className="text-primary text-xs font-medium">باقات كواليس</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-4 leading-tight">
            اختر الباقة المناسبة
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            انضم لمنصة كواليس وابدأ رحلتك في عالم الفنون والكاستنج الاحترافي
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-white/5 border border-white/10 rounded-2xl p-1.5 gap-1">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                data-testid={`tab-pricing-${key}`}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === key
                    ? "bg-primary text-background shadow-sm"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Plans grid */}
        <div className={`grid gap-6 ${plans.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2 max-w-2xl mx-auto"}`}>
          {plans.map((plan) => (
            <PlanCard key={plan.key} plan={plan as typeof artistPlans[0]} />
          ))}
        </div>

        {/* Comparison table (artist only) */}
        {activeTab === "artist" && <ArtistComparisonTable />}

        {/* FAQ note */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white/3 border border-white/8 rounded-2xl px-8 py-6 text-sm text-gray-400 max-w-lg">
            <p className="mb-2">
              <span className="text-white font-medium">ملاحظة:</span> جميع الباقات تشمل سنة كاملة من الاشتراك.
              يمكن الترقية في أي وقت.
            </p>
            <p>
              للاستفسار عن الباقات المؤسسية أو العروض الخاصة،{" "}
              <Link href="/contact" className="text-primary hover:underline">
                تواصل معنا
              </Link>
            </p>
          </div>
        </div>

        {/* Dashboard shortcut */}
        {user && (
          <div className="mt-8 text-center">
            <Link
              href={user.type === "artist" ? "/dashboard/artist" : "/dashboard/company"}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              <ChevronLeft size={14} />
              العودة إلى لوحة التحكم
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
