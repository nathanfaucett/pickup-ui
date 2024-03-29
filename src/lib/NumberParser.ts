export class NumberParser {
	private group: RegExp;
	private decimal: RegExp;
	private numeral: RegExp;
	private index: (key: string) => string;

	constructor(locale?: string) {
		const format = new Intl.NumberFormat(locale);
		const parts = format.formatToParts(12345.6);
		const numerals = Array.from({ length: 10 }).map((_, i) => format.format(i));
		const index = new Map(numerals.map((d, i) => [d, i.toString()]));
		this.group = new RegExp(`[${parts.find((d) => d.type === 'group')?.value}]`, 'g');
		this.decimal = new RegExp(`[${parts.find((d) => d.type === 'decimal')?.value}]`);
		this.numeral = new RegExp(`[${numerals.join('')}]`, 'g');
		this.index = (d) => index.get(d) as string;
	}
	parse(string: string) {
		const parsed = string
			.trim()
			.replace(this.group, '')
			.replace(this.decimal, '.')
			.replace(this.numeral, this.index);
		return parsed ? +parsed : NaN;
	}
}
