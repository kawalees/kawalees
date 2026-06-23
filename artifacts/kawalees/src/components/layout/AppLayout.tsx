import { type ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Clapperboard, Mail, Menu, UserPlus, Users, X } from "lucide-react";

export function AppLayout({ children }: { children: ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  const isActive = (path: string) => location === path;
  const navLinks = [
    { href: "/", label: "الفنانون", icon: Users },
    { href: "/projects", label: "الكاستنج", icon: Clapperboard },
    { href: "/contact", label: "تواصل معنا", icon: Mail },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground dark selection:bg-primary/30 selection:text-primary">
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? "py-3" : "py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="nav-capsule flex justify-between items-center gap-6 px-4 py-3 md:px-7">
            <Link
              href="/"
              className="group flex items-center gap-2 z-50 flex-shrink-0 focus-gold rounded-xl"
            >
              <span className="logo-wordmark font-display font-bold text-3xl tracking-wider text-gradient-gold">
                كواليس
              </span>
            </Link>

            <nav
              className="hidden md:flex items-center gap-6 flex-1 justify-center"
              aria-label="التنقل الرئيسي"
            >
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`focus-gold rounded-lg font-display text-base transition-colors hover:text-primary flex items-center gap-1.5 ${
                    isActive(href) ? "text-primary" : "text-gray-300"
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
              <Link
                href="/join"
                data-testid="link-join"
                className={`focus-gold font-display text-base px-4 py-2 rounded-full border transition-all duration-300 flex items-center gap-1.5 ${
                  isActive("/join")
                    ? "border-primary bg-primary text-background"
                    : "border-primary/40 text-primary hover:bg-primary/10"
                }`}
              >
                <UserPlus size={14} />
                انضم كفنان
              </Link>
            </div>

            <button
              className="focus-gold md:hidden z-50 p-2 rounded-lg text-gray-300 hover:text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <motion.div
          id="mobile-navigation"
          initial={false}
          animate={mobileMenuOpen ? "open" : "closed"}
          variants={{
            open: { opacity: 1, height: "auto", display: "block" },
            closed: { opacity: 0, height: 0, transitionEnd: { display: "none" } },
          }}
          className="md:hidden absolute left-4 right-4 top-[calc(100%-0.5rem)] overflow-hidden rounded-3xl border border-primary/20 bg-black/90 shadow-2xl shadow-black/50 backdrop-blur-2xl"
        >
          <div className="px-4 py-6 flex flex-col gap-4">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`focus-gold rounded-lg font-display text-xl hover:text-primary flex items-center gap-2 ${
                  isActive(href) ? "text-primary" : "text-gray-300"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
            <Link
              href="/join"
              className="focus-gold rounded-lg font-display text-xl text-primary hover:text-primary/80 flex items-center gap-2"
            >
              <UserPlus size={18} />
              انضم كفنان
            </Link>
          </div>
        </motion.div>
      </header>

      <main className="flex-grow flex flex-col">{children}</main>

      <footer className="border-t border-white/5 pt-14 pb-8 mt-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <span className="font-display font-bold text-2xl text-gradient-gold">كواليس</span>
              <p className="text-gray-500 mt-2 font-sans text-sm leading-relaxed max-w-xs">
                المنصة الاحترافية الأولى لربط صناع الفن والمسرح والسينما في العالم العربي.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-primary text-xs font-medium">منصة مجانية للفنانين</span>
              </div>
            </div>

            <div>
              <h4 className="text-white text-sm font-bold mb-4">المنصة</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/"
                    className="text-gray-500 hover:text-primary transition-colors text-sm"
                  >
                    دليل الفنانين
                  </Link>
                </li>
                <li>
                  <Link
                    href="/projects"
                    className="text-gray-500 hover:text-primary transition-colors text-sm"
                  >
                    فرص الكاستنج
                  </Link>
                </li>
                <li>
                  <Link
                    href="/join"
                    className="text-gray-500 hover:text-primary transition-colors text-sm"
                  >
                    انضم كفنان
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-bold mb-4">التواصل</h4>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-500 hover:text-primary transition-colors text-sm"
                  >
                    تواصل معنا
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-500 hover:text-primary transition-colors text-sm"
                  >
                    طلب فنان
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white text-sm font-bold mb-4">عن كواليس</h4>
              <ul className="space-y-2.5">
                <li>
                  <span className="text-gray-600 text-sm">مجاني للفنانين</span>
                </li>
                <li>
                  <span className="text-gray-600 text-sm">بيانات آمنة ومحمية</span>
                </li>
                <li>
                  <span className="text-gray-600 text-sm">دليل موثّق ومعتمد</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-700 text-xs">
              © {new Date().getFullYear()} كواليس — جميع الحقوق محفوظة
            </p>
            <p className="text-gray-700 text-xs">منصة عربية لصناع الفن والمسرح والسينما</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
