import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, XCircle, Lock, Eye, Mail, Phone, MapPin,
  Briefcase, GraduationCap, Link2, Film, AlertCircle, RefreshCw,
  User, LogOut, ChevronDown, ChevronUp, Star, StarOff, Trash2,
  Users, ClipboardList, Edit3
} from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

interface ArtistRecord {
  id: string;
  name: string;
  specialty: string;
  country: string;
  city?: string;
  experience: string;
  bio?: string;
  education?: string;
  imageUrl?: string;
  email?: string;
  phone?: string;
  portfolioLinks?: string;
  works?: string;
  gender?: string;
  dateOfBirth?: string;
  workTypes?: string;
  languages?: string;
  dialects?: string;
  featured?: boolean;
  approved?: boolean;
  createdAt?: string;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("ar-SA", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function ArtistExpandedDetails({ app }: { app: ArtistRecord }) {
  return (
    <div className="p-5 space-y-4 border-t border-white/10">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {app.gender && (
          <div>
            <p className="text-xs text-gray-500 mb-1">الجنس</p>
            <p className="text-gray-300 text-sm">{app.gender === "male" ? "ذكر" : app.gender === "female" ? "أنثى" : app.gender}</p>
          </div>
        )}
        {app.dateOfBirth && (
          <div>
            <p className="text-xs text-gray-500 mb-1">تاريخ الميلاد</p>
            <p className="text-gray-300 text-sm">{app.dateOfBirth}</p>
          </div>
        )}
        {app.workTypes && (
          <div>
            <p className="text-xs text-gray-500 mb-1">مجالات العمل</p>
            <p className="text-gray-300 text-sm">{app.workTypes}</p>
          </div>
        )}
        {app.languages && (
          <div>
            <p className="text-xs text-gray-500 mb-1">اللغات</p>
            <p className="text-gray-300 text-sm">{app.languages}</p>
          </div>
        )}
        {app.dialects && (
          <div>
            <p className="text-xs text-gray-500 mb-1">اللهجات</p>
            <p className="text-gray-300 text-sm">{app.dialects}</p>
          </div>
        )}
      </div>
      {app.bio && (
        <div>
          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Eye size={11} /> السيرة الذاتية</p>
          <p className="text-gray-300 text-sm leading-relaxed">{app.bio}</p>
        </div>
      )}
      {app.education && (
        <div>
          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><GraduationCap size={11} /> التعليم</p>
          <p className="text-gray-300 text-sm">{app.education}</p>
        </div>
      )}
      {app.works && (
        <div>
          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Film size={11} /> الأعمال</p>
          <p className="text-gray-300 text-sm">{app.works}</p>
        </div>
      )}
      {app.portfolioLinks && (
        <div>
          <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Link2 size={11} /> روابط البورتفوليو</p>
          <p className="text-gray-300 text-sm break-all">{app.portfolioLinks}</p>
        </div>
      )}
    </div>
  );
}

function ApplicationCard({
  app, onApprove, onReject, isLoading,
}: {
  app: ArtistRecord;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isLoading: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {app.imageUrl ? (
              <img src={app.imageUrl} alt={app.name} className="w-full h-full object-cover" />
            ) : (
              <User size={24} className="text-primary/60" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-white font-display font-bold text-lg truncate">{app.name}</h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
              <span className="text-primary text-sm font-medium">{app.specialty}</span>
              <span className="text-gray-500 text-sm flex items-center gap-1"><MapPin size={12} />{app.country}{app.city ? `، ${app.city}` : ""}</span>
              <span className="text-gray-500 text-sm flex items-center gap-1"><Briefcase size={12} />{app.experience}</span>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
              {app.email && <span className="text-gray-400 text-xs flex items-center gap-1"><Mail size={11} />{app.email}</span>}
              {app.phone && <span className="text-gray-400 text-xs flex items-center gap-1"><Phone size={11} />{app.phone}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-gray-600 text-xs hidden sm:block">{formatDate(app.createdAt)}</span>
          <button onClick={() => setExpanded(!expanded)} data-testid={`button-expand-${app.id}`}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button onClick={() => onApprove(app.id)} data-testid={`button-approve-${app.id}`} disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 rounded-xl text-sm font-medium transition-colors disabled:opacity-40">
            <CheckCircle2 size={16} />موافقة
          </button>
          <button onClick={() => onReject(app.id)} data-testid={`button-reject-${app.id}`} disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-destructive/10 hover:bg-destructive/20 border border-destructive/20 text-destructive rounded-xl text-sm font-medium transition-colors disabled:opacity-40">
            <XCircle size={16} />رفض
          </button>
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <ArtistExpandedDetails app={app} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ApprovedArtistRow({
  artist, onToggleFeatured, onDelete, isLoading,
}: {
  artist: ArtistRecord;
  onToggleFeatured: (id: string, featured: boolean) => void;
  onDelete: (id: string, name: string) => void;
  isLoading: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {artist.imageUrl ? (
              <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />
            ) : (
              <User size={20} className="text-primary/60" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-white font-medium truncate">{artist.name}</h3>
              {artist.featured && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/20">مميز</span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
              <span className="text-primary text-xs">{artist.specialty}</span>
              <span className="text-gray-500 text-xs">{artist.country}</span>
              {artist.email && <span className="text-gray-500 text-xs flex items-center gap-1"><Mail size={10} />{artist.email}</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-gray-600 text-xs hidden lg:block">{formatDate(artist.createdAt)}</span>
          <button onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            {expanded ? <ChevronUp size={14} /> : <Eye size={14} />}
          </button>
          <button
            onClick={() => onToggleFeatured(artist.id, !artist.featured)}
            disabled={isLoading}
            title={artist.featured ? "إلغاء التمييز" : "جعله مميزاً"}
            className={`p-1.5 rounded-lg border transition-colors disabled:opacity-40 ${artist.featured ? "bg-primary/20 border-primary/30 text-primary hover:bg-destructive/20 hover:border-destructive/30 hover:text-destructive" : "bg-white/5 border-white/10 text-gray-400 hover:bg-primary/10 hover:border-primary/20 hover:text-primary"}`}>
            {artist.featured ? <StarOff size={14} /> : <Star size={14} />}
          </button>
          <button
            onClick={() => onDelete(artist.id, artist.name)}
            disabled={isLoading}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive transition-colors disabled:opacity-40">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <ArtistExpandedDetails app={artist} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminPanel() {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem("kawalees_admin_key") || "");
  const [keyInput, setKeyInput] = useState("");
  const [keyError, setKeyError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem("kawalees_admin_key"));
  const [activeTab, setActiveTab] = useState<"applications" | "artists">("applications");

  const [applications, setApplications] = useState<ArtistRecord[]>([]);
  const [approvedArtists, setApprovedArtists] = useState<ArtistRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");

  const getHeaders = (key?: string) => ({
    "Content-Type": "application/json",
    "x-admin-key": key ?? adminKey,
  });

  const fetchAll = async () => {
    setIsLoading(true);
    setError("");
    try {
      const [appsRes, artistsRes] = await Promise.all([
        fetch(`${baseUrl}/api/admin/applications`, { headers: { "x-admin-key": adminKey } }),
        fetch(`${baseUrl}/api/admin/artists`, { headers: { "x-admin-key": adminKey } }),
      ]);

      if (appsRes.status === 401 || artistsRes.status === 401) {
        setError("انتهت جلستك. يرجى تسجيل الدخول مجدداً.");
        setIsAuthenticated(false);
        sessionStorage.removeItem("kawalees_admin_key");
        return;
      }

      if (!appsRes.ok || !artistsRes.ok) {
        setError("خطأ من الخادم. حاول مجدداً.");
        return;
      }

      const [apps, artists] = await Promise.all([appsRes.json(), artistsRes.json()]);
      setApplications(apps);
      setApprovedArtists(artists);
    } catch {
      setError("تعذّر الاتصال بالخادم. تحقق من اتصالك بالإنترنت وحاول مجدداً.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!keyInput.trim()) { setKeyError("يرجى إدخال مفتاح الإدارة"); return; }
    setKeyError("");
    const key = keyInput.trim();
    setIsLoading(true);
    try {
      const [appsRes, artistsRes] = await Promise.all([
        fetch(`${baseUrl}/api/admin/applications`, { headers: { "x-admin-key": key } }),
        fetch(`${baseUrl}/api/admin/artists`, { headers: { "x-admin-key": key } }),
      ]);

      if (appsRes.status === 401 || artistsRes.status === 401) {
        setKeyError("مفتاح الإدارة غير صحيح");
        return;
      }

      if (!appsRes.ok || !artistsRes.ok) {
        setKeyError("خطأ في الخادم. حاول مجدداً.");
        return;
      }

      const [apps, artists] = await Promise.all([appsRes.json(), artistsRes.json()]);
      sessionStorage.setItem("kawalees_admin_key", key);
      setAdminKey(key);
      setApplications(apps);
      setApprovedArtists(artists);
      setIsAuthenticated(true);
    } catch {
      setKeyError("تعذّر الاتصال بالخادم. تأكد من أنك تستخدم رابط التطوير وليس رابط النشر.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("kawalees_admin_key");
    setAdminKey("");
    setIsAuthenticated(false);
    setApplications([]);
    setApprovedArtists([]);
  };

  useEffect(() => {
    if (isAuthenticated && adminKey) fetchAll();
  }, []);

  const showMsg = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(""), 4000); };

  const handleApprove = async (id: string) => {
    setLoadingAction(true);
    try {
      const res = await fetch(`${baseUrl}/api/admin/applications/${id}/approve`, { method: "PATCH", headers: getHeaders() });
      if (!res.ok) throw new Error();
      const approved = applications.find(a => a.id === id);
      setApplications(prev => prev.filter(a => a.id !== id));
      if (approved) setApprovedArtists(prev => [{ ...approved, approved: true }, ...prev]);
      showMsg("تمت الموافقة وإرسال بريد التأكيد للفنان.");
    } catch { setError("حدث خطأ أثناء الموافقة."); }
    finally { setLoadingAction(false); }
  };

  const handleReject = async (id: string) => {
    if (!confirm("هل أنت متأكد من رفض هذا الطلب؟ سيتم إرسال إشعار للمتقدم.")) return;
    setLoadingAction(true);
    try {
      const res = await fetch(`${baseUrl}/api/admin/applications/${id}`, { method: "DELETE", headers: getHeaders() });
      if (!res.ok) throw new Error();
      setApplications(prev => prev.filter(a => a.id !== id));
      showMsg("تم رفض الطلب وإرسال إشعار للمتقدم.");
    } catch { setError("حدث خطأ أثناء الرفض."); }
    finally { setLoadingAction(false); }
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    setLoadingAction(true);
    try {
      const res = await fetch(`${baseUrl}/api/admin/artists/${id}`, {
        method: "PATCH", headers: getHeaders(), body: JSON.stringify({ featured }),
      });
      if (!res.ok) throw new Error();
      setApprovedArtists(prev => prev.map(a => a.id === id ? { ...a, featured } : a));
      showMsg(featured ? "تم تمييز الفنان وسيظهر في القسم المميز." : "تم إلغاء تمييز الفنان.");
    } catch { setError("حدث خطأ أثناء التحديث."); }
    finally { setLoadingAction(false); }
  };

  const handleDeleteArtist = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف الفنان "${name}" من الدليل نهائياً؟`)) return;
    setLoadingAction(true);
    try {
      const res = await fetch(`${baseUrl}/api/admin/artists/${id}`, { method: "DELETE", headers: getHeaders() });
      if (!res.ok) throw new Error();
      setApprovedArtists(prev => prev.filter(a => a.id !== id));
      showMsg("تم حذف الفنان من الدليل.");
    } catch { setError("حدث خطأ أثناء الحذف."); }
    finally { setLoadingAction(false); }
  };

  return (
    <AppLayout>
      <div className="pt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
              لوحة <span className="text-gradient-gold">الإدارة</span>
            </h1>
            <p className="text-gray-400">إدارة طلبات الانضمام والفنانين المعتمدين</p>
          </div>
          {isAuthenticated && (
            <button onClick={handleLogout} data-testid="button-logout"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-sm">
              <LogOut size={16} />خروج
            </button>
          )}
        </div>

        {!isAuthenticated ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock size={28} className="text-primary" />
              </div>
              <h2 className="text-xl font-display font-bold text-white mb-2">منطقة محمية</h2>
              <p className="text-gray-400 text-sm mb-6">أدخل مفتاح الإدارة للوصول إلى لوحة التحكم</p>
              <div className="space-y-4">
                <input type="password" value={keyInput} onChange={e => setKeyInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()} data-testid="input-admin-key"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-center focus:outline-none focus:border-primary transition-all"
                  placeholder="مفتاح الإدارة" />
                {keyError && <p className="text-destructive text-sm">{keyError}</p>}
                <button onClick={handleLogin} data-testid="button-admin-login" disabled={isLoading}
                  className="w-full py-3 bg-gradient-gold text-background font-bold rounded-xl transition-all hover:shadow-[0_4px_20px_rgba(200,169,106,0.4)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isLoading ? <><RefreshCw size={16} className="animate-spin" />جاري التحقق...</> : "دخول"}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <div>
            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6 p-1 bg-white/5 rounded-2xl w-fit">
              <button
                onClick={() => setActiveTab("applications")}
                data-testid="tab-applications"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "applications" ? "bg-primary text-background" : "text-gray-400 hover:text-white"}`}>
                <ClipboardList size={16} />
                الطلبات المعلقة
                {applications.length > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === "applications" ? "bg-background/20 text-background" : "bg-primary/20 text-primary"}`}>
                    {applications.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("artists")}
                data-testid="tab-artists"
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === "artists" ? "bg-primary text-background" : "text-gray-400 hover:text-white"}`}>
                <Users size={16} />
                الفنانون المعتمدون
                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === "artists" ? "bg-background/20 text-background" : "bg-white/10 text-gray-400"}`}>
                  {approvedArtists.length}
                </span>
              </button>
            </div>

            {/* Actions bar */}
            <div className="flex items-center justify-end mb-4">
              <button onClick={() => fetchAll()} data-testid="button-refresh" disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors text-sm disabled:opacity-40">
                <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />تحديث
              </button>
            </div>

            {/* Messages */}
            <AnimatePresence>
              {message && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
                  <CheckCircle2 size={16} />{message}
                </motion.div>
              )}
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mb-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
                  <AlertCircle size={16} />{error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tab content */}
            {activeTab === "applications" && (
              <div>
                {isLoading ? (
                  <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />)}</div>
                ) : applications.length === 0 ? (
                  <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl">
                    <CheckCircle2 size={48} className="text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 font-display text-xl">لا توجد طلبات معلقة</p>
                    <p className="text-gray-600 text-sm mt-2">جميع الطلبات تمت مراجعتها.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {applications.map(app => (
                        <ApplicationCard key={app.id} app={app} onApprove={handleApprove} onReject={handleReject} isLoading={loadingAction} />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            )}

            {activeTab === "artists" && (
              <div>
                {isLoading ? (
                  <div className="space-y-3">{[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-white/5 border border-white/10 rounded-2xl animate-pulse" />)}</div>
                ) : approvedArtists.length === 0 ? (
                  <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl">
                    <Users size={48} className="text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 font-display text-xl">لا يوجد فنانون معتمدون بعد</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-gray-500 text-sm mb-4 flex items-center gap-2">
                      <Star size={14} className="text-primary" />
                      اضغط على نجمة لتمييز فنان ليظهر في قسم "مواهب استثنائية" في الرئيسية
                    </p>
                    {approvedArtists.map(artist => (
                      <ApprovedArtistRow key={artist.id} artist={artist}
                        onToggleFeatured={handleToggleFeatured} onDelete={handleDeleteArtist} isLoading={loadingAction} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
