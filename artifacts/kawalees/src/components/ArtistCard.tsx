import { Link } from "wouter";
import { MapPin, ShieldCheck, Star } from "lucide-react";
import type { Artist } from "@/types";

function resolveAssetUrl(url: string) {
  if (/^(https?:|data:|blob:)/.test(url)) return url;
  return `${import.meta.env.BASE_URL}${url.replace(/^\/+/, "")}`;
}

export function ArtistCard({
  artist,
  isFeatured = false,
}: {
  artist: Artist;
  isFeatured?: boolean;
}) {
  const primarySpecialty = artist.specialty.split(/[,،]/)[0]?.trim() ?? "";

  return (
    <Link
      href={`/artist/${artist.id}`}
      aria-label={`عرض ملف ${artist.name}`}
      className="focus-gold group block h-full rounded-2xl"
    >
      <div className="artist-card-luxe relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-card group-hover:-translate-y-1.5 group-hover:border-primary/55 group-hover:shadow-[0_24px_78px_rgba(200,169,106,0.26)]">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
          {artist.imageUrl ? (
            <img
              src={resolveAssetUrl(artist.imageUrl)}
              alt={artist.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-900">
              <span className="font-display text-5xl text-primary/20">{artist.name.charAt(0)}</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent opacity-70" />

          <div className="absolute top-3 right-3 left-3 flex items-start justify-between gap-2">
            {isFeatured && (
              <span className="flex items-center gap-1 rounded-full bg-primary/90 px-2.5 py-0.5 text-xs font-bold text-background backdrop-blur-sm">
                <Star size={10} className="fill-background" />
                مميز
              </span>
            )}
            <span className="mr-auto flex items-center gap-1 rounded-full border border-primary/30 bg-black/50 px-2 py-0.5 text-xs font-medium text-primary backdrop-blur-sm">
              <ShieldCheck size={10} className="fill-primary/20" />
              موثّق
            </span>
          </div>

          <div className="absolute bottom-0 left-0 z-10 w-full translate-y-1 p-4 transition-transform duration-300 group-hover:translate-y-0">
            <h3 className="font-display mb-0.5 text-xl font-bold leading-tight text-white transition-colors group-hover:text-primary">
              {artist.name}
            </h3>
            <p className="mb-2 text-xs font-medium text-primary">{primarySpecialty}</p>

            <div className="flex items-center gap-3 text-xs text-gray-300 opacity-0 transition-opacity delay-75 duration-300 group-hover:opacity-100">
              <span className="flex items-center gap-1">
                <MapPin size={11} className="text-primary/70" />
                {artist.country}
                {artist.city ? `، ${artist.city}` : ""}
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-primary/70" />
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
    <div className="relative aspect-[3/4] w-full animate-pulse overflow-hidden rounded-2xl border border-white/5 bg-zinc-900">
      <div className="absolute bottom-0 left-0 w-full p-5">
        <div className="mb-2 h-5 w-2/3 rounded bg-zinc-800" />
        <div className="h-3 w-1/3 rounded bg-zinc-800" />
      </div>
    </div>
  );
}
