/**
 * Open-Meteo — free weather API, no API key required.
 * https://open-meteo.com/
 */

export type CityWeather = {
  id: string;
  city: string;
  lat: number;
  lon: number;
  temperatureC: number | null;
  weatherCode: number | null;
  label: string;
  windKmh: number | null;
};

const KOREA_CITIES = [
  { id: "seoul", city: "Seoul", lat: 37.5665, lon: 126.978 },
  { id: "busan", city: "Busan", lat: 35.1796, lon: 129.0756 },
  { id: "jeju", city: "Jeju", lat: 33.4996, lon: 126.5312 }
] as const;

function weatherLabel(code: number | null): string {
  if (code == null) return "—";
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly cloudy";
  if (code <= 48) return "Fog";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 99) return "Thunder";
  return "Mixed";
}

export async function fetchKoreaCityWeather(): Promise<CityWeather[]> {
  const results = await Promise.all(
    KOREA_CITIES.map(async (c) => {
      try {
        const url = new URL("https://api.open-meteo.com/v1/forecast");
        url.searchParams.set("latitude", String(c.lat));
        url.searchParams.set("longitude", String(c.lon));
        url.searchParams.set("current", "temperature_2m,weather_code,wind_speed_10m");
        url.searchParams.set("timezone", "Asia/Seoul");
        url.searchParams.set("wind_speed_unit", "kmh");

        const res = await fetch(url.toString(), {
          next: { revalidate: 1800 },
          headers: { Accept: "application/json" }
        });
        if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
        const data = (await res.json()) as {
          current?: {
            temperature_2m?: number;
            weather_code?: number;
            wind_speed_10m?: number;
          };
        };
        const temperatureC = data.current?.temperature_2m ?? null;
        const weatherCode = data.current?.weather_code ?? null;
        const windKmh = data.current?.wind_speed_10m ?? null;
        return {
          id: c.id,
          city: c.city,
          lat: c.lat,
          lon: c.lon,
          temperatureC,
          weatherCode,
          label: weatherLabel(weatherCode),
          windKmh
        } satisfies CityWeather;
      } catch {
        return {
          id: c.id,
          city: c.city,
          lat: c.lat,
          lon: c.lon,
          temperatureC: null,
          weatherCode: null,
          label: "Unavailable",
          windKmh: null
        } satisfies CityWeather;
      }
    })
  );
  return results;
}
