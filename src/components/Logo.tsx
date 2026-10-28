/*
  Logos are transparent, square PNGs already centred on their own canvas,
  so they sit straight on the page with no tile behind them.
*/
export function Logo({ src, name, mark }: { src?: string; name: string; mark?: string }) {
  return (
    <div className="grid size-11 shrink-0 place-items-center">
      {src ? (
        <img src={src} alt="" loading="lazy" className="size-full object-contain" />
      ) : (
        <span
          aria-hidden="true"
          className="grid size-full place-items-center rounded-full font-serif text-sm text-ink/80 ring-1 ring-line"
        >
          {mark ??
            name
              .split(/[\s-]+/)
              .slice(0, 2)
              .map((w) => w[0])
              .join("")}
        </span>
      )}
    </div>
  );
}
