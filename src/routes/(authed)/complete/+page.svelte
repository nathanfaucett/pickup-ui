<svelte:options immutable />

<script lang="ts" context="module">
	import { create, test, enforce, only } from 'vest';
	import type { TranslationFunctions } from '$lib/i18n/i18n-types';

	type CompleteForm = {
		username: string;
		birthdate: Date;
		sex: string;
		termsOfServiceAcknowledge: boolean;
	};
	type CompleteField = keyof CompleteForm;

	const createSuite = (LL: TranslationFunctions) =>
		create((data: Partial<CompleteForm> = {}, fields: Set<string>) => {
			if (!fields.size) {
				return;
			}
			only(Array.from(fields));

			test('username', LL.forms.required(), () => {
				enforce(data.username).isNotBlank();
			});
			test('birthdate', LL.forms.required(), () => {
				enforce(data.birthdate).isNotBlank();
			});
			test('sex', LL.forms.required(), () => {
				enforce(data.sex).isNotBlank();
			});
			test('termsOfServiceAcknowledge', LL.forms.required(), () => {
				enforce(data.termsOfServiceAcknowledge).isTruthy();
			});
		});
</script>

<script lang="ts">
	import classNames from 'vest/classnames';
	import { base } from '$app/paths';
	import Spinner from '$lib/components/Spinner.svelte';
	import { debounce } from '@aicacia/debounce';
	import InputResults from '$lib/components/InputResults.svelte';
	import LL from '$lib/i18n/i18n-svelte';
	import type { PageData } from './$types';
	import { userApi } from '$lib/openapi';
	import { updateUser } from '$lib/stores/currentUser';
	import { goto } from '$app/navigation';

	export let data: PageData;

	$: username = data.user.username || '';
	$: birthdate = data.user.birthdate || new Date(0);
	$: birthdateString = birthdate.toISOString().slice(0, 10);
	$: sex = (data.user.sex as string) || 'male';
	$: termsOfServiceAcknowledge = data.user.terms_of_service_acknowledge || false;

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

	const fields = new Set<CompleteField>();
	const validate = debounce(() => {
		suite({ username, termsOfServiceAcknowledge, sex, birthdate }, fields).done((r) => {
			result = r;
		});
		fields.clear();
	}, 300);
	function onChange(e: Event & { currentTarget: HTMLInputElement | HTMLSelectElement }) {
		fields.add(e.currentTarget.name as CompleteField);
		validate();
	}
	function onUsernameChange(e: Event & { currentTarget: HTMLInputElement }) {
		username = username.trim();
		fields.add(e.currentTarget.name as CompleteField);
		validate();
	}
	function onBirthdateChange(e: Event & { currentTarget: HTMLInputElement }) {
		birthdate = new Date(birthdateString);
		if (!isNaN(birthdate.getTime())) {
			fields.add(e.currentTarget.name as CompleteField);
			validate();
		}
	}
	function validateAll() {
		fields.add('username');
		fields.add('termsOfServiceAcknowledge');
		fields.add('sex');
		fields.add('birthdate');
		validate();
		validate.flush();
	}

	let loading = false;
	async function onSubmit(e: SubmitEvent & { currentTarget: HTMLFormElement }) {
		try {
			loading = true;
			validateAll();
			if (result.isValid()) {
				const user = await userApi.userCompletePatch({
					username,
					terms_of_service_acknowledge: termsOfServiceAcknowledge,
					birthdate,
					sex
				});
				updateUser(user);
				await goto('/pickup');
			}
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>{$LL.auth.complete()}</title>
</svelte:head>

<div class="flex flex-grow flex-col justify-end md:justify-start">
	<div class="mx-auto my-10 flex w-full flex-shrink flex-col sm:w-72">
		<div class="m-4 flex flex-col bg-white p-4 shadow dark:bg-gray-800">
			<h4 class="mb-1">{$LL.auth.complete()}</h4>
			<form class="flex flex-grow flex-col" on:submit|preventDefault={onSubmit}>
				<div class="flex w-full flex-grow flex-col">
					<div class="mb-4">
						<label for="username">{$LL.auth.username()}</label>
						<input
							class="w-full {cn('username')}"
							type="text"
							name="username"
							autocomplete="username"
							placeholder={$LL.auth.usernamePlaceholder()}
							bind:value={username}
							on:input={onUsernameChange}
						/>
						<InputResults name="username" {result} />
					</div>
					<div class="mb-4">
						<label for="sex">{$LL.auth.sex()}</label>
						<select
							class="w-full {cn('sex')}"
							name="sex"
							autocomplete="sex"
							bind:value={sex}
							on:input={onChange}
						>
							<option value="male">{$LL.forms.male()}</option>
							<option value="female">{$LL.forms.female()}</option>
						</select>
						<InputResults name="sex" {result} />
					</div>
					<div class="mb-4">
						<label for="birthdate">{$LL.auth.birthdate()}</label>
						<input
							class="w-full {cn('birthdate')}"
							type="date"
							name="birthdate"
							autocomplete="bday"
							placeholder={$LL.auth.birthdatePlaceholder()}
							bind:value={birthdateString}
							on:input={onBirthdateChange}
						/>
						<InputResults name="birthdate" {result} />
					</div>
					<div class="mb-4">
						<div class="flex flex-row">
							<input
								class={cn('termsOfServiceAcknowledge')}
								type="checkbox"
								name="termsOfServiceAcknowledge"
								bind:checked={termsOfServiceAcknowledge}
								on:input={onChange}
							/>
							<p class="ms-2 font-sans text-sm">
								{@html $LL.auth.termsOfServiceAcknowledge({ link: `${base}/terms` })}
							</p>
						</div>
						<InputResults name="termsOfServiceAcknowledge" {result} />
					</div>
				</div>
				<div class="mt-8 flex w-full flex-row justify-end">
					<button type="submit" class="btn primary flex flex-shrink" {disabled}>
						{#if loading}
							<div class="me-2 flex flex-row justify-center">
								<div class="inline-block h-6 w-6"><Spinner /></div>
							</div>
						{/if}
						{$LL.auth.complete()}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
