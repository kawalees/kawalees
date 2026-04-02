import { Link } from "wouter";
import { MapPin, Star, ShieldCheck } from "lucide-react";
import type { Artist } from "@workspace/api-client-react";

export function ArtistCard({ artist, isFeatured = false }: { artist: Artist; isFeatured?: boolean }) {
  const primarySpecialty = artist.specialty.split(/[,،]/)[0]?.trim() ?? "";

  return (
    <Link href={`/artist/${artist.id}`} className="group block h-full">
      <div className="relative h-full flex flex-col bg-card rounded-2xl overflow-hidden border border-white/5 hover:border-primary/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(200,169,106,0.15)]">

        {/* Image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
          {artist.imageUrl ? (
            <img
              src={artist.imageUrl}
              alt={artist.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-900">
              <span className="text-5xl text-primary/20 font-display">{artist.name.charAt(0)}</span>
            </div>
          )}

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Top badges */}
          <div className="absolute top-3 right-3 left-3 flex items-start justify-between gap-2">
            {isFeatured && (
              <span className="bg-primary/90 text-background px-2.5 py-0.5 text-xs font-bold rounded-full flex items-center gap-1 backdrop-blur-sm">
                <Star size={10} className="fill-background" />
                مميز
              </span>
            )}
            {/* Verified badge for all approved artists */}
            <span className="mr-auto bg-black/50 text-primary px-2 py-0.5 text-xs font-medium rounded-full flex items-center gap-1 backdrop-blur-sm border border-primary/30">
              <ShieldCheck size={10} className="fill-primary/20" />
              موثّق
            </span>
          </div>

          {/* Content on image */}
          <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-display font-bold text-xl text-white mb-0.5 group-hover:text-primary transition-colors leading-tight">
              {artist.name}
            </h3>
            <p className="text-primary font-medium text-xs mb-2">{primarySpecialty}</p>

            <div className="flex items-center gap-3 text-gray-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
              <span className="flex items-center gap-1">
                <MapPin size={11} className="text-primary/70" />
                {artist.country}{artist.city ? `، ${artist.city}` : ""}
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-primary/70" />
                {artist.experience}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ArtistCardSkeleton() {
  return (
    <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 animate-pulse">
      <div className="absolute bottom-0 left-0 w-full p-5">
        <div className="h-5 w-2/3 bg-zinc-800 rounded mb-2" />
        <div className="h-3 w-1/3 bg-zinc-800 rounded" />
      </div>
    </div>
  );
}
