import { derived, get } from 'svelte/store';
import { localstorageWritable } from 'svelte-localstorage-writable';
import { isOnline } from './online';
import {
	getAuthToken,
	setAuthToken,
	pickupConfiguration,
  userApi
} from '$lib/openapi';
import EventEmitter from 'eventemitter3';
import { base } from '$app/paths';
import { goto } from '$app/navigation';
import { UserFromJSON, type User } from '$lib/openapi/pickup';

const tokenWritable = localstorageWritable<string | null>('token', null);
const userWritable = localstorageWritable<User | null>('user', null, {
	fromJSON: UserFromJSON
});

export const currentUser = derived(userWritable, (user) => user);
export const signedIn = derived(userWritable, (user) => !!user);

export const userEmitter = new EventEmitter<{ user(user: User): void; signOut(): void }>();

export function waitForUser() {
	const user = get(userWritable);
	if (getAuthToken() && user) {
		return Promise.resolve(user);
	} else {
		return new Promise<User>((resolve) => userEmitter.once('user', resolve));
	}
}

export function isSignedIn() {
	return get(signedIn);
}

export function updateUser(user: User) {
	userWritable.set(user);
}

export async function signInWithToken(token: string) {
	setAuthToken(token);
	const user = await userApi.userGet();
	userWritable.set(user);
	tokenWritable.set(token);
	userEmitter.emit('user', user);
	return user;
}

export function signOut() {
	userWritable.set(null);
	tokenWritable.set(null);
	setAuthToken(undefined);
	userEmitter.emit('signOut');
}

let initialCall = true;
export async function getCurrentUser() {
	try {
		let user = get(userWritable);
		if (initialCall) {
			if (isOnline()) {
				const token = get(tokenWritable);
				if (token) {
					setAuthToken(token);
					user = await userApi.userGet();
					userWritable.set(user);
					userEmitter.emit('user', user);
				} else {
					signOut();
					user = null;
				}
			} else if (user) {
				userEmitter.emit('user', user);
			}
			initialCall = false;
		}
		return user;
	} catch (error) {
		console.error(error);
		signOut();
		return null;
	}
}

pickupConfiguration.middleware?.push({
	async post(context) {
		switch (context.response.status) {
			case 401:
				signOut();
				await goto(`${base}/signin`);
				break;
			case 503:
				await goto(`${base}/maintenance`);
		}
	}
});
