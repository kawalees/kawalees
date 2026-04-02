import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  Search, Filter, ChevronDown, UserX, MapPin,
  UserPlus, CheckCircle2, Handshake,
  Palette, Building2, Users, Crown,
  ArrowLeft, Star, TrendingUp, ShieldCheck
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useGetArtists } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ArtistCard, ArtistCardSkeleton } from "@/components/ArtistCard";

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: UserPlus,
    title: "أنشئ حسابك",
    desc: "سجّل مجانًا كفنان، جهة إنتاج، أو فرقة مسرحية في أقل من دقيقتين.",
  },
  {
    step: "02",
    icon: CheckCircle2,
    title: "أكمل ملفك الشخصي",
    desc: "أضف خبراتك، أعمالك، وصورك لبناء بروفايل احترافي يظهر لصناع الفن.",
  },
  {
    step: "03",
    icon: Handshake,
    title: "تواصل واحترف",
    desc: "تقدّم لفرص الكاستنج، استقبل عروض التواصل، وابنِ شبكتك المهنية.",
  },
];

const USER_TYPES = [
  {
    icon: Palette,
    title: "الفنانون والمبدعون",
    color: "text-primary",
    bg: "bg-primary/5",
    border: "border-primary/20",
    items: [
      "بروفايل احترافي في الدليل",
      "التقديم على مشاريع الكاستنج",
      "استقبال عروض التواصل",
      "إدارة أعمالك وسيرتك الذاتية",
    ],
    cta: "انضم كفنان",
    href: "/join",
  },
  {
    icon: Building2,
    title: "شركات الإنتاج",
    color: "text-blue-400",
    bg: "bg-blue-400/5",
    border: "border-blue-400/20",
    items: [
      "نشر مشاريع كاستنج",
      "تصفّح دليل الفنانين المعتمدين",
      "استقبال طلبات وإدارة المتقدمين",
      "التواصل المباشر مع المواهب",
    ],
    cta: "إنشاء حساب شركة",
    href: "/register",
  },
  {
    icon: Users,
    title: "الفرق المسرحية",
    color: "text-purple-400",
    bg: "bg-purple-400/5",
    border: "border-purple-400/20",
    items: [
      "بروفايل مخصص للفرقة",
      "نشر فرص العضوية والأدوار",
      "إدارة أعضاء الفرقة",
      "التواصل مع صناع الفن",
    ],
    cta: "سجّل فرقتك",
    href: "/register",
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSpecialty, setActiveSpecialty] = useState<string>("الكل");
  const [activeCountry, setActiveCountry] = useState<string>("الكل");
  const [visibleCount, setVisibleCount] = useState(12);

  const { data: artists, isLoading, error } = useGetArtists();

  const [emblaRef] = useEmblaCarousel(
    { loop: true, direction: "rtl", dragFree: true },
    [Autoplay({ delay: 4000 })]
  );

  const featuredArtists = useMemo(() => artists?.filter((a) => a.featured) || [], [artists]);
  const totalArtists = artists?.length ?? 0;

  const specialties = useMemo(() => {
    if (!artists) return ["الكل"];
    const specs = new Set(
      artists.flatMap((a) =>
        a.specialty ? a.specialty.split(/[,،]/).map((s) => s.trim()).filter(Boolean) : []
      )
    );
    return ["الكل", ...Array.from(specs).sort()];
  }, [artists]);

  const countries = useMemo(() => {
    if (!artists) return ["الكل"];
    const cs = new Set(artists.map((a) => a.country).filter(Boolean));
    return ["الكل", ...Array.from(cs).sort()];
  }, [artists]);

  const filteredArtists = useMemo(() => {
    if (!artists) return [];
    return artists.filter((artist) => {
      const matchesSearch =
        artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (artist.specialty && artist.specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (artist.country && artist.country.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSpecialty =
        activeSpecialty === "الكل" ||
        artist.specialty.split(/[,،]/).map((s) => s.trim()).includes(activeSpecialty);
      const matchesCountry =
        activeCountry === "الكل" || artist.country === activeCountry;
      return matchesSearch && matchesSpecialty && matchesCountry;
    });
  }, [artists, searchTerm, activeSpecialty, activeCountry]);

  const visibleArtists = filteredArtists.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArtists.length;
  const hasActiveFilters = searchTerm || activeSpecialty !== "الكل" || activeCountry !== "الكل";

  function clearFilters() {
    setSearchTerm("");
    setActiveSpecialty("الكل");
    setActiveCountry("الكل");
    setVisibleCount(12);
  }

  return (
    <AppLayout>
      {/* ── Hero Section ─────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Stage Background"
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,106,0.1)_0%,transparent_60%)]" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/30 rounded-full mb-6">
              <Star size={12} className="text-primary fill-primary" />
              <span className="text-primary text-xs font-medium">المنصة الاحترافية للفنانين العرب</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight text-white drop-shadow-2xl">
              اكتشف <span className="text-gradient-gold">المواهب</span>
              <br /> خلف الكواليس
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto font-sans leading-relaxed">
              المنصة الأولى المخصصة لربط صناع المسرح، السينما، والفنون بأفضل الكفاءات والمحترفين في العالم العربي.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <div className="absolute inset-y-0 right-0 pl-3 pr-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <input
                type="text"
                className="w-full block pl-4 pr-12 py-5 bg-black/50 border border-white/10 rounded-2xl text-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary backdrop-blur-md shadow-2xl transition-all"
                placeholder="ابحث عن مخرج، مصمم إضاءة، كاتب..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setVisibleCount(12); }}
                data-testid="input-artist-search"
              />
            </div>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background font-bold rounded-xl hover:bg-primary/90 transition-all shadow-[0_4px_20px_rgba(200,169,106,0.3)]"
              >
                <UserPlus size={16} />
                ابدأ مجانًا
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-gray-200 rounded-xl hover:border-white/40 hover:bg-white/5 transition-all"
              >
                تصفّح الكاستنج
                <ArrowLeft size={16} />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30">
          <div className="w-px h-8 bg-white/40" />
          <ChevronDown size={16} className="text-white" />
        </div>
      </section>

      {/* ── Stats Band ───────────────────────────────────── */}
      {totalArtists > 0 && !hasActiveFilters && (
        <section className="py-10 border-y border-white/5 bg-zinc-950/40">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="font-display text-4xl font-bold text-primary">{totalArtists}+</p>
                <p className="text-gray-400 text-sm mt-1">فنان محترف</p>
              </div>
              <div>
                <p className="font-display text-4xl font-bold text-primary">3</p>
                <p className="text-gray-400 text-sm mt-1">دول مشاركة</p>
              </div>
              <div>
                <p className="font-display text-4xl font-bold text-primary">∞</p>
                <p className="text-gray-400 text-sm mt-1">فرصة للتواصل</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── How it works ─────────────────────────────────── */}
      {!hasActiveFilters && (
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="font-display text-3xl sm:text-4xl text-white mb-3">
                كيف تعمل المنصة؟
              </h2>
              <p className="text-gray-400 max-w-lg mx-auto">
                ثلاث خطوات بسيطة تفصلك عن عالم الاحترافية
              </p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Connecting line (desktop) */}
              <div className="hidden md:block absolute top-10 right-[calc(33%+2rem)] left-[calc(33%+2rem)] h-px bg-gradient-to-l from-primary/30 via-primary/10 to-primary/30" />

              {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: parseInt(step) * 0.15 }}
                  className="relative text-center"
                >
                  <div className="w-20 h-20 mx-auto bg-primary/10 border border-primary/30 rounded-2xl flex items-center justify-center mb-4 relative z-10">
                    <Icon className="text-primary" size={32} />
                    <span className="absolute -top-2.5 -left-2.5 w-6 h-6 bg-primary text-background text-xs font-bold rounded-full flex items-center justify-center">
                      {step.replace("0", "")}
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-white mb-2">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Artists Slider ───────────────────────── */}
      {featuredArtists.length > 0 && !hasActiveFilters && (
        <section className="py-16 bg-zinc-950/50 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                <span className="w-2 h-8 bg-primary rounded-full" />
                مواهب استثنائية
              </h2>
              <Link href="/" className="text-sm text-gray-400 hover:text-primary transition-colors flex items-center gap-1">
                عرض الكل
                <ArrowLeft size={14} />
              </Link>
            </div>
            <div className="embla" ref={emblaRef}>
              <div className="embla__container gap-6 py-4">
                {featuredArtists.map((artist) => (
                  <div key={artist.id} className="embla__slide w-[85%] sm:w-[45%] md:w-[30%] lg:w-[25%] flex-shrink-0">
                    <div className="h-[400px]">
                      <ArtistCard artist={artist} isFeatured={true} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── User types ───────────────────────────────────── */}
      {!hasActiveFilters && (
        <section className="py-20 bg-zinc-950/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="font-display text-3xl sm:text-4xl text-white mb-3">لمن كواليس؟</h2>
              <p className="text-gray-400 max-w-lg mx-auto">
                منصة مصممة لكل صانع فن، مهما كان دوره
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {USER_TYPES.map(({ icon: Icon, title, color, bg, border, items, cta, href }) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`rounded-2xl border p-6 flex flex-col ${bg} ${border}`}
                >
                  <div className={`w-12 h-12 rounded-xl ${bg} border ${border} flex items-center justify-center mb-4`}>
                    <Icon className={color} size={22} />
                  </div>
                  <h3 className={`font-display text-xl font-bold mb-4 ${color}`}>{title}</h3>
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle2 size={14} className={`${color} flex-shrink-0 mt-0.5 opacity-70`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={href}
                    className={`w-full text-center py-2.5 rounded-xl text-sm font-medium border transition-all hover:opacity-90 ${border} ${color}`}
                  >
                    {cta}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Main Directory Section ────────────────────────── */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header + Filters */}
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                <span className="w-2 h-8 bg-white/20 rounded-full" />
                الدليل المهني
                {!isLoading && (
                  <span className="text-base font-sans text-gray-400 font-normal">
                    ({filteredArtists.length} فنان)
                  </span>
                )}
              </h2>

              {countries.length > 2 && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary flex-shrink-0" />
                  <select
                    value={activeCountry}
                    onChange={(e) => { setActiveCountry(e.target.value); setVisibleCount(12); }}
                    data-testid="select-country-filter"
                    className="bg-white/5 border border-white/10 text-gray-300 text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-primary/50 transition-all"
                  >
                    {countries.map((c) => (
                      <option key={c} value={c} className="bg-zinc-900">{c}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Specialty Filter Tabs */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-gray-400">
                <Filter size={16} />
                <span className="text-sm">تخصص:</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 flex-wrap">
                {specialties.map((spec) => (
                  <button
                    key={spec}
                    data-testid={`filter-specialty-${spec}`}
                    onClick={() => { setActiveSpecialty(spec); setVisibleCount(12); }}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      activeSpecialty === spec
                        ? "bg-primary text-background shadow-[0_0_15px_rgba(200,169,106,0.3)]"
                        : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-500 hover:text-primary transition-colors px-2 py-1 rounded-lg border border-white/10 hover:border-primary/30"
                >
                  مسح الكل
                </button>
              )}
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <ArtistCardSkeleton key={i} />)}
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-destructive/10 border border-destructive/30 rounded-2xl">
              <p className="text-destructive font-display text-xl">حدث خطأ أثناء تحميل البيانات.</p>
            </div>
          ) : visibleArtists.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 px-4 text-center border border-dashed border-white/10 rounded-3xl bg-white/5"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <UserX size={32} className="text-gray-500" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-2">لم نجد نتائج مطابقة</h3>
              <p className="text-gray-400 max-w-md">
                حاول البحث بكلمات مختلفة أو تغيير إعدادات التصفية لرؤية المزيد من المواهب.
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 px-6 py-2 border border-primary text-primary rounded-full hover:bg-primary/10 transition-colors"
              >
                مسح عوامل التصفية
              </button>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                <AnimatePresence mode="popLayout">
                  {visibleArtists.map((artist, i) => (
                    <motion.div
                      key={artist.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: (i % 12) * 0.05 }}
                    >
                      <ArtistCard artist={artist} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm mb-6">
                  عرض {Math.min(visibleCount, filteredArtists.length)} من {filteredArtists.length} فنان
                </p>
                {hasMore && (
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 12)}
                    data-testid="button-load-more"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-primary/50 text-primary hover:bg-primary hover:text-background font-bold rounded-xl transition-all duration-300 group"
                  >
                    تحميل المزيد
                    <ChevronDown className="group-hover:translate-y-1 transition-transform" size={20} />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Trust Section ─────────────────────────────────── */}
      {!hasActiveFilters && (
        <section className="py-16 border-t border-white/5 bg-zinc-950/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center gap-3 p-6">
                <ShieldCheck className="text-primary" size={32} />
                <h3 className="font-display text-lg text-white">فنانون موثّقون</h3>
                <p className="text-gray-400 text-sm">كل فنان في الدليل يمر بمراجعة إدارية قبل النشر</p>
              </div>
              <div className="flex flex-col items-center gap-3 p-6">
                <TrendingUp className="text-primary" size={32} />
                <h3 className="font-display text-lg text-white">فرص كاستنج حقيقية</h3>
                <p className="text-gray-400 text-sm">مشاريع منشورة من شركات إنتاج معتمدة</p>
              </div>
              <div className="flex flex-col items-center gap-3 p-6">
                <Users className="text-primary" size={32} />
                <h3 className="font-display text-lg text-white">مجتمع متنامٍ</h3>
                <p className="text-gray-400 text-sm">منصة تجمع الفنانين وصناع الفن من أنحاء العالم العربي</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA to Pricing ───────────────────────────────── */}
      {!hasActiveFilters && (
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,106,0.06)_0%,transparent_70%)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full mb-6">
              <Crown className="text-primary" size={14} />
              <span className="text-primary text-xs font-medium">مجاني لأول سنة كاملة</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-white mb-4">
              ابدأ رحلتك في كواليس
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">
              سجّل الآن مجانًا واستمتع بجميع مزايا المنصة. الترقية لباقة Pro أو Elite متاحة في أي وقت.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-background font-bold rounded-xl hover:bg-primary/90 transition-all shadow-[0_4px_20px_rgba(200,169,106,0.3)] hover:shadow-[0_8px_30px_rgba(200,169,106,0.4)]"
              >
                <UserPlus size={18} />
                إنشاء حساب مجاني
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-primary/40 text-primary rounded-xl hover:bg-primary/10 transition-all"
              >
                <Crown size={16} />
                عرض الباقات
              </Link>
            </div>
          </div>
        </section>
      )}
    </AppLayout>
  );
}
