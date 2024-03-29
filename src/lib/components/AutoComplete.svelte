<svelte:options immutable />

<script lang="ts" generics="T">
	import Spinner from './Spinner.svelte';
	import { debounce } from '@aicacia/debounce';
	import { clickoutside } from '@svelte-put/clickoutside';
	import { escapeRegExp, scrollIntoViewIfNeed } from '$lib/util';
	import { createEventDispatcher } from 'svelte';
	import X from 'lucide-svelte/icons/x';
	import Pencil from 'lucide-svelte/icons/pencil';

	export let id: string | undefined = undefined;
	export let name = '';
	export let value: T | undefined = undefined;
	export let results: T[] = [];
	export let toValue: (value: T) => string | number;
	export let toLabel: (value: T) => string;
	export let toSubLabel: ((value: T) => string) | undefined = undefined;
	export let placeholder = '';
	export let className: string = '';
	export let onSearch: (search: string) => Promise<[results: T[], noExactMatch: boolean]>;
	export let onNew: ((value: string) => Promise<T | undefined>) | undefined = undefined;
	export let onEdit: ((value: T) => Promise<T | undefined>) | undefined = undefined;
	export let disabled: boolean | undefined = undefined;
	export let createMinLength = 1;
	export let debounceMS = 500;
	export let dropdownRight = false;

	const dispatch = createEventDispatcher<{ input: [name: string, value: T] }>();

	let search = '';
	$: searchRegex = new RegExp(`(${escapeRegExp(search)})`, 'igm');

	let open = false;
	function onOpen() {
		open = searchResults.length > 0 || showNew;
	}
	function onClickOutside() {
		open = false;
	}

	let showNew = false;
	$: if (onNew && search && noExactMatch && search.length > createMinLength) {
		open = true;
		showNew = true;
	}
	$: editable = !!onEdit;

	function toLabelHTML(value: T) {
		return search ? toLabel(value).replace(searchRegex, '<strong>$1</strong>') : toLabel(value);
	}

	let searchResults: T[] = results;
	let searching = false;
	let noExactMatch = false;
	async function onSearchInput() {
		if (searching) {
			return;
		}
		try {
			searching = true;
			open = true;
			[searchResults, noExactMatch] = await onSearch(search);
		} finally {
			searching = false;
		}
	}
	$: onSearchInputDebounce = debounce(onSearchInput, debounceMS);

	function onSelectResult(e: Event) {
		const resultElement = (e.target as HTMLElement).closest('li');
		if (resultElement) {
			const dataIndex = resultElement.getAttribute('data-index');
			if (dataIndex != null) {
				selectResult(+dataIndex);
			} else if (showNew) {
				createResult(search);
			}
		}
	}
	function selectResult(index: number) {
		const result = searchResults[index];
		if (result) {
			searchResults = results;
			open = false;
			search = '';
			value = result;
			dispatch('input', [name, value]);
		}
	}
	async function createResult(newValue: string) {
		if (onNew) {
			value = await onNew(newValue);
			if (value) {
				searchResults = results;
				open = false;
				search = '';
				dispatch('input', [name, value]);
			}
		}
	}
	function onClear(e: Event & { currentTarget: HTMLElement }) {
		if (disabled === true) {
			return;
		}
		searchResults = results;
		value = undefined;
		open = false;
		showNew = false;
		search = '';
	}
	function onEditInternal() {
		if (onEdit && value) {
			onEdit(value);
		}
	}

	function onKeyDown(e: KeyboardEvent & { currentTarget: HTMLElement }) {
		switch (e.key) {
			case 'Enter':
				e.preventDefault();
				e.stopPropagation();
				break;
			case 'ArrowUp':
				e.preventDefault();
				e.stopPropagation();
				break;
			case 'ArrowDown':
				e.preventDefault();
				e.stopPropagation();
				break;
		}
	}
	function onKeyUp(e: KeyboardEvent & { currentTarget: HTMLElement }) {
		const element = e.currentTarget.querySelector('ol');
		if (element) {
			const selected = element.querySelector('.active');
			switch (e.key) {
				case 'Enter': {
					if (selected) {
						const dataIndex = selected.getAttribute('data-index');
						if (dataIndex != null) {
							selectResult(+dataIndex);
						} else if (showNew) {
							createResult(search);
						}
					}
					e.preventDefault();
					e.stopPropagation();
					break;
				}
				case 'ArrowUp': {
					if (selected) {
						selected.classList.remove('active');
						const prev = selected.previousElementSibling;
						if (prev) {
							prev.classList.add('active');
							scrollIntoViewIfNeed(prev);
							break;
						}
					}
					element.querySelector('li:last-child')?.classList.add('active');
					e.preventDefault();
					e.stopPropagation();
					break;
				}
				case 'ArrowDown': {
					if (selected) {
						selected.classList.remove('active');
						const next = selected.nextElementSibling;
						if (next) {
							next.classList.add('active');
							scrollIntoViewIfNeed(next);
							break;
						}
					}
					element.querySelector('li:first-child')?.classList.add('active');
					e.preventDefault();
					e.stopPropagation();
					break;
				}
			}
		}
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="relative {className}"
	on:keyup={onKeyUp}
	on:keydown={onKeyDown}
	use:clickoutside
	on:clickoutside={onClickOutside}
>
	{#if value}
		<div
			class="relative w-full rounded"
			class:cursor-not-allowed={disabled}
			class:cursor-auto={!disabled}
		>
			<input
				{id}
				type="text"
				class="w-full"
				class:pe-8={editable || !disabled}
				class:pe-16={editable && !disabled}
				value={toLabel(value)}
				disabled
			/>
			<div class="btn icon borderless absolute right-0 top-0 flex h-full items-center">
				{#if !disabled}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div on:click={onClear} class="btn icon borderless">
						<X />
					</div>
				{/if}
				{#if editable}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div on:click={onEditInternal} class="btn icon borderless">
						<Pencil />
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<input
			type="text"
			class="w-full"
			{id}
			{placeholder}
			autocomplete="off"
			on:click={onOpen}
			bind:value={search}
			on:input={onSearchInputDebounce}
			{disabled}
		/>
		<div class="btn icon borderless absolute right-0 top-0 flex h-full items-center">
			{#if searching}<div class="h-6 w-6"><Spinner /></div>{/if}
		</div>
	{/if}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
	<ol
		class="absolute z-10 -mt-[4px] max-h-64 w-full min-w-fit overflow-auto bg-gray-200 dark:bg-gray-700 shadow-md transition-transform duration-75"
		class:scale-y-0={!open}
		class:scale-y-100={open}
		class:left-0={!dropdownRight}
		class:right-0={dropdownRight}
		class:origin-top-right={dropdownRight}
		class:origin-top-left={!dropdownRight}
		on:click={onSelectResult}
	>
		{#if showNew}
			<li class="cursor-pointer p-2 text-sm">Create {search}</li>
		{/if}
		{#each searchResults as searchResult, index (toValue(searchResult))}
			<li class="flex cursor-pointer flex-col p-2 text-sm" data-index={index}>
				{#if toSubLabel}
					<span class="text-[0.6rem] leading-[0.6rem]">{toSubLabel(searchResult)}</span>
				{/if}
				<span>{@html toLabelHTML(searchResult)}</span>
			</li>
		{/each}
	</ol>
</div>

<style lang="postcss">
	.active,
	li:hover {
		@apply bg-gray-300 dark:bg-gray-600;
	}
</style>
