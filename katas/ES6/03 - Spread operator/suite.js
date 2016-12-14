const { expect } = chai;

describe('Spread operator', function() {
	it('has correct type', function() {
		expect(spread).to.be.a('function');
	});

	it('calls first parameter function no args', function() {
		const fn = (...args) => {
			expect(args.length).to.equal(0);
		};

		spread({ fn, args: [] });
	});

	it('calls first parameter function with three args', function() {
		const fn = (...params) => {
			expect(params[0]).to.equal('first');
			expect(params[1]).to.equal('second');
			expect(params[2]).to.equal('third');
		};

		spread({ fn, args: ['first', 'second', 'third'] });
	});

	it('calls first parameter function with 1000 args', function() {
		const args = [];

		for (let i=0; i<1000; i++) {
			args.push(i);
		}

		const fn = (...params) => {
			for (let i=0; i<1000; i++) {
				expect(params[i]).to.equal(i);
			}
		};

		spread({ fn, args });
	});

	it('returns last of 3 arguments', function() {
		const obj = { fn: () => {}, args: [] };

		expect(spread(obj, 'ignore', 'last')).to.equal('last');
	});

	it('returns last of 1000 arguments', function() {
		const obj = { fn: () => {}, args: [] };
		const args = [];

		for (let i=0; i<998; i++) {
			args.push(i);
		}
		args.push('last');

		expect(spread(obj, ...args)).to.equal('last');
	});
});
