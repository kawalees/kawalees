import { Link } from "wouter";
import { AlertCircle, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

export default function NotFound() {
  return (
    <AppLayout>
      <div className="min-h-[70vh] w-full flex items-center justify-center px-4 pt-32 pb-20">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 h-16 w-16 rounded-2xl border border-primary/20 bg-primary/10 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-primary" />
          </div>
          <p className="text-primary text-sm font-medium mb-2">404</p>
          <h1 className="font-display text-3xl text-white mb-3">الصفحة غير موجودة</h1>
          <p className="text-gray-400 leading-relaxed mb-8">
            الرابط الذي تحاول فتحه غير متاح أو تم نقله. يمكنك العودة للدليل أو تصفح فرص الكاستنج.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-background font-bold rounded-xl hover:bg-primary/90 transition-colors"
            >
              <ArrowRight size={16} />
              العودة للرئيسية
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-5 py-3 border border-white/15 text-gray-200 rounded-xl hover:bg-white/5 hover:border-white/25 transition-colors"
            >
              فرص الكاستنج
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
