import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const CHICAGO_LATITUDE = 41.8781;
const CHICAGO_LONGITUDE = -87.6298;
const CHICAGO_TIME_ZONE = "America/Chicago";

type OpenMeteoForecast = {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
  };
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
  };
};

function getChicagoDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CHICAGO_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value || "";
  return `${value("year")}-${value("month")}-${value("day")}`;
}

function describeWeatherCode(code: number) {
  if (code === 0) return "Clear";
  if (code === 1) return "Mostly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Cloudy";
  if (code === 45 || code === 48) return "Foggy";
  if (code >= 51 && code <= 57) return "Drizzle";
  if (code >= 61 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Rain showers";
  if (code >= 85 && code <= 86) return "Snow showers";
  if (code >= 95) return "Thunderstorms";
  return "Mixed conditions";
}

export async function GET(request: NextRequest) {
  const requestedDate = request.nextUrl.searchParams.get("date") || getChicagoDateKey();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) {
    return NextResponse.json({ error: "A valid tournament date is required." }, { status: 400 });
  }

  const params = new URLSearchParams({
    latitude: String(CHICAGO_LATITUDE),
    longitude: String(CHICAGO_LONGITUDE),
    current: "temperature_2m,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    temperature_unit: "fahrenheit",
    timezone: CHICAGO_TIME_ZONE,
    forecast_days: "16"
  });

  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, {
      next: { revalidate: 1800 }
    });
    if (!response.ok) {
      return NextResponse.json({ error: "Chicago weather is temporarily unavailable." }, { status: 502 });
    }

    const forecast = await response.json() as OpenMeteoForecast;
    const dailyIndex = forecast.daily?.time?.indexOf(requestedDate) ?? -1;
    if (dailyIndex < 0) {
      return NextResponse.json({ error: "A forecast is not available for this tournament date yet." }, { status: 404 });
    }

    const isCurrent = requestedDate === getChicagoDateKey();
    const weatherCode = isCurrent
      ? forecast.current?.weather_code ?? forecast.daily?.weather_code?.[dailyIndex]
      : forecast.daily?.weather_code?.[dailyIndex];
    const highF = forecast.daily?.temperature_2m_max?.[dailyIndex];
    const lowF = forecast.daily?.temperature_2m_min?.[dailyIndex];
    const temperatureF = isCurrent ? forecast.current?.temperature_2m ?? highF : highF;

    if (temperatureF == null || weatherCode == null) {
      return NextResponse.json({ error: "The Chicago forecast did not include temperature data." }, { status: 502 });
    }

    return NextResponse.json({
      city: "Chicago",
      date: requestedDate,
      condition: describeWeatherCode(weatherCode),
      temperatureF: Math.round(temperatureF),
      highF: highF == null ? null : Math.round(highF),
      lowF: lowF == null ? null : Math.round(lowF),
      isCurrent
    }, {
      headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600" }
    });
  } catch {
    return NextResponse.json({ error: "Chicago weather is temporarily unavailable." }, { status: 502 });
  }
}
