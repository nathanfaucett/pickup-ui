<svelte:options immutable />

<script lang="ts" context="module">
	import { get, writable } from 'svelte/store';

	let search = writable('');

	const PAGE_SIZE = 20;

	export function parseSearchParams(url: URL) {
		let latitude = parseFloat(url.searchParams.get('latitude') || '');
		if (isNaN(latitude)) {
			latitude = 0;
		}
		let longitude = parseFloat(url.searchParams.get('longitude') || '');
		if (isNaN(longitude)) {
			longitude = 0;
		}
		let maxDistance = parseFloat(url.searchParams.get('maxDistance') || '');
		if (isNaN(maxDistance)) {
			maxDistance = 0;
		}
		const locationTypes = (url.searchParams.get('locationTypes') || '')
			.split(',')
			.filter((s) => !!s) as string[];
		const types = (url.searchParams.get('types') || '').split(',').filter((s) => !!s) as string[];

		return {
			latitude,
			longitude,
			maxDistance,
			locationTypes,
			types
		};
	}
</script>

<script lang="ts">
	import LL from '$lib/i18n/i18n-svelte';
	import { base } from '$app/paths';
	import { placeApi } from '$lib/openapi';
	import type { Place } from '$lib/openapi/pickup';
	import { debounce } from '@aicacia/debounce';
	import { hashOf } from '@aicacia/hash';
	import { setUrlParams } from '$lib/util';
	import { page } from '$app/stores';
	import { waitGeolocationPosition } from '$lib/stores/location';

	$: searchParams = parseSearchParams($page.url);

	$: latitude = searchParams.latitude;
	$: longitude = searchParams.longitude;
	$: maxDistance = searchParams.maxDistance;
	$: locationTypes = searchParams.locationTypes;
	$: types = searchParams.types;

	waitGeolocationPosition().then((position) => {
		if (!latitude) {
			latitude = position.coords.latitude;
		}
		if (!longitude) {
			longitude = position.coords.longitude;
		}
	});

	let lastPage: number;
	let pageIndex = 1;
	let lastHash: number;
	let reset = false;
	let searching = false;
	let debouncing = false;

	let places: Place[] = [];

	$: if (!searching) {
		const hash = hashOf([latitude, longitude, maxDistance, types, locationTypes]);
		reset = lastHash !== hash;
		lastHash = hash;
		if (reset) {
			pageIndex = 1;
		}
		let pageChanged = lastPage !== pageIndex;
		lastPage = pageIndex;
		if (pageChanged || reset) {
			debouncing = true;
			onSearch();
		}
	}

	const onSearch = debounce(async () => {
		debouncing = false;
		if (searching) {
			return;
		}
		try {
			searching = true;
			places = await placeApi.placesGet(
				latitude,
				pageIndex * PAGE_SIZE,
				longitude,
				maxDistance,
				pageIndex,
				locationTypes.length ? locationTypes : undefined,
				types.length ? types : undefined
			);
			setUrlParams({
				latitude,
				longitude,
				maxDistance,
				locationTypes: locationTypes.join(','),
				types: types.join(',')
			});
		} finally {
			searching = false;
		}
	}, 300);
</script>

<svelte:head>
	<title>{$LL.pickup.title()}</title>
</svelte:head>

<div class="container mx-auto">
	<div class="flex flex-row justify-between p-2">
		<div class="flex flex-row justify-center">
			<input type="text" bind:value={$search} placeholder={$LL.pickup.searchPlaceholder()} />
		</div>
		<a class="btn primary" href={`${base}/pickup/create`}>{$LL.pickup.create.title()}</a>
	</div>
</div>

<div class="container mx-auto">
	<div class="flex flex-row justify-center p-2"></div>
</div>
