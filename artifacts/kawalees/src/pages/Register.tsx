import { useState } from "react";
import { Link, useLocation } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2, UserPlus, Palette, Building2, Users,
  ChevronLeft, Check, ArrowLeft
} from "lucide-react";

type UserType = "artist" | "company" | "group";

const USER_TYPE_INFO: Record<UserType, {
  icon: typeof Palette;
  label: string;
  sublabel: string;
  description: string;
  namePlaceholder: string;
  nameLabel: string;
}> = {
  artist: {
    icon: Palette,
    label: "فنان / مبدع",
    sublabel: "ممثل، مخرج، كاتب...",
    description: "أنشئ بروفايلك الاحترافي وتقدّم على مشاريع الكاستنج",
    namePlaceholder: "أحمد محمد",
    nameLabel: "الاسم الكامل",
  },
  company: {
    icon: Building2,
    label: "شركة إنتاج",
    sublabel: "إنتاج سينمائي، مسرحي...",
    description: "انشر مشاريع الكاستنج واعثر على أفضل المواهب",
    namePlaceholder: "شركة الإنتاج الفنية",
    nameLabel: "اسم الشركة / الجهة",
  },
  group: {
    icon: Users,
    label: "فرقة مسرحية",
    sublabel: "فرق الأداء والفنون",
    description: "سجّل فرقتك وانشر فرص العضوية والأدوار",
    namePlaceholder: "فرقة المسرح الوطني",
    nameLabel: "اسم الفرقة",
  },
};

export default function Register() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState<1 | 2>(1);
  const [userType, setUserType] = useState<UserType>("artist");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 6) {
      toast({ title: "خطأ", description: "كلمة المرور 6 أحرف على الأقل", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, type: userType }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({ title: "خطأ", description: data.message ?? "فشل إنشاء الحساب", variant: "destructive" });
        return;
      }

      login(data.token, data.user);
      toast({ title: "تم إنشاء الحساب!", description: `مرحبًا ${data.user.name} في كواليس` });
      navigate("/onboarding");
    } catch {
      toast({ title: "خطأ", description: "تعذّر الاتصال بالخادم", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  const info = USER_TYPE_INFO[userType];
  const SelectedIcon = info.icon;

  return (
    <AppLayout>
      <div className="min-h-screen flex items-center justify-center px-4 pt-28 pb-16">
        <div className="w-full max-w-md">

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === 1
                  ? "bg-primary text-background"
                  : "bg-primary/20 text-primary border border-primary/30"
              }`}>
                {step > 1 ? <Check size={14} /> : "1"}
              </div>
              <span className={`text-xs ${step === 1 ? "text-white" : "text-gray-500"}`}>
                نوع الحساب
              </span>
            </div>
            <div className="w-10 h-px bg-white/10" />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === 2
                  ? "bg-primary text-background"
                  : "bg-white/5 text-gray-600 border border-white/10"
              }`}>
                2
              </div>
              <span className={`text-xs ${step === 2 ? "text-white" : "text-gray-500"}`}>
                بيانات الحساب
              </span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">

            {step === 1 ? (
              <>
                {/* Step 1: choose type */}
                <div className="text-center mb-8">
                  <h1 className="font-display text-2xl text-white mb-1">كيف ستستخدم كواليس؟</h1>
                  <p className="text-gray-400 text-sm">اختر نوع حسابك للمتابعة</p>
                </div>

                <div className="space-y-3 mb-8">
                  {(Object.entries(USER_TYPE_INFO) as [UserType, typeof USER_TYPE_INFO[UserType]][]).map(
                    ([type, typeInfo]) => {
                      const Icon = typeInfo.icon;
                      const selected = userType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          data-testid={`button-type-${type}`}
                          onClick={() => setUserType(type)}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border text-right transition-all ${
                            selected
                              ? "border-primary bg-primary/10"
                              : "border-white/10 hover:border-white/25 hover:bg-white/5"
                          }`}
                        >
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            selected ? "bg-primary/20" : "bg-white/5"
                          }`}>
                            <Icon size={22} className={selected ? "text-primary" : "text-gray-400"} />
                          </div>
                          <div className="flex-1 text-right">
                            <div className={`font-medium text-sm mb-0.5 ${selected ? "text-primary" : "text-white"}`}>
                              {typeInfo.label}
                            </div>
                            <div className="text-xs text-gray-500">{typeInfo.sublabel}</div>
                          </div>
                          {selected && (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                              <Check size={12} className="text-background" />
                            </div>
                          )}
                        </button>
                      );
                    }
                  )}
                </div>

                {/* Selected type description */}
                <div className="flex items-start gap-3 p-3 bg-white/3 border border-white/8 rounded-xl mb-6">
                  <SelectedIcon size={16} className="text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-400 leading-relaxed">{info.description}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-3 px-6 bg-primary text-background font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  متابعة
                  <ArrowLeft size={16} />
                </button>
              </>
            ) : (
              <>
                {/* Step 2: account details */}
                <div className="flex items-center gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div>
                    <h1 className="font-display text-xl text-white">بيانات الحساب</h1>
                    <p className="text-gray-500 text-xs flex items-center gap-1.5 mt-0.5">
                      <SelectedIcon size={12} className="text-primary" />
                      {info.label}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5">{info.nameLabel}</label>
                    <input
                      data-testid="input-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoFocus
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                      placeholder={info.namePlaceholder}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5">البريد الإلكتروني</label>
                    <input
                      data-testid="input-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                      placeholder="example@email.com"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5">كلمة المرور</label>
                    <input
                      data-testid="input-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                      placeholder="••••••••"
                      dir="ltr"
                    />
                    <p className="text-gray-600 text-xs mt-1">6 أحرف على الأقل</p>
                  </div>

                  <button
                    type="submit"
                    data-testid="button-register"
                    disabled={loading}
                    className="w-full py-3 px-6 bg-primary text-background font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                  >
                    {loading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        <UserPlus size={18} />
                        إنشاء الحساب
                      </>
                    )}
                  </button>
                </form>
              </>
            )}

            <p className="text-center mt-6 text-gray-500 text-sm">
              لديك حساب بالفعل؟{" "}
              <Link href="/login" className="text-primary hover:text-primary/80 transition-colors">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
