<svelte:options immutable />

<script lang="ts">
	import { portal } from 'svelte-portal';
	import X from 'lucide-svelte/icons/x';
	import { createInsecureID } from '$lib/util';

	export let onClose: () => void = () => undefined;
	export let small = false;
	export let open = false;
	export let backdrop = true;
	export let backgroundClose = backdrop;

	let key = createInsecureID();
	let prevOpen: boolean;
	$: if (prevOpen !== open) {
		key = createInsecureID();
		prevOpen = open;
	}

	function close() {
		open = false;
		onClose();
	}

	let container: HTMLElement;
	function onClickOutside(e: Event) {
		if (!backgroundClose) {
			return;
		}
		if (container.contains(e.target as Node)) {
			e.stopPropagation();
			return;
		}
		if (open) {
			open = false;
			onClose();
		}
	}
</script>

<div use:portal class="relative" role="dialog" aria-modal="true">
	<div
		class="fixed z-[10000] inset-0 bg-black bg-opacity-25"
		class:hidden={backdrop ? !open : true}
	/>
	<div
		class="fixed z-[10000] inset-0 overflow-y-auto"
		class:hidden={!open}
		on:pointerdown={onClickOutside}
	>
		<div class="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
			<div
				class="relative bg-gray-100 dark:bg-gray-900 shadow-lg rounded sm:my-8 sm:w-full sm:max-w-lg"
				class:m-auto={small}
				bind:this={container}
			>
				{#key key}
					<div class="flex flex-row flex-shrink items-start justify-between px-4 pt-4">
						<div class="flex flex-col flex-grow">
							<slot name="title" />
						</div>
						<button class="btn primary icon" on:click|stopPropagation={close}>
							<div class="w-6 h-6"><X /></div>
						</button>
					</div>
					<div class="relative px-4 pb-4 pt-0 flex-col flex-grow">
						<slot />
					</div>
				{/key}
			</div>
		</div>
	</div>
</div>
