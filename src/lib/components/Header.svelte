<svelte:options immutable />

<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import LogOut from 'lucide-svelte/icons/log-out';
	import Search from 'lucide-svelte/icons/search';
	import Menu from 'lucide-svelte/icons/menu';
	import UserIcon from 'lucide-svelte/icons/user';
	import { page } from '$app/stores';
	import LL from '$lib/i18n/i18n-svelte';
	import type { User } from '$lib/repository/user';
	import { signOut } from '$lib/stores/currentUser';
	import { createNotification } from '$lib/stores/notifications';

	export let user: User | null = null;

	async function onSignOut() {
		try {
			await signOut();
			onGoto();
			await goto(`${base}/signin`);
		} catch (error) {
			console.error(error);
			createNotification($LL.errors.failedToSignOut());
		}
	}

	let open = false;
	function onGoto() {
		open = false;
	}
</script>

<div class="z-20 flex flex-shrink flex-row justify-between bg-white shadow dark:bg-gray-800">
	<div class="ms-2 flex flex-shrink flex-row">
		<a class="btn text-lg" href={user ? `${base}/pickup` : `${base}/`}>Pickup</a>
	</div>
	<div class="me-2 flex flex-shrink flex-row">
		<div class="flex flex-col content-center justify-center">
			{#if user}
				<Dropdown bind:open>
					<Menu slot="button" />
					<a
						href={`${base}/pickup`}
						class="default flex cursor-pointer flex-row justify-between p-2 hover:bg-gray-200 dark:hover:bg-gray-600"
						class:active={$page.route.id === '/(authed)/pickup'}
						on:click={onGoto}
					>
						<Search /><span class="ms-4">{$LL.home.title()}</span>
					</a>
					<a
						href={`${base}/profile`}
						class="default flex cursor-pointer flex-row justify-between p-2 hover:bg-gray-200 dark:hover:bg-gray-600"
						class:active={$page.route.id === '/(authed)/profile'}
						on:click={onGoto}
					>
						<UserIcon /><span class="ms-4">{$LL.profile.title()}</span>
					</a>
					<hr />
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
					<li
						class="flex cursor-pointer flex-row justify-between p-2 hover:bg-gray-200 dark:hover:bg-gray-600"
						on:click={onSignOut}
					>
						<LogOut /><span class="ms-4">{$LL.auth.signOut()}</span>
					</li>
				</Dropdown>
			{:else}
				<a href={`${base}/signin`}>{$LL.auth.signInUp()}</a>
			{/if}
		</div>
	</div>
</div>

<style lang="postcss">
	li.active,
	a.active {
		@apply bg-gray-200 dark:bg-gray-600;
	}
</style>
