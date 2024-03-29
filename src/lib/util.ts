import { MAX_INT, random, float, nextIntInRange } from '@aicacia/rand';

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

// {
//   "place_id": 327969073,
//   "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright",
//   "osm_type": "way",
//   "osm_id": 51311477,
//   "lat": "33.78793335",
//   "lon": "-84.30283538311988",
//   "category": "building",
//   "type": "yes",
//   "place_rank": 30,
//   "importance": 0.00000999999999995449,
//   "addresstype": "building",
//   "name": "Emory Garden Condominiums Bldgs N-R",
//   "display_name": "Emory Garden Condominiums Bldgs N-R, 1111, Clairemont Avenue, Clairemont Condos, Decatur, DeKalb County, Georgia, 30030, United States",
//   "address": {
//       "building": "Emory Garden Condominiums Bldgs N-R",
//       "house_number": "1111",
//       "road": "Clairemont Avenue",
//       "neighbourhood": "Clairemont Condos",
//       "town": "Decatur",
//       "county": "DeKalb County",
//       "state": "Georgia",
//       "ISO3166-2-lvl4": "US-GA",
//       "postcode": "30030",
//       "country": "United States",
//       "country_code": "us"
//   },
//   "boundingbox": [
//       "33.7876982",
//       "33.7881622",
//       "-84.3029934",
//       "-84.3026993"
//   ]
// }
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
