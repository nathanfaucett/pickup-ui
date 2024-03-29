import { browser } from '$app/environment';
import { derived, get } from 'svelte/store';
import { localstorageWritable } from 'svelte-localstorage-writable';
import EventEmitter from 'eventemitter3';

const geolocationPositionWritable = localstorageWritable<GeolocationPosition | null>(
	'location',
	null,
	{
		toJSON(geolocationPosition) {
			return geolocationPosition
				? {
						coords: {
							accurracy: geolocationPosition.coords.accuracy,
							altitude: geolocationPosition.coords.altitude,
							altitudeAccuracy: geolocationPosition.coords.altitudeAccuracy,
							heading: geolocationPosition.coords.heading,
							latitude: geolocationPosition.coords.latitude,
							longitude: geolocationPosition.coords.longitude,
							speed: geolocationPosition.coords.speed
						},
						timestamp: geolocationPosition.timestamp
					}
				: null;
		},
		fromJSON(geolocationPosition) {
			return geolocationPosition
				? ({
						coords: {
							accurracy: geolocationPosition.coords.accuracy,
							altitude: geolocationPosition.coords.altitude,
							altitudeAccuracy: geolocationPosition.coords.altitudeAccuracy,
							heading: geolocationPosition.coords.heading,
							latitude: geolocationPosition.coords.latitude,
							longitude: geolocationPosition.coords.longitude,
							speed: geolocationPosition.coords.speed
						},
						timestamp: geolocationPosition.timestamp
					} as unknown as GeolocationPosition)
				: null;
		}
	}
);

export const geolocationPosition = derived(geolocationPositionWritable, (state) => state);

const geolocationPositionEmitter = new EventEmitter<{
	geolocationPosition(geolocationPosition: GeolocationPosition): void;
}>();

export function waitGeolocationPosition() {
	const geolocationPosition = get(geolocationPositionWritable);
	if (geolocationPosition) {
		return Promise.resolve(geolocationPosition);
	} else {
		return new Promise<GeolocationPosition>((resolve) =>
			geolocationPositionEmitter.once('geolocationPosition', resolve)
		);
	}
}

export async function requestGeoLocation() {
	return new Promise<GeolocationPosition>((resolve, reject) =>
		navigator.geolocation.getCurrentPosition(
			(position) => {
				geolocationPositionEmitter.emit('geolocationPosition', position);
				resolve(position);
				return position;
			},
			reject,
			{
				enableHighAccuracy: true
			}
		)
	);
}

if (browser) {
	requestGeoLocation().then((geoposition) => {
		geolocationPositionWritable.set(geoposition);
	});
}
