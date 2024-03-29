import { base } from '$app/paths';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async (event) => {
  const { user } = await event.parent()
	if (!user.terms_of_service_acknowledge) {
		redirect(302, `${base}/complete`);
	}
};
