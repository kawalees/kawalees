import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import {
  Clapperboard, Calendar, Building2,
  Loader2, Star, ChevronLeft, User, Crown,
  TrendingUp, Zap, Search, Settings
} from "lucide-react";

interface Application {
  applicationId: number;
  message: string | null;
  appliedAt: string;
  projectId: number;
  projectTitle: string;
  projectType: "normal" | "featured";
  companyName: string | null;
}

interface DashboardData {
  type: "artist";
  user: { id: number; name: string; email: string; plan: string };
  applications: Application[];
  stats: { totalApplications: number };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const FREE_LIMIT = 3;

const PLANS: Record<string, { label: string; icon: string; color: string; bg: string; border: string }> = {
  free:  { label: "مجانية",  icon: "Free",  color: "text-gray-300",  bg: "bg-white/5",    border: "border-white/10" },
  pro:   { label: "Pro",     icon: "Pro",   color: "text-blue-400",  bg: "bg-blue-400/10", border: "border-blue-400/20" },
  elite: { label: "Elite",   icon: "Elite", color: "text-primary",  bg: "bg-primary/10",  border: "border-primary/20" },
};

export default function ArtistDashboard() {
  const { user, token } = useAuth();
  const [, navigate] = useLocation();

  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
    queryFn: () =>
      fetch("/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => {
        if (!r.ok) throw new Error("فشل جلب البيانات");
        return r.json();
      }),
    enabled: !!token,
  });

  if (!user) {
    navigate("/login");
    return null;
  }
  if (user.type !== "artist") {
    navigate("/dashboard/company");
    return null;
  }

  const plan = PLANS[user.plan] ?? PLANS.free;
  const used = data?.stats.totalApplications ?? 0;
  const isFreePlan = user.plan === "free";
  const isAtLimit = isFreePlan && used >= FREE_LIMIT;
  const remaining = isFreePlan ? Math.max(0, FREE_LIMIT - used) : Infinity;
  const usagePercent = isFreePlan ? Math.min(100, (used / FREE_LIMIT) * 100) : 0;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
              <User className="text-primary" size={22} />
            </div>
            <div>
              <h1 className="font-display text-2xl text-white">{data?.user.name ?? user.name}</h1>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/settings"
              data-testid="link-settings"
              className="flex items-center gap-1.5 px-3 py-2.5 border border-white/10 text-gray-400 text-sm rounded-xl hover:border-white/20 hover:text-gray-200 transition-colors"
            >
              <Settings size={14} />
              الإعدادات
            </Link>
            <Link
              href="/projects"
              data-testid="link-browse-projects"
              className="flex items-center gap-2 px-4 py-2.5 border border-primary/30 text-primary text-sm font-medium rounded-xl hover:bg-primary/10 transition-colors"
            >
              <Search size={15} />
              تصفّح المشاريع
            </Link>
          </div>
        </div>

        {/* Profile creation card */}
        <div className="rounded-2xl p-5 border border-primary/20 bg-gradient-to-l from-primary/5 to-transparent mb-6 flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
            <User className="text-primary" size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm mb-0.5">ملفك الشخصي في الدليل</p>
            <p className="text-gray-400 text-xs leading-relaxed">
              أضف تخصصك وأعمالك وصورتك لتظهر في دليل الفنانين وتستقطب فرص الكاستنج
            </p>
          </div>
          <Link
            href="/join"
            data-testid="link-create-profile"
            className="flex-shrink-0 px-4 py-2 bg-primary text-background text-xs font-bold rounded-xl hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            إنشاء / تحديث الملف
          </Link>
        </div>

        {/* Plan Card */}
        <div className={`rounded-2xl p-5 border mb-6 ${plan.bg} ${plan.border}`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Crown className={plan.color} size={20} />
              <div>
                <p className="text-xs text-gray-400 mb-0.5">خطتك الحالية</p>
                <p className={`font-display text-lg font-bold ${plan.color}`}>
                  الخطة {plan.label}
                </p>
              </div>
            </div>
            {isFreePlan && (
              <div className="text-left">
                <p className={`text-2xl font-display font-bold ${isAtLimit ? "text-red-400" : "text-white"}`}>
                  {used} / {FREE_LIMIT}
                </p>
                <p className="text-xs text-gray-400">طلبات مستخدمة</p>
              </div>
            )}
            {!isFreePlan && (
              <div className="text-left">
                <p className="text-2xl font-display font-bold text-white">{used}</p>
                <p className="text-xs text-gray-400">طلب مرسل</p>
              </div>
            )}
          </div>

          {/* Progress bar for free plan */}
          {isFreePlan && (
            <div className="mt-4">
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isAtLimit ? "bg-red-400" : usagePercent >= 66 ? "bg-yellow-400" : "bg-primary"
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                {isAtLimit
                  ? "وصلت للحد الأقصى — قم بالترقية للمزيد"
                  : `${remaining} طلب متبقٍ من أصل ${FREE_LIMIT}`}
              </p>
            </div>
          )}
        </div>

        {/* Upgrade prompt */}
        {isAtLimit && (
          <div className="mb-8 px-5 py-4 bg-gradient-to-l from-primary/5 to-transparent border border-primary/20 rounded-2xl flex items-center gap-4">
            <Zap className="text-primary flex-shrink-0" size={24} />
            <div className="flex-1">
              <p className="text-white font-medium text-sm">قم بالترقية للحصول على طلبات غير محدودة</p>
              <p className="text-gray-400 text-xs mt-0.5">
                خطة Pro وElite تتيح لك التقديم على عدد غير محدود من مشاريع الكاستنج
              </p>
            </div>
            <Link
              href="/pricing"
              className="flex-shrink-0 text-xs px-3 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-lg font-medium hover:bg-primary/30 transition-colors"
            >
              عرض الباقات
            </Link>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <p className="text-3xl font-display text-white mb-1">{used}</p>
            <p className="text-xs text-gray-400">إجمالي الطلبات</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <p className="text-3xl font-display font-bold mb-1">
              {isFreePlan ? (
                <span className={isAtLimit ? "text-red-400" : "text-white"}>{remaining}</span>
              ) : (
                <span className="text-primary">∞</span>
              )}
            </p>
            <p className="text-xs text-gray-400">طلبات متبقية</p>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-3">
            <TrendingUp className="text-primary flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-white">نشاط الطلبات</p>
              <p className="text-xs text-gray-400">
                {used > 0 ? `${used} طلب مرسل` : "لم ترسل طلبات بعد"}
              </p>
            </div>
          </div>
        </div>

        {/* Applications */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl text-white">طلباتي</h2>
          {data?.applications && data.applications.length > 0 && (
            <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              {data.applications.length} طلب
            </span>
          )}
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        )}

        {!isLoading && data?.applications.length === 0 && (
          <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
            <Clapperboard className="mx-auto text-gray-600 mb-3" size={40} />
            <p className="text-gray-300 font-medium mb-1">لم تتقدم لأي مشروع بعد</p>
            <p className="text-gray-500 text-sm mb-5">تصفح الفرص المتاحة وابدأ مسيرتك</p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-background font-medium rounded-xl hover:bg-primary/90 transition-colors text-sm"
            >
              <Clapperboard size={16} />
              تصفّح المشاريع المتاحة
            </Link>
          </div>
        )}

        {data?.applications && data.applications.length > 0 && (
          <div className="space-y-3">
            {data.applications.map((app) => (
              <div
                key={app.applicationId}
                data-testid={`card-application-${app.applicationId}`}
                className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
                      <Clapperboard className="text-primary" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-medium text-white text-sm">{app.projectTitle}</h3>
                        {app.projectType === "featured" && (
                          <Star size={11} className="text-primary fill-primary flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Building2 size={11} />
                          {app.companyName ?? "جهة إنتاج"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {formatDate(app.appliedAt)}
                        </span>
                      </div>
                      {app.message && (
                        <p className="text-xs text-gray-500 mt-2 bg-white/5 rounded-lg px-3 py-2 italic line-clamp-2">
                          "{app.message}"
                        </p>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/projects/${app.projectId}`}
                    className="flex-shrink-0 text-gray-500 hover:text-primary transition-colors p-1"
                    title="عرض المشروع"
                  >
                    <ChevronLeft size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
