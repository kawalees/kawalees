import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Clapperboard, Star, Calendar, Building2, Users,
  Loader2, Send, Lock, ArrowRight, CheckCircle
} from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  type: "normal" | "featured";
  createdAt: string;
  companyId: number;
  companyName: string | null;
  applicantCount: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const [message, setMessage] = useState("");
  const [applied, setApplied] = useState(false);

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", id],
    queryFn: () =>
      fetch(`/api/projects/${id}`).then((r) => {
        if (!r.ok) throw new Error("المشروع غير موجود");
        return r.json();
      }),
    enabled: !!id,
  });

  const applyMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/projects/${id}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "فشل إرسال الطلب");
      return data;
    },
    onSuccess: () => {
      setApplied(true);
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({ title: "تم التقديم!", description: "تم إرسال طلبك بنجاح" });
    },
    onError: (err: Error) => {
      if (err.message.includes("plan_limit") || err.message.includes("الحد الأقصى")) {
        toast({
          title: "حد الخطة المجانية",
          description: err.message,
          variant: "destructive",
        });
      } else if (err.message.includes("تقدمت")) {
        toast({ title: "سبق التقديم", description: err.message, variant: "destructive" });
        setApplied(true);
      } else {
        toast({ title: "خطأ", description: err.message, variant: "destructive" });
      }
    },
  });

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        {/* Back */}
        <button
          onClick={() => navigate("/projects")}
          className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8 text-sm"
        >
          <ArrowRight size={16} />
          العودة للمشاريع
        </button>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={36} />
          </div>
        )}

        {!isLoading && !project && (
          <div className="text-center py-20 text-gray-400">المشروع غير موجود</div>
        )}

        {project && (
          <>
            {/* Project card */}
            <div
              className={`bg-white/5 border rounded-2xl p-8 mb-6 ${
                project.type === "featured"
                  ? "border-primary/40 shadow-lg shadow-primary/10"
                  : "border-white/10"
              }`}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                  <Clapperboard className="text-primary" size={26} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="font-display text-2xl text-white">{project.title}</h1>
                    {project.type === "featured" && (
                      <span className="flex items-center gap-1 text-xs bg-primary/20 text-primary border border-primary/30 px-2.5 py-1 rounded-full">
                        <Star size={11} fill="currentColor" />
                        مميز
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Building2 size={14} />
                      {project.companyName ?? "جهة إنتاج"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {formatDate(project.createdAt)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users size={14} />
                      {project.applicantCount} متقدم
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{project.description}</p>
            </div>

            {/* Apply section */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              {/* Not logged in */}
              {!user && (
                <div className="text-center py-4">
                  <Lock className="mx-auto text-gray-500 mb-3" size={32} />
                  <p className="text-gray-300 mb-4">يجب تسجيل الدخول كفنان للتقديم على هذا المشروع</p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <button
                      onClick={() => navigate("/login")}
                      className="px-6 py-2.5 bg-primary text-background font-medium rounded-xl hover:bg-primary/90 transition-colors"
                    >
                      تسجيل الدخول
                    </button>
                    <button
                      onClick={() => navigate("/register")}
                      className="px-6 py-2.5 border border-white/20 text-gray-300 font-medium rounded-xl hover:border-primary/40 transition-colors"
                    >
                      إنشاء حساب
                    </button>
                  </div>
                </div>
              )}

              {/* Company viewing */}
              {user?.type === "company" && (
                <div className="text-center py-4 text-gray-400">
                  <p>حسابات الشركات لا تتقدم للمشاريع</p>
                  <button
                    onClick={() => navigate("/dashboard/company")}
                    className="mt-3 text-primary hover:text-primary/80 text-sm transition-colors"
                  >
                    الانتقال للوحة التحكم
                  </button>
                </div>
              )}

              {/* Artist applying */}
              {user?.type === "artist" && !applied && (
                <>
                  <h2 className="font-display text-lg text-white mb-4">التقديم على المشروع</h2>
                  {user.plan === "free" && (
                    <div className="mb-4 px-4 py-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-xs text-yellow-400">
                      الخطة المجانية تتيح لك 3 طلبات فقط. قم بالترقية للوصول الكامل.
                    </div>
                  )}
                  <textarea
                    data-testid="input-apply-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="اكتب رسالة مختصرة تعرّف فيها بنفسك وخبراتك (اختياري)"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all resize-none text-sm mb-4"
                  />
                  <button
                    data-testid="button-apply"
                    onClick={() => applyMutation.mutate()}
                    disabled={applyMutation.isPending}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-background font-medium rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    {applyMutation.isPending ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Send size={18} />
                    )}
                    إرسال طلب التقديم
                  </button>
                </>
              )}

              {/* Applied successfully */}
              {user?.type === "artist" && applied && (
                <div className="flex flex-col items-center py-4 text-center">
                  <CheckCircle className="text-green-400 mb-3" size={40} />
                  <p className="text-white font-medium mb-1">تم إرسال طلبك بنجاح!</p>
                  <p className="text-gray-400 text-sm mb-4">ستتواصل معك جهة الإنتاج قريبًا</p>
                  <button
                    onClick={() => navigate("/dashboard/artist")}
                    className="text-primary text-sm hover:text-primary/80 transition-colors"
                  >
                    عرض طلباتي
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
