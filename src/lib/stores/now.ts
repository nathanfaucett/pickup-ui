import { MONTH, WEEK } from '$lib/time';
import { derived, writable } from 'svelte/store';

const nowWritable = writable(Date.now());
export const now = derived(nowWritable, (now) => now);
export const date = derived(nowWritable, (now) => new Date(now));
export const nextWeek = derived(nowWritable, (now) => now + WEEK.getTime());
export const nextMonth = derived(nowWritable, (now) => now + MONTH.getTime());

let lastMS = Date.now();
let offsetMS = 0;

function onTimeout() {
	const nowMS = Date.now();
	offsetMS = 1000 - (nowMS - lastMS);
	lastMS = nowMS;
	nowWritable.set(Date.now());
	setTimeout(onTimeout, 1000 + offsetMS);
}

setTimeout(onTimeout, 1000);
