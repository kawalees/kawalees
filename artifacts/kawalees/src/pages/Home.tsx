import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronDown,
  Film,
  Filter,
  Handshake,
  MapPin,
  Palette,
  Search,
  ShieldCheck,
  Star,
  TrendingUp,
  UserPlus,
  UserX,
  Users,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { AppLayout } from "@/components/layout/AppLayout";
import { ArtistCard } from "@/components/ArtistCard";
import { artists as allArtists } from "@/data/artists";

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: UserPlus,
    title: "سجّل ملفك المهني",
    desc: "أضف تخصصاتك وأعمالك وصورتك لتظهر في الدليل الاحترافي للفنانين.",
  },
  {
    step: "02",
    icon: Film,
    title: "تصفّح الكاستنج",
    desc: "اكتشف الفرص المتاحة من مشاريع سينما ومسرح وتلفزيون في العالم العربي.",
  },
  {
    step: "03",
    icon: Handshake,
    title: "تواصل واحترف",
    desc: "تقدّم للأدوار المناسبة وابنِ شبكتك المهنية مع صناع الفن.",
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
    color: "text-primary",
    bg: "bg-primary/5",
    border: "border-primary/20",
    items: [
      "تصفّح دليل الفنانين المعتمدين",
      "طلب تواصل مع أي فنان",
      "فرص كاستنج موثّقة",
      "وصول سريع للمواهب المناسبة",
    ],
    cta: "تواصل معنا",
    href: "/contact",
  },
  {
    icon: Users,
    title: "الفرق المسرحية",
    color: "text-primary",
    bg: "bg-primary/5",
    border: "border-primary/20",
    items: [
      "بروفايل مخصص للفرقة",
      "نشر فرص العضوية والأدوار",
      "الوصول لدليل الفنانين",
      "التواصل مع صناع الفن",
    ],
    cta: "انضم كفرقة",
    href: "/join",
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSpecialty, setActiveSpecialty] = useState<string>("الكل");
  const [activeCountry, setActiveCountry] = useState<string>("الكل");
  const [visibleCount, setVisibleCount] = useState(12);

  const [emblaRef] = useEmblaCarousel({ loop: true, direction: "rtl", dragFree: true }, [
    Autoplay({ delay: 4000 }),
  ]);

  const featuredArtists = useMemo(() => allArtists.filter((artist) => artist.featured), []);
  const totalArtists = allArtists.length;
  const totalCountries = useMemo(
    () => new Set(allArtists.map((artist) => artist.country).filter(Boolean)).size,
    [],
  );
  const hasArtists = totalArtists > 0;

  const specialties = useMemo(() => {
    const specs = new Set(
      allArtists.flatMap((artist) =>
        artist.specialty
          ? artist.specialty
              .split(/[,،]/)
              .map((specialty) => specialty.trim())
              .filter(Boolean)
          : [],
      ),
    );
    return ["الكل", ...Array.from(specs).sort()];
  }, []);

  const countries = useMemo(() => {
    const countrySet = new Set(allArtists.map((artist) => artist.country).filter(Boolean));
    return ["الكل", ...Array.from(countrySet).sort()];
  }, []);

  const filteredArtists = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return allArtists
      .filter((artist) => {
        const searchableFields = [
          artist.name,
          artist.specialty,
          artist.country,
          artist.city,
          artist.experience,
          artist.workTypes,
          artist.languages,
          artist.dialects,
        ];
        const matchesSearch =
          !normalizedSearch ||
          searchableFields.some((field) => field?.toLowerCase().includes(normalizedSearch));
        const matchesSpecialty =
          activeSpecialty === "الكل" ||
          artist.specialty
            .split(/[,،]/)
            .map((specialty) => specialty.trim())
            .includes(activeSpecialty);
        const matchesCountry = activeCountry === "الكل" || artist.country === activeCountry;
        return matchesSearch && matchesSpecialty && matchesCountry;
      })
      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }, [searchTerm, activeSpecialty, activeCountry]);

  const visibleArtists = filteredArtists.slice(0, visibleCount);
  const hasMore = visibleCount < filteredArtists.length;
  const hasActiveFilters = searchTerm || activeSpecialty !== "الكل" || activeCountry !== "الكل";
  const isEmptyDirectory = !hasActiveFilters && !hasArtists;

  function clearFilters() {
    setSearchTerm("");
    setActiveSpecialty("الكل");
    setActiveCountry("الكل");
    setVisibleCount(12);
  }

  return (
    <AppLayout>
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-4 pt-28">
        <div className="absolute inset-0 z-0 bg-black">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 shadow-[0_0_34px_rgba(200,169,106,0.18)] backdrop-blur-md">
              <Star size={12} className="fill-primary text-primary" />
              <span className="text-xs font-medium text-primary">
                المنصة الاحترافية للفنانين العرب
              </span>
            </div>

            <h1 className="font-display mb-6 text-5xl font-bold tracking-tight text-white drop-shadow-2xl md:text-7xl lg:text-8xl">
              اكتشف <span className="text-gradient-gold">المواهب</span>
              <br /> خلف الكواليس
            </h1>
            <p className="mx-auto mb-10 max-w-2xl font-sans text-xl leading-relaxed text-gray-300 md:text-2xl">
              المنصة الأولى المخصصة لربط صناع المسرح، السينما، والفنون بأفضل الكفاءات والمحترفين في
              العالم العربي.
            </p>

            <div className="premium-search mx-auto mb-8 max-w-2xl">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pl-3 pr-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <input
                  type="text"
                  className="focus-gold block w-full rounded-2xl border border-white/10 bg-black/70 py-5 pl-4 pr-12 text-lg text-white shadow-2xl placeholder:text-gray-500 backdrop-blur-md transition-all focus:border-primary/55"
                  placeholder="ابحث عن مخرج، مصمم إضاءة، كاتب..."
                  aria-label="البحث في دليل الفنانين"
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setVisibleCount(12);
                  }}
                  data-testid="input-artist-search"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-primary/10 bg-background px-4 py-7">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-4">
          <Link
            href="/join"
            className="focus-gold gold-cta inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold"
          >
            <UserPlus size={16} />
            <span className="relative z-10">انضم كفنان</span>
          </Link>
          <Link
            href="/projects"
            className="focus-gold group inline-flex items-center gap-3 rounded-xl border border-white/20 bg-black/30 px-5 py-3 text-gray-200 transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-white"
          >
            تصفّح الكاستنج
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-primary transition-all group-hover:-translate-x-0.5 group-hover:border-primary/40 group-hover:bg-primary/15">
              <ArrowLeft size={15} />
            </span>
          </Link>
        </div>
      </section>

      {hasArtists && !hasActiveFilters && (
        <section className="border-y border-primary/10 bg-zinc-950/45 py-10">
          <div className="mx-auto max-w-4xl px-4">
            <div className="grid grid-cols-3 gap-4 text-center sm:gap-6">
              {[
                { value: totalArtists, label: "فنان محترف" },
                { value: totalCountries, label: "دول مشاركة" },
                { value: "∞", label: "فرصة للتواصل" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="theatre-card rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="font-display text-3xl font-bold text-primary sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!hasActiveFilters && (
        <section className="relative py-20">
          <div className="absolute inset-x-0 top-0 gold-divider opacity-60" />
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="mb-14 text-center">
              <h2 className="font-display mb-3 text-3xl text-white sm:text-4xl">
                كيف تعمل المنصة؟
              </h2>
              <p className="mx-auto max-w-lg text-gray-400">
                ثلاث خطوات بسيطة تفصلك عن عالم الاحترافية
              </p>
            </div>
            <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3">
              {HOW_IT_WORKS.map(({ step, icon: Icon, title, desc }, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  className="premium-card theatre-card p-6 text-center"
                >
                  <div className="relative z-10 mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
                    <Icon className="text-primary" size={32} />
                    <span className="absolute -left-2.5 -top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-background">
                      {step.replace("0", "")}
                    </span>
                  </div>
                  <h3 className="font-display mb-2 text-xl text-white">{title}</h3>
                  <p className="text-sm leading-relaxed text-gray-400">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {featuredArtists.length > 0 && !hasActiveFilters && (
        <section className="relative overflow-hidden border-y border-primary/10 bg-zinc-950/50 py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(200,169,106,0.12),transparent_34rem)]" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-display flex items-center gap-3 text-3xl font-bold text-white">
                <span className="h-8 w-2 rounded-full bg-primary" />
                مواهب استثنائية
              </h2>
              <Link
                href="/"
                className="focus-gold flex items-center gap-1 rounded-full border border-white/10 px-4 py-2 text-sm text-gray-400 transition-colors hover:border-primary/30 hover:text-primary"
              >
                عرض الكل
                <ArrowLeft size={14} />
              </Link>
            </div>
            <div className="embla" ref={emblaRef}>
              <div className="embla__container gap-6 py-4">
                {featuredArtists.map((artist) => (
                  <div
                    key={artist.id}
                    className="embla__slide w-[85%] flex-shrink-0 sm:w-[45%] md:w-[30%] lg:w-[25%]"
                  >
                    <div className="aspect-[3/4]">
                      <ArtistCard artist={artist} isFeatured />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {!hasActiveFilters && (
        <section className="bg-zinc-950/30 py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="mb-14 text-center">
              <h2 className="font-display mb-3 text-3xl text-white sm:text-4xl">لمن كواليس؟</h2>
              <p className="mx-auto max-w-lg text-gray-400">
                منصة مصممة لكل صانع فن، مهما كان دوره
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {USER_TYPES.map(({ icon: Icon, title, color, bg, border, items, cta, href }) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`premium-card theatre-card flex flex-col p-6 ${bg} ${border}`}
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${bg} border ${border}`}
                  >
                    <Icon className={color} size={22} />
                  </div>
                  <h3 className={`font-display mb-4 text-xl font-bold ${color}`}>{title}</h3>
                  <ul className="mb-6 flex-1 space-y-2.5">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle2
                          size={14}
                          className={`${color} mt-0.5 flex-shrink-0 opacity-70`}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={href}
                    className={`focus-gold w-full rounded-xl border py-2.5 text-center text-sm font-medium transition-all hover:opacity-90 ${border} ${color}`}
                  >
                    {cta}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <h2 className="font-display flex items-center gap-3 text-3xl font-bold text-white">
                <span className="h-8 w-2 rounded-full bg-white/20" />
                الدليل المهني
                <span className="font-sans text-base font-normal text-gray-400">
                  ({filteredArtists.length} فنان)
                </span>
              </h2>

              {countries.length > 2 && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="flex-shrink-0 text-primary" />
                  <select
                    value={activeCountry}
                    onChange={(event) => {
                      setActiveCountry(event.target.value);
                      setVisibleCount(12);
                    }}
                    data-testid="select-country-filter"
                    className="focus-gold rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300 transition-all focus:border-primary/50"
                    aria-label="تصفية حسب الدولة"
                  >
                    {countries.map((country) => (
                      <option key={country} value={country} className="bg-zinc-900">
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-gray-400">
                <Filter size={16} />
                <span className="text-sm">تخصص:</span>
              </div>
              <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
                {specialties.map((specialty) => (
                  <button
                    key={specialty}
                    type="button"
                    data-testid={`filter-specialty-${specialty}`}
                    onClick={() => {
                      setActiveSpecialty(specialty);
                      setVisibleCount(12);
                    }}
                    className={`focus-gold whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
                      activeSpecialty === specialty
                        ? "bg-primary text-background"
                        : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="focus-gold rounded-lg border border-white/10 px-2 py-1 text-xs text-gray-500 transition-colors hover:border-primary/30 hover:text-primary"
                >
                  مسح الكل
                </button>
              )}
            </div>
          </div>

          {visibleArtists.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="premium-card theatre-card flex flex-col items-center justify-center px-4 py-32 text-center"
            >
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
                <UserX size={32} className="text-gray-500" />
              </div>
              <h3 className="font-display mb-2 text-2xl font-bold text-white">
                {isEmptyDirectory ? "الدليل جاهز لاستقبال الملفات الرسمية" : "لم نجد نتائج مطابقة"}
              </h3>
              <p className="max-w-md text-gray-400">
                {isEmptyDirectory
                  ? "لم يتم نشر أي فنان بعد. ستظهر هنا الملفات المعتمدة بعد مراجعتها وإضافتها رسميًا."
                  : "حاول البحث بكلمات مختلفة أو تغيير إعدادات التصفية."}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="focus-gold mt-6 rounded-full border border-primary px-6 py-2 text-primary transition-colors hover:bg-primary/10"
                >
                  مسح عوامل التصفية
                </button>
              )}
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <AnimatePresence mode="popLayout">
                  {visibleArtists.map((artist, index) => (
                    <motion.div
                      key={artist.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: (index % 12) * 0.05 }}
                    >
                      <ArtistCard artist={artist} isFeatured={artist.featured} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="mt-8 text-center">
                <p className="mb-6 text-sm text-gray-500">
                  عرض {Math.min(visibleCount, filteredArtists.length)} من {filteredArtists.length}{" "}
                  فنان
                </p>
                {hasMore && (
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => prev + 12)}
                    data-testid="button-load-more"
                    className="focus-gold group inline-flex items-center gap-2 rounded-xl border-2 border-primary/50 bg-transparent px-8 py-4 font-bold text-primary transition-all duration-300 hover:bg-primary hover:text-background"
                  >
                    تحميل المزيد
                    <ChevronDown
                      className="transition-transform group-hover:translate-y-1"
                      size={20}
                    />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {!hasActiveFilters && (
        <section className="border-t border-white/5 bg-zinc-950/40 py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-3">
              {[
                {
                  icon: ShieldCheck,
                  title: "فنانون موثّقون",
                  desc: "كل فنان في الدليل يمر بمراجعة إدارية قبل النشر",
                },
                {
                  icon: TrendingUp,
                  title: "فرص كاستنج حقيقية",
                  desc: "مشاريع منشورة من شركات إنتاج معتمدة",
                },
                {
                  icon: Users,
                  title: "مجتمع متنامٍ",
                  desc: "منصة تجمع الفنانين وصناع الفن من أنحاء العالم العربي",
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="premium-card theatre-card p-6 text-center">
                  <Icon className="mx-auto text-primary" size={32} />
                  <h3 className="font-display mt-3 text-lg text-white">{title}</h3>
                  <p className="mt-2 text-sm text-gray-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!hasActiveFilters && (
        <section className="relative overflow-hidden py-20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,169,106,0.14)_0%,transparent_70%)]" />
          <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
              <Star className="fill-primary text-primary" size={14} />
              <span className="text-xs font-medium text-primary">منصة مجانية للفنانين</span>
            </div>
            <h2 className="font-display mb-4 text-3xl text-white sm:text-4xl">
              ابدأ رحلتك في كواليس
            </h2>
            <p className="mx-auto mb-8 max-w-xl leading-relaxed text-gray-400">
              سجّل ملفك المهني الآن وظهر في الدليل الاحترافي لصناع الفن في العالم العربي.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/join"
                className="focus-gold gold-cta inline-flex items-center gap-2 rounded-xl px-8 py-3.5 font-bold"
              >
                <UserPlus size={18} />
                <span className="relative z-10">انضم كفنان مجانًا</span>
              </Link>
              <Link
                href="/projects"
                className="focus-gold inline-flex items-center gap-2 rounded-xl border border-primary/40 px-8 py-3.5 text-primary transition-all hover:bg-primary/10"
              >
                تصفّح الكاستنج
              </Link>
            </div>
          </div>
        </section>
      )}
    </AppLayout>
  );
}
