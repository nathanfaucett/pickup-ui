import { browser } from '$app/environment';
import { derived } from 'svelte/store';
import { localstorageWritable } from 'svelte-localstorage-writable';

const geolocationPositionWritable = localstorageWritable<GeolocationPosition | null>('location', null, {
  toJSON(geolocationPosition) {
    return geolocationPosition ? {
      coords: {
        accurracy: geolocationPosition.coords.accuracy,
        altitude: geolocationPosition.coords.altitude,
        altitudeAccuracy: geolocationPosition.coords.altitudeAccuracy,
        heading: geolocationPosition.coords.heading,
        latitude: geolocationPosition.coords.latitude,
        longitude: geolocationPosition.coords.longitude,
        speed: geolocationPosition.coords.speed,
      },
      timestamp: geolocationPosition.timestamp,
    } : null;
  },
  fromJSON(geolocationPosition) {
    return geolocationPosition ? {
      coords: {
        accurracy: geolocationPosition.coords.accuracy,
        altitude: geolocationPosition.coords.altitude,
        altitudeAccuracy: geolocationPosition.coords.altitudeAccuracy,
        heading: geolocationPosition.coords.heading,
        latitude: geolocationPosition.coords.latitude,
        longitude: geolocationPosition.coords.longitude,
        speed: geolocationPosition.coords.speed,
      },
      timestamp: geolocationPosition.timestamp,
    } as unknown as GeolocationPosition : null;
  }
});

export const geolocationPosition = derived(geolocationPositionWritable, (state) => state);

export async function requestGeoLocation() {
  return new Promise<GeolocationPosition>((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
    })
  );
}

if (browser) {
	requestGeoLocation().then((geoposition) => {
    geolocationPositionWritable.set(geoposition);
  });
}
