import type { PageLoad } from './$types';
import { base } from '$app/paths';
import { createNotification } from '$lib/stores/notifications';
import { redirect } from '@sveltejs/kit';
import { ModelErrorFromJSON, type User } from '$lib/openapi/pickup';
import { get } from 'svelte/store';
import LL from '$lib/i18n/i18n-svelte';
import { signInWithToken } from '$lib/stores/currentUser';

export const prerender = true;
export const ssr = false;

export const load: PageLoad = async (event) => {
	const token = event.url.searchParams.get('token') as string;
	const errorString = event.url.searchParams.get('error') as string;

  if (token) {
    let user: User | undefined;
    try {
      user = await signInWithToken(token);
    } catch (e) {
      console.error(e);
    }
    if (user) {
      if (user.terms_of_service_acknowledge) {
        redirect(302, `${base}/pickup`);
      } else {
        redirect(302, `${base}/complete`);
      }
      return;
    }
  }
  if (errorString) {
    const error = ModelErrorFromJSON(errorString);
    console.error(error);
  }
  createNotification(get(LL).errors.internalServerError(), "error");
  redirect(302, `${base}/signin`);
};
