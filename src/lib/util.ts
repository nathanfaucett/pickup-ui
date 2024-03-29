import { page } from '$app/stores';
import { MAX_INT, random, float, nextIntInRange } from '@aicacia/rand';
import { get } from 'svelte/store';

export function createInsecureID() {
  return (random() * MAX_INT) | 0;
}

export function createRandomString(size: number) {
  return float()
    .map((x) => {
      if (x > 0.333) {
        return String.fromCharCode(nextIntInRange(65, 90) + (x > 0.666 ? 0 : 32));
      } else {
        return nextIntInRange(0, 9);
      }
    })
    .take(size)
    .join('');
}

export function waitMS(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
}

export function getRequiredTimezone() {
  return getTimezone() || 'America/New_York';
}

export function setUrlParams(params: { [key: string]: number | string | null | undefined }) {
	const url = get(page).url;
	Object.entries(params).forEach(([key, value]) => {
		if (value == null) {
			url.searchParams.delete(key);
		} else {
			url.searchParams.set(key, value + "");
		}
	});
	history.replaceState({}, '', url);
}

export type LocationResult = {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  category: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: [number, number, number, number];
  address: {
    building: string;
    house_number: string;
    road: string;
    neighbourhood: string;
    town?: string;
    village?: string;
    county: string;
    state?: string;
    region?: string;
    "ISO3166-2-lvl4": string;
    postcode: string;
    country: string;
    country_code: string;
  };
}

export async function getLocation(latitude: number, longitude: number): Promise<LocationResult> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse.php?lat=${latitude}&lon=${longitude}&zoom=18&format=jsonv2`
  );
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return await res.json();
}

export type LocationSearchResult = {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  category: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  boundingbox: [number, number, number, number];
}

export async function searchForLocation(search: string): Promise<LocationSearchResult[]> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search.php?q=${encodeURIComponent(search)}&format=jsonv2`
  );
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return await res.json();
}

export async function searchForLocationBy(street: string, city: string, state: string, country: string): Promise<LocationSearchResult[]> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search.php?street=${encodeURIComponent(street)}&city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&country=${encodeURIComponent(country)}&format=jsonv2`
  );
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return await res.json();
}

export function isVisible(element: Element, container: Element) {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return elementRect.top <= containerRect.top
    ? containerRect.top - elementRect.top < elementRect.height
    : elementRect.bottom - containerRect.bottom < elementRect.height;
}

export function scrollIntoViewIfNeed(element: Element) {
  const container = element.parentElement;
  if (container && !isVisible(element, container)) {
    element.scrollIntoView();
  }
}

export function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
