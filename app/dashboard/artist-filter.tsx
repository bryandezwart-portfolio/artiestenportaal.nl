"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

type Artist = { id: string; name: string };

export default function ArtistFilter({ artists }: { artists: Artist[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedIds = useMemo(() => {
    const raw = searchParams.get("artistIds");
    return raw ? raw.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return artists;
    return artists.filter((a) => a.name.toLowerCase().includes(q));
  }, [artists, query]);

  function updateSelection(next: string[]) {
    const params = new URLSearchParams(searchParams.toString());
    if (next.length > 0) {
      params.set("artistIds", next.join(","));
    } else {
      params.delete("artistIds");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      updateSelection(selectedIds.filter((x) => x !== id));
    } else {
      updateSelection([...selectedIds, id]);
    }
  }

  function clearAll() {
    updateSelection([]);
  }

  const selectedNames = artists.filter((a) => selectedIds.includes(a.id)).map((a) => a.name);

  const buttonLabel =
    selectedNames.length === 0
      ? "Alle artiesten"
      : selectedNames.length <= 2
      ? selectedNames.join(", ")
      : `${selectedNames.length} artiesten geselecteerd`;

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-2 text-[13px] font-medium bg-surface border border-line px-3.5 py-2.5 rounded-lg hover:bg-surfaceHover transition shadow-card"
      >
        <span className="text-muted">Artiest:</span>
        <span className="text-ink">{buttonLabel}</span>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-64 bg-surface border border-line rounded-lg shadow-card overflow-hidden">
          <div className="p-2 border-b border-line">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Zoek artiest…"
              autoFocus
              className="w-full rounded-md border border-line bg-canvas px-2.5 py-1.5 text-[12.5px] text-ink focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition"
            />
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="text-muted text-[12.5px] px-3 py-2.5">Geen artiest gevonden.</p>
            )}
            {filtered.map((a) => (
              <label
                key={a.id}
                className="flex items-center gap-2 px-3 py-2 text-[13px] text-ink hover:bg-canvas transition cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(a.id)}
                  onChange={() => toggle(a.id)}
                  className="accent-accent"
                />
                {a.name}
              </label>
            ))}
          </div>
          {selectedIds.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="w-full text-left px-3 py-2 text-[12.5px] text-muted hover:text-ink border-t border-line transition"
            >
              Filter wissen
            </button>
          )}
        </div>
      )}
    </div>
  );
}
