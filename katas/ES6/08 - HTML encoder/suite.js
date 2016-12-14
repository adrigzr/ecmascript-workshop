const { expect } = chai;

const computedName = 'xg3r992h3e';

describe('Template strings', () => {
	it('precompile exists', () => {
		expect(precompile).to.be.a('function');
	});

	it('precompile returns a String', () => {
		const result = precompile``;

		expect(result).to.be.a('string');
	});

	it('precompile returns a escaped string for: <p>foo & bar</p>', () => {
		const result = precompile`<p>foo & bar</p>`;

		expect(result).to.equal('&lt;p&gt;foo &amp; bar&lt;/p&gt;');
	});

	it('precompile returns a escaped string with vars: <p>${me} & ${you}</p>', () => {
		const me = 'foo';
		const you = 'bar';
		const result = precompile`<p>${me} & ${you}</p>`;

		expect(result).to.equal('&lt;p&gt;foo &amp; bar&lt;/p&gt;');
	});
});
