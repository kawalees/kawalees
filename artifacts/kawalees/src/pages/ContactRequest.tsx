import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, User, Building, Briefcase, MessageSquare } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { artists } from "@/data/artists";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xpwznoel";

const inputClasses =
  "w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 font-sans";
const labelClasses = "block text-sm font-medium text-gray-400 mb-2 font-display";

export default function ContactRequest() {
  const queryParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const preSelectedArtist = queryParams.get("artist") || "";

  const [artistName, setArtistName] = useState(preSelectedArtist);
  const [requesterName, setRequesterName] = useState("");
  const [company, setCompany] = useState("");
  const [projectType, setProjectType] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!artistName || !requesterName || !projectType || message.length < 10) {
      setError("الرجاء تعبئة جميع الحقول المطلوبة بشكل صحيح.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ artistName, requesterName, company, projectType, message }),
      });
      if (res.ok) {
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setError("فشل الإرسال. يرجى المحاولة مجددًا.");
      }
    } catch {
      setError("حدث خطأ. تحقق من اتصالك بالإنترنت.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            طلب <span className="text-gradient-gold">تواصل</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            نحن هنا لتسهيل تواصلك مع أفضل المواهب. قم بتعبئة النموذج وسنقوم بإيصال طلبك للفنان المعني.
          </p>
        </div>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel rounded-3xl p-12 text-center border-primary/30"
          >
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} className="text-primary" />
            </div>
            <h2 className="text-3xl font-display font-bold text-white mb-4">تم إرسال طلبك بنجاح!</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">
              سيقوم فريق كواليس بمراجعة طلبك والتواصل مع الفنان. سنتواصل معك قريبًا.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="px-8 py-3 bg-white/10 text-white hover:bg-primary hover:text-background font-bold rounded-xl transition-colors"
            >
              العودة للرئيسية
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-3xl p-6 sm:p-10 md:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">

              <div className="space-y-6">
                <h3 className="text-xl font-display font-bold text-white border-b border-white/10 pb-4">المعلومات الأساسية</h3>

                {/* Artist Selection */}
                <div>
                  <label className={labelClasses}>اختر الفنان المطلوب *</label>
                  <div className="relative">
                    <select
                      value={artistName}
                      onChange={(e) => setArtistName(e.target.value)}
                      className={`${inputClasses} appearance-none pr-10`}
                    >
                      <option value="" className="bg-zinc-900">-- اختر فناناً --</option>
                      {artists.map((a) => (
                        <option key={a.id} value={a.name} className="bg-zinc-900">
                          {a.name} ({a.specialty.split(/[,،]/)[0]?.trim()})
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <User className="text-gray-500" size={18} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClasses}>اسمك الكامل *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={requesterName}
                        onChange={(e) => setRequesterName(e.target.value)}
                        className={`${inputClasses} pr-10`}
                        placeholder="محمد عبدالله"
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <User className="text-gray-500" size={18} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClasses}>الجهة / الشركة</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className={`${inputClasses} pr-10`}
                        placeholder="شركة إنتاج..."
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <Building className="text-gray-500" size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-4">
                <h3 className="text-xl font-display font-bold text-white border-b border-white/10 pb-4">تفاصيل المشروع</h3>

                <div>
                  <label className={labelClasses}>نوع المشروع *</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className={`${inputClasses} pr-10`}
                      placeholder="مسرحية، فيلم قصير، إعلان..."
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <Briefcase className="text-gray-500" size={18} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>تفاصيل العرض / الرسالة *</label>
                  <div className="relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      className={`${inputClasses} pr-10 resize-none`}
                      placeholder="اشرح باختصار طبيعة العمل ودور الفنان المطلوب..."
                    />
                    <div className="absolute top-4 right-3 flex items-start pointer-events-none">
                      <MessageSquare className="text-gray-500" size={18} />
                    </div>
                  </div>
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-gold text-background font-bold text-lg rounded-xl shadow-[0_4px_20px_rgba(200,169,106,0.2)] hover:shadow-[0_8px_30px_rgba(200,169,106,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {submitting ? (
                    <span className="w-6 h-6 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={20} className="rotate-180" />
                      إرسال الطلب
                    </>
                  )}
                </button>
                <p className="text-center text-gray-500 text-xs mt-4">
                  بياناتك آمنة. لن يتم مشاركة معلومات التواصل الخاصة بالفنانين مباشرة.
                </p>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
