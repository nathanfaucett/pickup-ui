<svelte:options immutable />

<script lang="ts">
	import LL from '$lib/i18n/i18n-svelte';
	import Google from '$lib/components/icons/Google.svelte';
	import Facebook from 'lucide-svelte/icons/facebook';
	import { PUBLIC_PICKUP_API_URL } from '$env/static/public';
</script>

<svelte:head>
	<title>{$LL.auth.signInUp()}</title>
</svelte:head>

<div class="flex flex-grow flex-col justify-end md:justify-start">
	<div class="mx-auto my-10 flex w-full flex-shrink flex-col sm:w-72">
		<div class="m-4 flex flex-col bg-white p-4 shadow dark:bg-gray-800">
			<h3 class="text-center">{$LL.auth.signInUp()}</h3>
			<hr class="mb-4 mt-2" />
			<div class="flex flex-col items-center justify-center">
				<a
					class="btn secondary flex w-fit flex-row items-center justify-center rounded-full normal-case"
					href={`${PUBLIC_PICKUP_API_URL}/oauth2/google`}
				>
					<div class="me-2 h-5 w-5"><Google /></div>
					Sign in with Google
				</a>
				<a
					class="btn mt-2 flex w-fit flex-row items-center justify-center rounded-full bg-blue-600 normal-case !text-white shadow hover:bg-blue-800"
					href={`${PUBLIC_PICKUP_API_URL}/oauth2/facebook`}
				>
					<div class="me-2"><Facebook /></div>
					Sign in with Facebook
				</a>
			</div>
		</div>
	</div>
</div>
