<svelte:options immutable />

<script lang="ts" context="module">
	import 'leaflet/dist/leaflet.css';
	import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
	import 'leaflet.markercluster/dist/MarkerCluster.css';
</script>

<script lang="ts">
	import type L from 'leaflet';
	import { createEventDispatcher, onMount } from 'svelte';

	export let latitude: number = 39;
	export let longitude: number = -98;
	export let altitude: number | undefined = undefined;
	export let zoom: number = 13;
	export let map: L.Map | undefined = undefined;

	const dispatch = createEventDispatcher<{
		move: [latitude: number, longitude: number, altitude?: number];
		zoom: number;
	}>();

	let element: HTMLElement;

	let prevLatitude = latitude;
	let prevLongitude = longitude;
	$: if ((map && prevLatitude !== latitude) || prevLongitude !== longitude) {
		map?.setView([latitude, longitude], zoom);
	}

	onMount(async () => {
		await import('leaflet');
		await import('leaflet.markercluster');

		let m = window.L.map(element, { zoomControl: false }).setView([latitude, longitude], zoom);
		map = m;
		window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '© OpenStreetMap'
		}).addTo(m);

		m.addEventListener('moveend', () => {
			const center = m.getCenter();
			latitude = prevLatitude = center.lat;
			longitude = prevLongitude = center.lng;
			altitude = center.alt;
			dispatch('move', [latitude, longitude, altitude]);
		});
		m.addEventListener('zoom', () => {
			zoom = m.getZoom();
			dispatch('zoom', zoom);
		});
	});
</script>

<div bind:this={element} class="z-0 h-full w-full" />
