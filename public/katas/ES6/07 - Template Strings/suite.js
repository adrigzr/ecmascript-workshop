const { expect } = chai;

describe('Template strings', () => {
	it('concat must be a function', () => {
		expect(concat).to.be.a('function');
	});

	it('concat works for 2 arguments', () => {
		const result = concat('a', 'b');

		expect(result).to.equal('ab');
	});

	it('concat works for 9999 arguments', () => {
		const expected = new Array(9999).join('a');
		const data = expected.split('');
		const result = concat(...data);

		expect(result).to.equal(expected);
	});

	it('concat works for numbers', () => {
		const result = concat(1, 2, 3, 4, 5, 6);

		expect(result).to.equal('123456');
	});
});
