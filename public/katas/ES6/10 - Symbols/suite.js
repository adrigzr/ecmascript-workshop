const { expect } = chai;

describe('Symbol #secret', () => {
	it('exists in #blackbox object', () => {
		const symbol = Symbol.for('secret');

		expect(blackbox).to.exist;
		expect(blackbox[symbol]).to.exist;
	});
	it('in #blackbox object is a function', () => {
		const symbol = Symbol.for('secret');

		expect(blackbox[symbol]).to.be.a('function');
	});
});
