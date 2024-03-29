import { describe, it, expect } from 'vitest';
import { NumberParser } from './NumberParser';

describe('NumberParser', () => {
	it('should parse numbers for en-US', () => {
		const numberParser = new NumberParser('en-US');
		expect(numberParser.parse('.0')).toEqual(0);
		expect(numberParser.parse('0.0')).toEqual(0);
		expect(numberParser.parse('0')).toEqual(0);
		expect(numberParser.parse('1')).toEqual(1);
		expect(numberParser.parse('1.0')).toEqual(1);
		expect(numberParser.parse('1.123')).toEqual(1.123);
		expect(numberParser.parse('123.123')).toEqual(123.123);
	});
	it('should parse numbers for de-DE', () => {
		const numberParser = new NumberParser('de-DE');
		expect(numberParser.parse(',0')).toEqual(0);
		expect(numberParser.parse('0,0')).toEqual(0);
		expect(numberParser.parse('0')).toEqual(0);
		expect(numberParser.parse('1')).toEqual(1);
		expect(numberParser.parse('1,0')).toEqual(1);
		expect(numberParser.parse('1,123')).toEqual(1.123);
		expect(numberParser.parse('123,123')).toEqual(123.123);
	});
});
