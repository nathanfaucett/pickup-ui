import { describe, it, expect } from 'vitest';
import { createInsecureID, toCents } from './util';

describe('createInsecureID', () => {
	it('should return a number', () => {
		expect(createInsecureID()).not.toBeNaN();
	});
});

describe('toCents', () => {
	it('should return number of cents in dollor', () => {
		expect(toCents(0.49)).toEqual(49);
		expect(toCents(0.99)).toEqual(99);
		expect(toCents(1.49)).toEqual(149);
		expect(toCents(1.99)).toEqual(199);
		expect(toCents(19.49)).toEqual(1949);
		expect(toCents(19.99)).toEqual(1999);
		expect(toCents(199.49)).toEqual(19949);
		expect(toCents(199.99)).toEqual(19999);
	});
});
