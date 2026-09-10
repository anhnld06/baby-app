"use client";

import { useEffect, useState } from "react";
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

function formatCoords(latitude: number, longitude: number) {
  return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
}

async function reverseGeocode(latitude: number, longitude: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=14&accept-language=vi`,
    );
    if (!response.ok) return null;
    const data = (await response.json()) as { address?: Record<string, string | undefined> };
    const address = data.address;
    if (!address) return null;
    const place =
      address.suburb ??
      address.quarter ??
      address.neighbourhood ??
      address.city_district ??
      address.town ??
      address.city ??
      address.county;
    const region = address.state ?? address.city;
    return (
      [place, region].filter((part, index, all) => part && all.indexOf(part) === index).join(", ") || null
    );
  } catch {
    return null;
  }
}

type WeatherState =
  | { status: "loading" }
  | { status: "unavailable" }
  | {
      status: "ready";
      temperature: number;
      humidity: number;
      weatherCode: number;
      locationName: string | null;
      coords: { latitude: number; longitude: number };
    };

export function WeatherBadge({ unavailableLabel }: { unavailableLabel?: string }) {
  const [state, setState] = useState<WeatherState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function loadWeather(latitude: number, longitude: number) {
      try {
        const [weatherResponse, locationName] = await Promise.all([
          fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code`,
          ),
          reverseGeocode(latitude, longitude),
        ]);
        if (!weatherResponse.ok) throw new Error("weather unavailable");
        const data = (await weatherResponse.json()) as {
          current?: { temperature_2m?: number; relative_humidity_2m?: number; weather_code?: number };
        };
        if (cancelled) return;
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
          coords: { latitude, longitude },
        });
      } catch {
        if (!cancelled) setState({ status: "unavailable" });
      }
    }

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => void loadWeather(position.coords.latitude, position.coords.longitude),
        () => {
          if (!cancelled) setState({ status: "unavailable" });
        },
        { timeout: 5000 },
      );
    } else {
      queueMicrotask(() => {
        if (!cancelled) setState({ status: "unavailable" });
      });
    }

    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") return null;
  if (state.status === "unavailable") {
    return unavailableLabel ? (
      <span className="text-xs text-muted-foreground">{unavailableLabel}</span>
    ) : null;
  }

  const Icon = (state.weatherCode != null && WEATHER_ICON[state.weatherCode]) || Cloud;
  const shownLocation = state.locationName ?? formatCoords(state.coords.latitude, state.coords.longitude);

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
    </span>
  );
}
