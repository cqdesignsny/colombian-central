import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/data/destinations";

export default function DestinationCard({
  destination,
  tall = false,
}: {
  destination: Destination;
  tall?: boolean;
}) {
  return (
    <Link
      href={`/viajes#${destination.slug}`}
      className={`group relative block overflow-hidden border-2 border-ink ${
        tall ? "aspect-[4/5]" : "aspect-[3/2]"
      }`}
    >
      <Image
        src={destination.image}
        alt={destination.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
      <div className="absolute right-0 bottom-0 left-0 p-5">
        <p className="text-[11px] font-bold tracking-[0.25em] text-amarillo uppercase">
          {destination.region}
        </p>
        <h3 className="display-tight mt-1 font-display text-3xl text-paper uppercase">
          {destination.name}
        </h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {destination.bestFor.map((tag) => (
            <span
              key={tag}
              className="border border-paper/40 px-2 py-0.5 text-[10px] font-bold tracking-[0.15em] text-paper/90 uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
