import type { CityWeather } from "@/lib/weather";

export function WeatherStrip({ cities }: { cities: CityWeather[] }) {
  if (!cities.length) return null;

  return (
    <section
      aria-label="Korea weather"
      className="mx-4 mb-3 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-ink-900/80 via-ink-900/40 to-neon-cyan/5 lg:mx-0"
    >
      <div className="flex items-center justify-between border-b border-white/5 px-3 py-2">
        <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Live weather</p>
        <p className="text-[10px] text-white/30">Open-Meteo · Asia/Seoul</p>
      </div>
      <div className="no-scrollbar flex gap-0 overflow-x-auto">
        {cities.map((c) => (
          <div
            key={c.id}
            className="min-w-[7.5rem] flex-1 border-r border-white/5 px-3 py-3 last:border-r-0"
          >
            <p className="text-xs font-medium text-paper">{c.city}</p>
            <p className="mt-1 font-display text-2xl text-neon-cyan">
              {c.temperatureC != null ? `${Math.round(c.temperatureC)}°` : "—"}
            </p>
            <p className="mt-0.5 text-[11px] text-white/55">{c.label}</p>
            {c.windKmh != null ? (
              <p className="mt-1 text-[10px] text-white/35">Wind {Math.round(c.windKmh)} km/h</p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
