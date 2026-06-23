import { Link } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Building2,
  Check,
  Crown,
  Handshake,
  Palette,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";

const artistPlans = [
  {
    name: "الظهور الأساسي",
    price: "مجاني",
    description: "للأفراد الذين يرغبون في الظهور داخل دليل كواليس بعد المراجعة اليدوية.",
    icon: Star,
    featured: false,
    cta: "قدّم كفنان",
    href: "/join",
    features: [
      "ملف فنان في الدليل بعد الاعتماد",
      "صورة شخصية وروابط أعمال",
      "ظهور في نتائج البحث والفلاتر",
      "استقبال طلبات التواصل عبر كواليس",
    ],
  },
  {
    name: "ملف مميز",
    price: "حسب الاتفاق",
    description: "للفنانين والفرق التي تحتاج ظهوراً أعلى أو إبرازاً في الصفحات الرئيسية.",
    icon: Crown,
    featured: true,
    cta: "اطلب تمييز ملف",
    href: "/contact",
    features: [
      "إبراز داخل أقسام مختارة",
      "تنسيق أفضل للنبذة والأعمال",
      "مراجعة تحريرية للمحتوى",
      "أولوية في تحديث البيانات يدوياً",
    ],
  },
];

const organizationServices = [
  {
    title: "نشر فرصة كاستنج",
    description: "أرسل تفاصيل المشروع والأدوار المطلوبة ليتم إضافتها يدوياً إلى صفحة الكاستنج.",
    icon: Building2,
    href: "/contact",
    cta: "أرسل مشروعك",
  },
  {
    title: "طلب فنان",
    description: "اختر فناناً من الدليل أو اشرح احتياجك، وسنرتب طلب التواصل عبر النموذج.",
    icon: Handshake,
    href: "/contact",
    cta: "اطلب تواصل",
  },
  {
    title: "إضافة فرقة",
    description: "يمكن للفرق المسرحية والفنية إرسال بياناتها ليتم تنسيقها كملف داخل الدليل.",
    icon: Users,
    href: "/join",
    cta: "قدّم بيانات الفرقة",
  },
];

function PlanCard({ plan }: { plan: (typeof artistPlans)[number] }) {
  const Icon = plan.icon;
  return (
    <div
      className={`relative rounded-2xl border p-6 flex flex-col ${
        plan.featured
          ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
          : "border-white/10 bg-white/5"
      }`}
    >
      {plan.featured && (
        <div className="absolute -top-3 right-1/2 translate-x-1/2">
          <span className="bg-primary text-background text-xs font-bold px-4 py-1 rounded-full">
            خيار مميز
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Icon className={plan.featured ? "text-primary" : "text-gray-300"} size={21} />
        </div>
        <div>
          <h2 className="font-display text-xl text-white">{plan.name}</h2>
          <p className="text-primary text-sm font-medium mt-0.5">{plan.price}</p>
        </div>
      </div>

      <p className="text-gray-400 text-sm leading-relaxed mb-6">{plan.description}</p>

      <ul className="space-y-2.5 mb-7 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-200">
            <Check size={15} className="text-primary flex-shrink-0 mt-0.5" />
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href={plan.href}
        className={`w-full text-center py-3 rounded-xl text-sm font-bold transition-all ${
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

export default function Pricing() {
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-5">
            <Sparkles className="text-primary" size={14} />
            <span className="text-primary text-xs font-medium">خدمات كواليس</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-4 leading-tight">
            منصة ثابتة، تحرير يدوي، وظهور منسّق
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            كواليس تعمل كدليل عربي منسق يدوياً. أرسل بياناتك عبر النماذج، ثم تتم مراجعتها وإضافتها
            إلى الموقع في تحديث النشر التالي.
          </p>
        </div>

        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Palette className="text-primary" size={20} />
            <h2 className="font-display text-2xl text-white">للفنانين والمبدعين</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {artistPlans.map((plan) => (
              <PlanCard key={plan.name} plan={plan} />
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="text-primary" size={20} />
            <h2 className="font-display text-2xl text-white">للجهات والفرق</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {organizationServices.map(({ title, description, icon: Icon, href, cta }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                  <Icon className="text-primary" size={21} />
                </div>
                <h3 className="font-display text-lg text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">{description}</p>
                <Link
                  href={href}
                  className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:text-primary/80"
                >
                  {cta}
                  <Zap size={14} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-primary/20 bg-gradient-to-l from-primary/10 to-white/5 p-7 md:p-9 text-center">
          <h2 className="font-display text-2xl text-white mb-3">كيف تتم الإضافة؟</h2>
          <p className="text-gray-300 leading-relaxed max-w-3xl mx-auto mb-6">
            لا توجد حسابات أو لوحات تحكم داخل الموقع. كل طلب يصل عبر Formspree، ثم يتم تحديث ملفات
            البيانات يدوياً وإعادة نشر GitHub Pages لضمان جودة الدليل ودقة المحتوى.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/join"
              className="px-5 py-3 bg-primary text-background font-bold rounded-xl hover:bg-primary/90 transition-colors"
            >
              انضم إلى الدليل
            </Link>
            <Link
              href="/contact"
              className="px-5 py-3 border border-white/20 text-gray-200 rounded-xl hover:border-white/40 hover:bg-white/5 transition-colors"
            >
              تواصل معنا
            </Link>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
