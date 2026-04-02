import { useState } from "react";
import { Link, useLocation } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({ title: "خطأ في تسجيل الدخول", description: data.message ?? "البريد الإلكتروني أو كلمة المرور غير صحيحة", variant: "destructive" });
        return;
      }

      login(data.token, data.user);
      toast({ title: "أهلًا بك مجددًا!", description: `مرحبًا ${data.user.name}` });

      if (data.user.type === "company") {
        navigate("/dashboard/company");
      } else {
        navigate("/dashboard/artist");
      }
    } catch {
      toast({ title: "خطأ", description: "تعذّر الاتصال بالخادم، تحقق من اتصالك بالإنترنت", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16">
        <div className="w-full max-w-md">

          {/* Decorative glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          </div>

          <div className="relative bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 mb-5">
                <span className="font-display text-2xl text-gradient-gold font-bold">ك</span>
              </div>
              <h1 className="font-display text-2xl text-white mb-1">تسجيل الدخول</h1>
              <p className="text-gray-500 text-sm">أهلًا بعودتك إلى كواليس</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm text-gray-300 mb-1.5" htmlFor="email">
                  البريد الإلكتروني
                </label>
                <input
                  id="email"
                  data-testid="input-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="example@email.com"
                  dir="ltr"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm text-gray-300" htmlFor="password">
                    كلمة المرور
                  </label>
                  <Link
                    href="/settings"
                    className="text-xs text-gray-500 hover:text-primary transition-colors"
                  >
                    نسيت كلمة المرور؟
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    data-testid="input-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pl-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    placeholder="••••••••"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                data-testid="button-login"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-primary text-background font-bold text-base rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
              >
                {loading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <LogIn size={18} />
                    دخول
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-gray-600 text-xs">أو</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <Link
              href="/register"
              className="w-full flex items-center justify-center gap-2 py-3 border border-white/10 rounded-xl text-gray-300 text-sm hover:border-white/25 hover:bg-white/5 transition-all"
            >
              إنشاء حساب جديد مجانًا
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
