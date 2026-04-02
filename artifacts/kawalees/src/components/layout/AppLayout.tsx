import { type ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Menu, X, Clapperboard, LogOut, LayoutDashboard, ChevronDown, Settings, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function AppLayout({ children }: { children: ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { user, logout, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  const dashboardPath = user?.type === "company" ? "/dashboard/company" : "/dashboard/artist";
  const isActive = (path: string) => location === path;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground dark selection:bg-primary/30 selection:text-primary">
      {/* Navigation */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-primary/20 py-4 shadow-lg shadow-black/50"
            : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center gap-6">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2 z-50 flex-shrink-0">
              <span className="font-display font-bold text-3xl tracking-wider text-gradient-gold">كواليس</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
              <Link
                href="/"
                className={`font-display text-base transition-colors hover:text-primary ${isActive("/") ? "text-primary" : "text-gray-300"}`}
              >
                الفنانون
              </Link>
              <Link
                href="/projects"
                className={`font-display text-base transition-colors hover:text-primary flex items-center gap-1.5 ${isActive("/projects") ? "text-primary" : "text-gray-300"}`}
              >
                <Clapperboard size={15} />
                الكاستنج
              </Link>
              <Link
                href="/pricing"
                className={`font-display text-base transition-colors hover:text-primary flex items-center gap-1.5 ${isActive("/pricing") ? "text-primary" : "text-gray-300"}`}
              >
                <Crown size={14} />
                الأسعار
              </Link>
              <Link
                href="/contact"
                className={`font-display text-base transition-colors hover:text-primary ${isActive("/contact") ? "text-primary" : "text-gray-300"}`}
              >
                تواصل معنا
              </Link>
            </nav>

            {/* Auth area (desktop) */}
            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
              {!isLoading && !user && (
                <>
                  <Link
                    href="/login"
                    className="font-display text-base text-gray-300 hover:text-primary transition-colors"
                  >
                    دخول
                  </Link>
                  <Link
                    href="/register"
                    className="font-display text-base px-4 py-2 rounded-full border border-primary/40 text-primary hover:bg-primary/10 transition-all duration-300"
                  >
                    إنشاء حساب
                  </Link>
                </>
              )}

              {!isLoading && user && (
                <div className="relative">
                  <button
                    data-testid="button-user-menu"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 hover:border-primary/30 transition-all text-sm"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                      {user.name[0]}
                    </div>
                    <span className="text-gray-200 max-w-[120px] truncate">{user.name}</span>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute left-0 top-full mt-2 w-48 bg-[#141414] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                      <Link
                        href={dashboardPath}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <LayoutDashboard size={15} />
                        لوحة التحكم
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors border-t border-white/5"
                      >
                        <Settings size={15} />
                        إعدادات الحساب
                      </Link>
                      <button
                        data-testid="button-logout"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-gray-300 hover:text-red-400 hover:bg-white/5 transition-colors border-t border-white/5"
                      >
                        <LogOut size={15} />
                        تسجيل الخروج
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Artist join button — only for non-artists */}
              {!isLoading && user?.type !== "artist" && (
                <Link
                  href="/join"
                  className={`font-display text-base px-4 py-2 rounded-full border transition-all duration-300 ${
                    isActive("/join")
                      ? "border-primary bg-primary text-background"
                      : "border-primary/40 text-primary hover:bg-primary/10"
                  }`}
                >
                  انضم كفنان
                </Link>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden z-50 p-2 text-gray-300 hover:text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={mobileMenuOpen ? "open" : "closed"}
          variants={{
            open: { opacity: 1, height: "auto", display: "block" },
            closed: { opacity: 0, height: 0, transitionEnd: { display: "none" } },
          }}
          className="md:hidden absolute top-full left-0 w-full bg-background border-b border-white/10 overflow-hidden"
        >
          <div className="px-4 py-6 flex flex-col gap-4">
            <Link href="/" className="font-display text-xl text-gray-300 hover:text-primary">الفنانون</Link>
            <Link href="/projects" className="font-display text-xl text-gray-300 hover:text-primary flex items-center gap-2">
              <Clapperboard size={18} />
              الكاستنج
            </Link>
            <Link href="/pricing" className="font-display text-xl text-gray-300 hover:text-primary flex items-center gap-2">
              <Crown size={16} />
              الأسعار
            </Link>
            <Link href="/contact" className="font-display text-xl text-gray-300 hover:text-primary">تواصل معنا</Link>

            {!user && (
              <>
                <Link href="/login" className="font-display text-xl text-gray-300 hover:text-primary">تسجيل الدخول</Link>
                <Link href="/register" className="font-display text-xl text-primary hover:text-primary/80">إنشاء حساب</Link>
              </>
            )}

            {user && (
              <>
                <Link href={dashboardPath} className="font-display text-xl text-gray-300 hover:text-primary flex items-center gap-2">
                  <LayoutDashboard size={18} />
                  لوحة التحكم
                </Link>
                <Link href="/settings" className="font-display text-xl text-gray-300 hover:text-primary flex items-center gap-2">
                  <Settings size={18} />
                  إعدادات الحساب
                </Link>
                <button
                  onClick={handleLogout}
                  className="font-display text-xl text-red-400 hover:text-red-300 text-right flex items-center gap-2"
                >
                  <LogOut size={18} />
                  تسجيل الخروج
                </button>
              </>
            )}

            {!user && (
              <Link href="/join" className="font-display text-xl text-primary hover:text-primary/80">انضم كفنان</Link>
            )}
          </div>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 pt-14 pb-8 mt-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top: logo + columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <span className="font-display font-bold text-2xl text-gradient-gold">كواليس</span>
              <p className="text-gray-500 mt-2 font-sans text-sm leading-relaxed max-w-xs">
                المنصة الاحترافية الأولى لربط صناع الفن والمسرح والسينما في العالم العربي.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-primary text-xs font-medium">مجاني لأول سنة</span>
              </div>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-white text-sm font-bold mb-4">المنصة</h4>
              <ul className="space-y-2.5">
                <li><Link href="/" className="text-gray-500 hover:text-primary transition-colors text-sm">دليل الفنانين</Link></li>
                <li><Link href="/projects" className="text-gray-500 hover:text-primary transition-colors text-sm">الكاستنج</Link></li>
                <li><Link href="/pricing" className="text-gray-500 hover:text-primary transition-colors text-sm">الباقات والأسعار</Link></li>
                <li><Link href="/join" className="text-gray-500 hover:text-primary transition-colors text-sm">انضم كفنان</Link></li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="text-white text-sm font-bold mb-4">الحساب</h4>
              <ul className="space-y-2.5">
                <li><Link href="/register" className="text-gray-500 hover:text-primary transition-colors text-sm">إنشاء حساب</Link></li>
                <li><Link href="/login" className="text-gray-500 hover:text-primary transition-colors text-sm">تسجيل الدخول</Link></li>
                <li><Link href="/settings" className="text-gray-500 hover:text-primary transition-colors text-sm">إعدادات الحساب</Link></li>
                {user && (
                  <li>
                    <Link
                      href={user.type === "company" ? "/dashboard/company" : "/dashboard/artist"}
                      className="text-gray-500 hover:text-primary transition-colors text-sm"
                    >
                      لوحة التحكم
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white text-sm font-bold mb-4">الدعم</h4>
              <ul className="space-y-2.5">
                <li><Link href="/contact" className="text-gray-500 hover:text-primary transition-colors text-sm">تواصل معنا</Link></li>
                <li><Link href="/pricing" className="text-gray-500 hover:text-primary transition-colors text-sm">الأسئلة الشائعة</Link></li>
                <li><Link href="/admin" className="text-gray-700 hover:text-gray-500 transition-colors text-sm">لوحة الإدارة</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-700 text-xs">
              © {new Date().getFullYear()} كواليس — جميع الحقوق محفوظة
            </p>
            <p className="text-gray-700 text-xs">
              منصة عربية لصناع الفن والمسرح والسينما
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
