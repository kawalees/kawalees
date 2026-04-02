import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import {
  Clapperboard, Plus, Star, Calendar, Users,
  Loader2, Lock, Search, Filter
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

function fetchProjects(): Promise<Project[]> {
  return fetch("/api/projects").then((r) => {
    if (!r.ok) throw new Error("فشل جلب المشاريع");
    return r.json();
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const TYPE_LABELS: Record<string, string> = {
  all: "الكل",
  normal: "عادي",
  featured: "مميز",
};

export default function Projects() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "normal" | "featured">("all");

  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: fetchProjects,
  });

  const filtered = useMemo(() => {
    if (!projects) return [];
    return projects.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        (p.companyName && p.companyName.toLowerCase().includes(search.toLowerCase()));
      const matchesType = typeFilter === "all" || p.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [projects, search, typeFilter]);

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl text-white mb-1">فرص الكاستنج</h1>
            <p className="text-gray-400 text-sm">مشاريع مفتوحة للتقديم من فنانين وممثلين</p>
          </div>
          {user?.type === "company" && (
            <Link
              href="/dashboard/company"
              data-testid="link-post-project"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-background font-medium rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Plus size={18} />
              نشر مشروع
            </Link>
          )}
          {!user && (
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-primary/40 text-primary font-medium rounded-xl hover:bg-primary/10 transition-colors"
            >
              انضم للتقديم
            </Link>
          )}
        </div>

        {/* Search + Filter Row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-500" />
            </div>
            <input
              data-testid="input-project-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن مشروع أو جهة إنتاج..."
              className="w-full pr-10 pl-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-gray-400 flex-shrink-0" />
            <div className="flex gap-1.5">
              {(["all", "normal", "featured"] as const).map((t) => (
                <button
                  key={t}
                  data-testid={`filter-type-${t}`}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    typeFilter === t
                      ? t === "featured"
                        ? "bg-primary/20 text-primary border border-primary/40"
                        : "bg-white/15 text-white border border-white/20"
                      : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {t === "featured" && <Star size={12} className="inline ml-1" fill="currentColor" />}
                  {TYPE_LABELS[t]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        {!isLoading && !error && projects && (
          <p className="text-xs text-gray-500 mb-5">
            {filtered.length === projects.length
              ? `${projects.length} مشروع`
              : `${filtered.length} من ${projects.length} مشروع`}
          </p>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={36} />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20 text-gray-400">
            <p>تعذّر تحميل المشاريع. حاول مرة أخرى.</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && filtered.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
            <Clapperboard className="mx-auto text-gray-600 mb-4" size={48} />
            {projects?.length === 0 ? (
              <>
                <p className="text-gray-400 text-lg mb-2">لا توجد مشاريع حاليًا</p>
                {user?.type === "company" && (
                  <p className="text-gray-500 text-sm">كن أول من ينشر فرصة كاستنج!</p>
                )}
              </>
            ) : (
              <>
                <p className="text-gray-400 text-lg mb-2">لا توجد نتائج مطابقة</p>
                <button
                  onClick={() => { setSearch(""); setTypeFilter("all"); }}
                  className="mt-2 text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  مسح الفلاتر
                </button>
              </>
            )}
          </div>
        )}

        {/* Project grid */}
        {filtered.length > 0 && (
          <div className="grid gap-4">
            {filtered.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <div
                  data-testid={`card-project-${project.id}`}
                  className={`group relative bg-white/5 border rounded-2xl p-6 hover:bg-white/8 transition-all cursor-pointer ${
                    project.type === "featured"
                      ? "border-primary/40 shadow-md shadow-primary/10"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Featured badge */}
                  {project.type === "featured" && (
                    <span className="absolute top-4 left-4 flex items-center gap-1 text-xs bg-primary/20 text-primary border border-primary/30 px-2.5 py-1 rounded-full">
                      <Star size={11} fill="currentColor" />
                      مميز
                    </span>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                      <Clapperboard className="text-primary" size={22} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="font-display text-lg text-white group-hover:text-primary transition-colors truncate">
                        {project.title}
                      </h2>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{project.description}</p>

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {project.companyName ?? "جهة إنتاج"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(project.createdAt)}
                        </span>
                        <span className="flex items-center gap-1 text-gray-500">
                          <Users size={12} className="text-primary/60" />
                          {project.applicantCount} متقدم
                        </span>
                        {user?.type === "artist" && (
                          <span className="flex items-center gap-1 text-primary mr-auto">
                            تقدّم الآن ←
                          </span>
                        )}
                        {!user && (
                          <span className="flex items-center gap-1">
                            <Lock size={11} />
                            سجّل دخولك للتقديم
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
