import { useState, useMemo } from "react";
import { Link } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { projects as allProjects } from "@/data/projects";
import {
  Clapperboard, Star, MapPin, Search, Filter,
  CheckCircle, XCircle, ChevronLeft
} from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  all: "الكل",
  open: "مفتوح",
  closed: "مغلق",
};

export default function Projects() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "closed">("all");
  const [typeFilter, setTypeFilter] = useState<string>("الكل");

  const types = useMemo(() => {
    const ts = new Set(allProjects.map((p) => p.type));
    return ["الكل", ...Array.from(ts)];
  }, []);

  const filtered = useMemo(() => {
    return allProjects.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        (p.producer && p.producer.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesType = typeFilter === "الكل" || p.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [search, statusFilter, typeFilter]);

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-4">
            <Clapperboard size={13} className="text-primary" />
            <span className="text-primary text-xs font-medium">الكاستنج المهني</span>
          </div>
          <h1 className="font-display text-4xl text-white mb-2">فرص الكاستنج</h1>
          <p className="text-gray-400">مشاريع سينما ومسرح وتلفزيون تبحث عن مواهب عربية</p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-500" />
            </div>
            <input
              data-testid="input-project-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن مشروع أو جهة إنتاج..."
              className="w-full pr-10 pl-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-gray-400" />
              <span className="text-gray-400 text-xs">الحالة:</span>
            </div>
            {(["all", "open", "closed"] as const).map((s) => (
              <button
                key={s}
                data-testid={`filter-status-${s}`}
                onClick={() => setStatusFilter(s)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                  statusFilter === s
                    ? s === "open" ? "bg-green-500/20 text-green-400 border border-green-500/40"
                      : s === "closed" ? "bg-red-500/20 text-red-400 border border-red-500/40"
                      : "bg-white/15 text-white border border-white/20"
                    : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                }`}
              >
                {s === "open" && <CheckCircle size={11} />}
                {s === "closed" && <XCircle size={11} />}
                {STATUS_LABELS[s]}
              </button>
            ))}

            <div className="flex items-center gap-2 mr-2">
              <span className="text-gray-400 text-xs">النوع:</span>
              <div className="flex gap-1.5 flex-wrap">
                {types.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypeFilter(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      typeFilter === t
                        ? "bg-primary/20 text-primary border border-primary/40"
                        : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Count */}
        <p className="text-xs text-gray-500 mb-6">
          {filtered.length === allProjects.length
            ? `${allProjects.length} مشروع`
            : `${filtered.length} من ${allProjects.length} مشروع`}
        </p>

        {/* Empty */}
        {filtered.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl">
            <Clapperboard className="mx-auto text-gray-600 mb-4" size={48} />
            <p className="text-gray-400 text-lg mb-2">لا توجد نتائج مطابقة</p>
            <button
              onClick={() => { setSearch(""); setStatusFilter("all"); setTypeFilter("الكل"); }}
              className="mt-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              مسح الفلاتر
            </button>
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 && (
          <div className="grid gap-5">
            {filtered.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <div
                  data-testid={`card-project-${project.id}`}
                  className={`group relative bg-white/5 border rounded-2xl p-6 hover:bg-white/8 transition-all cursor-pointer ${
                    project.featured
                      ? "border-primary/30 shadow-md shadow-primary/10"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Status + Featured badge */}
                  <div className="flex items-center gap-2 mb-4">
                    {project.featured && (
                      <span className="flex items-center gap-1 text-xs bg-primary/20 text-primary border border-primary/30 px-2.5 py-1 rounded-full">
                        <Star size={10} fill="currentColor" />
                        مميز
                      </span>
                    )}
                    <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border ${
                      project.status === "open"
                        ? "bg-green-500/10 text-green-400 border-green-500/30"
                        : "bg-gray-500/10 text-gray-400 border-gray-500/30"
                    }`}>
                      {project.status === "open" ? <CheckCircle size={10} /> : <XCircle size={10} />}
                      {project.status === "open" ? "مفتوح للتقديم" : "انتهى التقديم"}
                    </span>
                    <span className="text-xs text-gray-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                      {project.type}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                      <Clapperboard className="text-primary" size={22} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className="font-display text-lg text-white group-hover:text-primary transition-colors mb-1">
                        {project.title}
                      </h2>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-3">{project.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin size={11} />
                          {project.location}
                        </span>
                        {project.producer && (
                          <span className="flex items-center gap-1">
                            {project.producer}
                          </span>
                        )}
                        {project.deadline && (
                          <span>
                            آخر موعد: {new Date(project.deadline).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}
                          </span>
                        )}
                      </div>
                    </div>

                    <ChevronLeft size={18} className="text-gray-600 group-hover:text-primary transition-colors flex-shrink-0 self-center" />
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
