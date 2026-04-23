import { useState } from "react";
import { useParams, Link } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { projects } from "@/data/projects";
import {
  Clapperboard, Star, MapPin, Calendar, Send,
  ArrowRight, CheckCircle, XCircle, Users, Loader2, CheckCircle2
} from "lucide-react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xpwznoel";

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          projectId: project?.id,
          projectTitle: project?.title,
          name,
          email,
          role,
          message,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("فشل الإرسال. يرجى المحاولة مجددًا.");
      }
    } catch {
      setError("حدث خطأ. تحقق من اتصالك بالإنترنت وحاول مجددًا.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!project) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto px-4 pt-32 pb-16 text-center">
          <Clapperboard className="mx-auto text-gray-600 mb-4" size={48} />
          <h1 className="font-display text-3xl text-white mb-4">المشروع غير موجود</h1>
          <Link href="/projects" className="text-primary hover:text-primary/80 transition-colors">
            العودة لفرص الكاستنج
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16">

        {/* Back */}
        <Link
          href="/projects"
          className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8 text-sm group"
        >
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          العودة للمشاريع
        </Link>

        {/* Status + Type badges */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
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

        {/* Project card */}
        <div className={`bg-white/5 border rounded-2xl p-8 mb-8 ${
          project.featured ? "border-primary/30 shadow-lg shadow-primary/10" : "border-white/10"
        }`}>
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
              <Clapperboard className="text-primary" size={26} />
            </div>
            <div className="flex-1">
              <h1 className="font-display text-2xl text-white mb-3">{project.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {project.location}
                </span>
                {project.producer && (
                  <span className="flex items-center gap-1.5">
                    <Users size={14} />
                    {project.producer}
                  </span>
                )}
                {project.deadline && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {new Date(project.deadline).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-gray-300 leading-relaxed whitespace-pre-line mb-6">{project.description}</p>

          {project.roles.length > 0 && (
            <div>
              <h2 className="font-display text-lg text-white mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full" />
                الأدوار المطلوبة
              </h2>
              <ul className="space-y-2">
                {project.roles.map((role, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {role}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Apply section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          {project.status === "closed" ? (
            <div className="text-center py-4">
              <XCircle className="mx-auto text-gray-500 mb-3" size={36} />
              <p className="text-gray-300 text-lg font-display mb-1">انتهى باب التقديم</p>
              <p className="text-gray-500 text-sm">لا يمكن التقديم على هذا المشروع حاليًا.</p>
              <Link
                href="/projects"
                className="mt-4 inline-block text-primary text-sm hover:text-primary/80 transition-colors"
              >
                تصفّح فرص أخرى
              </Link>
            </div>
          ) : submitted ? (
            <div className="flex flex-col items-center py-6 text-center">
              <CheckCircle2 className="text-green-400 mb-3" size={48} />
              <p className="text-white font-display text-xl mb-1">تم إرسال طلبك بنجاح!</p>
              <p className="text-gray-400 text-sm mb-4">ستتواصل معك جهة الإنتاج قريبًا على البريد الإلكتروني المذكور.</p>
              <Link href="/projects" className="text-primary text-sm hover:text-primary/80 transition-colors">
                العودة للمشاريع
              </Link>
            </div>
          ) : (
            <>
              <h2 className="font-display text-xl text-white mb-6">التقديم على المشروع</h2>
              <form onSubmit={handleApply} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">اسمك الكامل *</label>
                    <input
                      data-testid="input-apply-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="محمد عبدالله"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">البريد الإلكتروني *</label>
                    <input
                      data-testid="input-apply-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all text-sm"
                    />
                  </div>
                </div>

                {project.roles.length > 0 && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">الدور المطلوب</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-all text-sm appearance-none"
                    >
                      <option value="" className="bg-zinc-900">-- اختر الدور (اختياري) --</option>
                      {project.roles.map((r, i) => (
                        <option key={i} value={r} className="bg-zinc-900">{r}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm text-gray-400 mb-2">رسالتك (اختياري)</label>
                  <textarea
                    data-testid="input-apply-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="عرّف بنفسك وخبراتك بإيجاز..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-all resize-none text-sm"
                  />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  data-testid="button-apply"
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-background font-medium rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  إرسال طلب التقديم
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
