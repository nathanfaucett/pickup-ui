<svelte:options immutable />

<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex flex-grow flex-col w-full mx-4 sm:container sm:mx-auto mt-4 mb-16">
	<h3>{$page.status}</h3>
	{#if $page.error?.message}
		<p>{$page.error.message}</p>
	{/if}
</div>
