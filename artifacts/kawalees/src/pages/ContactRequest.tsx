import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Send, CheckCircle2, User, Building, Briefcase, DollarSign, MessageSquare } from "lucide-react";
import { useGetArtists, useSubmitContactRequest } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";

// Schema matches OpenAPI definition
const contactSchema = z.object({
  artistId: z.string().min(1, "الرجاء اختيار فنان"),
  requesterName: z.string().min(2, "الاسم مطلوب"),
  company: z.string().optional(),
  projectType: z.string().min(2, "نوع المشروع مطلوب"),
  budget: z.string().optional(),
  message: z.string().min(10, "الرسالة يجب أن تكون 10 أحرف على الأقل"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactRequest() {
  const [location] = useLocation();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Extract artistId from query params if present
  const queryParams = new URLSearchParams(window.location.search);
  const preSelectedArtistId = queryParams.get("artistId") || "";

  const { data: artists } = useGetArtists();
  const submitMutation = useSubmitContactRequest();

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      artistId: preSelectedArtistId,
    }
  });

  useEffect(() => {
    if (preSelectedArtistId) {
      setValue("artistId", preSelectedArtistId);
    }
  }, [preSelectedArtistId, setValue]);

  const onSubmit = async (data: ContactFormValues) => {
    try {
      await submitMutation.mutateAsync({ data });
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "حدث خطأ",
        description: "لم نتمكن من إرسال طلبك. يرجى المحاولة مرة أخرى.",
      });
    }
  };

  const inputClasses = "w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 font-sans";
  const labelClasses = "block text-sm font-medium text-gray-400 mb-2 font-display";

  return (
    <AppLayout>
      <div className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            طلب <span className="text-gradient-gold">تواصل</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            نحن هنا لتسهيل تواصلك مع أفضل المواهب. قم بتعبئة النموذج وسنقوم بإيصال طلبك للفنان المعني.
          </p>
        </div>

        {isSuccess ? (
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
              سيقوم فريق كواليس بمراجعة طلبك والتواصل مع الفنان. سنتواصل معك قريباً.
            </p>
            <button 
              onClick={() => window.location.href = '/'}
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
            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
              
              <div className="space-y-6">
                <h3 className="text-xl font-display font-bold text-white border-b border-white/10 pb-4 mb-6">المعلومات الأساسية</h3>
                
                {/* Artist Selection */}
                <div>
                  <label className={labelClasses}>اختر الفنان المطلوب *</label>
                  <div className="relative">
                    <select 
                      {...register("artistId")}
                      className={`${inputClasses} appearance-none pr-10`}
                    >
                      <option value="">-- اختر فناناً --</option>
                      {artists?.map(a => (
                        <option key={a.id} value={a.id}>{a.name} ({a.specialty})</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <User className="text-gray-500" size={18} />
                    </div>
                  </div>
                  {errors.artistId && <p className="text-destructive text-sm mt-1">{errors.artistId.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className={labelClasses}>اسمك الكامل *</label>
                    <div className="relative">
                      <input type="text" {...register("requesterName")} className={`${inputClasses} pr-10`} placeholder="محمد عبدالله" />
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <User className="text-gray-500" size={18} />
                      </div>
                    </div>
                    {errors.requesterName && <p className="text-destructive text-sm mt-1">{errors.requesterName.message}</p>}
                  </div>

                  {/* Company */}
                  <div>
                    <label className={labelClasses}>الجهة / الشركة</label>
                    <div className="relative">
                      <input type="text" {...register("company")} className={`${inputClasses} pr-10`} placeholder="شركة إنتاج..." />
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <Building className="text-gray-500" size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-4">
                <h3 className="text-xl font-display font-bold text-white border-b border-white/10 pb-4 mb-6">تفاصيل المشروع</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Project Type */}
                  <div>
                    <label className={labelClasses}>نوع المشروع *</label>
                    <div className="relative">
                      <input type="text" {...register("projectType")} className={`${inputClasses} pr-10`} placeholder="مسرحية، فيلم قصير، إعلان..." />
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <Briefcase className="text-gray-500" size={18} />
                      </div>
                    </div>
                    {errors.projectType && <p className="text-destructive text-sm mt-1">{errors.projectType.message}</p>}
                  </div>

                  {/* Budget */}
                  <div>
                    <label className={labelClasses}>الميزانية التقريبية (اختياري)</label>
                    <div className="relative">
                      <input type="text" {...register("budget")} className={`${inputClasses} pr-10`} placeholder="مثال: 5000$ - 10000$" />
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <DollarSign className="text-gray-500" size={18} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className={labelClasses}>تفاصيل العرض / الرسالة *</label>
                  <div className="relative">
                    <textarea 
                      {...register("message")} 
                      rows={5}
                      className={`${inputClasses} pr-10 resize-none`} 
                      placeholder="اشرح باختصار طبيعة العمل ودور الفنان المطلوب..."
                    />
                    <div className="absolute top-4 right-3 flex items-start pointer-events-none">
                      <MessageSquare className="text-gray-500" size={18} />
                    </div>
                  </div>
                  {errors.message && <p className="text-destructive text-sm mt-1">{errors.message.message}</p>}
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-gold text-background font-bold text-lg rounded-xl shadow-[0_4px_20px_rgba(200,169,106,0.2)] hover:shadow-[0_8px_30px_rgba(200,169,106,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isSubmitting ? (
                    <span className="w-6 h-6 border-2 border-background/30 border-t-background rounded-full animate-spin"></span>
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
