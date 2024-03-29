<svelte:options immutable />

<script lang="ts" context="module">
	import '../app.postcss';
	import '$lib';
</script>

<script lang="ts">
	import Notifications from '$lib/components/Notifications.svelte';
	import Header from '$lib/components/Header.svelte';
	import { currentUser } from '$lib/stores/currentUser';
</script>

<div class="flex h-full w-full flex-col">
	<Header user={$currentUser} />
	<div class="flex flex-grow flex-col overflow-y-auto overflow-x-hidden">
		<slot />
	</div>
</div>

<Notifications />
