import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Clapperboard, Plus, Users, Calendar, Star, Loader2,
  Trash2, ChevronDown, ChevronUp, Building2, Crown, X, Mail,
  UserCheck, Sparkles, Settings
} from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  type: "normal" | "featured";
  createdAt: string;
  applicantCount: number;
}

interface Applicant {
  applicationId: number;
  message: string | null;
  appliedAt: string;
  artistId: number | null;
  artistName: string | null;
  artistEmail: string | null;
  artistPlan: string | null;
}

interface DashboardData {
  type: "company";
  user: { id: number; name: string; email: string; plan: string };
  projects: Project[];
  stats: { totalProjects: number; totalApplicants: number };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const PLAN_BADGES: Record<string, { label: string; cls: string }> = {
  free:  { label: "مجاني",  cls: "text-gray-400 bg-white/5 border-white/10" },
  pro:   { label: "Pro",    cls: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  elite: { label: "Elite",  cls: "text-primary bg-primary/10 border-primary/20" },
};

function NewProjectModal({ onClose, token }: { onClose: () => void; token: string | null }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"normal" | "featured">("normal");

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "فشل إنشاء المشروع");
      return data;
    },
    onSuccess: () => {
      toast({ title: "تم نشر المشروع!", description: "المشروع الآن مرئي للفنانين" });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      onClose();
    },
    onError: (err: Error) => {
      toast({ title: "خطأ", description: err.message, variant: "destructive" });
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#141414] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl text-white">نشر مشروع جديد</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-1.5">عنوان المشروع</label>
            <input
              data-testid="input-project-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مسرحية — فيلم — إعلان..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1.5">وصف المشروع والمطلوب</label>
            <textarea
              data-testid="input-project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="نبذة عن المشروع، التخصصات المطلوبة، الخبرة المطلوبة..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all resize-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">نوع المشروع</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType("normal")}
                className={`py-3 px-4 rounded-xl border text-sm transition-all ${
                  type === "normal"
                    ? "border-white/40 bg-white/10 text-white"
                    : "border-white/10 text-gray-400 hover:border-white/20"
                }`}
              >
                عادي
              </button>
              <button
                type="button"
                onClick={() => setType("featured")}
                className={`py-3 px-4 rounded-xl border text-sm transition-all flex items-center justify-center gap-2 ${
                  type === "featured"
                    ? "border-primary/60 bg-primary/10 text-primary"
                    : "border-white/10 text-gray-400 hover:border-white/20"
                }`}
              >
                <Star size={14} />
                مميز
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            data-testid="button-create-project"
            onClick={() => createMutation.mutate()}
            disabled={!title.trim() || description.trim().length < 10 || createMutation.isPending}
            className="flex-1 py-3 bg-primary text-background font-medium rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {createMutation.isPending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Plus size={18} />
                نشر المشروع
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 border border-white/10 text-gray-400 rounded-xl hover:border-white/20 transition-colors"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

function ApplicantsList({ projectId, token }: { projectId: number; token: string | null }) {
  const { data: applicants, isLoading } = useQuery<Applicant[]>({
    queryKey: ["/api/projects", projectId, "applicants"],
    queryFn: () =>
      fetch(`/api/projects/${projectId}/applicants`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 size={20} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!applicants || applicants.length === 0) {
    return (
      <div className="text-center py-6">
        <UserCheck size={28} className="mx-auto text-gray-600 mb-2" />
        <p className="text-sm text-gray-500">لا توجد طلبات بعد</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 mt-3">
      {applicants.map((applicant) => {
        const planInfo = PLAN_BADGES[applicant.artistPlan ?? "free"] ?? PLAN_BADGES.free;
        const initial = applicant.artistName?.charAt(0)?.toUpperCase() ?? "؟";
        return (
          <div
            key={applicant.applicationId}
            data-testid={`card-applicant-${applicant.applicationId}`}
            className="flex items-start gap-3 px-4 py-3.5 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
          >
            {/* Avatar */}
            <div className="flex-shrink-0 w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 text-sm text-primary font-bold">
              {initial}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <p className="text-sm text-white font-medium">{applicant.artistName ?? "فنان"}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${planInfo.cls}`}>
                  {planInfo.label}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                <Mail size={10} />
                <span>{applicant.artistEmail}</span>
              </div>
              {applicant.message && (
                <p className="text-xs text-gray-400 bg-white/5 rounded-lg px-3 py-2 mt-1.5 line-clamp-3 italic">
                  "{applicant.message}"
                </p>
              )}
              <p className="text-[10px] text-gray-600 mt-1.5 flex items-center gap-1">
                <Calendar size={9} />
                تقدّم {formatDate(applicant.appliedAt)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function CompanyDashboard() {
  const { user, token } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

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

  const deleteMutation = useMutation({
    mutationFn: async (projectId: number) => {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("فشل الحذف");
    },
    onSuccess: () => {
      toast({ title: "تم حذف المشروع" });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
    onError: () => {
      toast({ title: "خطأ", description: "فشل حذف المشروع", variant: "destructive" });
    },
  });

  if (!user) {
    navigate("/login");
    return null;
  }
  if (user.type !== "company") {
    navigate("/dashboard/artist");
    return null;
  }

  return (
    <AppLayout>
      {showModal && <NewProjectModal onClose={() => setShowModal(false)} token={token} />}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-16">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
              <Building2 className="text-primary" size={22} />
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
            <button
              data-testid="button-new-project"
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-background font-medium rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Plus size={18} />
              نشر مشروع جديد
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <p className="text-3xl font-display text-white mb-1">{data?.stats.totalProjects ?? 0}</p>
            <p className="text-xs text-gray-400">مشاريع منشورة</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <p className="text-3xl font-display text-white mb-1">{data?.stats.totalApplicants ?? 0}</p>
            <p className="text-xs text-gray-400">إجمالي المتقدمين</p>
          </div>
          <div className="col-span-2 sm:col-span-1 bg-primary/5 border border-primary/20 rounded-xl p-5 flex items-center gap-3">
            <Crown className="text-primary flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-primary">الخطة الحالية</p>
              <p className="text-xs text-gray-400 capitalize">{user.plan}</p>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl text-white">مشاريعي</h2>
          <Link href="/projects" className="text-sm text-gray-400 hover:text-primary transition-colors">
            الصفحة العامة ←
          </Link>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        )}

        {!isLoading && data?.projects.length === 0 && (
          <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
            <Sparkles className="mx-auto text-gray-600 mb-3" size={40} />
            <p className="text-gray-300 font-medium mb-1">لم تنشر أي مشاريع بعد</p>
            <p className="text-gray-500 text-sm mb-5">انشر مشروعك الأول وابدأ باستقبال طلبات المواهب</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-background font-medium rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Plus size={16} />
              انشر أول مشروع
            </button>
          </div>
        )}

        {data?.projects && data.projects.length > 0 && (
          <div className="space-y-4">
            {data.projects.map((project) => {
              const isExpanded = expandedProject === project.id;
              return (
                <div
                  key={project.id}
                  data-testid={`card-project-${project.id}`}
                  className={`bg-white/5 border rounded-2xl overflow-hidden transition-all ${
                    project.type === "featured" ? "border-primary/30" : "border-white/10"
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                        <Clapperboard className="text-primary" size={18} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-display text-white">{project.title}</h3>
                          {project.type === "featured" && (
                            <span className="flex items-center gap-1 text-[10px] bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full">
                              <Star size={9} fill="currentColor" />
                              مميز
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Users size={11} className="text-primary/60" />
                            <span className={project.applicantCount > 0 ? "text-primary/80" : ""}>
                              {project.applicantCount} متقدم
                            </span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            {formatDate(project.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          data-testid={`button-toggle-applicants-${project.id}`}
                          onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                          className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-colors ${
                            isExpanded
                              ? "text-primary bg-primary/10"
                              : "text-gray-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          المتقدمون
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        <button
                          data-testid={`button-delete-project-${project.id}`}
                          onClick={() => {
                            if (confirm("هل أنت متأكد من حذف هذا المشروع؟")) {
                              deleteMutation.mutate(project.id);
                            }
                          }}
                          disabled={deleteMutation.isPending}
                          className="p-1.5 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
                          title="حذف المشروع"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded applicants section */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-xs text-gray-500 mb-3">
                          {project.applicantCount > 0
                            ? `${project.applicantCount} متقدم على هذا المشروع`
                            : "لا توجد طلبات بعد"}
                        </p>
                        <ApplicantsList projectId={project.id} token={token} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
