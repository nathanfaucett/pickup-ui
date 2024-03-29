<svelte:options immutable />

<script lang="ts" context="module">
	import { writable } from 'svelte/store';

	let search = writable('');
</script>

<script lang="ts">
	import LL from '$lib/i18n/i18n-svelte';
	import { base } from '$app/paths';
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
