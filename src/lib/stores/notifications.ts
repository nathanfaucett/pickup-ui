import { createInsecureID } from '$lib/util';
import type { Readable } from 'svelte/store';
import { writable } from 'svelte/store';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface INotification {
	id: number;
	message: string;
	type: NotificationType;
	onRemove: () => void;
}

const writableNotifications = writable<INotification[]>([]);

export const notifications: Readable<INotification[]> = writableNotifications;

export function createNotification(
	message: string,
	type: NotificationType = 'error',
	deleteAfterMS = 3000,
	onRemove = () => undefined
) {
	const id = createInsecureID();
	writableNotifications.update((state) => [
		...state,
		{
			id,
			message,
			type,
			onRemove
		}
	]);
	if (deleteAfterMS > 0) {
		setTimeout(() => removeNotification(id), deleteAfterMS);
	}
	return id;
}

export function removeNotification(id: number): void {
	writableNotifications.update((state) => {
		const index = state.findIndex((notification) => notification.id === id);

		if (index === -1) {
			return state;
		} else {
			const newState = state.slice();
			newState.splice(index, 1);
			state[index].onRemove();
			return newState;
		}
	});
}
