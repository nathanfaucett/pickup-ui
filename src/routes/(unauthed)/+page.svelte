<svelte:options immutable />

<script lang="ts">
	import { base } from '$app/paths';
	import LL from '$lib/i18n/i18n-svelte';
</script>

<svelte:head>
	<title>{$LL.home.title()}</title>
</svelte:head>

<div class="flex flex-col flex-grow justify-end md:justify-start">
	<div class="flex flex-col flex-shrink mx-auto my-10 bg-white dark:bg-gray-800 shadow py-4 px-8">
		<div class="text-center">
			<h1>{$LL.home.title()}</h1>
			<p>{$LL.home.tagline()}</p>
			<a href={`${base}/signin`}>{$LL.auth.signInUp()}</a>
		</div>
	</div>
</div>
