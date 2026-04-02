import { useState } from "react";
import { useLocation } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Lock, Crown, ChevronLeft, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

const PLAN_LABELS: Record<string, { label: string; color: string }> = {
  free:  { label: "مجانية",  color: "text-gray-300" },
  pro:   { label: "Pro",     color: "text-blue-400" },
  elite: { label: "Elite",   color: "text-primary" },
};

export default function Settings() {
  const { user, token, login } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name ?? "");
  const [nameLoading, setNameLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const plan = PLAN_LABELS[user.plan] ?? PLAN_LABELS.free;

  async function handleChangeName(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      toast({ title: "خطأ", description: "الاسم يجب أن يكون حرفين على الأقل", variant: "destructive" });
      return;
    }
    setNameLoading(true);
    try {
      const res = await fetch("/api/auth/update-name", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: "خطأ", description: data.message ?? "فشل تحديث الاسم", variant: "destructive" });
        return;
      }
      login(token!, { ...user, name: data.name });
      toast({ title: "تم التحديث", description: "تم تحديث اسمك بنجاح" });
    } catch {
      toast({ title: "خطأ", description: "تعذّر الاتصال بالخادم", variant: "destructive" });
    } finally {
      setNameLoading(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast({ title: "خطأ", description: "كلمة المرور الجديدة 6 أحرف على الأقل", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "خطأ", description: "كلمتا المرور غير متطابقتين", variant: "destructive" });
      return;
    }
    setPassLoading(true);
    setPassSuccess(false);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: "خطأ", description: data.message ?? "فشل تغيير كلمة المرور", variant: "destructive" });
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPassSuccess(true);
      toast({ title: "تم بنجاح", description: "تم تغيير كلمة المرور بنجاح" });
      setTimeout(() => setPassSuccess(false), 4000);
    } catch {
      toast({ title: "خطأ", description: "تعذّر الاتصال بالخادم", variant: "destructive" });
    } finally {
      setPassLoading(false);
    }
  }

  const dashboardHref = user.type === "artist" ? "/dashboard/artist" : "/dashboard/company";

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Back link */}
        <Link
          href={dashboardHref}
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-sm mb-8 transition-colors"
        >
          <ChevronLeft size={14} />
          العودة إلى لوحة التحكم
        </Link>

        <h1 className="font-display text-3xl text-white mb-8">إعدادات الحساب</h1>

        {/* Account info */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
              <User className="text-primary" size={16} />
            </div>
            <h2 className="font-display text-lg text-white">معلومات الحساب</h2>
          </div>

          <div className="flex items-center gap-4 mb-5 p-4 bg-white/3 border border-white/8 rounded-xl">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 flex-shrink-0">
              <User className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-white font-medium">{user.name}</p>
              <p className="text-gray-400 text-sm">{user.email}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Crown size={12} className={plan.color} />
                <span className={`text-xs ${plan.color}`}>الخطة {plan.label}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleChangeName} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">الاسم الكامل</label>
              <input
                data-testid="input-settings-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-primary/40 transition-colors"
                placeholder="أدخل اسمك"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">البريد الإلكتروني</label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full bg-white/3 border border-white/6 rounded-xl px-4 py-2.5 text-gray-500 text-sm cursor-not-allowed"
              />
              <p className="text-xs text-gray-600 mt-1.5">لا يمكن تغيير البريد الإلكتروني حاليًا</p>
            </div>
            <button
              data-testid="button-save-name"
              type="submit"
              disabled={nameLoading || name.trim() === user.name}
              className="px-5 py-2.5 bg-primary/10 border border-primary/30 text-primary text-sm font-medium rounded-xl hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {nameLoading ? <Loader2 size={15} className="animate-spin inline" /> : "حفظ التغييرات"}
            </button>
          </form>
        </section>

        {/* Change password */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
              <Lock className="text-gray-300" size={16} />
            </div>
            <h2 className="font-display text-lg text-white">تغيير كلمة المرور</h2>
          </div>

          {passSuccess && (
            <div className="flex items-center gap-2.5 p-4 bg-green-500/10 border border-green-500/20 rounded-xl mb-5">
              <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
              <p className="text-green-300 text-sm">تم تغيير كلمة المرور بنجاح</p>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">كلمة المرور الحالية</label>
              <input
                data-testid="input-current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-primary/40 transition-colors"
                placeholder="أدخل كلمة المرور الحالية"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">كلمة المرور الجديدة</label>
              <input
                data-testid="input-new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-primary/40 transition-colors"
                placeholder="6 أحرف على الأقل"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">تأكيد كلمة المرور</label>
              <input
                data-testid="input-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-primary/40 transition-colors"
                placeholder="أعد إدخال كلمة المرور الجديدة"
              />
            </div>
            <button
              data-testid="button-change-password"
              type="submit"
              disabled={passLoading || !currentPassword || !newPassword || !confirmPassword}
              className="px-5 py-2.5 bg-white/5 border border-white/10 text-gray-200 text-sm font-medium rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {passLoading ? (
                <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" />جارٍ التحديث...</span>
              ) : (
                "تغيير كلمة المرور"
              )}
            </button>
          </form>
        </section>

        {/* Plan upgrade link */}
        {user.plan === "free" && (
          <div className="p-5 bg-primary/5 border border-primary/20 rounded-2xl flex items-center gap-4">
            <Crown className="text-primary flex-shrink-0" size={20} />
            <div className="flex-1">
              <p className="text-white text-sm font-medium">قم بترقية خطتك</p>
              <p className="text-gray-400 text-xs mt-0.5">احصل على تقديمات غير محدودة ومزايا احترافية</p>
            </div>
            <Link
              href="/pricing"
              data-testid="link-upgrade-plan"
              className="flex-shrink-0 text-xs px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg font-medium hover:bg-primary/30 transition-colors"
            >
              عرض الباقات
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
