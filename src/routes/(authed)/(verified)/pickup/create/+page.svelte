<svelte:options immutable />

<script lang="ts" context="module">
	import { create, test, enforce, only } from 'vest';
	import type { TranslationFunctions } from '$lib/i18n/i18n-types';

	type CreateForm = {
		categoryId: number;
		type: string;
		sex: string;
		minAge: number;
		maxAge?: number;
		schedule: string;
		description: string;
		latitude: number;
		longitude: number;
		streetAddressLine1: string;
		streetAddressLine2: string;
		locality: string;
		region: string;
		postalCode: string;
		country: string;
	};
	type CreateField = keyof CreateForm;

	const createSuite = (LL: TranslationFunctions) =>
		create((data: Partial<CreateForm> = {}, fields: Set<string>) => {
			if (!fields.size) {
				return;
			}
			only(Array.from(fields));

			test('categoryId', LL.forms.required(), () => {
				enforce(data.categoryId).isNotBlank();
			});
			test('type', LL.forms.required(), () => {
				enforce(data.type).isNotBlank();
			});
			test('sex', LL.forms.required(), () => {
				enforce(data.sex).isNotBlank();
			});
			test('minAge', LL.forms.required(), () => {
				enforce(data.minAge).isNotBlank();
			});
			test('streetAddressLine1', LL.forms.required(), () => {
				enforce(data.streetAddressLine1).isNotBlank();
			});
			test('locality', LL.forms.required(), () => {
				enforce(data.locality).isNotBlank();
			});
			test('region', LL.forms.required(), () => {
				enforce(data.region).isNotBlank();
			});
			test('postalCode', LL.forms.required(), () => {
				enforce(data.postalCode).isNotBlank();
			});
			test('country', LL.forms.required(), () => {
				enforce(data.country).isNotBlank();
			});
		});
</script>

<script lang="ts">
	import classNames from 'vest/classnames';
	import { invalidateAll } from '$app/navigation';
	import Spinner from '$lib/components/Spinner.svelte';
	import { debounce } from '@aicacia/debounce';
	import InputResults from '$lib/components/InputResults.svelte';
	import LL from '$lib/i18n/i18n-svelte';
	import type { PageData } from './$types';
	import { applyAction, deserialize } from '$app/forms';
	import { createNotification } from '$lib/stores/notifications';
	import { searchForLocationBy } from '$lib/util';
	import { get } from 'svelte/store';
	import { tick } from 'svelte';

	export let data: PageData;

	let categoryId: number;
	let type = 'invite-only';
	$: sex = (data.user.sex as string) || 'male';
	let minAge: number = 18;
	let maxAge: number | undefined;
	let schedule: string;
	let description: string;
	let latitude: number;
	let longitude: number;
	let streetAddressLine1: string;
	let streetAddressLine2: string;
	let locality: string;
	let region: string;
	let postalCode: string;
	let country: string;

	$: suite = createSuite($LL);
	$: result = suite.get();
	$: disabled = loading;
	$: cn = classNames(result, {
		untested: 'untested',
		tested: 'tested',
		invalid: 'invalid',
		valid: 'valid',
		warning: 'warning'
	});

	const fields = new Set<CreateField>();
	const validate = debounce(() => {
		suite(
			{
				categoryId,
				type,
				sex,
				minAge,
				maxAge,
				schedule,
				description,
				latitude,
				longitude,
				streetAddressLine1,
				streetAddressLine2,
				locality,
				region,
				postalCode,
				country
			},
			fields
		).done((r) => {
			result = r;
		});
		fields.clear();
	}, 300);
	function onChange(
		e: Event & { currentTarget: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement }
	) {
		fields.add(e.currentTarget.name as CreateField);
		validate();
	}
	function onMinAgeChange() {
		if (maxAge && maxAge < minAge) {
			maxAge = minAge;
			fields.add('maxAge');
		}
		fields.add('minAge');
		validate();
	}
	function onMaxAgeChange() {
		if (maxAge && minAge > maxAge) {
			minAge = maxAge;
			fields.add('minAge');
		}
		fields.add('maxAge');
		validate();
	}
	function validateAll() {
		fields.add('categoryId');
		fields.add('type');
		fields.add('sex');
		fields.add('minAge');
		fields.add('maxAge');
		fields.add('schedule');
		fields.add('description');
		fields.add('latitude');
		fields.add('longitude');
		fields.add('streetAddressLine1');
		fields.add('streetAddressLine2');
		fields.add('locality');
		fields.add('region');
		fields.add('postalCode');
		fields.add('country');
		validate();
		validate.flush();
	}

	let loading = false;
	async function onSubmit(e: SubmitEvent & { currentTarget: HTMLFormElement }) {
		try {
			loading = true;
			const form = e.currentTarget;
			validateAll();
			if (result.isValid()) {
				const locationResults = await searchForLocationBy(
					`${streetAddressLine1}${streetAddressLine2.trim() ? ', ' : ''}${streetAddressLine2}`,
					locality,
					region,
					country
				);
				if (!locationResults.length) {
					createNotification(get(LL).errors.failedToFindLocation());
					return;
				}
				latitude = parseFloat(locationResults[0].lat);
				longitude = parseFloat(locationResults[0].lon);
				await tick();

				const response = await fetch(form.action, {
					method: 'POST',
					body: new FormData(form)
				});

				const result = deserialize(await response.text());

				if (result.type === 'success') {
					await invalidateAll();
				}

				await applyAction(result);
			}
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>{$LL.pickup.create.title()}</title>
</svelte:head>

<div class="flex flex-grow flex-col justify-end md:justify-start">
	<div class="container mx-auto my-10 flex flex-shrink flex-col">
		<div class="m-4 flex flex-col bg-white p-4 shadow dark:bg-gray-800">
			<h4 class="mb-1">{$LL.pickup.create.title()}</h4>
			<form class="flex flex-grow flex-col" on:submit|preventDefault={onSubmit}>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="flex flex-grow flex-col">
						<div class="mb-4">
							<label for="type">{$LL.pickup.type()}</label>
							<select class="w-full {cn('type')}" name="type" bind:value={type} on:input={onChange}>
								<option value="invite-only">{$LL.pickup.inviteOnly()}</option>
								<option value="public">{$LL.pickup.public()}</option>
							</select>
							<InputResults name="sex" {result} />
						</div>
						<div class="mb-4">
							<label for="sex">{$LL.auth.sex()}</label>
							<select class="w-full {cn('sex')}" name="sex" bind:value={sex} on:input={onChange}>
								<option value="all">{$LL.pickup.create.allGenders()}</option>
								<option value="male">{$LL.forms.male()}</option>
								<option value="female">{$LL.forms.female()}</option>
							</select>
							<InputResults name="sex" {result} />
						</div>
						<div class="mb-4">
							<label for="categoryId">{$LL.pickup.category()}</label>
							<select
								class="w-full {cn('categoryId')}"
								name="categoryId"
								bind:value={categoryId}
								on:input={onChange}
							>
								{#each data.categories as category (category.id)}
									<option value={category.id}>{$LL.pickup.categories[category.uri]()}</option>
								{/each}
							</select>
							<InputResults name="categoryId" {result} />
						</div>
						<div class="mb-4 grid grid-cols-2 gap-4">
							<div class="flex-grow">
								<label for="minAge">{$LL.pickup.minAge()}</label>
								<input
									class="w-full {cn('minAge')}"
									type="number"
									min="1"
									step="1"
									name="minAge"
									bind:value={minAge}
									on:input={onMinAgeChange}
								/>
								<InputResults name="minAge" {result} />
							</div>
							<div class="flex-grow">
								<label for="maxAge">{$LL.pickup.maxAge()}</label>
								<input
									class="w-full {cn('maxAge')}"
									type="number"
									min="1"
									step="1"
									name="maxAge"
									placeholder={$LL.pickup.noLimit()}
									bind:value={maxAge}
									on:input={onMaxAgeChange}
								/>
								<InputResults name="maxAge" {result} />
							</div>
						</div>
					</div>
					<div class="flex flex-grow flex-col">
						<div class="mb-4">
							<label for="description">{$LL.pickup.description()}</label>
							<textarea
								class="w-full {cn('description')}"
								name="description"
								bind:value={description}
								on:input={onChange}
							/>
							<InputResults name="description" {result} />
						</div>
						<div>
							<label for="streetAddressLine1">{$LL.pickup.streetAddressLine1()}</label>
							<input
								class="w-full {cn('streetAddressLine1')}"
								name="streetAddressLine1"
								type="text"
								bind:value={streetAddressLine1}
								on:input={onChange}
							/>
							<InputResults name="streetAddressLine1" {result} />
						</div>
						<div>
							<label for="streetAddressLine2">{$LL.pickup.streetAddressLine2()}</label>
							<input
								class="w-full {cn('streetAddressLine2')}"
								name="streetAddressLine2"
								type="text"
								bind:value={streetAddressLine2}
								on:input={onChange}
							/>
							<InputResults name="streetAddressLine2" {result} />
						</div>
						<div class="grid grid-cols-2 gap-4">
							<div class="flex-grow">
								<label for="region">{$LL.pickup.region()}</label>
								<input
									class="w-full {cn('region')}"
									name="region"
									type="text"
									bind:value={region}
									on:input={onChange}
								/>
								<InputResults name="region" {result} />
							</div>
							<div class="flex-grow">
								<label for="locality">{$LL.pickup.locality()}</label>
								<input
									class="w-full {cn('locality')}"
									name="locality"
									type="text"
									bind:value={locality}
									on:input={onChange}
								/>
								<InputResults name="locality" {result} />
							</div>
						</div>
						<div class="grid grid-cols-2 gap-4">
							<div class="flex-grow">
								<label for="postalCode">{$LL.pickup.postalCode()}</label>
								<input
									class="w-full {cn('postalCode')}"
									name="postalCode"
									type="text"
									bind:value={postalCode}
									on:input={onChange}
								/>
								<InputResults name="postalCode" {result} />
							</div>
							<div class="flex-grow">
								<label for="country">{$LL.pickup.country()}</label>
								<input
									class="w-full {cn('country')}"
									name="country"
									type="text"
									bind:value={country}
									on:input={onChange}
								/>
								<InputResults name="country" {result} />
							</div>
						</div>
						<InputResults name="latitude" {result} />
						<InputResults name="longitude" {result} />
					</div>
				</div>
				<div class="mt-8 flex w-full flex-row justify-end">
					<button type="submit" class="btn primary flex flex-shrink" {disabled}>
						{#if loading}
							<div class="me-2 flex flex-row justify-center">
								<div class="inline-block h-6 w-6"><Spinner /></div>
							</div>
						{/if}
						{$LL.forms.create()}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
