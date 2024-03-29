import type { LayoutLoad } from './$types';
import { base } from '$app/paths';
import { getCurrentUser } from '$lib/stores/currentUser';
import { redirect } from '@sveltejs/kit';

export const prerender = false;

export const load: LayoutLoad = async () => {
	const currentUser = await getCurrentUser();

	if (currentUser) {
		return {
			user: currentUser
		};
	} else {
		redirect(302, `${base}/signin`);
	}
};
