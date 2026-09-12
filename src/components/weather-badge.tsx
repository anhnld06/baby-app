"use client";

import { useState } from "react";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Droplets,
  MapPin,
  Sun,
} from "lucide-react";

// WMO weather codes, as returned by Open-Meteo's `weather_code` field.
const WEATHER_ICON: Record<number, typeof Sun> = {
  0: Sun,
  1: CloudSun,
  2: CloudSun,
  3: Cloud,
  45: CloudFog,
  48: CloudFog,
  51: CloudDrizzle,
  53: CloudDrizzle,
  55: CloudDrizzle,
  56: CloudDrizzle,
  57: CloudDrizzle,
  61: CloudRain,
  63: CloudRain,
  65: CloudRain,
  66: CloudRain,
  67: CloudRain,
  71: CloudSnow,
  73: CloudSnow,
  75: CloudSnow,
  77: CloudSnow,
  80: CloudRain,
  81: CloudRain,
  82: CloudRain,
  85: CloudSnow,
  86: CloudSnow,
  95: CloudLightning,
  96: CloudLightning,
  99: CloudLightning,
};

async function reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
  try {
    const response = await fetch(
      `/api/location?latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`,
    );
    if (!response.ok) return null;
    const data = (await response.json()) as { name?: unknown };
    return typeof data.name === "string" && data.name.trim() ? data.name : null;
  } catch {
    return null;
  }
}

type WeatherState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "unavailable" }
  | {
      status: "ready";
      temperature: number;
      humidity: number;
      weatherCode: number;
      locationName: string | null;
    };

export function WeatherBadge({
  unavailableLabel,
  currentLocationLabel = "Current location",
  requestLabel = "Show weather",
}: {
  unavailableLabel?: string;
  currentLocationLabel?: string;
  requestLabel?: string;
}) {
  const [state, setState] = useState<WeatherState>({ status: "idle" });

  function requestWeather() {
    setState({ status: "loading" });

    async function loadWeather(latitude: number, longitude: number) {
      try {
        const roundedLatitude = Number(latitude.toFixed(3));
        const roundedLongitude = Number(longitude.toFixed(3));
        const [weatherResponse, locationName] = await Promise.all([
          fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${roundedLatitude}&longitude=${roundedLongitude}&current=temperature_2m,relative_humidity_2m,weather_code`,
          ),
          reverseGeocode(roundedLatitude, roundedLongitude),
        ]);
        if (!weatherResponse.ok) throw new Error("weather unavailable");
        const data = (await weatherResponse.json()) as {
          current?: { temperature_2m?: number; relative_humidity_2m?: number; weather_code?: number };
        };
        const temperature = data.current?.temperature_2m;
        const humidity = data.current?.relative_humidity_2m;
        const weatherCode = data.current?.weather_code;
        if (
          typeof temperature !== "number" ||
          typeof humidity !== "number" ||
          typeof weatherCode !== "number"
        ) {
          throw new Error("weather payload malformed");
        }
        setState({
          status: "ready",
          temperature: Math.round(temperature),
          humidity: Math.round(humidity),
          weatherCode,
          locationName,
        });
      } catch {
        setState({ status: "unavailable" });
      }
    }

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => void loadWeather(position.coords.latitude, position.coords.longitude),
        () => setState({ status: "unavailable" }),
        { timeout: 5000 },
      );
    } else {
      setState({ status: "unavailable" });
    }
  }

  if (state.status === "idle") {
    return (
      <button
        type="button"
        onClick={requestWeather}
        className="inline-flex min-h-11 items-center gap-1 rounded-xl px-2 text-xs font-medium text-muted-foreground hover:bg-muted"
      >
        <MapPin className="size-3.5" />
        {requestLabel}
      </button>
    );
  }
  if (state.status === "loading") {
    return <span className="text-xs text-muted-foreground" role="status">…</span>;
  }
  if (state.status === "unavailable") {
    return unavailableLabel ? (
      <span className="text-xs text-muted-foreground">{unavailableLabel}</span>
    ) : null;
  }

  const Icon = (state.weatherCode != null && WEATHER_ICON[state.weatherCode]) || Cloud;
  const shownLocation = state.locationName ?? currentLocationLabel;

  return (
    <span className="inline-flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1">
        <MapPin className="size-3.5 shrink-0" />
        {shownLocation}
      </span>
      <span className="inline-flex items-center gap-1">
        <Icon className="size-3.5 shrink-0" />
        {state.temperature}°C
      </span>
      <span className="inline-flex items-center gap-1">
        <Droplets className="size-3.5 shrink-0" />
        {state.humidity}%
      </span>
      {state.locationName ? (
        <a
          className="underline-offset-2 hover:underline"
          href="https://www.openstreetmap.org/copyright"
          rel="noreferrer"
          target="_blank"
        >
          © OpenStreetMap
        </a>
      ) : null}
    </span>
  );
}
