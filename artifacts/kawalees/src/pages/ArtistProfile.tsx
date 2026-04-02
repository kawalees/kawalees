import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Mail,
  ArrowRight,
  Award,
  PlayCircle,
  Languages,
  Film,
  ShieldCheck,
  Star
} from "lucide-react";
import { useGetArtistById } from "@workspace/api-client-react";
import { AppLayout } from "@/components/layout/AppLayout";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= Math.floor(rating) ? "text-primary fill-primary" : s - 0.5 <= rating ? "text-primary fill-primary/40" : "text-gray-600"}
        />
      ))}
      <span className="text-xs text-gray-400 mr-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function getMockRating(experience: string, featured: boolean): number {
  if (featured) return 4.9;
  const exp = experience.toLowerCase();
  if (exp.includes("خبير") || exp.includes("20") || exp.includes("15")) return 4.7;
  if (exp.includes("محترف") || exp.includes("10") || exp.includes("8")) return 4.5;
  if (exp.includes("متوسط") || exp.includes("5") || exp.includes("6") || exp.includes("7")) return 4.2;
  return 3.9;
}

export default function ArtistProfile() {
  const params = useParams();
  const id = params.id as string;
  
  const { data: artist, isLoading, error } = useGetArtistById(id);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 animate-pulse">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-1/3 aspect-[3/4] bg-zinc-900 rounded-3xl"></div>
            <div className="w-full md:w-2/3 space-y-6">
              <div className="h-12 w-1/2 bg-zinc-900 rounded"></div>
              <div className="h-6 w-1/4 bg-zinc-900 rounded"></div>
              <div className="space-y-3 pt-8">
                <div className="h-4 w-full bg-zinc-900 rounded"></div>
                <div className="h-4 w-full bg-zinc-900 rounded"></div>
                <div className="h-4 w-2/3 bg-zinc-900 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !artist) {
    return (
      <AppLayout>
        <div className="pt-40 pb-20 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-display text-white mb-4">الفنان غير موجود</h1>
          <p className="text-gray-400 mb-8">عذراً، لم نتمكن من العثور على الملف الشخصي المطلوب.</p>
          <Link href="/" className="px-6 py-3 bg-primary text-background font-bold rounded-lg hover:bg-primary/90">
            العودة للرئيسية
          </Link>
        </div>
      </AppLayout>
    );
  }

  // Parse portfolio links if they are stored as comma-separated string 
  // (In schema it's string[], but just in case it comes as a single string from sheets)
  const renderPortfolioLinks = () => {
    if (!artist.portfolioLinks || artist.portfolioLinks.length === 0) return null;
    
    // Check if it's an array of strings that might actually be one comma separated string inside
    const links = Array.isArray(artist.portfolioLinks) 
      ? (artist.portfolioLinks.length === 1 && artist.portfolioLinks[0].includes(',') 
          ? artist.portfolioLinks[0].split(',') 
          : artist.portfolioLinks)
      : [];

    return links.map((link, i) => {
      const url = link.trim();
      if (!url) return null;
      
      // Simple heuristic for image vs link
      const isImage = url.match(/\.(jpeg|jpg|gif|png)$/i) != null;
      
      if (isImage) {
        return (
          <div key={i} className="aspect-square rounded-xl overflow-hidden border border-white/10 group relative">
            <img src={url} alt={`Portfolio ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300"></div>
          </div>
        );
      }
      
      return (
        <a 
          key={i} 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all group"
        >
          <div className="flex items-center gap-3">
            <PlayCircle className="text-primary" size={24} />
            <span className="text-white group-hover:text-primary transition-colors">مشاهدة العمل</span>
          </div>
          <ArrowRight size={16} className="text-gray-500 group-hover:-translate-x-1 group-hover:text-primary transition-all" />
        </a>
      );
    });
  };

  const renderWorks = () => {
    if (!artist.works || artist.works.length === 0) return null;
    
    const worksList = Array.isArray(artist.works)
      ? (artist.works.length === 1 && artist.works[0].includes(',') 
          ? artist.works[0].split(',') 
          : artist.works)
      : [];

    return (
      <ul className="space-y-3">
        {worksList.map((work, i) => (
          <li key={i} className="flex items-start gap-3 text-gray-300">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
            <span className="leading-relaxed">{work.trim()}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <AppLayout>
      <div className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary mb-8 transition-colors group">
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          <span>العودة للدليل</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Left Column: Image & Quick Info */}
          <div className="w-full lg:w-1/3">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-32"
            >
              <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl relative mb-6 border border-white/10">
                {artist.imageUrl ? (
                  <img 
                    src={artist.imageUrl} 
                    alt={artist.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                    <span className="text-6xl text-primary/20 font-display">{artist.name.charAt(0)}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>

              {/* Action Button */}
              <Link 
                href={`/contact?artistId=${artist.id}`}
                className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-gold text-background font-bold text-lg rounded-2xl shadow-[0_4px_20px_rgba(200,169,106,0.4)] hover:shadow-[0_8px_30px_rgba(200,169,106,0.6)] hover:-translate-y-1 transition-all duration-300"
              >
                <Mail size={20} />
                طلب تواصل
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Details */}
          <div className="w-full lg:w-2/3">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {artist.specialty.split(/[,،]/).map(s => s.trim()).filter(Boolean).map((spec, i) => (
                  <span key={i} className="text-primary font-bold tracking-wider text-sm border border-primary/30 bg-primary/10 px-3 py-1 rounded-full">
                    {spec}
                  </span>
                ))}
                {artist.featured && (
                  <span className="text-white font-bold text-sm border border-white/20 bg-white/10 px-3 py-1 rounded-full flex items-center gap-1">
                    <Award size={14} className="text-primary" /> مميز
                  </span>
                )}
                <span className="text-primary text-sm border border-primary/30 bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <ShieldCheck size={13} className="fill-primary/20" />
                  موثّق
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-3 leading-tight">
                {artist.name}
              </h1>

              {/* Star Rating */}
              <div className="mb-6">
                <StarRating rating={getMockRating(artist.experience, artist.featured ?? false)} />
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
                  <MapPin className="text-primary" size={24} />
                  <div>
                    <p className="text-xs text-gray-500">الموقع</p>
                    <p className="text-white font-medium">{artist.country}{artist.city ? `، ${artist.city}` : ''}</p>
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
                  <Briefcase className="text-primary" size={24} />
                  <div>
                    <p className="text-xs text-gray-500">الخبرة</p>
                    <p className="text-white font-medium">{artist.experience}</p>
                  </div>
                </div>

                {artist.education && (
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-2 col-span-2 md:col-span-1">
                    <GraduationCap className="text-primary" size={24} />
                    <div>
                      <p className="text-xs text-gray-500">التعليم</p>
                      <p className="text-white font-medium text-sm leading-snug">{artist.education}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Info Tags */}
              {(artist.workTypes || artist.languages || artist.dialects) && (
                <div className="flex flex-wrap gap-4 mb-12">
                  {artist.workTypes && (
                    <div className="flex items-center gap-2">
                      <Film className="text-primary shrink-0" size={18} />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">مجالات العمل</p>
                        <div className="flex flex-wrap gap-1.5">
                          {artist.workTypes.split(/[,،]/).map(w => w.trim()).filter(Boolean).map((w, i) => (
                            <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">{w}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {(artist.languages || artist.dialects) && (
                    <div className="flex items-center gap-2">
                      <Languages className="text-primary shrink-0" size={18} />
                      <div>
                        {artist.languages && (
                          <>
                            <p className="text-xs text-gray-500 mb-1">اللغات</p>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {artist.languages.split(/[,،]/).map(l => l.trim()).filter(Boolean).map((l, i) => (
                                <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">{l}</span>
                              ))}
                            </div>
                          </>
                        )}
                        {artist.dialects && (
                          <>
                            <p className="text-xs text-gray-500 mb-1">اللهجات</p>
                            <div className="flex flex-wrap gap-1.5">
                              {artist.dialects.split(/[,،]/).map(d => d.trim()).filter(Boolean).map((d, i) => (
                                <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">{d}</span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Bio */}
              {artist.bio && (
                <div className="mb-12">
                  <h3 className="text-2xl font-display font-bold text-white mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                    السيرة الذاتية
                  </h3>
                  <div className="prose prose-invert max-w-none text-gray-300 font-sans leading-loose text-lg">
                    {artist.bio.split('\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Works List */}
              {artist.works && artist.works.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                    أبرز الأعمال
                  </h3>
                  <div className="bg-black/30 border border-white/5 rounded-3xl p-6 md:p-8">
                    {renderWorks()}
                  </div>
                </div>
              )}

              {/* Portfolio */}
              {artist.portfolioLinks && artist.portfolioLinks.length > 0 && (
                <div>
                  <h3 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full"></span>
                    معرض الأعمال
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {renderPortfolioLinks()}
                  </div>
                </div>
              )}

            </motion.div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
