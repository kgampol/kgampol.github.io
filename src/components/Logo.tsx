/** logos are dark-on-white artwork, so they sit on a small light tile */
export function Logo({ src, name }: { src?: string; name: string }) {
  return (
    <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-white p-1.5">
      {src ? (
        <img src={src} alt="" loading="lazy" className="size-full object-contain" />
      ) : (
        <span aria-hidden="true" className="font-serif text-base text-night">
          {name
            .split(/[\s-]+/)
            .slice(0, 2)
            .map((w) => w[0])
            .join("")}
        </span>
      )}
    </div>
  );
}
