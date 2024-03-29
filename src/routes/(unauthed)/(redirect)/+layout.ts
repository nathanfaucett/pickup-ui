import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { getCurrentUser } from '$lib/stores/currentUser';
import { base } from '$app/paths';

export const load: LayoutLoad = async () => {
	const currentUser = await getCurrentUser();

	if (currentUser) {
		redirect(302, `${base}/pickup`);
	}
};
